'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import { useSetlists } from '@/next/ndb/hooks/useSetlists';
import Icon from '@/next/ndb/components/Icon';
import SetlistDisplay from '@/next/ndb/components/setlists/SetlistDisplay';
import SetlistEditor from '@/next/ndb/components/setlists/SetlistEditor';
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

  const handleSaveSuccess = () => {
    // Refetch setlists to get updated data, then exit edit mode
    refetch();
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!setlist) {
    return (
      <div className="middle-column mt-8">
        <Link href="/intern/ndb/setlists" className="flex items-center ndb-profex-label mb-4">
          <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
          <div className="mt-0.5">Zurück zu Setlists</div>
        </Link>
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
    <div className="middle-column mt-8">
      <Link href="/intern/ndb/setlists" className="flex items-center ndb-profex-label mb-4">
        <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
        <div className="mt-0.5">Zurück zu Setlists</div>
      </Link>

      {isEditMode ? (
        <>
          <h1 className="mb-6">{setlist.displayName} bearbeiten</h1>
          <SetlistEditor
            mode="edit"
            setlistId={setlistId}
            initialData={setlist}
            onSaveSuccess={handleSaveSuccess}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <SetlistDisplay setlist={setlist} onEdit={() => setIsEditMode(true)} />
      )}
    </div>
  );
};
