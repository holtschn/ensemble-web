import { useState, useEffect } from 'react';
import { fetchScoreAnalysis } from '@/next/ndb/api/actions';
import { ScoreItemWithUploads } from '@/next/ndb/types';
import { ERROR_MESSAGES } from '@/next/ndb/constants';

interface UseScoreAnalysisState {
  analysisResult: Partial<ScoreItemWithUploads> | null;
  isLoading: boolean;
  error: string | null;
}

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
        setError(ERROR_MESSAGES.LOAD_ERROR);
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
