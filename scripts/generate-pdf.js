#!/usr/bin/env node

import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  const fs = await import('fs/promises');

  // Create individual PDFs for each slide using the built HTML files
  console.log('Generating individual PDFs...');

  const pdfFiles = [];

  for (const slideNumber of slideNumbers) {
    const htmlFile = join(distDir, `${slideNumber}.html`);
    const pdfFile = join(__dirname, `../slide-${slideNumber}.pdf`);

    if (!existsSync(htmlFile)) {
      console.warn(`⚠️  HTML file not found for slide ${slideNumber}`);
      continue;
    }

    console.log(`Generating PDF for slide ${slideNumber}...`);

    try {
      const result = await new Promise((resolve, reject) => {
        const chrome = spawn('google-chrome', [
          '--headless',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--print-to-pdf=' + pdfFile,
          '--print-to-pdf-no-header',
          '--run-all-compositor-stages-before-draw',
          '--virtual-time-budget=5000',
          'file://' + htmlFile
        ], {
          stdio: 'pipe'
        });

        chrome.on('close', (code) => {
          if (code === 0) {
            resolve(pdfFile);
          } else {
            reject(new Error(`Chrome exited with code ${code}`));
          }
        });

        chrome.on('error', reject);
      });

      pdfFiles.push(result);
      console.log(`✓ Generated: slide-${slideNumber}.pdf`);

    } catch (error) {
      console.error(`❌ Failed to generate PDF for slide ${slideNumber}:`, error.message);
    }
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

    // Clean up individual files
    for (const pdfFile of pdfFiles) {
      await fs.unlink(pdfFile);
    }
    console.log('✓ Cleaned up individual PDF files.');

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
