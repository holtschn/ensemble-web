'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ScoreDetailsCard from '@/next/ndb/components/scores/ScoreDetailsCard';
import ScoreEditForm from '@/next/ndb/components/scores/ScoreEditForm';
import ScoreFilesInline from '@/next/ndb/components/scores/ScoreFilesInline';
import ScoreSamplesCard from '@/next/ndb/components/scores/ScoreSamplesCard';
import ScoreActions from '@/next/ndb/components/scores/ScoreActions';
import Icon from '@/next/ndb/components/Icon';
import { ErrorBoundary } from '@/next/components/ErrorBoundary';
import { ErrorFallback } from '@/next/components/ErrorFallback';

import { useScores } from '@/next/ndb/hooks/useScores';
import { updateScore } from '@/next/ndb/api/actions';
import { ScoreItemWithUploads } from '@/next/ndb/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';
import { useAuth } from '@/next/auth/context';

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const { getScoreById, isLoading } = useScores();
  const score = React.useMemo(() => (scoreId ? getScoreById(scoreId) : null), [scoreId, getScoreById]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => void) | null>(null);

  const handleEditClick = () => {
    setIsEditMode(true);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setHasChanges(false);
  };

  const handleSaveClick = () => {
    // Trigger form submit
    if (formSubmitRef.current) {
      formSubmitRef.current();
    }
  };

  const handleSave = async (scoreData: ScoreItemWithUploads) => {
    setIsSaving(true);
    try {
      await updateScore(scoreData);
      toast.success(SUCCESS_MESSAGES.SCORE_UPDATED);
      setIsEditMode(false);
      setHasChanges(false);
      // Reload the page to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to save score:', error);
      toast.error(ERROR_MESSAGES.SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!score) {
    return (
      <div className="middle-column mt-8">
        <h1>Eintrag nicht gefunden</h1>
        <BackToScores />
      </div>
    );
  }

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-8">
          <h1 className="mb-4">{isEditMode ? `${score.title} bearbeiten` : score.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center ndb-profex-label disabled:opacity-50"
              >
                <Icon name="arrow-left" alt="Cancel" className="mr-2 h-3 w-3" />
                <div className="mt-0.5">Abbrechen</div>
              </button>
            ) : (
              <BackToScores />
            )}
            <div className="ml-auto flex items-center gap-4">
              {isEditMode && hasChanges && <span className="text-sm text-amber-600">Ungespeicherte Änderungen</span>}
              {isEditMode ? (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasChanges}
                  className="flex items-center px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Speichern...' : 'Speichern'}
                </button>
              ) : (
                <ScoreActions
                  isEditMode={isEditMode}
                  isSaving={isSaving}
                  hasChanges={hasChanges}
                  onEditClick={handleEditClick}
                  onSaveClick={handleSaveClick}
                />
              )}
            </div>
          </div>
        </div>

        <div className="middle-column">
          <div className="max-w-5xl space-y-6">
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title="Fehler beim Laden der Note"
                  message="Die Notendetails konnten nicht geladen werden."
                />
              }
            >
              {isEditMode ? (
                <ScoreEditForm
                  score={score}
                  onSave={handleSave}
                  isSaving={isSaving}
                  onHasChanges={setHasChanges}
                  submitRef={formSubmitRef}
                />
              ) : (
                <>
                  <ScoreDetailsCard score={score} />
                  <ScoreFilesInline score={score} />
                  <ScoreSamplesCard score={score} />
                </>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    )
  );
};

export default ScoreDetailsPage;
