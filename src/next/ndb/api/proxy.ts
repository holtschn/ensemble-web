'use server';
/**
 * API utilities for Notendatenbank (NDB) integration
 */
import { ERROR_MESSAGES } from '@/next/ndb/constants';

const NDB_API_BASE_URL = process.env.NDB_API_URL || '';
const NDB_USERNAME = process.env.NDB_USERNAME || '';
const NDB_PASSWORD = process.env.NDB_PASSWORD || '';

/**
 * Error handling
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Authentication Headers
const createAuthHeaders = () => {
  const credentials = btoa(`${NDB_USERNAME}:${NDB_PASSWORD}`);
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${credentials}`,
  };
};

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

      const apiError = new ApiError(
        error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
        (error as Response).status,
        (error as Response).statusText
      );
      throw apiError;
    }
  };
};

// Create the API client instance
export const apiClient = createApiClient();
