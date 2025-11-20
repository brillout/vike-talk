#!/usr/bin/env node

// TODO/now:
// - Don't hard code the number of pages, look at the number of pages before generating the PDF
// - Don't rely on slides-combined.html (dynamically generated it if needs be)

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { lookup } from 'mime-types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Run build before generating PDFs
async function runBuild() {
  console.log('Building project...')

  return new Promise((resolve, reject) => {
    const build = spawn('pnpm', ['run', 'build'], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
    })

    build.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Build completed\n')
        resolve()
      } else {
        reject(new Error(`Build failed with exit code ${code}`))
      }
    })

    build.on('error', reject)
  })
}

// Simple static file server
function createStaticServer(distDir, port) {
  const server = createServer((req, res) => {
    let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url)

    // Security: prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const stat = statSync(filePath)
    if (stat.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    const mimeType = lookup(filePath) || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': mimeType })
    createReadStream(filePath).pipe(res)
  })

  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err)
      else resolve(server)
    })
  })
}

async function generatePDF() {
  console.log('Starting PDF generation...\n')

  // Always rebuild before generating PDFs
  try {
    await runBuild()
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    console.error('Continuing with existing build files...\n')
    // Don't return - continue with existing build if available
  }

  // Get all slide numbers by reading the dist/client directory
  const distDir = join(__dirname, '../dist/client')

  if (!existsSync(distDir)) {
    console.error('❌ Build directory not found after build.')
    return
  }

  const entries = await readdir(distDir, { withFileTypes: true })
  const slideNumbers = entries
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => parseInt(entry.name))
    .sort((a, b) => a - b)

  console.log(`Found ${slideNumbers.length} slides: ${slideNumbers.join(', ')}`)

  if (slideNumbers.length === 0) {
    console.error('❌ No slides found in build directory.')
    return
  }

  // Start a local server to serve the built files
  const port = 8765
  console.log(`Starting local server on port ${port}...`)
  const server = await createStaticServer(distDir, port)
  console.log('✓ Server started')

  const fs = await import('node:fs/promises')

  // Launch Playwright browser
  console.log('Launching browser...')
  const browser = await chromium.launch({
    headless: true,
  })
  console.log('✓ Browser launched')

  // Create individual PDFs for each slide
  console.log('Generating individual PDFs...')

  const pdfFiles = []

  try {
    for (const slideNumber of slideNumbers) {
      const url = `http://localhost:${port}/${slideNumber}.html`
      const pdfFile = join(__dirname, `../slide-${slideNumber}.pdf`)

      console.log(`Generating PDF for slide ${slideNumber}...`)

      try {
        const page = await browser.newPage()

        // Check if this is a dummy "Foo bar" slide and skip it
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })

        const pageContent = await page.content()
        if (
          pageContent.includes('Foo bar') &&
          (pageContent.includes('<h1>Slide</h1>') || pageContent.includes('# Slide'))
        ) {
          console.log(`⊘ Skipped dummy slide ${slideNumber}`)
          await page.close()
          continue
        }

        // Reset page for actual rendering
        await page.close()
        const renderPage = await browser.newPage()

        // Set viewport to match presentation size (1366x681)
        await renderPage.setViewportSize({
          width: 1366,
          height: 681,
        })

        // Emulate screen media type instead of print
        await renderPage.emulateMedia({ media: 'screen' })

        await renderPage.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })

        // Inject CSS to disable gradients and ensure colors print correctly
        await renderPage.addStyleTag({
          content: `
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            /* Disable text gradients for PDF rendering */
            span[style*="background"] {
              background: none !important;
              -webkit-background-clip: unset !important;
              background-clip: unset !important;
              -webkit-text-fill-color: unset !important;
              color: inherit !important;
            }
          `,
        })

        // Wait a bit more for fonts and animations to load
        await new Promise((resolve) => setTimeout(resolve, 2000))

        await renderPage.pdf({
          path: pdfFile,
          width: '1366px',
          height: '681px',
          printBackground: true,
          preferCSSPageSize: false,
        })

        await renderPage.close()

        pdfFiles.push(pdfFile)
        console.log(`✓ Generated: slide-${slideNumber}.pdf`)
      } catch (error) {
        console.error(`❌ Failed to generate PDF for slide ${slideNumber}:`, error.message)
      }
    }
  } finally {
    await browser.close()
    server.close()
    console.log('✓ Server stopped')
  }

  if (pdfFiles.length === 0) {
    console.error('❌ No PDFs were generated successfully.')
    return
  }

  console.log(`\n✓ Generated ${pdfFiles.length} individual PDF files.`)

  // Try to merge PDFs if pdftk is available
  try {
    console.log('\nAttempting to merge PDFs...')

    const mergedPdfPath = join(__dirname, '../slides-complete.pdf')

    await new Promise((resolve, reject) => {
      const pdftk = spawn('pdftk', [...pdfFiles, 'cat', 'output', mergedPdfPath], {
        stdio: 'pipe',
      })

      pdftk.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`pdftk exited with code ${code}`))
        }
      })

      pdftk.on('error', reject)
    })

    console.log(`✓ Merged PDF created: slides-complete.pdf`)

    // Clean up individual PDF files after successful merge
    console.log('Cleaning up individual PDF files...')
    for (const pdfFile of pdfFiles) {
      try {
        await fs.unlink(pdfFile)
      } catch (err) {
        console.warn(`⚠️  Could not delete ${pdfFile}:`, err.message)
      }
    }
    console.log('✓ Individual PDF files removed')
  } catch (error) {
    console.log('⚠️  Could not merge PDFs automatically (pdftk not available).')
    console.log('Individual PDF files are available:')
    pdfFiles.forEach((file) => {
      console.log(`  - ${file}`)
    })
    console.log('\nTo merge manually, you can use:')
    console.log(`pdftk ${pdfFiles.map((f) => f.split('/').pop()).join(' ')} cat output slides-complete.pdf`)
  }

  console.log('\n🎉 PDF generation complete!')
}

// Run the script
generatePDF().catch(console.error)
