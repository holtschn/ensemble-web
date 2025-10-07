'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { useAuth } from '@/next/auth/context';
import Icon from '@/next/ndb/components/Icon';
import SetlistEditor from '@/next/ndb/components/setlists/SetlistEditor';

export const NewSetlistPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();

  const handleSaveSuccess = (setlistId: number) => {
    // Navigate to the newly created setlist
    router.push(`/intern/ndb/setlists/${setlistId}`);
  };

  const handleCancel = () => {
    router.push('/intern/ndb/setlists');
  };

  return (
    <div className="middle-column mt-8">
      <Link href="/intern/ndb/setlists" className="flex items-center ndb-profex-label mb-4">
        <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
        <div className="mt-0.5">Zurück zu Setlists</div>
      </Link>

      <h1 className="mb-6">Neue Setlist erstellen</h1>

      <SetlistEditor mode="create" onSaveSuccess={handleSaveSuccess} onCancel={handleCancel} />
    </div>
  );
};
