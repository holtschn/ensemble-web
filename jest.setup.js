/**
 * Jest setup file
 * This file is executed before each test suite runs
 */

// Import React Testing Library matchers
require('@testing-library/jest-dom');

// Mock environment variables for testing
process.env.NDB_API_URL = 'https://test-api.example.com/v1/';
process.env.NDB_USERNAME = 'test-user';
process.env.NDB_PASSWORD = 'test-password';

// Note: MSW handlers are set up in individual test files where needed
// This allows for more granular control over API mocking per test suite

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Mock console.error and console.warn to avoid noise in test output
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Mock URL constructor for file validation tests
global.URL = class URL {
  constructor(url) {
    if (!url || typeof url !== 'string') {
      throw new TypeError('Invalid URL');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new TypeError('Invalid URL');
    }
    this.href = url;
  }
};

// Mock navigator object for node environment
global.navigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
};

// Mock document object for node environment
global.document = {
  createElement: jest.fn().mockImplementation((tagName) => {
    const element = {
      tagName: tagName.toUpperCase(),
      style: {},
      href: '',
      download: '',
      click: jest.fn(),
    };
    return element;
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
};

// Mock Date for consistent test results
const mockDate = new Date('2024-01-01T00:00:00.000Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
Date.now = jest.fn(() => mockDate.getTime());

// Mock Math.random for consistent test results
const mockMath = Object.create(global.Math);
let randomCounter = 0;
mockMath.random = jest.fn(() => {
  // Simple incrementing fraction to ensure different values for subsequent calls
  // while keeping it predictable for tests.
  randomCounter = (randomCounter + 0.01) % 1;
  return randomCounter;
});
global.Math = mockMath;

// Helper function to create a mock fetch response
global.createMockResponse = (data, status = 200, ok = true) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
};

// Helper function to create a mock file for testing
global.createMockFile = (name = 'test.pdf', size = 1024, type = 'application/pdf') => {
  // Cap ArrayBuffer size for tests to prevent allocation errors with extreme sizes
  const safeBufferSize = Math.min(size, 10 * 1024 * 1024); // Max 10MB for mock buffer
  return {
    name,
    size, // Report original size
    type,
    lastModified: Date.now(),
    slice: jest.fn(),
    stream: jest.fn(),
    text: jest.fn().mockResolvedValue('test content'),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(safeBufferSize)),
  };
};

// Suppress specific warnings that are expected in tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is deprecated') ||
      args[0].includes('Warning: React.createFactory is deprecated'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
