import React, { useState, useMemo } from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import { useFileUpDownLoad } from '@/next/ndb/hooks/useFileUpDownLoad';
import { useUserPreference } from '@/next/ndb/hooks/useUserPreference';

import Table, { TableColumn } from '@/next/ndb/components/Table';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';
import { ColumnSettingsModal } from '@/next/ndb/components/scores/ColumnSettingsModal';

import ScoresMobileView from '@/next/ndb/components/scores/ScoresMobileView';

import {
  ColumnConfig,
  ColumnPreferences,
  ScoreColumnId,
  getColumnConfiguration,
  columnConfigToPreferences,
} from '@/next/ndb/types/columns';

// Stable default value outside component to prevent infinite loops
const DEFAULT_COLUMN_PREFERENCES: ColumnPreferences = {};

interface ScoresTableProps {
  scores: ScoreItem[];
  onScoreClick?: (score: ScoreItem) => void;
  onColumnsModalOpen?: boolean;
  onColumnsModalClose?: () => void;
  className?: string;
}

const ScoresTable: React.FC<ScoresTableProps> = ({
  scores,
  onScoreClick,
  onColumnsModalOpen = false,
  onColumnsModalClose,
  className = '',
}) => {
  const { downloadFile } = useFileUpDownLoad();
  const [columnPreferences, setColumnPreferences] = useUserPreference<ColumnPreferences>('ndb_column_preferences', DEFAULT_COLUMN_PREFERENCES);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync external modal state
  React.useEffect(() => {
    setIsModalOpen(onColumnsModalOpen);
  }, [onColumnsModalOpen]);

  const columnConfig = useMemo(() => getColumnConfiguration(columnPreferences), [columnPreferences]);

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

  const handleSaveColumns = (newColumns: ColumnConfig[]) => {
    const prefs = columnConfigToPreferences(newColumns);
    setColumnPreferences(prefs);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onColumnsModalClose?.();
  };

  // Generate columns based on configuration
  const columns: TableColumn<ScoreItem>[] = useMemo(() => {
    const allColumns: Record<ScoreColumnId, TableColumn<ScoreItem>> = {
      title: {
        key: 'title',
        header: 'Titel',
        className: 'font-medium',
      },
      composer: {
        key: 'composer',
        header: 'Komponist',
        className: 'font-medium',
      },
      arranger: {
        key: 'arranger',
        header: 'Arrangeur',
        render: (value) => value || '-',
      },
      instrumentation: {
        key: 'instrumentation',
        header: 'Besetzung',
        render: (value) => toInstrumentation(value).renderValue(),
        className: 'text-center',
      },
      organ: {
        key: 'withOrgan',
        header: 'Orgel',
        render: (value) => (value ? '✓' : '-'),
        className: 'text-center',
      },
      percussion: {
        key: 'withPercussion',
        header: 'Schlagzeug',
        render: (value) => (value ? '✓' : '-'),
        className: 'text-center',
      },
      parts: {
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
      fullScore: {
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
      genre: {
        key: 'genre',
        header: 'Genre',
        render: (value) => value || '-',
      },
      publisher: {
        key: 'publisher',
        header: 'Verlag',
        render: (value) => value || '-',
      },
      difficulty: {
        key: 'difficulty',
        header: 'Schwierigkeit',
        render: (value) => value || '-',
      },
      audioMidi: {
        key: 'audioMidi',
        header: 'Audio (MIDI)',
        render: (_, row) =>
          row.audioMidi ? (
            <ScoreDownloadButton file={row.audioMidi} label="MIDI" size="sm" className="w-full" />
          ) : (
            <span className="text-sm text-gray-400">-</span>
          ),
        className: 'text-center',
      },
      audioMp3: {
        key: 'audioMp3',
        header: 'Audio (MP3)',
        render: (_, row) =>
          row.audioMp3 ? (
            <ScoreDownloadButton file={row.audioMp3} label="MP3" size="sm" className="w-full" />
          ) : (
            <span className="text-sm text-gray-400">-</span>
          ),
        className: 'text-center',
      },
    };

    // Filter columns based on visibility and sort by order
    return columnConfig
      .filter((config) => config.visible)
      .sort((a, b) => a.order - b.order)
      .map((config) => allColumns[config.id]);
  }, [columnConfig]);

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

      {/* Column Settings Modal */}
      <ColumnSettingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        columns={columnConfig}
        onSave={handleSaveColumns}
      />
    </div>
  );
};

export default ScoresTable;
