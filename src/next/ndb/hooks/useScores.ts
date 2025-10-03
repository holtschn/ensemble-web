/**
 * Custom React hook for fetching and managing Notendatenbank (NDB) scores.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchAllScores } from '@/next/ndb/api/actions';
import { ScoreItem } from '@/next/ndb/types';
import { ERROR_MESSAGES } from '@/next/ndb/constants';

interface UseScoresState {
  scores: ScoreItem[];
  isLoading: boolean;
  error: string | null;
  getScoreById: (id: number) => ScoreItem | null;
}

/**
 * Custom hook to fetch all scores from the NDB API.
 * Provides loading and error states, and helper functions.
 *
 * @returns {UseScoresState} An object containing scores, loading state, error state,
 *                           and helper functions like getScoreById and getUniqueAttributeValues.
 */
export const useScores = (): UseScoresState => {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllScores();
      setScores(data);
    } catch (e) {
      setError(ERROR_MESSAGES.LOAD_ERROR);
      setScores([]); // Clear scores on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  /**
   * Retrieves a single score by its ID from the fetched scores list.
   * This replicates the client-side filtering previously done by Recoil selectors.
   *
   * @param {number} id - The ID of the score to retrieve.
   * @returns {ScoreItem | undefined} The score item if found, otherwise undefined.
   */
  const getScoreById = useCallback(
    (id: number): ScoreItem | null => {
      return scores.find((score) => score.id === id) ?? null;
    },
    [scores]
  );

  return {
    scores,
    isLoading,
    error,
    getScoreById,
  };
};
