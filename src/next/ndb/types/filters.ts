/**
 * Filter types and state management for scores table
 */

import { ScoreColumnId } from './columns';

export type FilterType = 'text' | 'select' | 'boolean' | 'file';

export interface TextFilterValue {
  type: 'text';
  value: string;
}

export interface SelectFilterValue {
  type: 'select';
  value: string; // Selected option value
}

export interface BooleanFilterValue {
  type: 'boolean';
  value: boolean; // true = has, false = doesn't have
}

export interface FileFilterValue {
  type: 'file';
  value: boolean; // true = has file, false = no file
}

export type FilterValue = TextFilterValue | SelectFilterValue | BooleanFilterValue | FileFilterValue;

export interface ColumnFilter {
  columnId: ScoreColumnId;
  filterType: FilterType;
  value: FilterValue;
}

export type FilterState = {
  [key in ScoreColumnId]?: FilterValue;
};

/**
 * Check if a filter value is active (has meaningful content)
 */
export function isFilterActive(value?: FilterValue): boolean {
  if (!value) return false;

  switch (value.type) {
    case 'text':
      return value.value.trim().length > 0;
    case 'select':
      return value.value.length > 0;
    case 'boolean':
    case 'file':
      return true; // Boolean/file filters are always "active" if they exist
    default:
      return false;
  }
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: FilterState): number {
  return Object.values(filters).filter(isFilterActive).length;
}
