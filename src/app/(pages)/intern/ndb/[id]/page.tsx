import React from 'react';

// The default export is a client component, so it cannot directly use server-side functions.
import ScoreDetailsPage from './page.client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const scoreId = Number(id);

  if (scoreId && !isNaN(scoreId)) {
    return <ScoreDetailsPage scoreId={scoreId} />;
  }
  return <ScoreDetailsPage scoreId={null} />;
}
