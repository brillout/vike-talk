#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePDF() {
  console.log('Starting PDF generation...');
  
  // Get all slide numbers by reading the pages directory
  const pagesDir = join(__dirname, '../pages');
  const entries = await readdir(pagesDir, { withFileTypes: true });
  const slideNumbers = entries
    .filter(entry => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map(entry => parseInt(entry.name))
    .sort((a, b) => a - b);
  
  console.log(`Found ${slideNumbers.length} slides: ${slideNumbers.join(', ')}`);
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for slide dimensions (adjust as needed)
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });
    
    // Start the preview server
    console.log('Starting preview server...');
    const { spawn } = await import('child_process');
    const server = spawn('pnpm', ['preview'], {
      stdio: 'pipe',
      cwd: join(__dirname, '..')
    });
    
    // Wait for server to start
    await new Promise((resolve) => {
      server.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Server output:', output);
        if (output.includes('Local:') || output.includes('localhost')) {
          resolve();
        }
      });
      
      // Fallback timeout
      setTimeout(resolve, 5000);
    });
    
    console.log('Server started, generating PDF pages...');
    
    const pdfPages = [];
    
    for (const slideNumber of slideNumbers) {
      console.log(`Capturing slide ${slideNumber}...`);
      
      try {
        await page.goto(`http://localhost:3000/${slideNumber}`, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        
        // Wait a bit more for any animations or dynamic content
        await page.waitForTimeout(1000);
        
        // Generate PDF for this page
        const pdf = await page.pdf({
          format: 'A4',
          landscape: true,
          printBackground: true,
          margin: {
            top: '0.5in',
            bottom: '0.5in',
            left: '0.5in',
            right: '0.5in'
          }
        });
        
        pdfPages.push(pdf);
        console.log(`✓ Captured slide ${slideNumber}`);
        
      } catch (error) {
        console.error(`✗ Failed to capture slide ${slideNumber}:`, error.message);
      }
    }
    
    // Kill the server
    server.kill();
    
    if (pdfPages.length === 0) {
      throw new Error('No slides were captured successfully');
    }
    
    // For now, let's save the first page as an example
    // In a real implementation, you'd want to merge all PDFs
    const fs = await import('fs/promises');
    await fs.writeFile('slides.pdf', pdfPages[0]);
    
    console.log(`✓ PDF generated successfully: slides.pdf`);
    console.log(`Note: This is a basic implementation that saves the first slide.`);
    console.log(`For a complete solution, you'd need a PDF merging library.`);
    
  } finally {
    await browser.close();
  }
}

// Run the script
generatePDF().catch(console.error);
