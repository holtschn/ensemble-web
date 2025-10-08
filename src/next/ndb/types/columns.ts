/**
 * Column configuration types for the scores table
 */

export type ScoreColumnId =
  | 'title'
  | 'composer'
  | 'arranger'
  | 'instrumentation'
  | 'organ'
  | 'percussion'
  | 'parts'
  | 'fullScore'
  | 'genre'
  | 'publisher'
  | 'difficulty'
  | 'audioMidi'
  | 'audioMp3';

export interface ColumnConfig {
  id: ScoreColumnId;
  label: string;
  visible: boolean;
  order: number; // Display order (0-indexed)
  alwaysVisible?: boolean; // Cannot be hidden
}

export type ColumnPreferences = {
  visibility?: {
    [key in ScoreColumnId]?: boolean;
  };
  order?: ScoreColumnId[];
};

/**
 * Default column configuration
 * Order: titel, komponist, arrangeur, verlag, besetzung, orgel, schlagzeug, genre, schwierigkeit, stimmen, partitur, audio, audio
 * All selected columns are visible at all screen widths. Horizontal scroll handles overflow on smaller screens.
 */
export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'title', label: 'Titel', visible: true, order: 0, alwaysVisible: true },
  { id: 'composer', label: 'Komponist', visible: true, order: 1, alwaysVisible: true },
  { id: 'arranger', label: 'Arrangeur', visible: true, order: 2 },
  { id: 'publisher', label: 'Verlag', visible: false, order: 3 },
  { id: 'instrumentation', label: 'Besetzung', visible: true, order: 4 },
  { id: 'organ', label: 'Orgel', visible: true, order: 5 },
  { id: 'percussion', label: 'Schlagzeug', visible: true, order: 6 },
  { id: 'genre', label: 'Genre', visible: false, order: 7 },
  { id: 'difficulty', label: 'Schwierigkeit', visible: false, order: 8 },
  { id: 'parts', label: 'Stimmen', visible: true, order: 9, alwaysVisible: true },
  { id: 'fullScore', label: 'Partitur', visible: true, order: 10, alwaysVisible: true },
  { id: 'audioMidi', label: 'Audio (MIDI)', visible: false, order: 11 },
  { id: 'audioMp3', label: 'Audio (MP3)', visible: false, order: 12 },
];

/**
 * Get column configuration from user preferences
 */
export function getColumnConfiguration(preferences?: ColumnPreferences): ColumnConfig[] {
  if (!preferences || (!preferences.visibility && !preferences.order)) {
    return DEFAULT_COLUMNS;
  }

  let columns = [...DEFAULT_COLUMNS];

  // Apply visibility preferences
  if (preferences.visibility) {
    columns = columns.map((col) => ({
      ...col,
      visible: preferences.visibility![col.id] !== undefined ? preferences.visibility![col.id]! : col.visible,
    }));
  }

  // Apply order preferences
  if (preferences.order && preferences.order.length > 0) {
    const orderMap = new Map(preferences.order.map((id, index) => [id, index]));
    columns = columns.map((col) => ({
      ...col,
      order: orderMap.has(col.id) ? orderMap.get(col.id)! : col.order,
    }));
  }

  return columns;
}

/**
 * Convert column configuration to preferences object
 */
export function columnConfigToPreferences(columns: ColumnConfig[]): ColumnPreferences {
  const visibility: { [key in ScoreColumnId]?: boolean } = {};
  const order: ScoreColumnId[] = [];

  // Sort by order first
  const sorted = [...columns].sort((a, b) => a.order - b.order);

  sorted.forEach((col) => {
    visibility[col.id] = col.visible;
    order.push(col.id);
  });

  return { visibility, order };
}
