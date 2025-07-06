import React from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';

import Table, { TableColumn } from '@/next/ndb/components/Table';

import ScoresDownloadButtons from '@/next/ndb/components/scores/ScoresDownloadButtons';
import ScoresMobileView from '@/next/ndb/components/scores/ScoresMobileView';

interface ScoresTableProps {
  scores: ScoreItem[];
  onScoreClick?: (score: ScoreItem) => void;
  className?: string;
}

const ScoresTable: React.FC<ScoresTableProps> = ({ scores, onScoreClick, className = '' }) => {
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
      render: (_, row) => <ScoresDownloadButtons score={row} />,
      className: 'text-right',
    },
  ];

  return (
    <div className={className}>
      {/* Mobile view */}
      <div className="md:hidden">
        <ScoresMobileView scores={scores} onScoreClick={onScoreClick} />
      </div>

      {/* Desktop and Tablet view */}
      <div className="hidden md:block">
        <Table
          className="mx-4"
          data={scores}
          columns={columns}
          keyExtractor={(score) => score.id.toString()}
          emptyMessage="Keine Noten gefunden"
          onRowClick={onScoreClick}
        />
      </div>
    </div>
  );
};

export default ScoresTable;
