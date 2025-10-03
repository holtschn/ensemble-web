import React from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { Instrumentation, toInstrumentation } from '@/next/ndb/utils/instrumentation';

import Icon from '@/next/ndb/components/Icon';

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

const InstrumentationDisplay: React.FC<{
  instrumentation: Instrumentation;
  withPercussion: boolean;
  withOrgan: boolean;
}> = ({ instrumentation, withPercussion, withOrgan }) => {
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
          {withPercussion ? (
            <Icon name="check" alt="Ja" className="h-4 w-4" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4" />
          )}
          <span className="ndb-profex-label">Percussion</span>
        </div>
        <div className="flex items-center gap-1.5">
          {withOrgan ? (
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

const ScoreDetailsCard: React.FC<{ score: ScoreItem }> = ({ score }) => {
  const instrumentation = toInstrumentation(score.instrumentation);
  return (
    <div>
      <dl className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-x-4 gap-y-0">
        <DetailItem label="Titel">{score.title}</DetailItem>
        <DetailItem label="Komponist">{score.composer}</DetailItem>
        <DetailItem label="Arrangeur">{score.arranger}</DetailItem>
        <DetailItem label="Besetzung">
          <InstrumentationDisplay
            instrumentation={instrumentation}
            withPercussion={score.withPercussion}
            withOrgan={score.withOrgan}
          />
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
};

export default ScoreDetailsCard;
