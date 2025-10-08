/**
 * Custom React hook for fetching and managing Notendatenbank (NDB) setlists.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchAllSetlists } from '@/next/ndb/api/actions';
import { SetlistItem } from '@/next/ndb/types';
import { ERROR_MESSAGES } from '@/next/ndb/constants';

interface UseSetlistsState {
  setlists: SetlistItem[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  getSetlistById: (id: number) => SetlistItem | null;
}

/**
 * Custom hook to fetch all setlists from the NDB API.
 * Provides loading state and helper functions.
 *
 * @returns {UseSetlistsState} An object containing setlists, loading state,
 *                              refetch function, and helper functions like getSetlistById.
 */
export const useSetlists = (): UseSetlistsState => {
  const [setlists, setSetlists] = useState<SetlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSetlists = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllSetlists();
      console.log('GOOD BYE', data);
      setSetlists(data);
    } catch (e) {
      toast.error(ERROR_MESSAGES.LOAD_ERROR);
      setSetlists([]); // Clear setlists on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSetlists();
  }, [loadSetlists]);

  /**
   * Retrieves a single setlist by its ID from the fetched setlists list.
   *
   * @param {number} id - The ID of the setlist to retrieve.
   * @returns {SetlistItem | null} The setlist item if found, otherwise null.
   */
  const getSetlistById = useCallback(
    (id: number): SetlistItem | null => {
      if (setlists && !setlists.length) return null;
      return setlists.find((setlist) => setlist.id === id) || null;
    },
    [setlists]
  );

  /**
   * Refetch setlists from the API.
   * Useful after creating or updating a setlist.
   */
  const refetch = useCallback(async () => {
    await loadSetlists();
  }, [loadSetlists]);

  return {
    setlists,
    isLoading,
    refetch,
    getSetlistById,
  };
};
