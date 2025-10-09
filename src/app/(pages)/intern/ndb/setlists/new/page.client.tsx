'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import Button from '@/next/ndb/components/Button';
import SetlistEditor from '@/next/ndb/components/setlists/SetlistEditor';
import { NDBPageHeader } from '@/next/ndb/components/NDBPageHeader';

export const NewSetlistPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => Promise<void>) | null>(null);
  const isSavingRef = React.useRef(false); // Synchronous lock to prevent double submissions

  const handleSaveClick = async () => {
    // Check synchronous lock to prevent double submissions
    if (formSubmitRef.current && !isSavingRef.current) {
      isSavingRef.current = true;
      setIsSaving(true);
      try {
        await formSubmitRef.current();
      } catch (error) {
        // Error already handled in SetlistEditor (toast shown)
        console.error('Save error:', error);
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    }
  };

  const handleSaveSuccess = (setlistId: number) => {
    // Navigate to the newly created setlist
    router.push(`/intern/ndb/setlists/${setlistId}`);
  };

  const handleCancel = () => {
    router.push('/intern/ndb/setlists');
  };

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <NDBPageHeader
          title="Neue Setlist erstellen"
          backLink={{ href: '/intern/ndb/setlists', label: 'Zurück zu Setlists' }}
          action={
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
          }
          statusMessage={hasChanges && <span className="text-sm text-amber-600">Ungespeicherte Änderungen</span>}
        />

        {/* Full width for allocations table */}
        <div className="px-4 sm:px-6 lg:px-8">
          <SetlistEditor
            mode="create"
            onSaveSuccess={handleSaveSuccess}
            onHasChanges={setHasChanges}
            submitRef={formSubmitRef}
            isSaving={isSaving}
          />
        </div>
      </div>
    )
  );
};
