import React from 'react';
import { draftMode } from 'next/headers';

import { PrivatePlayersListPageClient } from './page.client';
import { AnimateHeaderWrapper } from '@/next/animation/wrapper';
import { EnrichedUser, getAllEnrichedUsers } from '@/next/utils/users';

export default async function PrivatePlayersListPage() {
  const players = await getPlayersList();
  return (
    <AnimateHeaderWrapper animateHeader={false}>
      <PrivatePlayersListPageClient players={players} />
    </AnimateHeaderWrapper>
  );
}

async function getPlayersList(): Promise<EnrichedUser[]> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    return await getAllEnrichedUsers(isDraftMode);
  } catch (error) {
    console.log('could not get users list', error);
  }
  return [];
}
