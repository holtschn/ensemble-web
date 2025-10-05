'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/next/auth/context';
import { getUserPreference, setUserPreference } from '@/next/ndb/utils/preferences';

/**
 * React hook for managing user preferences with hybrid storage.
 *
 * Architecture:
 * - Primary storage: Payload Preferences API (syncs across devices)
 * - Cache layer: localStorage (fast reads, offline fallback)
 *
 * Flow:
 * 1. Initial load: Try Payload first, fall back to localStorage
 * 2. Updates: Immediate localStorage + async Payload save
 * 3. Logged-out users: localStorage only
 *
 * Usage:
 * ```tsx
 * const [columnPrefs, setColumnPrefs] = useUserPreference('ndb_column_preferences', {
 *   title: true,
 *   composer: true,
 *   arranger: true,
 * });
 *
 * // Update preference
 * setColumnPrefs({ ...columnPrefs, genre: true });
 * ```
 *
 * @param key - The preference key
 * @param defaultValue - Default value if preference doesn't exist
 * @returns [value, setValue, isLoading] tuple
 */
export function useUserPreference<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, boolean] {
  const { user, status } = useAuth();
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Generate localStorage key with prefix
  const localStorageKey = `ndb_pref_${key}`;

  // Load preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      setIsLoading(true);

      try {
        // Try localStorage first (instant)
        const localValue = localStorage.getItem(localStorageKey);
        if (localValue !== null) {
          try {
            setValue(JSON.parse(localValue));
          } catch {
            // If parse fails, use string value
            setValue(localValue as unknown as T);
          }
        }

        // If user is logged in, load from Payload and update localStorage
        if (status === 'loggedIn' && user?.id) {
          const payloadValue = await getUserPreference(user.id, key);

          if (payloadValue !== null) {
            setValue(payloadValue);
            // Update localStorage cache
            localStorage.setItem(localStorageKey, JSON.stringify(payloadValue));
          } else if (localValue === null) {
            // No value in Payload or localStorage, use default
            setValue(defaultValue);
          }
        }
      } catch (error) {
        console.error('Error loading user preference:', error);
        // Fall back to default on error
        setValue(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreference();
  }, [key, user?.id, status, defaultValue, localStorageKey]);

  // Update preference function
  const updateValue = useCallback(
    (newValue: T) => {
      // Update local state immediately
      setValue(newValue);

      // Update localStorage immediately (synchronous)
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(newValue));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }

      // Update Payload asynchronously if user is logged in
      if (status === 'loggedIn' && user?.id) {
        setUserPreference(user.id, key, newValue).catch((error) => {
          console.error('Error saving preference to Payload:', error);
          // Note: localStorage still has the value, so user won't lose work
        });
      }
    },
    [key, user?.id, status, localStorageKey]
  );

  return [value, updateValue, isLoading];
}

/**
 * Hook for managing multiple preferences at once.
 * Useful when you need to load/update several preferences together.
 *
 * Usage:
 * ```tsx
 * const [prefs, updatePrefs, isLoading] = useUserPreferences({
 *   ndb_column_preferences: defaultColumns,
 *   ndb_active_filters: {},
 * });
 *
 * // Access values
 * const columns = prefs.ndb_column_preferences;
 * const filters = prefs.ndb_active_filters;
 *
 * // Update single preference
 * updatePrefs('ndb_column_preferences', newColumns);
 *
 * // Update multiple preferences
 * updatePrefs({
 *   ndb_column_preferences: newColumns,
 *   ndb_active_filters: newFilters,
 * });
 * ```
 */
export function useUserPreferences<T extends Record<string, any>>(
  defaults: T
): [T, (keyOrObject: string | Partial<T>, value?: any) => void, boolean] {
  const { user, status } = useAuth();
  const [preferences, setPreferences] = useState<T>(defaults);
  const [isLoading, setIsLoading] = useState(true);

  // Load all preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      const keys = Object.keys(defaults);
      const loaded: Partial<T> = {};

      try {
        // Load from localStorage first
        for (const key of keys) {
          const localKey = `ndb_pref_${key}`;
          const localValue = localStorage.getItem(localKey);
          if (localValue !== null) {
            try {
              loaded[key as keyof T] = JSON.parse(localValue);
            } catch {
              loaded[key as keyof T] = localValue as any;
            }
          }
        }

        // If user is logged in, load from Payload
        if (status === 'loggedIn' && user?.id) {
          for (const key of keys) {
            const payloadValue = await getUserPreference(user.id, key);
            if (payloadValue !== null) {
              loaded[key as keyof T] = payloadValue;
              // Update localStorage
              localStorage.setItem(`ndb_pref_${key}`, JSON.stringify(payloadValue));
            }
          }
        }

        setPreferences({ ...defaults, ...loaded });
      } catch (error) {
        console.error('Error loading preferences:', error);
        setPreferences(defaults);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id, status]);

  // Update function that can update one or multiple preferences
  const updatePreferences = useCallback(
    (keyOrObject: string | Partial<T>, value?: any) => {
      const updates: Partial<T> = (typeof keyOrObject === 'string' ? { [keyOrObject]: value } : keyOrObject) as Partial<T>;

      // Update local state
      setPreferences((prev) => ({ ...prev, ...updates }));

      // Update localStorage and Payload
      for (const [key, val] of Object.entries(updates)) {
        try {
          localStorage.setItem(`ndb_pref_${key}`, JSON.stringify(val));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }

        if (status === 'loggedIn' && user?.id) {
          setUserPreference(user.id, key, val).catch((error) => {
            console.error('Error saving preference to Payload:', error);
          });
        }
      }
    },
    [user?.id, status]
  );

  return [preferences, updatePreferences, isLoading];
}
