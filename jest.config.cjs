/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',

  // Use jsdom for component tests, node for utility tests
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock SVG and image imports
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
    // Mock CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],

  // TypeScript transformation
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          module: 'commonjs',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Coverage configuration
  collectCoverageFrom: ['src/next/ndb/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.config.ts', '!src/**/index.ts'],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Ignore patterns
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/build/', '<rootDir>/dist/'],

  // Transform ignore patterns
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],

  // Mock and test behavior
  clearMocks: true,
  restoreMocks: true,

  // Error handling
  bail: false,
  verbose: false,

  // Performance
  maxWorkers: '50%',

  // Global test timeout
  testTimeout: 10000,
};
