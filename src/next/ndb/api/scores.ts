/**
 * API client functions for Notendatenbank (NDB) score-related operations
 * providing direct asynchronous functions to interact with the NDB API.
 */

import { ndbApi } from './client';
import { API_ENDPOINTS } from './constants';
import { ScoreItem, ScoreItemWithUploads, ScoreSampleCollection } from '../types';

/**
 * Fetches all scores from the NDB API.
 * @returns A promise that resolves to an array of ScoreItem.
 * @throws {ApiError} If the API request fails or the response is invalid.
 */
export const fetchAllScores = async (): Promise<ScoreItem[]> =>
  (await ndbApi.get<{ rowData: ScoreItem[] }>(API_ENDPOINTS.SCORES)).rowData;

/**
 * Creates a new score in the NDB.
 * @param scoreData - The data for the new score, including any S3 keys for uploaded files.
 *                    The backend will assign an ID to the new score.
 * @returns A promise that resolves to an object containing the ID of the newly created score.
 * @throws {ApiError} If the API request fails or the response is invalid.
 */
export const createScore = async (scoreData: ScoreItemWithUploads): Promise<{ id: number }> =>
  await ndbApi.post<{ id: number }>(API_ENDPOINTS.SCORE, scoreData);

/**
 * Updates an existing score in the NDB.
 * The score ID must be present in the `scoreData` object.
 * @param scoreData - The updated score data, including its ID and any S3 keys for newly uploaded files.
 * @returns A promise that resolves to an object with a success message (e.g., { message: "score updated" }).
 * @throws {ApiError} If the API request fails or the response is invalid.
 */
export const updateScore = async (scoreData: ScoreItemWithUploads): Promise<{ message: string }> =>
  // The API for PUT /v1/score expects the full score object in the body,
  // including the 'id' of the score to be updated.
  await ndbApi.put<{ message: string }>(API_ENDPOINTS.SCORE, scoreData);

/**
 * Fetches score analysis results based on an S3 file key.
 * This is typically used after a file is uploaded to S3 (e.g., a PDF of sheet music)
 * and before a score is formally created or updated in the database. The backend
 * uses AI to extract metadata from the file.
 * @param s3FileKey - The S3 key of the uploaded file that needs to be analyzed.
 * @returns A promise that resolves to a partial ScoreItemWithUploads (AnalysisResponse)
 *          containing the metadata extracted from the file.
 * @throws {ApiError} If the API request fails or the response is invalid.
 */
export const fetchScoreAnalysis = async (s3FileKey: string): Promise<Partial<ScoreItemWithUploads>> =>
  await ndbApi.post<Partial<ScoreItemWithUploads>>(
    API_ENDPOINTS.UPLOAD_ANALYSIS, // Corresponds to POST /v1/upload
    { partsUploadS3Key: s3FileKey }
  );

/**
 * Fetches all score sample collections from the NDB API.
 * Each collection is associated with a scoreId and contains arrays of Spotify and YouTube samples.
 *
 * @returns A promise that resolves to an array of ScoreSampleCollection.
 * @throws {ApiError} If the API request fails or the response is invalid.
 */
export const fetchScoreSamples = async (): Promise<ScoreSampleCollection[]> =>
  await ndbApi.get<ScoreSampleCollection[]>(API_ENDPOINTS.SCORE_SAMPLES);
