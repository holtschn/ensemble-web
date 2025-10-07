'use client';

import React, { useCallback } from 'react';
import { SetlistScoreItem, ScoreItem } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';
import { getPartsFromInstrumentation } from '@/next/ndb/utils/instrumentationParts';
import { sortParts, mergePartsColumns } from '@/next/ndb/utils/partSorting';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';

interface PlayerAllocationDisplayProps {
  items: SetlistScoreItem[];
}

/**
 * PlayerAllocationDisplay component
 *
 * Read-only display of player allocations in a compact table format.
 * Shows which players are assigned to which parts for each score.
 */
const PlayerAllocationDisplay: React.FC<PlayerAllocationDisplayProps> = ({ items }) => {
  const { scores } = useScores();

  // Get all unique parts across all scores in the setlist
  const allParts = React.useMemo(() => {
    const partsSet = new Set<string>();

    items.forEach((item) => {
      const score = scores.find((s) => s.id === item.score);
      if (score) {
        const parts = getPartsFromInstrumentation(score);
        parts.forEach((part) => partsSet.add(part));
      }

      // Also include parts from existing allocations (handles orphaned parts)
      item.allocations?.forEach((allocation) => {
        partsSet.add(allocation.part);
      });
    });

    // Convert to array, merge singular+plural-1 columns, and sort by brass ensemble order
    const allUniqueParts = Array.from(partsSet);
    const mergedParts = mergePartsColumns(allUniqueParts);
    return sortParts(mergedParts);
  }, [items, scores]);

  // Get score details
  const getScore = useCallback(
    (scoreId: number): ScoreItem | undefined => {
      return scores.find((s) => s.id === scoreId);
    },
    [scores]
  );

  // Get parts for a specific score
  const getScoreParts = useCallback(
    (scoreId: number): string[] => {
      const score = getScore(scoreId);
      if (!score) return [];
      return getPartsFromInstrumentation(score);
    },
    [getScore]
  );

  /**
   * Get the actual part name to use for a given column and score.
   * Handles merged columns: if column is "hrn1" but score has "hrn", returns "hrn".
   */
  const getActualPartForColumn = useCallback((column: string, scoreParts: string[]): string | null => {
    // Direct match
    if (scoreParts.includes(column)) {
      return column;
    }

    // Check if this is a merged column (e.g., "hrn1") and score has singular ("hrn")
    if (/1$/.test(column)) {
      const singularPart = column.replace(/1$/, '');
      if (scoreParts.includes(singularPart)) {
        return singularPart;
      }
    }

    return null;
  }, []);

  // Get current player for a specific score and column
  const getPlayer = useCallback(
    (itemIndex: number, column: string): string => {
      const scoreParts = getScoreParts(items[itemIndex].score);
      const actualPart = getActualPartForColumn(column, scoreParts);

      if (!actualPart) return '';

      const allocation = items[itemIndex]?.allocations?.find((a) => a.part === actualPart);
      return allocation?.player || '';
    },
    [items, getScoreParts, getActualPartForColumn]
  );

  // Check if column is orphaned (exists in allocations but not in current score)
  const isOrphanedColumn = useCallback(
    (itemIndex: number, column: string): boolean => {
      const scoreParts = getScoreParts(items[itemIndex].score);
      const actualPart = getActualPartForColumn(column, scoreParts);

      // Not orphaned if it's a valid part for this score
      if (actualPart !== null) return false;

      // Check if there's an allocation for this column (exact match only for orphaned check)
      const hasAllocation = items[itemIndex]?.allocations?.some((a) => a.part === column);
      return hasAllocation === true;
    },
    [items, getScoreParts, getActualPartForColumn]
  );

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Keine Stücke in der Setlist.
      </div>
    );
  }

  return (
    <div>
      {/* Desktop/Tablet: Horizontal scrolling table */}
      <div className="hidden md:block">
        <ScrollableTable>
          <div className="border border-gray-200 rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="sticky left-0 z-10 bg-gray-50 px-2 py-1.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[140px]">
                    Note
                  </th>
                  {allParts.map((part) => (
                    <th
                      key={part}
                      className="px-1.5 py-1.5 text-center text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[90px]"
                    >
                      {part}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, itemIndex) => {
                  const score = getScore(item.score);
                  const scoreParts = getScoreParts(item.score);

                  return (
                    <tr key={`${item.score}-${itemIndex}`}>
                      {/* Score title (sticky first column) */}
                      <td className="sticky left-0 z-10 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 border-r border-gray-200 max-w-[140px]">
                        <div className="truncate" title={score?.title || `Score #${item.score}`}>
                          {score?.title || `Score #${item.score}`}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5" title={score?.composer || ''}>
                          {score?.composer || ''}
                        </div>
                      </td>

                      {/* Part values */}
                      {allParts.map((column) => {
                        const actualPart = getActualPartForColumn(column, scoreParts);
                        const isValidPart = actualPart !== null;
                        const currentPlayer = getPlayer(itemIndex, column);
                        const isOrphaned = isOrphanedColumn(itemIndex, column);

                        return (
                          <td
                            key={column}
                            className={`px-1.5 py-1.5 text-xs text-center ${
                              isOrphaned ? 'bg-amber-50 text-amber-700' : isValidPart ? 'text-gray-900' : 'text-gray-300'
                            }`}
                            title={isOrphaned ? 'Veraltete Stimme (nicht mehr im Stück vorhanden)' : ''}
                          >
                            {currentPlayer || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollableTable>
      </div>

      {/* Mobile: Vertical cards */}
      <div className="md:hidden space-y-4">
        {items.map((item, itemIndex) => {
          const score = getScore(item.score);
          const scoreParts = getScoreParts(item.score);
          const allocations = item.allocations || [];
          const validAllocations = allocations.filter((alloc) => scoreParts.includes(alloc.part));
          const orphanedAllocations = allocations.filter((alloc) => !scoreParts.includes(alloc.part));

          return (
            <div key={`${item.score}-${itemIndex}`} className="border border-gray-200 rounded-lg p-4">
              {/* Score header */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="font-medium text-gray-900 text-sm">
                  {itemIndex + 1}. {score?.title || `Score #${item.score}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">{score?.composer || ''}</div>
              </div>

              {/* Allocations */}
              {validAllocations.length === 0 && orphanedAllocations.length === 0 ? (
                <div className="text-xs text-gray-400 italic">Keine Besetzung festgelegt</div>
              ) : (
                <div className="space-y-2">
                  {/* Valid allocations */}
                  {validAllocations.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                      {sortParts(validAllocations.map((a) => a.part)).map((part) => {
                        const allocation = validAllocations.find((a) => a.part === part);
                        return (
                          <div key={part} className="flex">
                            <span className="font-medium text-gray-700 w-12">{part}:</span>
                            <span className="text-gray-900 truncate">{allocation?.player}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Orphaned allocations */}
                  {orphanedAllocations.length > 0 && (
                    <div className="pt-2 border-t border-amber-200">
                      <div className="text-xs font-medium text-amber-700 mb-1.5">Veraltete Stimmen:</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                        {sortParts(orphanedAllocations.map((a) => a.part)).map((part) => {
                          const allocation = orphanedAllocations.find((a) => a.part === part);
                          return (
                            <div key={part} className="flex">
                              <span className="font-medium text-amber-700 w-12">{part}:</span>
                              <span className="text-amber-600 truncate">{allocation?.player}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerAllocationDisplay;
