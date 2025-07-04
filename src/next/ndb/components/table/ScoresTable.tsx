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
        <div className="flex space-x-2 justify-end">
          <div className="w-24 text-center">
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
          </div>
          <div className="w-24 text-center">
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
          </div>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const MobileCard = ({ score }: { score: ScoreItem }) => (
    <div className="border-b px-2 py-2 cursor-pointer" onClick={() => onScoreClick?.(score)}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-sm">{score.title}</div>
          <div className="text-sm text-gray-600">{score.composer}</div>
        </div>
        <div>
          <div className="flex space-x-2 my-1 justify-end">
            <div className="w-24 text-center">
              {score.parts && onDownloadParts && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadParts(score);
                  }}
                >
                  Stimmen
                </Button>
              )}
            </div>
            <div className="w-24 text-center">
              {score.fullScore && onDownloadFullScore && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadFullScore(score);
                  }}
                >
                  Partitur
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile view */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="text-center p-8">Lade Noten...</div>
        ) : scores.length > 0 ? (
          <div className="divide-y border-t">
            {scores.map((score) => (
              <MobileCard key={score.id} score={score} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8">Keine Noten gefunden</div>
        )}
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
