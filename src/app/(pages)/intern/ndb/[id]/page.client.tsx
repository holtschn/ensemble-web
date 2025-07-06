'use client';

import React from 'react';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import BackToScores from '@/next/ndb/components/scores/BackToScores';
import ActionCard from '@/next/ndb/components/scores/details/ActionCard';
import ScoreDetailsCard from '@/next/ndb/components/scores/ScoreDetailsCard';
import FilesCard from '@/next/ndb/components/scores/ScoreDownloadButtons';
import SamplesCard from '@/next/ndb/components/scores/ScoreSamplesCard';

import { useScores } from '@/next/ndb/hooks/useScores';

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  useRedirectIfLoggedOut();

  const { getScoreById, isLoading } = useScores();
  const score = React.useMemo(() => (scoreId ? getScoreById(scoreId) : null), [scoreId, getScoreById]);

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
        <h1>{score.title}</h1>
        <BackToScores />
      </div>
      <div className="middle-column">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Samples */}
          <div className="lg:col-span-2 space-y-6">
            <ScoreDetailsCard score={score} />
            <SamplesCard score={score} />
          </div>
          {/* Right Column: Actions & Files */}
          <div className="lg:col-span-1 space-y-6">
            <ActionCard />
            <FilesCard score={score} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDetailsPage;
