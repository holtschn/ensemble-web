/**
 * Custom React hook for managing Notendatenbank (NDB) file uploads and downloads.
 */

import { useState, useCallback } from 'react';
import { uploadFile as apiUploadFile, downloadFile as apiDownloadFile } from '@/next/ndb/api/actions';
import { ScoreFileItem } from '@/next/ndb/types';
import { ERROR_MESSAGES } from '@/next/ndb/constants';

interface UseFileUpDownLoadState {
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<string | null>; // Returns S3 fileKey on success
  downloadFile: (fileItem: ScoreFileItem) => Promise<void>;
}

/**
 * Custom hook to manage file uploads to S3 and file downloads.
 *
 * @returns {UseFileUpDownLoadState} An object containing upload/download functions, loading state, and error state.
 */
export const useFileUpDownLoad = (): UseFileUpDownLoadState => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles file upload using the `uploadFile` function from the API.
   *
   * @param {File} file - The file to be uploaded.
   * @returns {Promise<string | null>} A promise that resolves to the S3 fileKey if successful, otherwise null.
   */
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { fileKey } = await apiUploadFile(file);
      setIsLoading(false);
      return fileKey;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(ERROR_MESSAGES.UPLOAD_ERROR);
      }
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Handles file download using the `downloadFile` function from the API.
   *
   * @param {ScoreFileItem} fileItem - Information about the file to be downloaded.
   * @returns {Promise<void>} A promise that resolves when the download attempt is made.
   */
  const downloadFile = useCallback(async (fileItem: ScoreFileItem): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiDownloadFile(fileItem);

      if (response) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileItem.filename || 'download');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(ERROR_MESSAGES.DOWNLOAD_ERROR);
      }

      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(ERROR_MESSAGES.DOWNLOAD_ERROR);
      }
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    uploadFile,
    downloadFile,
  };
};
