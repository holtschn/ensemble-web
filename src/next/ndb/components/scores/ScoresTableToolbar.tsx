import React, { useState } from 'react';

import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';

import Button from '@/next/ndb/components/Button';
import Icon from '@/next/ndb/components/Icon';
import TextField from '@/next/ndb/components/TextField';

interface FilterState {
  search: string;
  minHorns: number | null;
  withPercussion: boolean | null;
  hasFullScore: boolean | null;
  quintetsOnly: boolean;
}

type ScoresFilterButtonProps = {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const ScoresFilterButton: React.FC<ScoresFilterButtonProps> = ({ isActive, onClick, children }) => {
  return (
    <Button size="sm" className="text-xs" variant={isActive ? 'highlighted' : 'default'} onClick={onClick}>
      {isActive ? (
        <Icon name="filter-active" alt="Filter Active Icon" className="mr-2 h-3 w-3" />
      ) : (
        <Icon name="filter-inactive" alt="Filter Inactive Icon" className="mr-2 h-3 w-3" />
      )}
      {children}
    </Button>
  );
};

interface ScoresTableToolbarProps {
  scores: ScoreItem[];
  onFilteredScoresChange: (filteredScores: ScoreItem[]) => void;
  onColumnsClick?: () => void;
  className?: string;
}

const ScoresTableToolbar: React.FC<ScoresTableToolbarProps> = ({ scores, onFilteredScoresChange, onColumnsClick, className = '' }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minHorns: null,
    withPercussion: null,
    hasFullScore: null,
    quintetsOnly: false,
  });

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...scores];

    // Search filter
    if (newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (score) =>
          score.title.toLowerCase().includes(searchTerm) ||
          score.composer.toLowerCase().includes(searchTerm) ||
          score.arranger?.toLowerCase().includes(searchTerm)
      );
    }

    // Minimum horns filter
    if (newFilters.minHorns !== null) {
      filtered = filtered.filter(
        (score) => toInstrumentation(score.instrumentation).numHorns() >= newFilters.minHorns!
      );
    }

    // With percussion filter
    if (newFilters.withPercussion !== null) {
      filtered = filtered.filter((score) => score.withPercussion === newFilters.withPercussion);
    }

    // Has full score filter
    if (newFilters.hasFullScore !== null) {
      filtered = filtered.filter((score) =>
        newFilters.hasFullScore ? score.fullScore !== null : score.fullScore === null
      );
    }

    // Quintets only filter
    if (newFilters.quintetsOnly) {
      filtered = filtered.filter((score) => toInstrumentation(score.instrumentation).numTotal() === 5);
    }

    onFilteredScoresChange(filtered);
  };

  const toggleFilter = (filterKey: keyof FilterState, value: any) => {
    const newActiveFilters = new Set(activeFilters);
    let newFilters: FilterState;

    if (activeFilters.has(filterKey)) {
      // Remove filter
      newActiveFilters.delete(filterKey);
      newFilters = {
        ...filters,
        [filterKey]: filterKey === 'search' ? '' : filterKey === 'quintetsOnly' ? false : null,
      };
    } else {
      // Add filter
      newActiveFilters.add(filterKey);
      newFilters = {
        ...filters,
        [filterKey]: value,
      };
    }

    setActiveFilters(newActiveFilters);
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const resetFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      minHorns: null,
      withPercussion: null,
      hasFullScore: null,
      quintetsOnly: false,
    };
    setFilters(resetFilters);
    setActiveFilters(new Set());
    applyFilters(resetFilters);
  };

  return (
    <div className={`w-full bg-white border-b border-gray-200 py-4 ${className}`}>
      <div className="flex flex-col gap-0">
        {/* Row 1: Search Input */}
        <div className="w-full">
          <TextField
            placeholder="Suche nach Titel, Komponist, Arrangeur..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Row 2: Filter Buttons */}
        <div className="flex flex-row flex-wrap items-center justify-start gap-2">
          <ScoresFilterButton isActive={activeFilters.has('minHorns')} onClick={() => toggleFilter('minHorns', 2)}>
            mind. 2 Hörner
          </ScoresFilterButton>
          <ScoresFilterButton
            isActive={activeFilters.has('withPercussion')}
            onClick={() => toggleFilter('withPercussion', true)}
          >
            mit Schlagzeug
          </ScoresFilterButton>
          <ScoresFilterButton
            isActive={activeFilters.has('hasFullScore')}
            onClick={() => toggleFilter('hasFullScore', true)}
          >
            hat Partitur
          </ScoresFilterButton>
          <ScoresFilterButton
            isActive={activeFilters.has('quintetsOnly')}
            onClick={() => toggleFilter('quintetsOnly', true)}
          >
            Quintett
          </ScoresFilterButton>

          {/* Reset Filters Button */}
          {activeFilters.size > 0 && (
            <Button className="text-xs" size="sm" variant="ghost" onClick={resetFilters}>
              <Icon name="cross" alt="Cross Icon" className="mr-1 h-3 w-3" /> zurücksetzen
            </Button>
          )}

          {/* Columns Button - Hidden below 768px */}
          {onColumnsClick && (
            <Button className="text-xs max-md:hidden ml-auto" size="sm" variant="default" onClick={onColumnsClick}>
              <Icon name="columns" alt="Spalten" className="mr-2 h-3 w-3" />
              Spalten
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoresTableToolbar;
