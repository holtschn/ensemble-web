'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import { useSetlists } from '@/next/ndb/hooks/useSetlists';
import { SetlistItem } from '@/next/ndb/types';

import SetlistsTable from '@/next/ndb/components/setlists/SetlistsTable';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import { EmptyState } from '@/next/components/EmptyState';
import { NDBPageHeader } from '@/next/ndb/components/NDBPageHeader';

export const SetlistsPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();
  const { setlists, isLoading, refetch } = useSetlists();

  const handleSetlistClick = useCallback(
    (setlist: SetlistItem) => {
      router.push(`/intern/ndb/setlists/${setlist.id}`);
    },
    [router]
  );

  const handleCreateClick = useCallback(() => {
    router.push('/intern/ndb/setlists/new');
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!setlists || setlists.length < 1) {
    return (
      <div className="middle-column mt-8">
        <Link href="/intern/ndb" className="flex items-center ndb-profex-label mb-4">
          <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
          <div className="mt-0.5">Zurück zur Notendatenbank</div>
        </Link>
        <EmptyState
          variant="no-data"
          icon="folder"
          heading="Noch keine Setlists vorhanden"
          message="Erstellen Sie Ihre erste Setlist, um loszulegen."
          action={{
            label: 'Setlist erstellen',
            onClick: handleCreateClick,
          }}
        />
      </div>
    );
  }

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <NDBPageHeader
          title="Setlists"
          backLink={{ href: '/intern/ndb', label: 'Zurück zur Notendatenbank' }}
          action={
            <Button onClick={handleCreateClick} variant="secondary" size="sm">
              <Icon name="plus-circle" alt="Create" className="mr-1.5 h-3.5 w-3.5" />
              Setlist erstellen
            </Button>
          }
        />

        <div className="middle-column">
          <SetlistsTable setlists={setlists} onSetlistClick={handleSetlistClick} onRefetch={refetch} />
        </div>
      </div>
    )
  );
};
