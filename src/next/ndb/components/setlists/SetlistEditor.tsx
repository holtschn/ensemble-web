import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { SetlistItem, SetlistScoreItem, ScoreItem, PlayerAllocation } from '@/next/ndb/types';
import { createSetlist, updateSetlist } from '@/next/ndb/api/actions';
import { useScores } from '@/next/ndb/hooks/useScores';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/next/ndb/constants';
import TextField from '@/next/ndb/components/TextField';
import ScoreListItem from '@/next/ndb/components/setlists/ScoreListItem';
import PlayerAllocationEditor from '@/next/ndb/components/setlists/PlayerAllocationEditor';

interface SetlistEditorProps {
  mode: 'create' | 'edit';
  setlistId?: number;
  initialData?: SetlistItem;
  onSaveSuccess: (setlistId: number) => void;
  onHasChanges?: (hasChanges: boolean) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
  isSaving: boolean;
}

const SetlistEditor: React.FC<SetlistEditorProps> = ({
  mode,
  setlistId,
  initialData,
  onSaveSuccess,
  onHasChanges,
  submitRef,
  isSaving,
}) => {
  const { scores } = useScores();

  const [displayName, setDisplayName] = useState(initialData?.displayName || '');
  const [items, setItems] = useState<SetlistScoreItem[]>(initialData?.items || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations'>('overview');

  // Track changes for dirty state
  useEffect(() => {
    let hasChanges = false;
    if (mode === 'create') {
      hasChanges = displayName.trim().length > 0 || items.length > 0;
    } else {
      const nameChanged = displayName !== initialData?.displayName;
      const itemsChanged = JSON.stringify(items) !== JSON.stringify(initialData?.items);
      hasChanges = nameChanged || itemsChanged;
    }
    onHasChanges?.(hasChanges);
  }, [displayName, items, mode, initialData, onHasChanges]);

  // Filter scores based on search query
  const filteredScores = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return scores
      .filter((score) => {
        const matchesSearch = score.title.toLowerCase().includes(query) || score.composer.toLowerCase().includes(query);
        const notInSetlist = !items.some((item) => item.score === score.id);
        return matchesSearch && notInSetlist;
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, scores, items]);

  const handleAddScore = useCallback(
    (score: ScoreItem) => {
      // Check if score already in setlist
      if (items.some((item) => item.score === score.id)) {
        toast.error('Dieses Stück ist bereits in der Setlist');
        return;
      }

      const newItem: SetlistScoreItem = {
        score: score.id,
        order: items.length, // Add at end
        allocations: [],
      };

      setItems([...items, newItem]);
      toast.success(`"${score.title}" zur Setlist hinzugefügt`);
      setSearchQuery(''); // Clear search
      setShowSearchResults(false);
    },
    [items]
  );

  const handleRemoveScore = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      // Reorder remaining items
      const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
      setItems(reorderedItems);
    },
    [items]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return; // Already at top

      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];

      // Update order indices
      const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
      setItems(reorderedItems);
    },
    [items]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === items.length - 1) return; // Already at bottom

      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];

      // Update order indices
      const reorderedItems = newItems.map((item, i) => ({ ...item, order: i }));
      setItems(reorderedItems);
    },
    [items]
  );

  const handleAllocationsChange = useCallback(
    (itemIndex: number, allocations: PlayerAllocation[]) => {
      const newItems = [...items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        allocations,
      };
      setItems(newItems);
    },
    [items]
  );

  const handleSave = useCallback(async () => {
    // Validation
    if (!displayName.trim()) {
      toast.error('Bitte geben Sie einen Namen für die Setlist ein');
      return;
    }

    if (items.length === 0) {
      toast.error('Bitte fügen Sie mindestens ein Stück hinzu');
      return;
    }

    try {
      if (mode === 'create') {
        const result = await createSetlist({
          displayName: displayName.trim(),
          items,
        });
        toast.success(SUCCESS_MESSAGES.SETLIST_CREATED);
        onSaveSuccess(result.id);
      } else if (setlistId) {
        await updateSetlist({
          setlistId,
          displayName: displayName.trim(),
          items,
        });
        toast.success(SUCCESS_MESSAGES.SETLIST_UPDATED);
        onSaveSuccess(setlistId);
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES.SAVE_ERROR);
      console.error('Save error:', error);
    }
  }, [displayName, items, mode, setlistId, onSaveSuccess]);

  // Expose save function via ref
  useEffect(() => {
    if (submitRef) {
      submitRef.current = handleSave;
    }
  }, [handleSave, submitRef]);

  const getScoreDetails = (scoreId: number) => {
    const score = scores.find((s) => s.id === scoreId);
    return score
      ? {
          title: score.title,
          composer: score.composer,
          arranger: score.arranger,
          instrumentation: score.instrumentation,
        }
      : {
          title: `Score #${scoreId}`,
          composer: 'Unbekannt',
          arranger: null,
          instrumentation: '-',
        };
  };

  return (
    <div className="w-full">
      {/* Tab Navigation - Centered in middle column */}
      <div className="middle-column mb-6">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex gap-8 justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-body ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-muted hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Übersicht
            </button>
            {/* Hide Besetzung tab on mobile (< 768px) */}
            <button
              type="button"
              onClick={() => setActiveTab('allocations')}
              className={`hidden md:block py-4 px-1 border-b-2 font-medium text-body ${
                activeTab === 'allocations'
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-muted hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Besetzung
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'overview' && (
          <div className="middle-column">
            {/* Display Name Field */}
            <div className="mb-6">
              <label htmlFor="displayName" className="input-label mb-2">
                Name der Setlist *
              </label>
              <TextField
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="z.B. Weihnachtskonzert 2025"
                required
              />
            </div>

            {/* Items List */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="input-label">Stücke in der Setlist ({items.length})</label>
              </div>

              <div className="border-base rounded-card">
                {/* Existing items */}
                {items.length > 0 && (
                  <div className="divide-base">
                    {items.map((item, index) => {
                      const scoreDetails = getScoreDetails(item.score);
                      return (
                        <div key={`${item.score}-${index}`} className="p-3 flex items-start gap-3 hover:bg-neutral-50">
                          {/* Order number */}
                          <div className="text-muted w-8 pt-1">{index + 1}.</div>

                          {/* Score details */}
                          <div className="flex-1">
                            <ScoreListItem
                              title={scoreDetails.title}
                              composer={scoreDetails.composer}
                              arranger={scoreDetails.arranger}
                              instrumentation={scoreDetails.instrumentation}
                              compact
                            />
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="px-2 py-1 text-caption hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Nach oben"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === items.length - 1}
                              className="px-2 py-1 text-caption hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Nach unten"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveScore(index)}
                              className="px-2 py-1 text-caption text-red-600 hover:text-red-800"
                              title="Entfernen"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Score Section - at the bottom */}
                <div className={`p-3 relative ${items.length > 0 ? 'border-t border-neutral-200 bg-neutral-50' : ''}`}>
                  <TextField
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    placeholder="Stück hinzufügen..."
                    autoComplete="off"
                  />

                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.trim() && (
                    <div
                      className="absolute z-10 left-3 right-3 bg-white border-popover max-h-60 overflow-auto"
                      style={{ top: '100%', marginTop: '-1rem' }}
                    >
                      {filteredScores.length > 0 ? (
                        filteredScores.map((score) => (
                          <button
                            key={score.id}
                            type="button"
                            onClick={() => handleAddScore(score)}
                            className="w-full px-4 py-2 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                          >
                            <ScoreListItem
                              title={score.title}
                              composer={score.composer}
                              arranger={score.arranger}
                              instrumentation={score.instrumentation}
                              compact
                            />
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-muted">Keine Stücke gefunden</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="hidden md:block">
            <PlayerAllocationEditor items={items} onAllocationsChange={handleAllocationsChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SetlistEditor;
