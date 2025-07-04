'use client';

import React, { useState } from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import TextField from '@/next/ndb/components/form/TextField';
import Button from '@/next/ndb/components/form/Button';
import { FilterButton } from '@/next/ndb/components/table/FilterButton';

interface FilterState {
  search: string;
  minHorns: number | null;
  withPercussion: boolean | null;
  hasFullScore: boolean | null;
  quintetsOnly: boolean;
}

interface ScoresTableToolbarProps {
  scores: ScoreItem[];
  onFilteredScoresChange: (filteredScores: ScoreItem[]) => void;
  isLoading: boolean;
  className?: string;
}

const ScoresTableToolbar: React.FC<ScoresTableToolbarProps> = ({
  scores,
  onFilteredScoresChange,
  isLoading,
  className = '',
}) => {
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
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-0">
        <div className="flex-1 min-w-64">
          <TextField
            placeholder="Suche nach Titel, Komponist, Arrangeur..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-row gap-2">
          <FilterButton isActive={activeFilters.has('minHorns')} onClick={() => toggleFilter('minHorns', 2)}>
            mind. 2 Hörner
          </FilterButton>

          <FilterButton
            isActive={activeFilters.has('withPercussion')}
            onClick={() => toggleFilter('withPercussion', true)}
          >
            mit Schlagzeug
          </FilterButton>

          <FilterButton isActive={activeFilters.has('hasFullScore')} onClick={() => toggleFilter('hasFullScore', true)}>
            hat Partitur
          </FilterButton>

          <FilterButton isActive={activeFilters.has('quintetsOnly')} onClick={() => toggleFilter('quintetsOnly', true)}>
            Quintett
          </FilterButton>

          {/* Reset Filters Button */}
          {activeFilters.size > 0 && (
            <Button className="text-xs" size="sm" variant="ghost" onClick={resetFilters}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              zurücksetzen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoresTableToolbar;
