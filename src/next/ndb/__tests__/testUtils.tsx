/**
 * Test utilities for NDB tests
 * Provides common setup and helpers for testing components and hooks
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from '../__mocks__/handlers';

/**
 * MSW server for mocking API requests
 * Import and use in tests:
 *
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 */
export const server = setupServer(...handlers);

/**
 * Custom render function that wraps components with necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any provider props here if needed
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Override global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

/**
 * Mock IntersectionObserver for components that use it
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
};

/**
 * Mock ResizeObserver for components that use it
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Helper to mock window.matchMedia
 */
export const mockMatchMedia = (matches: boolean = true) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * Helper to create a mock file
 */
export const createMockFile = (
  name: string = 'test.pdf',
  size: number = 1024,
  type: string = 'application/pdf'
): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
