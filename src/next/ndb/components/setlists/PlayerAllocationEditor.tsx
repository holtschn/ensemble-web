'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SetlistScoreItem, PlayerAllocation, ScoreItem } from '@/next/ndb/types';
import { useScores } from '@/next/ndb/hooks/useScores';
import { getPartsFromInstrumentation } from '@/next/ndb/utils/instrumentationParts';
import { getSuggestedPlayersForPart } from '@/next/ndb/utils/playerSuggestions';
import { sortParts, mergePartsColumns } from '@/next/ndb/utils/partSorting';
import { fetchEnrichedUsers } from '@/next/ndb/api/userActions';
import type { EnrichedUser } from '@/next/utils/users';
import ScrollableTable from '@/next/ndb/components/ScrollableTable';
import PlayerAutocompleteInput from '@/next/ndb/components/setlists/PlayerAutocompleteInput';

interface PlayerAllocationEditorProps {
  items: SetlistScoreItem[];
  onAllocationsChange: (itemIndex: number, allocations: PlayerAllocation[]) => void;
}

/**
 * PlayerAllocationEditor component
 *
 * Displays a grid for assigning players to instrument parts in a setlist.
 * Each row represents a score, each column represents an instrument part.
 */
const PlayerAllocationEditor: React.FC<PlayerAllocationEditorProps> = ({ items, onAllocationsChange }) => {
  const { scores } = useScores();
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const enrichedUsers = await fetchEnrichedUsers();
        setUsers(enrichedUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

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
   *
   * @param column - Column name (e.g., "hrn1", "trp2")
   * @param scoreParts - Actual parts for the score
   * @returns Actual part name to use, or null if not valid
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

  // Handle player change for a specific column
  const handlePlayerChange = useCallback(
    (itemIndex: number, column: string, player: string) => {
      const item = items[itemIndex];
      const scoreParts = getScoreParts(item.score);
      const actualPart = getActualPartForColumn(column, scoreParts);

      if (!actualPart) return; // Invalid column for this score

      const existingAllocations = item.allocations || [];

      // Update or add allocation using the actual part name
      const allocationIndex = existingAllocations.findIndex((a) => a.part === actualPart);

      let newAllocations: PlayerAllocation[];

      if (player.trim() === '') {
        // Remove allocation if player is empty
        newAllocations = existingAllocations.filter((a) => a.part !== actualPart);
      } else if (allocationIndex >= 0) {
        // Update existing allocation
        newAllocations = [...existingAllocations];
        newAllocations[allocationIndex] = { part: actualPart, player: player.trim() };
      } else {
        // Add new allocation
        newAllocations = [...existingAllocations, { part: actualPart, player: player.trim() }];
      }

      onAllocationsChange(itemIndex, newAllocations);
    },
    [items, onAllocationsChange, getScoreParts, getActualPartForColumn]
  );

  // Get suggestions for a part
  const getSuggestions = useCallback(
    (part: string): string[] => {
      return getSuggestedPlayersForPart(part, users);
    },
    [users]
  );

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Keine Stücke in der Setlist. Fügen Sie zuerst Stücke hinzu, um die Besetzung festzulegen.
      </div>
    );
  }

  if (isLoadingUsers) {
    return <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">Lade Musiker...</div>;
  }

  return (
    <ScrollableTable>
      <div className="border border-gray-200 rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="sticky left-0 z-10 bg-gray-50 px-2 py-1.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[140px]">
                Stücke
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
                <tr key={`${item.score}-${itemIndex}`} className="hover:bg-gray-50">
                  {/* Score title (sticky first column) */}
                  <td className="sticky left-0 z-10 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 border-r border-gray-200 max-w-[140px]">
                    <div className="truncate" title={score?.title || `Score #${item.score}`}>
                      {score?.title || `Score #${item.score}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5" title={score?.composer || ''}>
                      {score?.composer || ''}
                    </div>
                  </td>

                  {/* Part inputs */}
                  {allParts.map((column) => {
                    const actualPart = getActualPartForColumn(column, scoreParts);
                    const isValidPart = actualPart !== null;
                    const currentPlayer = getPlayer(itemIndex, column);
                    const suggestions = getSuggestions(column);

                    return (
                      <td key={column} className="px-1 py-1">
                        {isValidPart ? (
                          <PlayerAutocompleteInput
                            value={currentPlayer}
                            onChange={(value) => handlePlayerChange(itemIndex, column, value)}
                            suggestions={suggestions}
                            placeholder="-"
                          />
                        ) : (
                          <div className="text-center text-gray-300 text-xs py-1">-</div>
                        )}
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
  );
};

export default PlayerAllocationEditor;
