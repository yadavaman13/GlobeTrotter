import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../app.js';
import redis from '../../config/cache.config.js';

describe('PDF Express Routes Integration Tests', () => {
    let server;
    let baseUrl;

    before(async () => {
        await new Promise((resolve) => {
            server = app.listen(0, '127.0.0.1', () => {
                const address = server.address();
                baseUrl = `http://127.0.0.1:${address.port}`;
                resolve();
            });
        });
    });

    after(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        try {
            await redis.quit();
        } catch {
            // Ignore if redis was not active
        }
    });

    test('GET /api/pdf/invoice/:id returns valid PDF attachment with correct headers', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/invoice/INV-2026-TEST`);

        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), 'application/pdf');
        assert.ok(res.headers.get('content-disposition').includes('attachment'));
        assert.ok(res.headers.get('content-disposition').includes('invoice-INV-2026-TEST.pdf'));

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        assert.ok(buffer.length > 2000, 'PDF size should be > 2KB');
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('GET /api/pdf/invoice/:id?inline=true returns inline PDF for browser viewer', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/invoice/INV-2026-INLINE?inline=true`);

        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), 'application/pdf');
        assert.ok(res.headers.get('content-disposition').includes('inline'));

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('GET /api/pdf/invoice/:id/preview returns text/html markup', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/invoice/INV-PREVIEW/preview`);

        assert.equal(res.status, 200);
        assert.ok(res.headers.get('content-type').includes('text/html'));

        const html = await res.text();
        assert.ok(html.includes('<!DOCTYPE html>'));
        assert.ok(html.includes('INVOICE'));
        assert.ok(html.includes('INV-PREVIEW'));
    });

    test('GET /api/pdf/receipt/:id returns valid receipt PDF attachment', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/receipt/REC-2026-0042`);

        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), 'application/pdf');
        assert.ok(res.headers.get('content-disposition').includes('receipt-REC-2026-0042.pdf'));

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('POST /api/pdf/render generates PDF from custom HTML body', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/render`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: '<h1>Custom PDF</h1><p>Generated dynamically via POST body.</p>',
            }),
        });

        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), 'application/pdf');

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('POST /api/pdf/render returns 400 when html is missing', async () => {
        const res = await fetch(`${baseUrl}/api/pdf/render`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        assert.equal(res.status, 400);
        const data = await res.json();
        assert.equal(data.success, false);
    });
});
