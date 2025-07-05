'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import { toInstrumentation, Instrumentation } from '@/next/ndb/utils/instrumentation';
import { ScoreFileItem, ScoreItem, ScoreSampleCollection, ScoreSampleItem as Sample } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';
import { useScoreSamples } from '@/next/ndb/hooks/useScoreSamples';

const BackToList = () => {
  return (
    <Link href="/intern/ndb" className="flex items-center text-xs text-gray-500 dark:text-gray-400 uppercase tracking">
      <Icon name="arrow-left" alt="Back to list" className="mr-2 h-3 w-3" />
      <div className="mt-0.5">Zurück zur Übersicht</div>
    </Link>
  );
};

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  // Fetching single score
  const { getScoreById, isLoading: isScoreLoading } = useScores();
  const score = React.useMemo(() => (scoreId ? getScoreById(scoreId) : null), [scoreId, getScoreById]);

  // Fetching samples
  const { getSamplesByScoreId, isLoading: areSamplesLoading, error: samplesError } = useScoreSamples();
  const samples = React.useMemo(() => (scoreId ? getSamplesByScoreId(scoreId) : null), [scoreId, getSamplesByScoreId]);

  if (isScoreLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="middle-column p-8 text-center">
        <h1>Eintrag nicht gefunden</h1>
        <BackToList />
      </div>
    );
  }

  const instrumentation = toInstrumentation(score.instrumentation);

  return (
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-8">
        <h1>{score.title}</h1>
        <BackToList />
      </div>
      <div className="middle-column">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <dl className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-x-4 gap-y-0">
              <DetailItem label="Titel">{score.title}</DetailItem>
              <DetailItem label="Komponist">{score.composer}</DetailItem>
              <DetailItem label="Arrangeur">{score.arranger}</DetailItem>
              <DetailItem label="Besetzung">
                <InstrumentationDisplay instrumentation={instrumentation} score={score} />
              </DetailItem>
              <DetailItem label="Genre">{score.genre}</DetailItem>
              <DetailItem label="Verlag">{score.publisher}</DetailItem>
              <DetailItem label="Schwierigkeit">{score.difficulty}</DetailItem>
              <DetailItem label="Kommentar" fullWidth>
                {score.comment}
              </DetailItem>
              <DetailItem label="Ansage" fullWidth>
                {score.moderation}
              </DetailItem>
            </dl>
          </div>

          {/* Right Column: Actions, Files & Samples */}
          <div className="lg:col-span-1 space-y-6">
            <ActionCard />
            <FilesCard score={score} />
            <SamplesCard samples={samples} isLoading={areSamplesLoading} error={samplesError} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const DetailItem: React.FC<{ label: string; children: React.ReactNode; fullWidth?: boolean }> = ({
  label,
  children,
  fullWidth,
}) => {
  if (!children || (typeof children === 'string' && !children.trim())) return null;

  if (fullWidth) {
    return (
      <div className="md:col-span-full pt-4">
        <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
        <dd>{children}</dd>
      </div>
    );
  }

  return (
    <>
      <dt className="mt-1 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
      <dd className="mb-4">{children}</dd>
    </>
  );
};

const InstrumentationDisplay: React.FC<{ instrumentation: Instrumentation; score: ScoreItem }> = ({
  instrumentation,
  score,
}) => {
  const instruments = [
    { label: 'Trp.', count: instrumentation.numTrumpets() },
    { label: 'Hrn.', count: instrumentation.numHorns() },
    { label: 'Pos.', count: instrumentation.numTrombones() },
    { label: 'Tub.', count: instrumentation.numTubas() },
    { label: 'Euph.', count: instrumentation.numEuphoniums() },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {instruments
          .filter((inst) => inst.count > 0)
          .map((inst) => (
            <div key={inst.label} className="flex items-baseline gap-1">
              <span className="font-bold text-gray-800 dark:text-gray-200">{inst.count}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{inst.label}</span>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4">
        <div className="flex items-center gap-1.5">
          {score.withPercussion ? (
            <Icon name="check" alt="Ja" className="h-4 w-4 text-green-500" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Percussion</span>
        </div>
        <div className="flex items-center gap-1.5">
          {score.withOrgan ? (
            <Icon name="check" alt="Ja" className="h-4 w-4 text-green-500" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Orgel</span>
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC = () => (
  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
    <Button disabled variant="primary" className="w-full">
      <Icon name="edit" alt="Edit Icon" className="mr-2" />
      Eintrag ändern
    </Button>
  </div>
);

const FilesCard: React.FC<{ score: ScoreItem }> = ({ score }) => {
  const files = [
    { file: score.parts, label: 'Stimmen' },
    { file: score.fullScore, label: 'Partitur' },
    { file: score.audioMidi, label: 'Audio (MIDI)' },
    { file: score.audioMp3, label: 'Audio (MP3)' },
  ];

  const availableFiles = files.filter((f) => f.file);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Downloads</h3>
      {availableFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {files.map(({ file, label }) => (
            <FileDownloadButton key={label} file={file} label={label} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 py-4">Keine Dateien vorhanden.</p>
      )}
    </div>
  );
};

const FileDownloadButton: React.FC<{ file: ScoreFileItem | null; label: string }> = ({ file, label }) => {
  const isDisabled = !file;

  const handleClick = () => {
    // In a real app, you would get a signed URL from the backend
    if (file) {
      console.log(`Downloading ${file.filename}`);
      // window.open(file.url, '_blank');
    }
  };

  return (
    <Button variant="secondary" className="w-full" disabled={isDisabled} onClick={handleClick}>
      <Icon name="download" alt="Download" className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

// Renaming the type locally for clarity
type SampleItemType = {
  item: Sample;
  type: 'youtube' | 'spotify';
};

const SamplesCard: React.FC<{ samples: ScoreSampleCollection | null; isLoading: boolean; error: string | null }> = ({
  samples,
  isLoading,
  error,
}) => {
  const allSamples: SampleItemType[] = React.useMemo(() => {
    if (!samples) return [];
    const youtubeSamples = samples.youtube.map((item) => ({ item, type: 'youtube' as const }));
    const spotifySamples = samples.spotify.map((item) => ({ item, type: 'spotify' as const }));
    return [...youtubeSamples, ...spotifySamples];
  }, [samples]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Samples</h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <p className="text-xs text-center text-red-500 py-4">{error}</p>
      ) : allSamples.length === 0 ? (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 py-4">Keine Samples vorhanden.</p>
      ) : (
        <div className="space-y-3">
          {allSamples.map((sample) => (
            <SampleItem key={`${sample.type}-${sample.item.url}`} sample={sample.item} type={sample.type} />
          ))}
        </div>
      )}
    </div>
  );
};

const SampleItem: React.FC<{ sample: Sample; type: 'youtube' | 'spotify' }> = ({ sample, type }) => {
  const getIcon = (sampleType: 'youtube' | 'spotify') => {
    switch (sampleType) {
      case 'youtube':
        return <Icon name="youtube" alt="YouTube" className="h-6 w-6 text-red-600" />;
      case 'spotify':
        return <Icon name="spotify" alt="Spotify" className="h-6 w-6 text-green-500" />;
    }
  };

  return (
    <a
      href={sample.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="mr-3 shrink-0">{getIcon(type)}</div>
      <div className="truncate">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sample.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type}</p>
      </div>
      <Icon name="external-link" alt="External link" className="h-4 w-4 ml-auto text-gray-400 dark:text-gray-500" />
    </a>
  );
};

export default ScoreDetailsPage;
