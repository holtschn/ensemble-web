'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ScoreEditForm from '@/next/ndb/components/scores/ScoreEditForm';
import ScoreActions from '@/next/ndb/components/scores/ScoreActions';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import { ErrorBoundary } from '@/next/components/ErrorBoundary';
import { ErrorFallback } from '@/next/components/ErrorFallback';

import { uploadFile, fetchScoreAnalysis, createScore } from '@/next/ndb/api/actions';
import { ScoreItem, ScoreItemWithUploads } from '@/next/ndb/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import { useAuth } from '@/next/auth/context';

type PageState = 'upload-prompt' | 'uploading' | 'form';

const ScoreCreatePage: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('upload-prompt');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analyzedScore, setAnalyzedScore] = useState<Partial<ScoreItem> | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formSubmitRef = useRef<(() => void) | null>(null);
  const isSavingRef = useRef(false); // Synchronous lock to prevent double submissions

  const handleSkipUpload = () => {
    setPageState('form');
    setAnalyzedScore(null);
    setUploadedFileKey(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Bitte laden Sie eine PDF-Datei hoch');
      return;
    }

    setPageState('uploading');
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
      setIsUploading(false);
      const analysis = await fetchScoreAnalysis(fileKey);

      // Convert to ScoreItem format
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
      setPageState('form');
      toast.info('Die Metadaten wurden automatisch aus der PDF-Datei extrahiert. Bitte überprüfen und bei Bedarf anpassen.');
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      setUploadError('Fehler beim Hochladen oder Analysieren der Datei');
      setPageState('upload-prompt');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveClick = () => {
    // Check synchronous lock to prevent double submissions
    if (formSubmitRef.current && !isSavingRef.current) {
      formSubmitRef.current();
    }
  };

  const handleSave = async (scoreData: ScoreItemWithUploads) => {
    // Check synchronous lock to prevent double submissions
    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      // Include the uploaded PDF's S3 key if available
      const dataWithFile: ScoreItemWithUploads = {
        ...scoreData,
        partsUploadS3Key: uploadedFileKey || scoreData.partsUploadS3Key,
      };

      const result = await createScore(dataWithFile);
      toast.success(SUCCESS_MESSAGES.SCORE_CREATED);
      setHasChanges(false);
      // Redirect to the newly created score's detail page
      router.push(`/intern/ndb/${result.id}`);
    } catch (error) {
      console.error('Failed to create score:', error);
      toast.error(ERROR_MESSAGES.SAVE_ERROR);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  // Upload prompt or uploading state
  if (pageState === 'upload-prompt' || pageState === 'uploading') {
    if (isUploading || isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center mt-16">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">{isUploading ? 'Datei wird hochgeladen...' : 'PDF wird analysiert...'}</p>
        </div>
      );
    }

    return (
      status === 'loggedIn' && (
        <div className="flex flex-col mt-8">
          <div className="middle-column mb-8">
            <h1 className="mb-4">Neuer Eintrag</h1>
            <BackToScores />
          </div>

          <div className="middle-column">
            <div className="max-w-2xl mx-auto">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-600 mb-4">
                  Laden Sie das PDF mit den Einzelstimmen herauf, um Daten wie Titel, Komponist u.a. automatisch zu
                  extrahieren. Auf der folgenden Seite können Sie die Daten manuell korrigieren und ergänzen.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <label className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
                    <Icon name="upload" alt="Upload" className="mr-1.5 h-3.5 w-3.5" />
                    PDF auswählen
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  <Button
                    type="button"
                    onClick={handleSkipUpload}
                    variant="default"
                    size="sm"
                  >
                    Überspringen
                  </Button>
                </div>

                {uploadError && <p className="mt-4 text-sm text-red-600">{uploadError}</p>}
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-8">
          <h1 className="mb-4">Neuer Eintrag</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <BackToScores />
            <div className="ml-auto">
              <ScoreActions
                isEditMode={true}
                isSaving={isSaving}
                hasChanges={hasChanges}
                onEditClick={() => {}}
                onSaveClick={handleSaveClick}
              />
            </div>
          </div>
        </div>

        <div className="middle-column">
          <div className="max-w-5xl space-y-6">
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title="Fehler beim Laden des Formulars"
                  message="Das Eingabeformular konnte nicht geladen werden."
                />
              }
            >
              <ScoreEditForm
                score={analyzedScore as ScoreItem}
                onSave={handleSave}
                isSaving={isSaving}
                onHasChanges={setHasChanges}
                submitRef={formSubmitRef}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    )
  );
};

export default ScoreCreatePage;
