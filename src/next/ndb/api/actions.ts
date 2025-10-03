/**
 * API client functions for Notendatenbank (NDB) score-related operations
 * providing direct asynchronous functions to interact with the NDB API.
 */

import { ndbApi } from './client';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/next/ndb/constants';
import { ScoreItem, ScoreItemWithUploads, ScoreFileItem, ScoreSampleCollection } from '../types';

/**
 * Fetches all scores from the NDB API.
 * @returns A promise that resolves to an array of ScoreItem.
 */
export const fetchAllScores = async (): Promise<ScoreItem[]> =>
  (await ndbApi.get<{ rowData: ScoreItem[] }>(API_ENDPOINTS.SCORES)).rowData;

/**
 * Creates a new score in the NDB.
 * @param scoreData - The data for the new score, including any S3 keys for uploaded files.
 *                    The backend will assign an ID to the new score.
 * @returns A promise that resolves to an object containing the ID of the newly created score.
 */
export const createScore = async (scoreData: ScoreItemWithUploads): Promise<{ id: number }> =>
  await ndbApi.post<{ id: number }>(API_ENDPOINTS.SCORE, scoreData);

/**
 * Updates an existing score in the NDB.
 * The score ID must be present in the `scoreData` object.
 * @param scoreData - The updated score data, including its ID and any S3 keys for newly uploaded files.
 * @returns A promise that resolves to an object with a success message (e.g., { message: "score updated" }).
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
 */
export const fetchScoreAnalysis = async (s3FileKey: string): Promise<Partial<ScoreItemWithUploads>> =>
  await ndbApi.post<Partial<ScoreItemWithUploads>>(
    API_ENDPOINTS.UPLOAD, // Corresponds to POST /v1/upload
    { partsUploadS3Key: s3FileKey }
  );

/**
 * Uploads a file to S3 storage via the NDB API.
 * First requests a pre-signed upload URL from the backend, then uploads the file directly to S3.
 * @param file - The File object to be uploaded.
 * @returns A promise that resolves to an object containing the upload URL and file key,
 *          or empty strings if the upload fails.
 */
export const uploadFile = async (file: File): Promise<{ uploadUrl: string; fileKey: string }> => {
  try {
    // First, get the upload URL
    const uploadResponse = await ndbApi.get<{ uploadUrl: string; fileKey: string }>(API_ENDPOINTS.UPLOAD);

    if (!uploadResponse || !uploadResponse.uploadUrl || !uploadResponse.fileKey) {
      throw new Error(ERROR_MESSAGES.UPLOAD_ERROR);
    }

    const { uploadUrl, fileKey } = uploadResponse;

    // Upload the file to S3
    // The x-amz-acl header is required as it's part of the signed headers
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-amz-acl': 'bucket-owner-full-control',
      },
      body: file,
    });

    if (!s3Response.ok) {
      throw new Error(ERROR_MESSAGES.UPLOAD_ERROR);
    }

    return { uploadUrl, fileKey };
  } catch (error) {
    console.error('Upload Error:', error);
  }
  return { uploadUrl: '', fileKey: '' };
};

/**
 * Fetches a pre-signed S3 URL for downloading an existing file.
 * The backend generates this URL based on the file's key and other score information.
 *
 * @param fileItem - An object containing `key`, `filename`, and `scoreId` of the file to download.
 * @returns A promise that resolves to an object containing the `url` for downloading the file.
 */
export const downloadFile = async (fileItem: ScoreFileItem): Promise<Response | null> => {
  const payload = {
    key: fileItem.key,
    filename: fileItem.filename,
    scoreId: Number(fileItem.scoreId), // Ensure scoreId is a number if it might come as string
  };
  try {
    const downloadResponse = await ndbApi.post<{
      url: string;
    }>(API_ENDPOINTS.DOWNLOAD, payload);

    if (!downloadResponse || !downloadResponse.url) {
      throw new Error(ERROR_MESSAGES.DOWNLOAD_ERROR);
    }

    return fetch(downloadResponse.url);
  } catch (error) {
    console.error('Download Error:', error);
    return null;
  }
};

/**
 * Fetches all score sample collections from the NDB API.
 * Each collection is associated with a scoreId and contains arrays of Spotify and YouTube samples.
 *
 * @returns A promise that resolves to an array of ScoreSampleCollection.
 */
export const fetchScoreSamples = async (): Promise<ScoreSampleCollection[]> =>
  await ndbApi.get<ScoreSampleCollection[]>(API_ENDPOINTS.SCORE_SAMPLES);
