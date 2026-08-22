import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    escapeHtml,
    formatCurrency,
    formatDate,
    invoiceTemplate,
    receiptTemplate,
    otpEmailTemplate,
    forgotPasswordOtpEmailTemplate,
    recoverAccountOtpEmailTemplate,
    accountRecoveredEmailTemplate,
} from '../../templates/index.js';
import { makePDF } from '../../services/pdf/index.pdf.service.js';

describe('Template Utilities & Escaping Tests', () => {
    test('escapeHtml properly sanitizes dangerous characters', () => {
        const raw = '<script>alert("xss & inject\' `")</script>';
        const escaped = escapeHtml(raw);

        assert.ok(!escaped.includes('<script>'));
        assert.ok(!escaped.includes('</script>'));
        assert.ok(escaped.includes('&lt;script&gt;'));
        assert.ok(escaped.includes('&quot;'));
        assert.ok(escaped.includes('&#39;'));
        assert.ok(escaped.includes('&amp;'));
        assert.ok(escaped.includes('&#96;'));
    });

    test('escapeHtml handles null, undefined, and non-string types safely', () => {
        assert.equal(escapeHtml(null), '');
        assert.equal(escapeHtml(undefined), '');
        assert.equal(escapeHtml(12345), '12345');
        assert.equal(escapeHtml(0), '0');
        assert.equal(escapeHtml(false), 'false');
    });

    test('formatCurrency formats amounts correctly', () => {
        const formatted = formatCurrency(1250.5, 'USD');
        assert.ok(formatted.includes('1,250.50') || formatted.includes('$1,250.50'));
    });

    test('formatDate formats valid date objects and strings', () => {
        const formatted = formatDate('2026-08-19T00:00:00Z');
        assert.ok(formatted.includes('2026') || formatted.includes('Aug'));
    });
});

describe('Invoice & Receipt Templates Tests', () => {
    const mockInvoice = {
        invoiceNumber: 'INV-2026-9999',
        issueDate: '2026-08-19',
        dueDate: '2026-09-18',
        status: 'PAID',
        currency: 'USD',
        company: {
            name: 'Apex Test Co.',
            address: '100 Tech Blvd',
            email: 'billing@apextest.com',
            taxId: 'US-9999',
        },
        customer: {
            name: 'Jane Doe <script>alert(1)</script>',
            company: 'Acme Corp & Co',
            address: '500 Main St',
            email: 'jane@acme.com',
        },
        items: [
            {
                description: 'Custom Development <tag>',
                quantity: 10,
                unitPrice: 150.0,
            },
            {
                description: 'Cloud Hosting Pack',
                quantity: 1,
                unitPrice: 300.0,
            },
        ],
        discount: 100.0,
        taxRate: 0.1,
    };

    test('invoiceTemplate produces valid complete HTML with escaped user content', () => {
        const html = invoiceTemplate(mockInvoice);

        assert.equal(typeof html, 'string');
        assert.ok(html.startsWith('<!DOCTYPE html>'));
        assert.ok(html.includes('INV-2026-9999'));
        assert.ok(html.includes('Apex Test Co.'));
        assert.ok(html.includes('Custom Development &lt;tag&gt;'));
        assert.ok(html.includes('Jane Doe &lt;script&gt;alert(1)&lt;/script&gt;'));
        assert.ok(html.includes('Acme Corp &amp; Co'));
        assert.ok(!html.includes('<script>alert(1)</script>'));
        assert.ok(html.includes('</html>'));
    });

    test('invoiceTemplate renders into a valid PDF via makePDF', async () => {
        const html = invoiceTemplate(mockInvoice);
        const buffer = await makePDF({ html });

        assert.ok(Buffer.isBuffer(buffer));
        assert.ok(buffer.length > 2000, 'Invoice PDF should be larger than 2KB');
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });

    test('receiptTemplate generates valid HTML and converts to PDF Buffer', async () => {
        const mockReceipt = {
            receiptNumber: 'REC-2026-7777',
            paymentDate: '2026-08-19',
            paymentMethod: 'Credit Card (Mastercard •••• 1234)',
            customerName: 'Bob Smith',
            customerEmail: 'bob@example.com',
            amountPaid: 850.0,
            currency: 'USD',
            description: 'Monthly Cloud Infrastructure Plan',
        };

        const html = receiptTemplate(mockReceipt);
        assert.ok(html.includes('REC-2026-7777'));
        assert.ok(html.includes('Bob Smith'));

        const buffer = await makePDF({ html });
        assert.ok(Buffer.isBuffer(buffer));
        assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-');
    });
});

describe('Email Templates Tests', () => {
    test('otpEmailTemplate produces valid HTML containing the OTP and design elements', () => {
        const otp = '123456';
        const html = otpEmailTemplate(otp);

        assert.equal(typeof html, 'string');
        assert.ok(html.trim().startsWith('<!DOCTYPE html>'));
        assert.ok(html.includes('123456'));
        assert.ok(html.includes('APEX'));
        assert.ok(html.includes('background-color: #fafafb')); // design system gray 50
        assert.ok(html.includes('color: #111827')); // design system text primary
        assert.ok(html.includes('</html>'));
    });

    test('forgotPasswordOtpEmailTemplate produces valid HTML containing the OTP', () => {
        const otp = '654321';
        const html = forgotPasswordOtpEmailTemplate(otp);

        assert.equal(typeof html, 'string');
        assert.ok(html.includes('654321'));
        assert.ok(html.includes('reset the password'));
    });

    test('recoverAccountOtpEmailTemplate produces valid HTML containing the OTP', () => {
        const otp = '987654';
        const html = recoverAccountOtpEmailTemplate(otp);

        assert.equal(typeof html, 'string');
        assert.ok(html.includes('987654'));
        assert.ok(html.includes('recover your deleted Apex account'));
    });

    test('accountRecoveredEmailTemplate produces valid HTML notification', () => {
        const html = accountRecoveredEmailTemplate();

        assert.equal(typeof html, 'string');
        assert.ok(
            html.includes(
                'account associated with this email address has been successfully recovered',
            ),
        );
    });
});
