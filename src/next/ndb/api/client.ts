'use server';

/**
 * API utilities for Notendatenbank (NDB) integration
 */

import { NDB_API_BASE_URL, API_ENDPOINTS, createAuthHeaders, ERROR_MESSAGES } from './constants';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

/**
 * Creates an enhanced fetch function with NDB-specific configuration
 */
const createApiClient = () => {
  const baseHeaders = createAuthHeaders();

  return async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const url = `${NDB_API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: baseHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          response.status === 403 ? ERROR_MESSAGES.AUTH_ERROR : errorText || ERROR_MESSAGES.NETWORK_ERROR
        );
      }

      const responseBody = await response.json();
      return responseBody as T;
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        throw error; // Re-throw ApiError for specific handling
      }

      const apiError: ApiError = new ApiError(
        error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        (error as Response).status,
        (error as Response).statusText
      );
      throw apiError;
    }
  };
};

// Create the API client instance
const apiClient = createApiClient();

/**
 * Specialized API methods
 */
export const ndbApi = {
  // GET requests
  get: <T = any>(endpoint: string): Promise<T> => {
    return apiClient<T>(endpoint, { method: 'GET' });
  },

  // POST requests
  post: <T = any>(endpoint: string, data: any): Promise<T> => {
    return apiClient<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT requests
  put: <T = any>(endpoint: string, data: any): Promise<T> => {
    return apiClient<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Error handling utilities
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
