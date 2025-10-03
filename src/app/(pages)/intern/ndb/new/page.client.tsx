'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ScoreEditForm from '@/next/ndb/components/scores/ScoreEditForm';
import ScoreActions from '@/next/ndb/components/scores/ScoreActions';

import { createScore } from '@/next/ndb/api/actions';
import { ScoreItemWithUploads } from '@/next/ndb/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';

const ScoreCreatePage: React.FC = () => {
  useRedirectIfLoggedOut();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => void) | null>(null);

  const handleCancel = () => {
    router.push('/intern/ndb');
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
      const result = await createScore(scoreData);
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

  return (
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
              onCancelClick={handleCancel}
            />
          </div>
        </div>
        {saveMessage && (
          <div
            className={`mt-4 p-4 rounded-md ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
      </div>

      <div className="middle-column">
        <div className="max-w-5xl space-y-6">
          <ScoreEditForm
            score={null}
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

export default ScoreCreatePage;
