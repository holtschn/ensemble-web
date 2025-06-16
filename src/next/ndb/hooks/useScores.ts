/**
 * Custom React hook for fetching and managing Notendatenbank (NDB) scores.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchAllScores, fetchScoreAnalysis } from '../api/scores';
import { ScoreItem, ScoreItemWithUploads } from '../types';
import { ApiError } from '../api/client';
import { ERROR_MESSAGES } from '../api/constants';

interface UseScoresState {
  scores: ScoreItem[];
  isLoading: boolean;
  error: string | null;
  getScoreById: (id: number) => ScoreItem | undefined;
  getUniqueAttributeValues: (attributeName: keyof ScoreItem) => string[];
}

interface UseScoreAnalysisState {
  analysisResult: Partial<ScoreItemWithUploads> | null;
  isLoading: boolean;
  error: string | null;
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
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError(ERROR_MESSAGES.LOAD_ERROR);
      }
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
    (id: number): ScoreItem | undefined => {
      return scores.find((score) => score.id === id);
    },
    [scores]
  );

  /**
   * Extracts unique values for a given attribute from the list of scores.
   * This replicates the client-side processing previously done by Recoil selectors.
   *
   * @param {keyof ScoreItem} attributeName - The name of the attribute (e.g., 'composer', 'genre').
   * @returns {string[]} An array of unique string values for the specified attribute, sorted.
   */
  const getUniqueAttributeValues = useCallback(
    (attributeName: keyof ScoreItem): string[] => {
      const allValues = scores
        .map((s) => {
          const value = s[attributeName];
          return value !== null && typeof value !== 'undefined' ? String(value) : '';
        })
        .filter((v) => v !== ''); // Filter out empty strings resulting from null/undefined

      return [...new Set(allValues)].sort();
    },
    [scores]
  );

  return {
    scores,
    isLoading,
    error,
    getScoreById,
    getUniqueAttributeValues,
  };
};

/**
 * Custom hook to fetch score analysis results based on an S3 file key.
 * This is typically used after a file is uploaded to S3 and before a score is created or updated.
 *
 * @param {string | null} s3FileKey - The S3 key of the uploaded file. Hook will fetch only if key is provided.
 * @returns {UseScoreAnalysisState} An object containing the analysis result, loading state, and error state.
 */
export const useScoreAnalysis = (s3FileKey: string | null): UseScoreAnalysisState => {
  const [analysisResult, setAnalysisResult] = useState<Partial<ScoreItemWithUploads> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!s3FileKey) {
      setAnalysisResult(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchScoreAnalysis(s3FileKey);
        setAnalysisResult(data);
      } catch (e) {
        if (e instanceof ApiError) {
          setError(e.message);
        } else {
          setError(ERROR_MESSAGES.LOAD_ERROR);
        }
        setAnalysisResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [s3FileKey]);

  return {
    analysisResult,
    isLoading,
    error,
  };
};

// Potentially, a useScoreMutations hook could be created to handle createScore and updateScore,
// including managing loading/error states for those specific operations and potentially re-fetching data.
// For now, createScore and updateScore from api/scores.ts can be called directly from components.
