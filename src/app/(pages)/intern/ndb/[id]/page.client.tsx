'use client';

import React from 'react';

import Link from 'next/link';

import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';
import { toInstrumentation, Instrumentation } from '@/next/ndb/utils/instrumentation';
import { ScoreFileItem, ScoreItem, ScoreSampleCollection, ScoreSampleItem as Sample } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';
import { useScoreSamples } from '@/next/ndb/hooks/useScoreSamples';

import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';

const BackToScoresList = () => {
  return (
    <Link href="/intern/ndb" className="flex items-center ndb-profex-label">
      <Icon name="arrow-left" alt="Back to list" className="mr-2 h-3 w-3" />
      <div className="mt-0.5">Zurück zur Übersicht</div>
    </Link>
  );
};

interface ScoreDetailsPageProps {
  scoreId: number | null;
}

const ScoreDetailsPage: React.FC<ScoreDetailsPageProps> = ({ scoreId }) => {
  useRedirectIfLoggedOut();

  const { getScoreById, isLoading: isScoreLoading } = useScores();
  const score = React.useMemo(() => (scoreId ? getScoreById(scoreId) : null), [scoreId, getScoreById]);

  // Fetching samples
  const { getSamplesByScoreId, isLoading: isSamplesLoading, error: samplesError } = useScoreSamples();
  const samples = React.useMemo(() => (scoreId ? getSamplesByScoreId(scoreId) : null), [scoreId, getSamplesByScoreId]);

  if (isScoreLoading) {
    return <LoadingSpinner />;
  }

  if (!score) {
    return (
      <div className="middle-column p-8 text-center">
        <h1>Eintrag nicht gefunden</h1>
        <BackToScoresList />
      </div>
    );
  }

  const instrumentation = toInstrumentation(score.instrumentation);

  return (
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-8">
        <h1>{score.title}</h1>
        <BackToScoresList />
      </div>
      <div className="middle-column">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Samples */}
          <div className="lg:col-span-2 space-y-6">
            <DetailsCard score={score} instrumentation={instrumentation} />
            <SamplesCard samples={samples} isLoading={isSamplesLoading} error={samplesError} />
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

// --- Helper Components ---

const DetailsCard: React.FC<{ score: ScoreItem; instrumentation: Instrumentation }> = ({ score, instrumentation }) => (
  <div>
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
);

const DetailItem: React.FC<{ label: string; children: React.ReactNode; fullWidth?: boolean }> = ({
  label,
  children,
  fullWidth,
}) => {
  if (!children || (typeof children === 'string' && !children.trim())) return null;

  if (fullWidth) {
    return (
      <div className="md:col-span-full pt-4">
        <dt className="ndb-profex-label">{label}</dt>
        <dd>{children}</dd>
      </div>
    );
  }

  return (
    <>
      <dt className="mt-1 ndb-profex-label">{label}</dt>
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
              <span>{inst.count}</span>
              <span className="ndb-profex-label">{inst.label}</span>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4">
        <div className="flex items-center gap-1.5">
          {score.withPercussion ? (
            <Icon name="check" alt="Ja" className="h-4 w-4" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4" />
          )}
          <span className="ndb-profex-label">Percussion</span>
        </div>
        <div className="flex items-center gap-1.5">
          {score.withOrgan ? (
            <Icon name="check" alt="Ja" className="h-4 w-4" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4" />
          )}
          <span className="ndb-profex-label">Orgel</span>
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
    <div>
      <h3 className="ndb-profex-label">Downloads</h3>
      {availableFiles.length > 0 ? (
        <div className="flex flex-col gap-y-2">
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

const SamplesCard: React.FC<{ samples: ScoreSampleCollection | null; isLoading: boolean; error: string | null }> = ({
  samples,
  isLoading,
  error,
}) => {
  const hasSamples = (samples?.spotify?.length ?? 0) + (samples?.youtube?.length ?? 0) > 0;

  return (
    <div>
      <p className="text-xs mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Samples</p>
      {!hasSamples ? (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 py-4">Keine Samples vorhanden.</p>
      ) : (
        <div className="space-y-4">
          {samples?.spotify && samples.spotify.length > 0 && (
            <div className="space-y-2">
              {samples.spotify.map((sample) => (
                <SampleItem key={sample.url} sample={sample} type="spotify" />
              ))}
            </div>
          )}
          {samples?.youtube && samples.youtube.length > 0 && (
            <div className="space-y-2">
              {samples.youtube.map((sample) => (
                <SampleItem key={sample.url} sample={sample} type="youtube" />
              ))}
            </div>
          )}
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
    <a href={sample.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
      <div className="mr-3 shrink-0">{getIcon(type)}</div>
      <img src={sample.image} alt={sample.title} className="h-14 w-14 object-cover rounded-md mr-4 shrink-0" />
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sample.title}</p>
      <Icon
        name="external-link"
        alt="External link"
        className="h-4 w-4 ml-auto text-gray-400 dark:text-gray-500 shrink-0"
      />
    </a>
  );
};

export default ScoreDetailsPage;
