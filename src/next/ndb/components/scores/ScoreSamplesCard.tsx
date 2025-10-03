import React from 'react';

import { ScoreItem, ScoreSampleItem } from '@/next/ndb/types';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import { useScoreSamples } from '@/next/ndb/hooks/useScoreSamples';

import Icon from '@/next/ndb/components/Icon';
import Image from 'next/image';

const SampleItem: React.FC<{ sample: ScoreSampleItem; type: 'youtube' | 'spotify' }> = ({ sample, type }) => {
  const getIcon = (sampleType: 'youtube' | 'spotify') => {
    switch (sampleType) {
      case 'youtube':
        return <Icon name="youtube" alt="YouTube" className="h-4 w-4" />;
      case 'spotify':
        return <Icon name="spotify" alt="Spotify" className="h-4 w-4" />;
    }
  };

  return (
    <a href={sample.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
      <div className="mr-3 shrink-0">{getIcon(type)}</div>
      <img src={sample.image} alt={sample.title} className="h-12 w-12 object-cover rounded-md mr-4 shrink-0" />
      <p className="text-xs">{sample.title}</p>
      <Icon name="external-link" alt="External link" className="h-4 w-4 ml-auto shrink-0" />
    </a>
  );
};

const SamplesCard: React.FC<{ score: ScoreItem | null }> = ({ score }) => {
  const { getSamplesByScoreId, isLoading } = useScoreSamples();
  const samples = React.useMemo(
    () => (score?.id ? getSamplesByScoreId(score?.id) : null),
    [score, getSamplesByScoreId]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hasSamples = (samples?.spotify?.length ?? 0) + (samples?.youtube?.length ?? 0) > 0;
  if (!hasSamples) {
    return (
      <div className="mt-4">
        <p className="mb-2 ndb-profex-label">Hörbeispiele</p>
        <p className="py-4">Keine gefunden</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-2 ndb-profex-label">Hörbeispiele</p>
      <div className="space-y-4">
        {samples?.spotify && samples.spotify.length > 0 && (
          <div className="space-y-4">
            {samples.spotify.map((sample) => (
              <SampleItem key={sample.url} sample={sample} type="spotify" />
            ))}
          </div>
        )}
        {samples?.youtube && samples.youtube.length > 0 && (
          <div className="space-y-4">
            {samples.youtube.map((sample) => (
              <SampleItem key={sample.url} sample={sample} type="youtube" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SamplesCard;
