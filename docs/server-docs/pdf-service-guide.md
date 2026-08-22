# Apex HTML-to-PDF Service (`makePDF`) Architecture & Developer Guide

## 1. Overview

The **Apex HTML-to-PDF Service** provides a fast, lightweight, and serverless/Render-friendly solution for converting HTML/CSS into PDF documents without the overhead of Chromium, Puppeteer, or Playwright.

Powered by `html-pdf-lite` (built on PDFKit and `@resvg/resvg-js`), it delivers:

- **Zero Chromium Footprint**: Uses ~30 MB self-contained native Node modules without multi-hundred MB browser binaries.
- **Ultra-Fast Generation**: ~14ms per PDF document warm rendering speed.
- **Tiny PDF Sizes**: 50–90% smaller than headless browser output.
- **Strict Decoupling**: Template generation (`data -> HTML`) is strictly isolated from rendering (`HTML -> PDF Buffer`) and delivery (`HTTP/Email/S3`).

---

## 2. Architecture & Data Flow

```text
┌───────────────────────────────────────────────┐
│               Application Data                │ (Invoices, reports, receipts, certificates)
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Template Function                │ (Pure function: data + escapeHtml -> HTML string)
│            ([`src/templates/`](../../server/src/templates/))                  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                   makePDF()                   │ (Abstraction wrapper: options, security, errors)
│              ([`src/services/pdf/`](../../server/src/services/pdf/))               │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                 html-pdf-lite                 │ (PDFKit engine + vector SVG rasterization)
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                  PDF Buffer                   │ (Node.js Buffer)
└───────────────────────┬───────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   HTTP Response     Storage         Email
 (Express stream)   (S3 / R2)     (Nodemailer)
```

---

## 3. Quickstart & Usage

### A. Basic PDF Generation

```js
import { makePDF } from './src/services/pdf/index.pdf.service.js';
import { invoiceTemplate } from './src/templates/index.js';

// 1. Prepare data
const invoiceData = {
    invoiceNumber: 'INV-2026-0042',
    issueDate: '2026-08-19',
    dueDate: '2026-09-18',
    customer: {
        name: 'Jane Doe',
        company: 'Acme Corp',
    },
    items: [{ description: 'Enterprise Subscription', quantity: 1, unitPrice: 2400.0 }],
    taxRate: 0.1,
};

// 2. Generate HTML
const html = invoiceTemplate(invoiceData);

// 3. Render PDF Buffer
const pdfBuffer = await makePDF({
    html,
    options: {
        margins: { top: 36, right: 36, bottom: 36, left: 36 },
    },
});

// pdfBuffer is a standard Node.js Buffer
```

### B. Express Route Handler Integration

```js
import { makePDF } from '../../../services/pdf/index.pdf.service.js';
import { invoiceTemplate } from '../../../templates/index.js';
import { sendPdfResponse } from '../../../utils/response.utlis.js';

export async function getInvoicePdf(req, res, next) {
    try {
        const invoice = await getInvoiceFromDb(req.params.id);
        const html = invoiceTemplate(invoice);
        const pdfBuffer = await makePDF({ html });

        const isInline = req.query.inline === 'true';

        return sendPdfResponse({
            res,
            pdfBuffer,
            filename: `invoice-${invoice.id}.pdf`,
            isInline,
        });
    } catch (error) {
        return next(error);
    }
}
```

### C. Client Download Helper ([`client/src/utils/pdfDownload.js`](../../client/src/utils/pdfDownload.js))

```js
import { downloadPdfFromApi } from '@/utils/pdfDownload';

// Trigger download from React button handler
async function handleDownload(invoiceId) {
    await downloadPdfFromApi(`/api/pdf/invoice/${invoiceId}`, `invoice-${invoiceId}.pdf`);
}
```

---

## 4. How to Create a New Template

Templates must remain **pure synchronous functions** that accept a plain data object and return a complete HTML document string.

### Guidelines:

1. **Always escape user input**: Import and use `escapeHtml()` on any variable originating from databases or users.
2. **Self-contained assets**: Use inline SVG or data URIs for logos/icons. Do not rely on external relative HTTP URLs (e.g. `<img src="/logo.png">`) that depend on the server running.
3. **No `<script>` tags**: Script execution is disabled (`allowScripts: false`) for security and predictability.
4. **Use Print-Friendly CSS**: Avoid complex JavaScript layout libraries. Rely on standard tables, flexbox, and CSS properties.

### Example Template Structure:

```js
import { escapeHtml, formatCurrency, formatDate } from '../utils/escapeHtml.js';

export function myReportTemplate(data = {}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(data.title || 'Report')}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      color: #1F2937;
      line-height: 1.4;
    }
    .header { margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #4F46E5; color: white; padding: 8px; }
    td { padding: 8px; border-bottom: 1px solid #E5E7EB; page-break-inside: avoid; break-inside: avoid; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.title)}</h1>
    <p>Generated: ${escapeHtml(formatDate(new Date()))}</p>
  </div>

  <table>
    <thead>
      <tr><th>Metric</th><th>Value</th></tr>
    </thead>
    <tbody>
      ${data.rows.map((r) => `<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.value)}</td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
}
```

---

## 5. CSS & HTML Compatibility Matrix

The underlying `html-pdf-lite` engine is designed specifically for document generation. The following features are fully tested and supported in Apex:

| Feature / CSS Property                                 |    Status    | Notes / Best Practice                                                          |
| ------------------------------------------------------ | :----------: | ------------------------------------------------------------------------------ |
| **Typography (h1-h6, p, spans, strong, em)**           | ✅ Supported | Standard sans-serif/system fonts work across environments.                     |
| **Tables (borders, collapse, padding)**                | ✅ Supported | Preferred structure for invoices, receipts, and grid reports.                  |
| **`<thead>` Header Repeat**                            | ✅ Supported | Repeating table headers automatically render on subsequent pages.              |
| **`colspan` & `rowspan`**                              | ✅ Supported | Supported across headers and rows.                                             |
| **Flexbox & Grid**                                     | ✅ Supported | Basic flex rows, column cards, and 2-column grids work smoothly.               |
| **Margins & Padding**                                  | ✅ Supported | Document and element margins/padding (pt, px, mm).                             |
| **Borders & `border-radius`**                          | ✅ Supported | Supports asymmetric borders and curved container cards.                        |
| **Colors & Backgrounds**                               | ✅ Supported | Hex, RGB, HSL colors supported.                                                |
| **Pagination (`page-break-before: always`)**           | ✅ Supported | Forces clean pagination breaks.                                                |
| **`break-inside: avoid` / `page-break-inside: avoid`** | ✅ Supported | Prevents summary cards or table rows from tearing across page breaks.          |
| **Inline SVG & Vector Graphics**                       | ✅ Supported | Rendered crisply via `@resvg/resvg-js` (`svgScale: 2`).                        |
| **Hyperlinks & Internal Anchors**                      | ✅ Supported | Clickable web links (`http`, `mailto`, `tel`) and internal `#id` jump targets. |
| **Color Emoji**                                        | ✅ Supported | Embedded as PDF Type 3 font glyphs.                                            |
| **`<script>` Execution**                               | ❌ Disabled  | Disabled for strict security (`allowScripts: false`).                          |

---

## 6. Performance & Benchmark Summary

Measured on Node 26 environment with concurrent loads:

- **Cold Start**: ~80ms
- **Warm Render**: ~14ms per PDF
- **Memory Footprint**: Under 2MB per request (no Chromium process spawning)
- **10 Concurrent Requests**: Completed in ~146ms total with zero crashes or leaks.
