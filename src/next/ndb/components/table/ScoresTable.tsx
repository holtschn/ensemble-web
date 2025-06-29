import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import Table, { TableColumn } from './Table';
import Button from '@/next/ndb/components/form/Button';

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
    },
    {
      key: 'genre',
      header: 'Genre',
      render: (value) => value || '-',
    },
    {
      key: 'publisher',
      header: 'Verlag',
      render: (value) => value || '-',
    },
    {
      key: 'difficulty',
      header: 'Schwierigkeit',
      render: (value) => value || '-',
      className: 'text-center',
    },
    {
      key: 'instrumentation',
      header: 'Besetzung',
      render: (value) => toInstrumentation(value).renderValue(),
      className: 'text-center font-mono',
    },
    {
      key: 'numTotal',
      header: '# Spieler',
      render: (_, row) => toInstrumentation(row.instrumentation).numTotal(),
      className: 'text-center',
    },
    {
      key: 'numTrumpets',
      header: '# Trompeten',
      render: (_, row) => toInstrumentation(row.instrumentation).numTrumpets(),
      className: 'text-center',
    },
    {
      key: 'numHorns',
      header: '# Hörner',
      render: (_, row) => toInstrumentation(row.instrumentation).numHorns(),
      className: 'text-center',
    },
    {
      key: 'numTrombones',
      header: '# Posaunen',
      render: (_, row) => toInstrumentation(row.instrumentation).numTrombones(),
      className: 'text-center',
    },
    {
      key: 'withOrgan',
      header: 'mit Orgel',
      render: (value) => (value ? '✓' : '-'),
      className: 'text-center',
    },
    {
      key: 'withPercussion',
      header: 'mit Schlagzeug',
      render: (value) => (value ? '✓' : '-'),
      className: 'text-center',
    },
    {
      key: 'actions',
      header: 'Aktionen',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.parts && onDownloadParts && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadParts(row);
              }}
            >
              Stimmen
            </Button>
          )}
          {row.fullScore && onDownloadFullScore && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFullScore(row);
              }}
            >
              Partitur
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onScoreClick?.(row);
            }}
          >
            Details
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <Table
      data={scores}
      columns={columns}
      keyExtractor={(score) => score.id.toString()}
      isLoading={isLoading}
      emptyMessage="Keine Noten gefunden"
      className={className}
      onRowClick={onScoreClick}
    />
  );
};

export default ScoresTable;
