import React, { useState, useMemo } from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import { useFileUpDownLoad } from '@/next/ndb/hooks/useFileUpDownLoad';
import { useUserPreference } from '@/next/ndb/hooks/useUserPreference';
import { GENRE_CHOICES, DIFFICULTY_CHOICES } from '@/next/ndb/constants';

import Table, { TableColumn } from '@/next/ndb/components/Table';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';
import { ColumnSettingsModal } from '@/next/ndb/components/scores/ColumnSettingsModal';
import { FilterPopover } from '@/next/ndb/components/filters/FilterPopover';
import { TextFilter } from '@/next/ndb/components/filters/TextFilter';
import { SelectFilter } from '@/next/ndb/components/filters/SelectFilter';
import { BooleanFilter } from '@/next/ndb/components/filters/BooleanFilter';
import { FileFilter } from '@/next/ndb/components/filters/FileFilter';

import ScoresMobileView from '@/next/ndb/components/scores/ScoresMobileView';

import {
  ColumnConfig,
  ColumnPreferences,
  ScoreColumnId,
  getColumnConfiguration,
  columnConfigToPreferences,
} from '@/next/ndb/types/columns';
import { FilterState, isFilterActive } from '@/next/ndb/types/filters';

// Stable default values outside component to prevent infinite loops
const DEFAULT_COLUMN_PREFERENCES: ColumnPreferences = {};
const DEFAULT_FILTER_STATE: FilterState = {};

interface ScoresTableProps {
  scores: ScoreItem[];
  onScoreClick?: (score: ScoreItem) => void;
  onColumnFiltersChange?: (hasActiveFilters: boolean) => void;
  onResetColumnFilters?: (clearFn: () => void) => void;
  className?: string;
}

const ScoresTable: React.FC<ScoresTableProps> = ({
  scores,
  onScoreClick,
  onColumnFiltersChange,
  onResetColumnFilters,
  className = '',
}) => {
  const { downloadFile } = useFileUpDownLoad();
  const [columnPreferences, setColumnPreferences] = useUserPreference<ColumnPreferences>('ndb_column_preferences', DEFAULT_COLUMN_PREFERENCES);
  const [filters, setFilters] = useUserPreference<FilterState>('ndb_column_filters', DEFAULT_FILTER_STATE);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columnConfig = useMemo(() => getColumnConfiguration(columnPreferences), [columnPreferences]);

  const clearAllFilters = React.useCallback(() => {
    setFilters({});
  }, [setFilters]);

  // Notify parent when column filters change
  React.useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(isFilterActive);
    onColumnFiltersChange?.(hasActiveFilters);
  }, [filters, onColumnFiltersChange]);

  // Expose clear function to parent
  React.useEffect(() => {
    onResetColumnFilters?.(clearAllFilters);
  }, [onResetColumnFilters, clearAllFilters]);

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
  };

  // Filter handlers
  const handleFilterChange = (columnId: ScoreColumnId, value: any) => {
    setFilters({
      ...filters,
      [columnId]: value,
    });
  };

  const handleClearFilter = (columnId: ScoreColumnId) => {
    const newFilters = { ...filters };
    delete newFilters[columnId];
    setFilters(newFilters);
  };

  // Apply filters to scores
  const filteredScores = useMemo(() => {
    return scores.filter((score) => {
      // Apply each active filter
      for (const [columnId, filterValue] of Object.entries(filters)) {
        if (!isFilterActive(filterValue)) continue;

        const col = columnId as ScoreColumnId;

        switch (filterValue.type) {
          case 'text': {
            const searchValue = filterValue.value.toLowerCase();
            let fieldValue = '';

            if (col === 'title') fieldValue = score.title?.toLowerCase() || '';
            else if (col === 'composer') fieldValue = score.composer?.toLowerCase() || '';
            else if (col === 'arranger') fieldValue = score.arranger?.toLowerCase() || '';
            else if (col === 'publisher') fieldValue = score.publisher?.toLowerCase() || '';

            if (!fieldValue.includes(searchValue)) return false;
            break;
          }

          case 'select': {
            const selectedValue = filterValue.value;
            if (col === 'genre' && score.genre !== selectedValue) return false;
            if (col === 'difficulty' && score.difficulty !== selectedValue) return false;
            break;
          }

          case 'boolean': {
            const boolValue = filterValue.value;
            if (col === 'organ' && score.withOrgan !== boolValue) return false;
            if (col === 'percussion' && score.withPercussion !== boolValue) return false;
            break;
          }

          case 'file': {
            const hasFile = filterValue.value;
            if (col === 'parts' && (hasFile ? !score.parts : !!score.parts)) return false;
            if (col === 'fullScore' && (hasFile ? !score.fullScore : !!score.fullScore)) return false;
            if (col === 'audioMidi' && (hasFile ? !score.audioMidi : !!score.audioMidi)) return false;
            if (col === 'audioMp3' && (hasFile ? !score.audioMp3 : !!score.audioMp3)) return false;
            break;
          }
        }
      }

      return true;
    });
  }, [scores, filters]);

  // Generate columns based on configuration
  const columns: TableColumn<ScoreItem>[] = useMemo(() => {
    // Genre/Difficulty options for SelectFilter
    const genreOptions = GENRE_CHOICES.filter((g) => g !== '').map((g) => ({ value: g, label: g }));
    const difficultyOptions = DIFFICULTY_CHOICES.filter((d) => d !== '').map((d) => ({ value: d, label: d }));

    const allColumns: Record<ScoreColumnId, TableColumn<ScoreItem>> = {
      title: {
        key: 'title',
        header: 'Titel',
        className: 'font-medium',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>TITEL</span>
            <FilterPopover
              isActive={isFilterActive(filters.title)}
              onClear={() => handleClearFilter('title')}
              label="Titel"
            >
              <TextFilter
                value={filters.title?.type === 'text' ? filters.title.value : ''}
                onChange={(val) => handleFilterChange('title', { type: 'text', value: val })}
                placeholder="Nach Titel filtern..."
              />
            </FilterPopover>
          </div>
        ),
      },
      composer: {
        key: 'composer',
        header: 'Komponist',
        className: 'font-medium',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>KOMPONIST</span>
            <FilterPopover
              isActive={isFilterActive(filters.composer)}
              onClear={() => handleClearFilter('composer')}
              label="Komponist"
            >
              <TextFilter
                value={filters.composer?.type === 'text' ? filters.composer.value : ''}
                onChange={(val) => handleFilterChange('composer', { type: 'text', value: val })}
                placeholder="Nach Komponist filtern..."
              />
            </FilterPopover>
          </div>
        ),
      },
      arranger: {
        key: 'arranger',
        header: 'Arrangeur',
        render: (value) => value || '-',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>ARRANGEUR</span>
            <FilterPopover
              isActive={isFilterActive(filters.arranger)}
              onClear={() => handleClearFilter('arranger')}
              label="Arrangeur"
            >
              <TextFilter
                value={filters.arranger?.type === 'text' ? filters.arranger.value : ''}
                onChange={(val) => handleFilterChange('arranger', { type: 'text', value: val })}
                placeholder="Nach Arrangeur filtern..."
              />
            </FilterPopover>
          </div>
        ),
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
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>ORGEL</span>
            <FilterPopover
              isActive={isFilterActive(filters.organ)}
              onClear={() => handleClearFilter('organ')}
              label="Orgel"
            >
              <BooleanFilter
                value={filters.organ?.type === 'boolean' ? filters.organ.value : true}
                onChange={(val) => handleFilterChange('organ', { type: 'boolean', value: val })}
                trueLabel="Mit Orgel"
                falseLabel="Ohne Orgel"
              />
            </FilterPopover>
          </div>
        ),
      },
      percussion: {
        key: 'withPercussion',
        header: 'Schlagzeug',
        render: (value) => (value ? '✓' : '-'),
        className: 'text-center',
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>SCHLAGZEUG</span>
            <FilterPopover
              isActive={isFilterActive(filters.percussion)}
              onClear={() => handleClearFilter('percussion')}
              label="Schlagzeug"
            >
              <BooleanFilter
                value={filters.percussion?.type === 'boolean' ? filters.percussion.value : true}
                onChange={(val) => handleFilterChange('percussion', { type: 'boolean', value: val })}
                trueLabel="Mit Schlagzeug"
                falseLabel="Ohne Schlagzeug"
              />
            </FilterPopover>
          </div>
        ),
      },
      parts: {
        key: 'parts',
        header: 'Stimmen',
        render: (_, row) =>
          row.parts ? (
            <ScoreDownloadButton file={row.parts} label="Stimmen" size="sm" className="w-full" />
          ) : (
            <span className="text-muted">-</span>
          ),
        className: 'text-center',
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>STIMMEN</span>
            <FilterPopover
              isActive={isFilterActive(filters.parts)}
              onClear={() => handleClearFilter('parts')}
              label="Stimmen"
            >
              <FileFilter
                value={filters.parts?.type === 'file' ? filters.parts.value : true}
                onChange={(val) => handleFilterChange('parts', { type: 'file', value: val })}
              />
            </FilterPopover>
          </div>
        ),
      },
      fullScore: {
        key: 'fullScore',
        header: 'Partitur',
        render: (_, row) =>
          row.fullScore ? (
            <ScoreDownloadButton file={row.fullScore} label="Partitur" size="sm" className="w-full" />
          ) : (
            <span className="text-muted">-</span>
          ),
        className: 'text-center',
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>PARTITUR</span>
            <FilterPopover
              isActive={isFilterActive(filters.fullScore)}
              onClear={() => handleClearFilter('fullScore')}
              label="Partitur"
            >
              <FileFilter
                value={filters.fullScore?.type === 'file' ? filters.fullScore.value : true}
                onChange={(val) => handleFilterChange('fullScore', { type: 'file', value: val })}
              />
            </FilterPopover>
          </div>
        ),
      },
      genre: {
        key: 'genre',
        header: 'Genre',
        render: (value) => value || '-',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>GENRE</span>
            <FilterPopover
              isActive={isFilterActive(filters.genre)}
              onClear={() => handleClearFilter('genre')}
              label="Genre"
            >
              <SelectFilter
                value={filters.genre?.type === 'select' ? filters.genre.value : ''}
                onChange={(val) => handleFilterChange('genre', { type: 'select', value: val })}
                options={genreOptions}
                placeholder="Alle Genres"
              />
            </FilterPopover>
          </div>
        ),
      },
      publisher: {
        key: 'publisher',
        header: 'Verlag',
        render: (value) => value || '-',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>VERLAG</span>
            <FilterPopover
              isActive={isFilterActive(filters.publisher)}
              onClear={() => handleClearFilter('publisher')}
              label="Verlag"
            >
              <TextFilter
                value={filters.publisher?.type === 'text' ? filters.publisher.value : ''}
                onChange={(val) => handleFilterChange('publisher', { type: 'text', value: val })}
                placeholder="Nach Verlag filtern..."
              />
            </FilterPopover>
          </div>
        ),
      },
      difficulty: {
        key: 'difficulty',
        header: 'Schwierigkeit',
        render: (value) => value || '-',
        renderHeader: () => (
          <div className="flex items-center gap-1">
            <span>SCHWIERIGKEIT</span>
            <FilterPopover
              isActive={isFilterActive(filters.difficulty)}
              onClear={() => handleClearFilter('difficulty')}
              label="Schwierigkeit"
            >
              <SelectFilter
                value={filters.difficulty?.type === 'select' ? filters.difficulty.value : ''}
                onChange={(val) => handleFilterChange('difficulty', { type: 'select', value: val })}
                options={difficultyOptions}
                placeholder="Alle Schwierigkeiten"
              />
            </FilterPopover>
          </div>
        ),
      },
      audioMidi: {
        key: 'audioMidi',
        header: 'Audio (MIDI)',
        render: (_, row) =>
          row.audioMidi ? (
            <ScoreDownloadButton file={row.audioMidi} label="MIDI" size="sm" className="w-full" />
          ) : (
            <span className="text-muted">-</span>
          ),
        className: 'text-center',
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>AUDIO (MIDI)</span>
            <FilterPopover
              isActive={isFilterActive(filters.audioMidi)}
              onClear={() => handleClearFilter('audioMidi')}
              label="Audio (MIDI)"
            >
              <FileFilter
                value={filters.audioMidi?.type === 'file' ? filters.audioMidi.value : true}
                onChange={(val) => handleFilterChange('audioMidi', { type: 'file', value: val })}
              />
            </FilterPopover>
          </div>
        ),
      },
      audioMp3: {
        key: 'audioMp3',
        header: 'Audio (MP3)',
        render: (_, row) =>
          row.audioMp3 ? (
            <ScoreDownloadButton file={row.audioMp3} label="MP3" size="sm" className="w-full" />
          ) : (
            <span className="text-muted">-</span>
          ),
        className: 'text-center',
        renderHeader: () => (
          <div className="flex items-center gap-1 justify-center">
            <span>AUDIO (MP3)</span>
            <FilterPopover
              isActive={isFilterActive(filters.audioMp3)}
              onClear={() => handleClearFilter('audioMp3')}
              label="Audio (MP3)"
            >
              <FileFilter
                value={filters.audioMp3?.type === 'file' ? filters.audioMp3.value : true}
                onChange={(val) => handleFilterChange('audioMp3', { type: 'file', value: val })}
              />
            </FilterPopover>
          </div>
        ),
      },
    };

    // Filter columns based on visibility and sort by order
    return columnConfig
      .filter((config) => config.visible)
      .sort((a, b) => a.order - b.order)
      .map((config) => allColumns[config.id]);
  }, [columnConfig, filters]);

  return (
    <div className={className}>
      {/* Mobile view */}
      <div className="md:hidden">
        <ScoresMobileView
          scores={filteredScores}
          onScoreClick={onScoreClick}
          onDownloadParts={handleDownloadParts}
          onDownloadFullScore={handleDownloadFullScore}
        />
      </div>

      {/* Table view */}
      <div className="hidden md:block">
        <div className="flex justify-center px-4 pb-1">
          <div className="max-w-7xl w-full flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-caption hover:text-neutral-900 underline"
            >
              Spalten konfigurieren
            </button>
          </div>
        </div>
        <ScrollableTable>
          <Table
            className="mx-4"
            data={filteredScores}
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
