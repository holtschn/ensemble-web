/**
 * Tests for column configuration utilities
 */

import {
  DEFAULT_COLUMNS,
  getColumnConfiguration,
  columnConfigToPreferences,
  type ColumnConfig,
  type ColumnPreferences,
  type ScoreColumnId,
} from './columns';

describe('Column Configuration Utilities', () => {
  describe('DEFAULT_COLUMNS', () => {
    it('should have all columns defined', () => {
      expect(DEFAULT_COLUMNS).toHaveLength(13);
    });

    it('should have correct always visible columns', () => {
      const alwaysVisible = DEFAULT_COLUMNS.filter((col) => col.alwaysVisible);
      expect(alwaysVisible).toHaveLength(4);
      expect(alwaysVisible.map((c) => c.id)).toEqual([
        'title',
        'composer',
        'parts',
        'fullScore',
      ]);
    });

    it('should have unique orders', () => {
      const orders = DEFAULT_COLUMNS.map((col) => col.order);
      const uniqueOrders = new Set(orders);
      expect(uniqueOrders.size).toBe(DEFAULT_COLUMNS.length);
    });

    it('should have sequential orders starting from 0', () => {
      const orders = DEFAULT_COLUMNS.map((col) => col.order).sort((a, b) => a - b);
      orders.forEach((order, index) => {
        expect(order).toBe(index);
      });
    });
  });

  describe('getColumnConfiguration', () => {
    it('should return default columns when no preferences provided', () => {
      const result = getColumnConfiguration();
      expect(result).toEqual(DEFAULT_COLUMNS);
    });

    it('should return default columns when empty preferences provided', () => {
      const result = getColumnConfiguration({});
      expect(result).toEqual(DEFAULT_COLUMNS);
    });

    it('should apply visibility preferences', () => {
      const preferences: ColumnPreferences = {
        visibility: {
          arranger: false,
          genre: true,
        },
      };

      const result = getColumnConfiguration(preferences);

      const arranger = result.find((col) => col.id === 'arranger');
      const genre = result.find((col) => col.id === 'genre');

      expect(arranger?.visible).toBe(false);
      expect(genre?.visible).toBe(true);
    });

    it('should apply order preferences', () => {
      const preferences: ColumnPreferences = {
        order: ['genre', 'title', 'composer', 'arranger', 'publisher', 'instrumentation', 'organ', 'percussion', 'difficulty', 'parts', 'fullScore', 'audioMidi', 'audioMp3'],
      };

      const result = getColumnConfiguration(preferences);

      const genre = result.find((col) => col.id === 'genre');
      const title = result.find((col) => col.id === 'title');

      expect(genre?.order).toBe(0);
      expect(title?.order).toBe(1);
    });

    it('should apply both visibility and order preferences', () => {
      const preferences: ColumnPreferences = {
        visibility: {
          genre: true,
          difficulty: true,
        },
        order: ['title', 'genre', 'composer', 'difficulty', 'arranger', 'publisher', 'instrumentation', 'organ', 'percussion', 'parts', 'fullScore', 'audioMidi', 'audioMp3'],
      };

      const result = getColumnConfiguration(preferences);

      const genre = result.find((col) => col.id === 'genre');
      const difficulty = result.find((col) => col.id === 'difficulty');

      expect(genre?.visible).toBe(true);
      expect(genre?.order).toBe(1);
      expect(difficulty?.visible).toBe(true);
      expect(difficulty?.order).toBe(3);
    });

    it('should preserve default visibility for columns not in preferences', () => {
      const preferences: ColumnPreferences = {
        visibility: {
          genre: true,
        },
      };

      const result = getColumnConfiguration(preferences);

      const title = result.find((col) => col.id === 'title');
      const publisher = result.find((col) => col.id === 'publisher');

      expect(title?.visible).toBe(true); // Default is true
      expect(publisher?.visible).toBe(false); // Default is false
    });
  });

  describe('columnConfigToPreferences', () => {
    it('should convert default columns to preferences', () => {
      const result = columnConfigToPreferences(DEFAULT_COLUMNS);

      expect(result.visibility).toBeDefined();
      expect(result.order).toBeDefined();
      expect(result.order?.length).toBe(DEFAULT_COLUMNS.length);
    });

    it('should preserve visibility settings', () => {
      const result = columnConfigToPreferences(DEFAULT_COLUMNS);

      expect(result.visibility?.title).toBe(true);
      expect(result.visibility?.composer).toBe(true);
      expect(result.visibility?.genre).toBe(false);
    });

    it('should create order array sorted by order property', () => {
      const result = columnConfigToPreferences(DEFAULT_COLUMNS);

      expect(result.order?.[0]).toBe('title');
      expect(result.order?.[1]).toBe('composer');
      expect(result.order?.[2]).toBe('arranger');
    });

    it('should handle custom column configuration', () => {
      const customColumns: ColumnConfig[] = [
        { id: 'genre', label: 'Genre', visible: true, order: 0 },
        { id: 'title', label: 'Titel', visible: true, order: 1, alwaysVisible: true },
        { id: 'composer', label: 'Komponist', visible: false, order: 2 },
      ];

      const result = columnConfigToPreferences(customColumns);

      expect(result.order?.[0]).toBe('genre');
      expect(result.order?.[1]).toBe('title');
      expect(result.order?.[2]).toBe('composer');
      expect(result.visibility?.genre).toBe(true);
      expect(result.visibility?.composer).toBe(false);
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve configuration through conversion cycles', () => {
      // Convert DEFAULT_COLUMNS to preferences
      const preferences = columnConfigToPreferences(DEFAULT_COLUMNS);

      // Convert back to configuration
      const config = getColumnConfiguration(preferences);

      // Should match original
      expect(config).toEqual(DEFAULT_COLUMNS);
    });

    it('should handle custom configuration round-trip', () => {
      const customColumns: ColumnConfig[] = [
        ...DEFAULT_COLUMNS.map((col) => ({
          ...col,
          visible: col.id === 'genre' ? true : col.visible,
          order: col.id === 'genre' ? 0 : col.order + 1,
        })),
      ];

      customColumns.find((c) => c.id === 'genre')!.order = 0;

      const preferences = columnConfigToPreferences(customColumns);
      const result = getColumnConfiguration(preferences);

      const genreOriginal = customColumns.find((c) => c.id === 'genre');
      const genreResult = result.find((c) => c.id === 'genre');

      expect(genreResult?.visible).toBe(genreOriginal?.visible);
      expect(genreResult?.order).toBe(genreOriginal?.order);
    });
  });
});
