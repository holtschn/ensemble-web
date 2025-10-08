'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Utility functions for managing user preferences.
 *
 * Architecture:
 * - Primary storage: Payload Preferences API (syncs across devices, persists in database)
 * - Cache layer: localStorage (fast reads, fallback for offline)
 *
 * Flow:
 * 1. Load from Payload → cache to localStorage
 * 2. Immediate localStorage updates + async Payload saves
 *
 * Preference Keys:
 * - ndb_column_preferences: Table column visibility configuration
 * - ndb_active_filters: Active filter state
 */

export interface UserPreferences {
  [key: string]: any;
}

/**
 * Get a user preference from Payload.
 * This is a server action that can be called from client components.
 *
 * @param userId - The ID of the user (string or number)
 * @param key - The preference key
 * @returns The preference value or null if not found
 */
export async function getUserPreference(userId: string | number, key: string): Promise<any> {
  try {
    const payload = await getPayload({ config });

    // Query user preferences from Payload
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    });

    // Payload stores preferences in a _preferences field
    const preferences = (user as any)?._preferences;
    if (!preferences) {
      return null;
    }

    return preferences[key] ?? null;
  } catch (error) {
    console.error('Error getting user preference:', error);
    return null;
  }
}

/**
 * Set a user preference in Payload.
 * This is a server action that can be called from client components.
 *
 * @param userId - The ID of the user (string or number)
 * @param key - The preference key
 * @param value - The preference value
 * @returns Success boolean
 */
export async function setUserPreference(userId: string | number, key: string, value: any): Promise<boolean> {
  try {
    const payload = await getPayload({ config });

    // Get current user to access preferences
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    });

    // Get existing preferences or create new object
    const currentPreferences = (user as any)?._preferences || {};

    // Update preferences
    const updatedPreferences = {
      ...currentPreferences,
      [key]: value,
    };

    // Update user with new preferences
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        _preferences: updatedPreferences,
      } as any,
    });

    return true;
  } catch (error) {
    console.error('Error setting user preference:', error);
    return false;
  }
}

/**
 * Get multiple user preferences at once.
 *
 * @param userId - The ID of the user (string or number)
 * @param keys - Array of preference keys
 * @returns Object with requested preferences
 */
export async function getUserPreferences(userId: string | number, keys: string[]): Promise<UserPreferences> {
  try {
    const payload = await getPayload({ config });

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    });

    const preferences = (user as any)?._preferences || {};

    // Filter to only requested keys
    const result: UserPreferences = {};
    for (const key of keys) {
      if (key in preferences) {
        result[key] = preferences[key];
      }
    }

    return result;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
}

/**
 * Set multiple user preferences at once.
 *
 * @param userId - The ID of the user (string or number)
 * @param preferences - Object with preference key-value pairs
 * @returns Success boolean
 */
export async function setUserPreferences(userId: string | number, preferences: UserPreferences): Promise<boolean> {
  try {
    const payload = await getPayload({ config });

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    });

    const currentPreferences = (user as any)?._preferences || {};

    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    };

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        _preferences: updatedPreferences,
      } as any,
    });

    return true;
  } catch (error) {
    console.error('Error setting user preferences:', error);
    return false;
  }
}

/**
 * Delete a user preference.
 *
 * @param userId - The ID of the user (string or number)
 * @param key - The preference key to delete
 * @returns Success boolean
 */
export async function deleteUserPreference(userId: string | number, key: string): Promise<boolean> {
  try {
    const payload = await getPayload({ config });

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    });

    const currentPreferences = (user as any)?._preferences || {};

    // Remove the key
    const { [key]: _, ...updatedPreferences } = currentPreferences;

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        _preferences: updatedPreferences,
      } as any,
    });

    return true;
  } catch (error) {
    console.error('Error deleting user preference:', error);
    return false;
  }
}

/**
 * Clear all preferences for a user.
 *
 * @param userId - The ID of the user (string or number)
 * @returns Success boolean
 */
export async function clearUserPreferences(userId: string | number): Promise<boolean> {
  try {
    const payload = await getPayload({ config });

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        _preferences: {},
      } as any,
    });

    return true;
  } catch (error) {
    console.error('Error clearing user preferences:', error);
    return false;
  }
}
