import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateTempPassword, isValidPassword } from '../../utils/password.utils.js';

describe('Password Utility Unit Tests', () => {
    test('generateTempPassword generates an 8-character password by default', () => {
        const password = generateTempPassword();
        assert.equal(password.length, 8);
    });

    test('generateTempPassword generates a password of specified length', () => {
        const password = generateTempPassword(12);
        assert.equal(password.length, 12);
    });

    test('generateTempPassword output passes isValidPassword', () => {
        for (let i = 0; i < 50; i++) {
            const password = generateTempPassword(8, 'test@example.com');
            assert.ok(
                isValidPassword(password, 'test@example.com'),
                `Generated password "${password}" failed validation`,
            );
        }
    });

    test('isValidPassword validates complexity constraints', () => {
        // Missing uppercase
        assert.equal(isValidPassword('abcde12@'), false);
        // Missing lowercase
        assert.equal(isValidPassword('ABCDE12@'), false);
        // Missing digits
        assert.equal(isValidPassword('abcdeFG@'), false);
        // Missing special character
        assert.equal(isValidPassword('abcdeFG1'), false);
        // Valid password
        assert.ok(isValidPassword('axbdFG1@'));
    });

    test('isValidPassword catches consecutive characters', () => {
        assert.equal(isValidPassword('aaaaFG1@'), false);
        assert.equal(isValidPassword('a1111FG@'), false);
        assert.ok(isValidPassword('aa11FG@!'));
    });

    test('isValidPassword catches sequential keyboard / alpha / numeric runs', () => {
        assert.equal(isValidPassword('abcdFG1@'), false);
        assert.equal(isValidPassword('1234FG@!'), false);
        assert.equal(isValidPassword('qwerFG1@'), false);
        assert.equal(isValidPassword('rewqFG1@'), false); // Backward run
        assert.ok(isValidPassword('axbdFG1@'));
    });

    test('isValidPassword enforces identity constraints', () => {
        const email = 'alex.mercer@nexustech.io';
        // Password same as email
        assert.equal(isValidPassword('alex.mercer@nexustech.io', email), false);
        // Password same as username
        assert.equal(isValidPassword('alex.mercer', email), false);
    });
});
