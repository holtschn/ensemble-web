'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import { useSetlists } from '@/next/ndb/hooks/useSetlists';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import SetlistDisplay from '@/next/ndb/components/setlists/SetlistDisplay';
import SetlistEditor from '@/next/ndb/components/setlists/SetlistEditor';
import BackToSetlists from '@/next/ndb/components/setlists/BackToSetlists';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import { EmptyState } from '@/next/components/EmptyState';

export const EditSetlistPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();
  const params = useParams();
  const setlistId = parseInt(params.id as string, 10);

  const { setlists, isLoading, getSetlistById, refetch } = useSetlists();
  const setlist = getSetlistById(setlistId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => void) | null>(null);

  const handleEditClick = () => {
    setIsEditMode(true);
    setHasChanges(false);
  };

  const handleSaveClick = () => {
    // Trigger form submit
    if (formSubmitRef.current) {
      setIsSaving(true);
      formSubmitRef.current();
    }
  };

  const handleSaveSuccess = () => {
    setIsSaving(false);
    // Refetch setlists to get updated data, then exit edit mode
    refetch();
    setIsEditMode(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setHasChanges(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!setlist) {
    return (
      <div className="middle-column mt-8">
        <BackToSetlists />
        <EmptyState
          variant="error"
          icon="alert-circle"
          heading="Setlist nicht gefunden"
          message="Die angeforderte Setlist konnte nicht gefunden werden."
          action={{
            label: 'Zurück zu Setlists',
            onClick: () => router.push('/intern/ndb/setlists'),
          }}
        />
      </div>
    );
  }

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-8">
          <h1 className="mb-4">{isEditMode ? `${setlist.displayName} bearbeiten` : setlist.displayName}</h1>
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
              <BackToSetlists />
            )}
            <div className="ml-auto flex items-center gap-4">
              {isEditMode && hasChanges && <span className="text-sm text-amber-600">Ungespeicherte Änderungen</span>}
              {isEditMode ? (
                <Button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasChanges}
                  variant="highlighted"
                  size="sm"
                  isLoading={isSaving}
                >
                  Speichern
                </Button>
              ) : (
                <Button type="button" onClick={handleEditClick} variant="highlighted" size="sm">
                  Bearbeiten
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Full width for allocations table */}
        <div className="px-4 sm:px-6 lg:px-8">
          {isEditMode ? (
            <SetlistEditor
              mode="edit"
              setlistId={setlistId}
              initialData={setlist}
              onSaveSuccess={handleSaveSuccess}
              onHasChanges={setHasChanges}
              submitRef={formSubmitRef}
              isSaving={isSaving}
            />
          ) : (
            <SetlistDisplay setlist={setlist} onEdit={handleEditClick} />
          )}
        </div>
      </div>
    )
  );
};
