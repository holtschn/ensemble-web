/**
 * Tests for filter type utilities
 */

import { isFilterActive, type FilterValue } from './filters';

describe('Filter Utilities', () => {
  describe('isFilterActive', () => {
    it('should return false for undefined filter value', () => {
      expect(isFilterActive(undefined)).toBe(false);
    });

    it('should return false for text filter with empty string', () => {
      const filter: FilterValue = { type: 'text', value: '' };
      expect(isFilterActive(filter)).toBe(false);
    });

    it('should return false for text filter with only whitespace', () => {
      const filter: FilterValue = { type: 'text', value: '   ' };
      expect(isFilterActive(filter)).toBe(false);
    });

    it('should return true for text filter with non-empty value', () => {
      const filter: FilterValue = { type: 'text', value: 'test' };
      expect(isFilterActive(filter)).toBe(true);
    });

    it('should return false for select filter with empty value', () => {
      const filter: FilterValue = { type: 'select', value: '' };
      expect(isFilterActive(filter)).toBe(false);
    });

    it('should return true for select filter with non-empty value', () => {
      const filter: FilterValue = { type: 'select', value: 'Klassik' };
      expect(isFilterActive(filter)).toBe(true);
    });

    it('should return true for boolean filter with true value', () => {
      const filter: FilterValue = { type: 'boolean', value: true };
      expect(isFilterActive(filter)).toBe(true);
    });

    it('should return true for boolean filter with false value', () => {
      const filter: FilterValue = { type: 'boolean', value: false };
      expect(isFilterActive(filter)).toBe(true);
    });

    it('should return true for file filter with true value', () => {
      const filter: FilterValue = { type: 'file', value: true };
      expect(isFilterActive(filter)).toBe(true);
    });

    it('should return true for file filter with false value', () => {
      const filter: FilterValue = { type: 'file', value: false };
      expect(isFilterActive(filter)).toBe(true);
    });
  });
});
