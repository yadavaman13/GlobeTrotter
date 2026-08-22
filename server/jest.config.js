export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['**/src/tests/**/*.test.js'],
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    testTimeout: 60000,
};
