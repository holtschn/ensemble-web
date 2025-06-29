'use client';

import React, { useState } from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import TextField from '@/next/ndb/components/form/TextField';
import Button from '@/next/ndb/components/form/Button';

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
  className?: string;
}

const ScoresTableToolbar: React.FC<ScoresTableToolbarProps> = ({ scores, onFilteredScoresChange, className = '' }) => {
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
          score.arranger?.toLowerCase().includes(searchTerm) ||
          score.genre?.toLowerCase().includes(searchTerm) ||
          score.publisher?.toLowerCase().includes(searchTerm)
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

  const getFilterIcon = (filterKey: string) => {
    if (activeFilters.has(filterKey)) {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Field */}
        <div className="flex-1 min-w-64">
          <TextField
            placeholder="Suche nach Titel, Komponist, Arrangeur..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeFilters.has('minHorns') ? 'primary' : 'outline'}
            onClick={() => toggleFilter('minHorns', 2)}
          >
            {getFilterIcon('minHorns')}
            mind. 2 Hörner
          </Button>

          <Button
            size="sm"
            variant={activeFilters.has('withPercussion') ? 'primary' : 'outline'}
            onClick={() => toggleFilter('withPercussion', true)}
          >
            {getFilterIcon('withPercussion')}
            mit Schlagzeug
          </Button>

          <Button
            size="sm"
            variant={activeFilters.has('hasFullScore') ? 'primary' : 'outline'}
            onClick={() => toggleFilter('hasFullScore', true)}
          >
            {getFilterIcon('hasFullScore')}
            hat Partitur
          </Button>

          <Button
            size="sm"
            variant={activeFilters.has('quintetsOnly') ? 'primary' : 'outline'}
            onClick={() => toggleFilter('quintetsOnly', true)}
          >
            {getFilterIcon('quintetsOnly')}
            Quintett
          </Button>

          {/* Reset Filters Button */}
          {activeFilters.size > 0 && (
            <Button size="sm" variant="ghost" onClick={resetFilters}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilters.size > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Aktive Filter:</span>
            {activeFilters.has('search') && filters.search && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Suche: &quot;{filters.search}&quot;
              </span>
            )}
            {activeFilters.has('minHorns') && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Mind. 2 Hörner
              </span>
            )}
            {activeFilters.has('withPercussion') && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Mit Schlagzeug
              </span>
            )}
            {activeFilters.has('hasFullScore') && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Hat Partitur
              </span>
            )}
            {activeFilters.has('quintetsOnly') && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                Quintett
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoresTableToolbar;
