// jest.config.js
// Using ES Module syntax for Jest configuration because package.json has "type": "module"
export default {
    // Specifies the test environment to use (Node.js for backend tests)
    testEnvironment: 'node',

    // Use the ts-jest preset for ES Modules. This provides a good baseline configuration.
    preset: 'ts-jest/presets/default-esm',

    // Defines how Jest should transform files based on their extensions.
    // This explicitly tells Jest to use 'ts-jest' for .ts and .tsx files,
    // and passes the 'useESM: true' option directly to ts-jest.
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            // Use your tsconfig.json for TypeScript compilation settings.
            tsconfig: './tsconfig.json',
            // Crucially, tell ts-jest to output ES module syntax.
            useESM: true,
        }],
    },

    // Specifies the file extensions Jest should look for when resolving modules.
    // This helps Jest resolve imports like './normalizer' to './normalizer.ts'.
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // Explicitly tell Jest to treat .ts and .tsx files as ES Modules.
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Module name mappers are essential for resolving paths correctly in ESM,
    // especially for local imports (e.g., './normalizer.ts' might be imported as './normalizer').
    // This rule tells Jest to attempt to resolve '.js' imports that start with a relative path
    // (like './' or '../') as their corresponding original TypeScript file.
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        // Mock axios to prevent actual HTTP requests during tests.
        // This is already handled by jest.fn() in your test file, but explicit mapping can be useful.
        // 'axios': '<rootDir>/node_modules/axios', // Example if axios itself caused issues (less likely)
    },

    // Specifies which files Jest should consider as test files.
    // Explicitly setting this can help Jest find and process your tests correctly.
    testMatch: [
        "**/__tests__/**/*.ts",
        "**/?(*.)+(spec|test).ts" // Looks for .spec.ts or .test.ts files
    ],

    // transformIgnorePatterns: [
    //   '/node_modules/(?!axios)/', // Example: Do NOT ignore axios if it's an ESM that needs transformation
    // ],
};
