import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import Table, { TableColumn } from '@/next/ndb/components/Table';
import ActionButtons from './ActionButtons';
import ScoresMobileView from './ScoresMobileView';

interface ScoresTableProps {
  scores: ScoreItem[];
  isLoading?: boolean;
  onScoreClick?: (score: ScoreItem) => void;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
  className?: string;
}

const ScoresTable: React.FC<ScoresTableProps> = ({
  scores,
  isLoading = false,
  onScoreClick,
  onDownloadParts,
  onDownloadFullScore,
  className = '',
}) => {
  const columns: TableColumn<ScoreItem>[] = [
    {
      key: 'title',
      header: 'Titel',
      className: 'font-medium',
    },
    {
      key: 'composer',
      header: 'Komponist',
      className: 'font-medium',
    },
    {
      key: 'arranger',
      header: 'Arrangeur',
      render: (value) => value || '-',
      className: 'hidden lg:table-cell',
    },
    {
      key: 'instrumentation',
      header: 'Besetzung',
      render: (value) => toInstrumentation(value).renderValue(),
      className: 'text-center',
    },
    {
      key: 'withOrgan',
      header: 'Orgel',
      render: (value) => (value ? '✓' : '-'),
      className: 'text-center hidden xl:table-cell',
    },
    {
      key: 'withPercussion',
      header: 'Schlagzeug',
      render: (value) => (value ? '✓' : '-'),
      className: 'text-center hidden xl:table-cell',
    },
    {
      key: 'actions',
      header: 'Aktionen',
      render: (_, row) => (
        <ActionButtons score={row} onDownloadParts={onDownloadParts} onDownloadFullScore={onDownloadFullScore} />
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className={className}>
      {/* Mobile view */}
      <div className="md:hidden">
        <ScoresMobileView
          scores={scores}
          isLoading={isLoading}
          onScoreClick={onScoreClick}
          onDownloadParts={onDownloadParts}
          onDownloadFullScore={onDownloadFullScore}
        />
      </div>

      {/* Desktop and Tablet view */}
      <div className="hidden md:block">
        <Table
          data={scores}
          columns={columns}
          keyExtractor={(score) => score.id.toString()}
          isLoading={isLoading}
          emptyMessage="Keine Noten gefunden"
          onRowClick={onScoreClick}
        />
      </div>
    </div>
  );
};

export default ScoresTable;
