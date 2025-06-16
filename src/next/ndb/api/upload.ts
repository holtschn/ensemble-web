/**
 * API client functions for Notendatenbank (NDB) file upload and download operations.
 */

import { ApiError, ndbApi } from './client';
import { API_ENDPOINTS, ERROR_MESSAGES } from './constants';
import { ScoreFileItem } from '../types';

// File upload
export const uploadFile = async (file: File): Promise<{ uploadUrl: string; fileKey: string }> => {
  try {
    // First, get the upload URL
    const uploadResponse = await ndbApi.get(API_ENDPOINTS.UPLOAD);

    if (!uploadResponse || !uploadResponse.uploadUrl || !uploadResponse.fileKey) {
      throw new Error(ERROR_MESSAGES.UPLOAD_ERROR);
    }

    const { uploadUrl, fileKey } = uploadResponse;

    // Upload the file to S3
    const formData = new FormData();
    formData.append('file', file);

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
    throw new ApiError(
      error instanceof Error ? error.message : ERROR_MESSAGES.UPLOAD_ERROR,
      (error as Response).status,
      (error as Response).statusText
    );
  }
};

/**
 * Fetches a pre-signed S3 URL for downloading an existing file.
 * The backend generates this URL based on the file's key and other score information.
 *
 * @param fileItem - An object containing `key`, `filename`, and `scoreId` of the file to download.
 * @returns A promise that resolves to an object containing the `url` for downloading the file.
 * @throws {ApiError} If the API request fails or the response is invalid.
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
