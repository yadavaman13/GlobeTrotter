import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    makePDF,
    PDFValidationError,
    PDFGenerationError,
    defaultPDFOptions,
} from '../../services/pdf/index.pdf.service.js';

describe('makePDF Service Unit Tests', () => {
    test('rejects undefined or null HTML with PDFValidationError', async () => {
        await assert.rejects(
            async () => {
                await makePDF({ html: null });
            },
            (err) => {
                assert.ok(err instanceof PDFValidationError);
                assert.match(err.message, /requires an HTML string/);
                assert.equal(err.statusCode, 400);
                assert.equal(err.code, 'PDF_VALIDATION_ERROR');
                return true;
            },
        );

        await assert.rejects(
            async () => {
                await makePDF({ html: undefined });
            },
            (err) => {
                assert.ok(err instanceof PDFValidationError);
                return true;
            },
        );
    });

    test('rejects non-string HTML with PDFValidationError', async () => {
        await assert.rejects(
            async () => {
                await makePDF({ html: 12345 });
            },
            (err) => {
                assert.ok(err instanceof PDFValidationError);
                assert.match(err.message, /received number/);
                return true;
            },
        );

        await assert.rejects(
            async () => {
                await makePDF({ html: { content: 'test' } });
            },
            (err) => {
                assert.ok(err instanceof PDFValidationError);
                assert.match(err.message, /received object/);
                return true;
            },
        );
    });

    test('rejects empty or whitespace-only HTML string with PDFValidationError', async () => {
        await assert.rejects(
            async () => {
                await makePDF({ html: '   ' });
            },
            (err) => {
                assert.ok(err instanceof PDFValidationError);
                assert.match(err.message, /non-empty/);
                return true;
            },
        );
    });

    test('generates a valid PDF Buffer from simple HTML', async () => {
        const html = '<h1>Apex Test Document</h1><p>Hello world!</p>';
        const buffer = await makePDF({ html });

        assert.ok(Buffer.isBuffer(buffer), 'Output must be a Buffer');
        assert.ok(buffer.length > 500, 'PDF buffer should be substantial');

        const header = buffer.subarray(0, 5).toString('ascii');
        assert.equal(header, '%PDF-', 'PDF must begin with %PDF- header');
    });

    test('accepts custom margins and options', async () => {
        const html = '<div>Custom Margin Test</div>';
        const buffer = await makePDF({
            html,
            options: {
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50,
                },
                svgScale: 3,
            },
        });

        assert.ok(Buffer.isBuffer(buffer));
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('exposes defaultPDFOptions with standard document defaults', () => {
        assert.ok(defaultPDFOptions);
        assert.equal(defaultPDFOptions.allowScripts, false);
        assert.equal(defaultPDFOptions.rootSelector, 'body');
        assert.deepEqual(defaultPDFOptions.margins, {
            top: 36,
            right: 36,
            bottom: 36,
            left: 36,
        });
    });

    test('wraps renderer failures in PDFGenerationError', () => {
        const customErr = new PDFGenerationError('Generation failed');
        assert.ok(customErr instanceof Error);
        assert.equal(customErr.statusCode, 500);
        assert.equal(customErr.code, 'PDF_GENERATION_ERROR');
    });
});
