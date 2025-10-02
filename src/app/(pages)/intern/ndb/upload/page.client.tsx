'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ScoreEditForm from '@/next/ndb/components/scores/ScoreEditForm';
import ScoreActions from '@/next/ndb/components/scores/ScoreActions';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';

import { uploadFile, fetchScoreAnalysis, createScore } from '@/next/ndb/api/actions';
import { ScoreItem, ScoreItemWithUploads } from '@/next/ndb/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';
import Icon from '@/next/ndb/components/Icon';

const ScoreUploadPage: React.FC = () => {
  useRedirectIfLoggedOut();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [analyzedScore, setAnalyzedScore] = useState<Partial<ScoreItem> | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formSubmitRef = useRef<(() => void) | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Bitte laden Sie eine PDF-Datei hoch');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Step 1: Upload file to S3
      const { fileKey } = await uploadFile(file);
      if (!fileKey) {
        throw new Error('Upload fehlgeschlagen');
      }

      setUploadedFileKey(fileKey);

      // Step 2: Analyze the uploaded file
      setIsAnalyzing(true);
      const analysis = await fetchScoreAnalysis(fileKey);

      // Convert to ScoreItem format (without the upload keys)
      const scoreData: Partial<ScoreItem> = {
        id: 0,
        title: analysis.title || '',
        composer: analysis.composer || '',
        arranger: analysis.arranger || '',
        genre: analysis.genre || '',
        publisher: analysis.publisher || '',
        difficulty: analysis.difficulty || '',
        instrumentation: analysis.instrumentation || '00000',
        withOrgan: analysis.withOrgan || false,
        withPercussion: analysis.withPercussion || false,
        comment: analysis.comment || '',
        moderation: analysis.moderation || '',
        parts: null,
        fullScore: null,
        audioMidi: null,
        audioMp3: null,
      };

      setAnalyzedScore(scoreData);
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      setUploadError('Fehler beim Hochladen oder Analysieren der Datei');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    router.push('/intern/ndb');
  };

  const handleSaveClick = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current();
    }
  };

  const handleSave = async (scoreData: ScoreItemWithUploads) => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Make sure to include the uploaded PDF's S3 key in the parts field
      const dataWithFile: ScoreItemWithUploads = {
        ...scoreData,
        partsUploadS3Key: uploadedFileKey,
      };

      const result = await createScore(dataWithFile);
      setSaveMessage({ type: 'success', text: SUCCESS_MESSAGES.SCORE_CREATED });
      setHasChanges(false);
      // Redirect to the newly created score's detail page
      setTimeout(() => {
        router.push(`/intern/ndb/${result.id}`);
      }, 1000);
    } catch (error) {
      console.error('Failed to create score:', error);
      setSaveMessage({ type: 'error', text: ERROR_MESSAGES.SAVE_ERROR });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartOver = () => {
    setAnalyzedScore(null);
    setUploadedFileKey(null);
    setUploadError(null);
    setSaveMessage(null);
    setHasChanges(false);
  };

  if (isUploading || isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {isUploading ? 'Datei wird hochgeladen...' : 'PDF wird analysiert...'}
        </p>
      </div>
    );
  }

  if (!analyzedScore) {
    return (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-8">
          <h1 className="mb-4">Noten aus PDF erstellen</h1>
          <BackToScores />
        </div>

        <div className="middle-column">
          <div className="max-w-2xl mx-auto">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center dark:border-gray-600">
              <Icon name="upload" alt="Upload" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium mb-2">PDF-Datei hochladen</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Laden Sie eine PDF-Datei hoch (Stimmen oder Partitur). Die Metadaten werden automatisch extrahiert.
              </p>

              <label className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                <Icon name="upload" alt="Upload" className="mr-2 h-4 w-4" />
                PDF auswählen
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Hinweis:</strong> Nach dem Upload wird die PDF-Datei automatisch analysiert und die Metadaten
                werden in das Formular eingetragen. Sie können diese anschließend überprüfen und anpassen.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-8">
        <h1 className="mb-4">Noten aus PDF erstellen</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <BackToScores />
          <button
            type="button"
            onClick={handleStartOver}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Icon name="upload" alt="New Upload" className="mr-1.5 h-3.5 w-3.5" />
            Neue Datei
          </button>
          <div className="ml-auto">
            <ScoreActions
              isEditMode={true}
              isSaving={isSaving}
              hasChanges={hasChanges}
              onEditClick={() => {}}
              onSaveClick={handleSaveClick}
              onCancelClick={handleCancel}
            />
          </div>
        </div>
        {saveMessage && (
          <div
            className={`mt-4 p-4 rounded-md ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Die Metadaten wurden automatisch aus der PDF-Datei extrahiert. Bitte überprüfen und bei Bedarf anpassen.
          </p>
        </div>
      </div>

      <div className="middle-column">
        <div className="max-w-5xl space-y-6">
          <ScoreEditForm
            score={analyzedScore as ScoreItem}
            onSave={handleSave}
            isSaving={isSaving}
            onHasChanges={setHasChanges}
            submitRef={formSubmitRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreUploadPage;
