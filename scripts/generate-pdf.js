#!/usr/bin/env node

// TODO/now:
// - Disable text color gradients when rendering PDF
// - Don't render the dummy slides "Foo bar"

// NOTE: If slides appear to be missing or have wrong content, run `pnpm run build` first
// to ensure dist/client/ is up to date with the source MDX files.

import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { lookup } from 'mime-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple static file server
function createStaticServer(distDir, port) {
  const server = createServer((req, res) => {
    let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    const mimeType = lookup(filePath) || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err);
      else resolve(server);
    });
  });
}

async function generatePDF() {
  console.log('Starting PDF generation...');

  // Get all slide numbers by reading the dist/client directory
  const distDir = join(__dirname, '../dist/client');

  if (!existsSync(distDir)) {
    console.error('❌ Build directory not found. Please run `pnpm run build` first.');
    return;
  }

  const entries = await readdir(distDir, { withFileTypes: true });
  const slideNumbers = entries
    .filter(entry => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map(entry => parseInt(entry.name))
    .sort((a, b) => a - b);

  console.log(`Found ${slideNumbers.length} slides: ${slideNumbers.join(', ')}`);

  if (slideNumbers.length === 0) {
    console.error('❌ No slides found in build directory.');
    return;
  }

  // Start a local server to serve the built files
  const port = 8765;
  console.log(`Starting local server on port ${port}...`);
  const server = await createStaticServer(distDir, port);
  console.log('✓ Server started');

  const fs = await import('fs/promises');

  // Launch Puppeteer
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log('✓ Browser launched');

  // Create individual PDFs for each slide
  console.log('Generating individual PDFs...');

  const pdfFiles = [];

  try {
    for (const slideNumber of slideNumbers) {
      const url = `http://localhost:${port}/${slideNumber}.html`;
      const pdfFile = join(__dirname, `../slide-${slideNumber}.pdf`);

      console.log(`Generating PDF for slide ${slideNumber}...`);

      try {
        const page = await browser.newPage();

        // Debug: log console messages for slides 2 and 3
        if (slideNumber === 2 || slideNumber === 3) {
          page.on('console', msg => console.log(`  [Browser Console]:`, msg.text()));
          page.on('pageerror', error => console.log(`  [Page Error]:`, error.message));
        }

        // Set viewport to match presentation size (1366x681)
        await page.setViewport({
          width: 1366,
          height: 681,
          deviceScaleFactor: 2
        });

        // Emulate screen media type instead of print to preserve gradients
        await page.emulateMediaType('screen');

        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Inject CSS to ensure gradients and colors print correctly
        await page.addStyleTag({
          content: `
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          `
        });

        // Wait a bit more for fonts and animations to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Debug: take screenshot for slides 2 and 3
        if (slideNumber === 2 || slideNumber === 3) {
          const screenshotPath = join(__dirname, `../debug-slide-${slideNumber}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: false });
          console.log(`  Debug screenshot saved: debug-slide-${slideNumber}.png`);
        }

        await page.pdf({
          path: pdfFile,
          width: '1366px',
          height: '681px',
          printBackground: true,
          preferCSSPageSize: false
        });

        await page.close();

        pdfFiles.push(pdfFile);
        console.log(`✓ Generated: slide-${slideNumber}.pdf`);

      } catch (error) {
        console.error(`❌ Failed to generate PDF for slide ${slideNumber}:`, error.message);
      }
    }
  } finally {
    await browser.close();
    server.close();
    console.log('✓ Server stopped');
  }

  if (pdfFiles.length === 0) {
    console.error('❌ No PDFs were generated successfully.');
    return;
  }

  console.log(`\n✓ Generated ${pdfFiles.length} individual PDF files.`);

  // Try to merge PDFs if pdftk is available
  try {
    console.log('\nAttempting to merge PDFs...');

    const mergedPdfPath = join(__dirname, '../slides-complete.pdf');

    await new Promise((resolve, reject) => {
      const pdftk = spawn('pdftk', [
        ...pdfFiles,
        'cat',
        'output',
        mergedPdfPath
      ], {
        stdio: 'pipe'
      });

      pdftk.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pdftk exited with code ${code}`));
        }
      });

      pdftk.on('error', reject);
    });

    console.log(`✓ Merged PDF created: slides-complete.pdf`);

    // Keep individual files for debugging
    console.log('✓ Individual PDF files kept for debugging.');

  } catch (error) {
    console.log('⚠️  Could not merge PDFs automatically (pdftk not available).');
    console.log('Individual PDF files are available:');
    pdfFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    console.log('\nTo merge manually, you can use:');
    console.log(`pdftk ${pdfFiles.map(f => f.split('/').pop()).join(' ')} cat output slides-complete.pdf`);
  }

  console.log('\n🎉 PDF generation complete!');
}

// Run the script
generatePDF().catch(console.error);
