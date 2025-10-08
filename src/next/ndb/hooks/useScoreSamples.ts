/**
 * Custom React hook for fetching and managing Notendatenbank (NDB) score samples.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchScoreSamples as apiFetchScoreSamples } from '@/next/ndb/api/actions';
import { ScoreSampleCollection } from '@/next/ndb/types';
import { ERROR_MESSAGES } from '@/next/ndb/constants';

interface UseScoreSamplesState {
  allSamples: ScoreSampleCollection[];
  isLoading: boolean;
  getSamplesByScoreId: (scoreId: number) => ScoreSampleCollection | null;
}

/**
 * Custom hook to fetch all score sample collections from the NDB API.
 * Provides loading state and a helper function to get samples for a specific score.
 *
 * @returns {UseScoreSamplesState} An object containing all samples, loading state,
 *                           and a helper function getSamplesByScoreId.
 */
export const useScoreSamples = (): UseScoreSamplesState => {
  const [allSamples, setAllSamples] = useState<ScoreSampleCollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSamples = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetchScoreSamples();
      setAllSamples(data);
    } catch (e) {
      toast.error(ERROR_MESSAGES.LOAD_ERROR);
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
    getSamplesByScoreId,
  };
};
