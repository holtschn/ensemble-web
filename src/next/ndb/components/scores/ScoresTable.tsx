import React from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import { useFileUpDownLoad } from '@/next/ndb/hooks/useFileUpDownLoad';

import Table, { TableColumn } from '@/next/ndb/components/Table';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';

import ScoresMobileView from '@/next/ndb/components/scores/ScoresMobileView';

interface ScoresTableProps {
  scores: ScoreItem[];
  onScoreClick?: (score: ScoreItem) => void;
  className?: string;
}

const ScoresTable: React.FC<ScoresTableProps> = ({ scores, onScoreClick, className = '' }) => {
  const { downloadFile } = useFileUpDownLoad();

  const handleDownloadParts = (score: ScoreItem) => {
    if (score.parts) {
      downloadFile(score.parts);
    }
  };

  const handleDownloadFullScore = (score: ScoreItem) => {
    if (score.fullScore) {
      downloadFile(score.fullScore);
    }
  };
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
      className: 'hidden xl:table-cell',
    },
    {
      key: 'instrumentation',
      header: 'Besetzung',
      render: (value) => toInstrumentation(value).renderValue(),
      className: 'text-center hidden lg:table-cell',
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
      key: 'parts',
      header: 'Stimmen',
      render: (_, row) =>
        row.parts ? (
          <ScoreDownloadButton file={row.parts} label="Stimmen" size="sm" className="w-full" />
        ) : (
          <span className="text-sm text-gray-400">-</span>
        ),
      className: 'text-center',
    },
    {
      key: 'fullScore',
      header: 'Partitur',
      render: (_, row) =>
        row.fullScore ? (
          <ScoreDownloadButton file={row.fullScore} label="Partitur" size="sm" className="w-full" />
        ) : (
          <span className="text-sm text-gray-400">-</span>
        ),
      className: 'text-center',
    },
  ];

  return (
    <div className={className}>
      {/* Mobile view */}
      <div className="md:hidden">
        <ScoresMobileView
          scores={scores}
          onScoreClick={onScoreClick}
          onDownloadParts={handleDownloadParts}
          onDownloadFullScore={handleDownloadFullScore}
        />
      </div>

      {/* Table view */}
      <div className="hidden md:block">
        <ScrollableTable>
          <Table
            className="mx-4"
            data={scores}
            columns={columns}
            keyExtractor={(score) => score.id.toString()}
            emptyMessage="Keine Noten gefunden"
            onRowClick={onScoreClick}
          />
        </ScrollableTable>
      </div>
    </div>
  );
};

export default ScoresTable;
