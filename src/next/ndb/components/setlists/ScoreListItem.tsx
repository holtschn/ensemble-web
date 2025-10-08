import React from 'react';

interface ScoreListItemProps {
  title: string;
  composer: string;
  arranger?: string | null;
  instrumentation: string;
  compact?: boolean;
}

/**
 * Reusable component to display score information in a consistent format.
 * Shows title on first line, composer • arranger • instrumentation on second line.
 */
const ScoreListItem: React.FC<ScoreListItemProps> = ({ title, composer, arranger, instrumentation, compact = false }) => {
  const titleClass = compact ? 'text-body font-medium' : 'font-medium text-neutral-900';
  const detailsClass = compact ? 'text-caption' : 'text-body';

  return (
    <div>
      <div className={titleClass}>{title}</div>
      <div className={`${detailsClass} mt-1`}>
        {composer}
        {arranger && ` • ${arranger}`} • {instrumentation}
      </div>
    </div>
  );
};

export default ScoreListItem;
