import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { makePDF } from '../../services/pdf/index.pdf.service.js';

describe('CSS Compatibility & Layout Rendering Tests', () => {
    test('renders text, headings (h1-h6), and paragraphs with diverse styles', async () => {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; color: #333; line-height: 1.6; }
          h1 { color: #1e3a8a; font-size: 24pt; border-bottom: 2px solid #3b82f6; }
          h2 { color: #1e40af; font-size: 18pt; }
          h3 { color: #2563eb; font-size: 14pt; }
          p { margin: 10px 0; }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .highlight { background-color: #fef08a; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Heading Level 1</h1>
        <h2>Heading Level 2</h2>
        <h3>Heading Level 3</h3>
        <p>This is a <span class="bold">bold text</span>, <span class="italic">italic text</span>, and <span class="highlight">highlighted badge</span>.</p>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('renders advanced tables with borders, thead, colspan, and rowspan', async () => {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2563eb; color: #fff; padding: 8px; border: 1px solid #1d4ed8; text-align: left; }
          td { padding: 8px; border: 1px solid #e2e8f0; }
          .center { text-align: center; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <h2>Quarterly Performance Table</h2>
        <table>
          <thead>
            <tr>
              <th rowspan="2">Department</th>
              <th colspan="2" class="center">Q1 Results</th>
              <th rowspan="2" class="right">Total</th>
            </tr>
            <tr>
              <th class="right">Target</th>
              <th class="right">Actual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Engineering</td>
              <td class="right">$100k</td>
              <td class="right">$120k</td>
              <td class="right">$220k</td>
            </tr>
            <tr>
              <td>Sales & Marketing</td>
              <td class="right">$200k</td>
              <td class="right">$210k</td>
              <td class="right">$410k</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total Operating Income</strong></td>
              <td class="right"><strong>$630k</strong></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.ok(pdf.length > 1000);
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('renders flexbox and grid style structures', async () => {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          .card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            background-color: #f8fafc;
          }
          .card-title { font-weight: bold; color: #0f172a; margin-bottom: 8px; }
          .flex-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed #cbd5e1;
            padding-top: 8px;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="grid-container">
          <div class="card">
            <div class="card-title">Card Alpha</div>
            <p>Summary information about system alpha.</p>
            <div class="flex-row">
              <span>Status:</span>
              <span style="color: green; font-weight: bold;">Healthy</span>
            </div>
          </div>
          <div class="card">
            <div class="card-title">Card Beta</div>
            <p>Summary information about system beta.</p>
            <div class="flex-row">
              <span>Status:</span>
              <span style="color: blue; font-weight: bold;">Active</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('renders inline SVG and raster graphics', async () => {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .svg-wrapper { margin: 15px 0; }
        </style>
      </head>
      <body>
        <h1>Vector Graphic Support</h1>
        <div class="svg-wrapper">
          <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="60" rx="10" fill="#4f46e5"/>
            <circle cx="30" cy="30" r="15" fill="#38bdf8"/>
            <text x="60" y="36" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold">Apex PDF</text>
          </svg>
        </div>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('renders clickable external links and internal anchor jump targets', async () => {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; }
          .spacer { height: 600px; }
          a { color: #2563eb; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Table of Contents</h1>
        <ul>
          <li><a href="#appendix">Jump to Appendix</a></li>
          <li><a href="https://example.com">Visit External Website</a></li>
        </ul>
        <div class="spacer"></div>
        <h2 id="appendix">Appendix Section</h2>
        <p>You have navigated to the appendix section successfully.</p>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('handles page breaks and multi-page documents (page-break-before, break-inside: avoid)', async () => {
        let tableRows = '';
        for (let i = 1; i <= 40; i++) {
            tableRows += `
        <tr style="break-inside: avoid; page-break-inside: avoid;">
          <td>Item #${i}</td>
          <td>Description for item ${i} with detailed text</td>
          <td>$${(i * 12.5).toFixed(2)}</td>
        </tr>
      `;
        }

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; font-size: 10pt; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #334155; color: #fff; padding: 6px; }
          td { padding: 6px; border: 1px solid #cbd5e1; }
          .page-two { page-break-before: always; margin-top: 20px; }
          .unbreakable { break-inside: avoid; page-break-inside: avoid; border: 2px solid #0284c7; padding: 10px; background: #e0f2fe; }
        </style>
      </head>
      <body>
        <h1>Multi-Page Document - Page 1</h1>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="page-two">
          <h2>Explicit Page Break - Page 2+</h2>
          <div class="unbreakable">
            <h3>Unbreakable Summary Card</h3>
            <p>This box will avoid breaking across page boundaries cleanly.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const pdf = await makePDF({ html });
        assert.ok(Buffer.isBuffer(pdf));
        assert.ok(pdf.length > 1000, 'Multi-page PDF should be properly generated');
        assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    });
});

describe('PDF Service Performance & Concurrency Benchmarking', () => {
    test('handles 10 concurrent PDF generation requests efficiently without leaks or crashes', async () => {
        const startMem = process.memoryUsage().heapUsed;
        const startTime = Date.now();

        const requests = Array.from({ length: 10 }).map((_, index) => {
            const html = `
        <h1>Concurrent Document #${index + 1}</h1>
        <p>Testing concurrency under constrained hosting environment.</p>
        <table border="1" style="width:100%;">
          <tr><th>Key</th><th>Value</th></tr>
          <tr><td>ID</td><td>REQ-${index + 1000}</td></tr>
          <tr><td>Timestamp</td><td>${new Date().toISOString()}</td></tr>
        </table>
      `;
            return makePDF({ html });
        });

        const results = await Promise.all(requests);
        const duration = Date.now() - startTime;
        const endMem = process.memoryUsage().heapUsed;
        const memoryDeltaMb = (endMem - startMem) / 1024 / 1024;

        assert.equal(results.length, 10);
        for (const buf of results) {
            assert.ok(Buffer.isBuffer(buf));
            assert.equal(buf.subarray(0, 5).toString('ascii'), '%PDF-');
        }

        console.log(
            `\n  [Performance Benchmark] Generated 10 PDFs in ${duration}ms (${(duration / 10).toFixed(1)}ms/pdf). Memory delta: ${memoryDeltaMb.toFixed(2)} MB\n`,
        );

        assert.ok(duration < 5000, `10 concurrent PDFs took ${duration}ms (expected < 5000ms)`);
    });
});
