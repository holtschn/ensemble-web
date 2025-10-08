'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import SetlistEditor from '@/next/ndb/components/setlists/SetlistEditor';
import BackToSetlists from '@/next/ndb/components/setlists/BackToSetlists';

export const NewSetlistPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store reference to form submit function
  const formSubmitRef = React.useRef<(() => void) | null>(null);

  const handleSaveClick = () => {
    // Trigger form submit
    if (formSubmitRef.current) {
      setIsSaving(true);
      formSubmitRef.current();
    }
  };

  const handleSaveSuccess = (setlistId: number) => {
    setIsSaving(false);
    // Navigate to the newly created setlist
    router.push(`/intern/ndb/setlists/${setlistId}`);
  };

  const handleCancel = () => {
    router.push('/intern/ndb/setlists');
  };

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-8">
          <h1 className="mb-4">Neue Setlist erstellen</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <BackToSetlists />
            <div className="ml-auto flex items-center gap-4">
              {hasChanges && <span className="text-sm text-amber-600">Ungespeicherte Änderungen</span>}
              <Button
                type="button"
                onClick={handleSaveClick}
                disabled={isSaving || !hasChanges}
                variant="highlighted"
                size="sm"
                isLoading={isSaving}
              >
                Setlist erstellen
              </Button>
            </div>
          </div>
        </div>

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
