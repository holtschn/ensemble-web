'use client';

import React from 'react';
import Link from 'next/link';
import DisplayField from '@/next/ndb/components/DisplayField';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import { ScoreFileItem, ScoreItem } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

/**
 * A client component responsible for fetching and displaying the details of a single score.
 */
const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  const { scores, isLoading, error, getScoreById } = useScores();
  const { score } = React.useMemo(() => {
    return {
      score: scoreId ? getScoreById(scoreId) : null,
    };
  }, [scoreId, getScoreById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  // --- Not Found State ---
  if (!score) {
    return (
      <div className="container p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Score Not Found</h1>
        <p>The score you are looking for does not exist or could not be loaded.</p>
        <Link href="/intern/ndb" className="mt-4 inline-block hover:underline">
          &larr; Back to Scores List
        </Link>
      </div>
    );
  }

  const instrumentation = toInstrumentation(score.instrumentation);

  // --- Success State ---
  return (
    <div className="container p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/intern/ndb" className="text-sm hover:underline mb-2 inline-block">
          &larr; Back to All Scores
        </Link>
        <h1 className="text-3xl font-bold truncate">{score.title}</h1>
        <p className="text-xl">by {score.composer}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">Score Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <DisplayField label="Title" value={score.title} />
              <DisplayField label="Composer" value={score.composer} />
              <DisplayField label="Arranger" value={score.arranger} />
              <DisplayField label="Publisher" value={score.publisher} />
              <DisplayField label="Genre" value={score.genre} />
              <DisplayField label="Difficulty" value={score.difficulty} />
            </div>
            <DisplayField label="Comment" value={score.comment} multiline />
            <DisplayField label="Moderation" value={score.moderation} multiline />
          </div>

          <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">Instrumentation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6">
              <DisplayField
                label="Full Code"
                value={<span className="font-mono">{instrumentation.renderValue()}</span>}
              />
              <DisplayField label="Total Players" value={instrumentation.numTotal()} />
              <DisplayField label="Trumpets" value={instrumentation.numTrumpets()} />
              <DisplayField label="Horns" value={instrumentation.numHorns()} />
              <DisplayField label="Trombones" value={instrumentation.numTrombones()} />
              <DisplayField label="Euphoniums" value={instrumentation.numEuphoniums()} />
              <DisplayField label="Tubas" value={instrumentation.numTubas()} />
              <DisplayField label="With Percussion" value={score.withPercussion ? 'Yes' : 'No'} />
              <DisplayField label="With Organ" value={score.withOrgan ? 'Yes' : 'No'} />
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Files */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button disabled className="w-full text-left p-2 cursor-not-allowed">
                Edit Score (coming soon)
              </button>
            </div>
          </div>

          <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            <div className="space-y-2">
              <FileDownloadItem file={score.parts} label="Parts" />
              <FileDownloadItem file={score.fullScore} label="Full Score" />
              <FileDownloadItem file={score.audioMidi} label="MIDI Audio" />
              <FileDownloadItem file={score.audioMp3} label="MP3 Audio" />
            </div>
          </div>

          <div className="p-6 border">
            <h2 className="text-xl font-semibold mb-4">Samples</h2>
            <p>Audio/video samples will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper component for rendering file download links ---
const FileDownloadItem: React.FC<{ file: ScoreFileItem | null; label: string }> = ({ file, label }) => {
  if (!file) {
    return <div className="p-2">{label}: Not available</div>;
  }

  return (
    <button disabled className="w-full text-left p-2 cursor-not-allowed">
      Download {label}
      <span className="block text-xs truncate">{file.filename}</span>
    </button>
  );
};

export default ScoreDetailsPage;
