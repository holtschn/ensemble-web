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
  const titleClass = compact ? 'text-sm font-medium' : 'text-base font-medium text-gray-900';
  const detailsClass = compact ? 'text-xs text-gray-500' : 'text-sm text-gray-600';

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
