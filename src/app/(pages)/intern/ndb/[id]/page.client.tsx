'use client';

import React, { useState } from 'react';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ScoreDetailsCard from '@/next/ndb/components/scores/ScoreDetailsCard';
import ScoreEditForm from '@/next/ndb/components/scores/ScoreEditForm';
import ScoreFilesInline from '@/next/ndb/components/scores/ScoreFilesInline';
import ScoreSamplesCard from '@/next/ndb/components/scores/ScoreSamplesCard';
import ScoreActions from '@/next/ndb/components/scores/ScoreActions';

import { useScores } from '@/next/ndb/hooks/useScores';
import { updateScore } from '@/next/ndb/api/actions';
import { ScoreItemWithUploads } from '@/next/ndb/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  useRedirectIfLoggedOut();

  const { getScoreById, isLoading } = useScores();
  const score = React.useMemo(() => (scoreId ? getScoreById(scoreId) : null), [scoreId, getScoreById]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => void) | null>(null);

  const handleEditClick = () => {
    setIsEditMode(true);
    setSaveMessage(null);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('Änderungen verwerfen? Alle nicht gespeicherten Änderungen gehen verloren.');
      if (!confirmed) return;
    }
    setIsEditMode(false);
    setSaveMessage(null);
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
    setSaveMessage(null);
    try {
      await updateScore(scoreData);
      setSaveMessage({ type: 'success', text: SUCCESS_MESSAGES.SCORE_UPDATED });
      setIsEditMode(false);
      setHasChanges(false);
      // Reload the page to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to save score:', error);
      setSaveMessage({ type: 'error', text: ERROR_MESSAGES.SAVE_ERROR });
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
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-8">
        <h1 className="mb-4">{isEditMode ? `${score.title} bearbeiten` : score.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <BackToScores />
          <div className="ml-auto">
            <ScoreActions
              isEditMode={isEditMode}
              isSaving={isSaving}
              hasChanges={hasChanges}
              onEditClick={handleEditClick}
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
      </div>

      <div className="middle-column">
        <div className="max-w-5xl space-y-6">
          {isEditMode ? (
            <>
              <ScoreEditForm
                score={score}
                onSave={handleSave}
                isSaving={isSaving}
                onHasChanges={setHasChanges}
                submitRef={formSubmitRef}
              />
              {/* TODO: Add file upload section here in edit mode */}
            </>
          ) : (
            <>
              <ScoreDetailsCard score={score} />
              <ScoreFilesInline score={score} />
              <ScoreSamplesCard score={score} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDetailsPage;
