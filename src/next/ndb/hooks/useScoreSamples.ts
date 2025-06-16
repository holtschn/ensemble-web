/**
 * Custom React hook for fetching and managing Notendatenbank (NDB) score samples.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchScoreSamples as apiFetchScoreSamples } from '../api/scores';
import { ScoreSampleCollection } from '../types';
import { ApiError } from '../api/client';
import { ERROR_MESSAGES } from '../api/constants';

interface UseScoreSamplesState {
  allSamples: ScoreSampleCollection[];
  isLoading: boolean;
  error: string | null;
  getSamplesByScoreId: (scoreId: number) => ScoreSampleCollection | null;
}

/**
 * Custom hook to fetch all score sample collections from the NDB API.
 * Provides loading and error states, and a helper function to get samples for a specific score.
 *
 * @returns {UseScoreSamplesState} An object containing all samples, loading state, error state,
 *                           and a helper function getSamplesByScoreId.
 */
export const useScoreSamples = (): UseScoreSamplesState => {
  const [allSamples, setAllSamples] = useState<ScoreSampleCollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSamples = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetchScoreSamples();
      setAllSamples(data);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError(ERROR_MESSAGES.LOAD_ERROR);
      }
      setAllSamples([]); // Clear samples on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  /**
   * Retrieves a single score sample collection by its score ID from the fetched samples list.
   * This replicates the client-side filtering previously done by Recoil selectors.
   *
   * @param {number} scoreId - The ID of the score for which to retrieve samples.
   * @returns {ScoreSampleCollection | null} The score sample collection if found, otherwise null.
   */
  const getSamplesByScoreId = useCallback(
    (scoreId: number): ScoreSampleCollection | null => {
      return allSamples.find((sampleCollection) => sampleCollection.scoreId === scoreId) ?? null;
    },
    [allSamples]
  );

  return {
    allSamples,
    isLoading,
    error,
    getSamplesByScoreId,
  };
};
