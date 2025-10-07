/**
 * TypeScript type definitions for Notendatenbank (NDB) data structures
 */

import { GENRE_CHOICES, DIFFICULTY_CHOICES } from './constants';

// Basic choice types
export type GenreChoice = (typeof GENRE_CHOICES)[number];
export type DifficultyChoice = (typeof DIFFICULTY_CHOICES)[number];

// File-related types
export interface ScoreFileItem {
  key: string;
  filename: string;
  scoreId: string;
}

// Core score data structure
export interface ScoreItem {
  id: number;
  title: string;
  composer: string;
  arranger: string | null;
  genre: string | null;
  publisher: string | null;
  difficulty: string | null;
  instrumentation: string;
  withOrgan: boolean;
  withPercussion: boolean;
  comment: string | null;
  moderation: string | null;
  parts: ScoreFileItem | null;
  fullScore: ScoreFileItem | null;
  audioMidi: ScoreFileItem | null;
  audioMp3: ScoreFileItem | null;
}

// Extended score item with upload keys for create/update operations
export interface ScoreItemWithUploads extends ScoreItem {
  partsUploadS3Key: string | null;
  fullScoreUploadS3Key: string | null;
  audioMidiUploadS3Key: string | null;
  audioMp3UploadS3Key: string | null;
}

// Sample/demo data structures
export interface ScoreSampleItem {
  url: string;
  title: string;
  image: string;
}

export interface ScoreSampleCollection {
  scoreId: number;
  spotify: ScoreSampleItem[];
  youtube: ScoreSampleItem[];
}

// Setlist-related types

/**
 * Player allocation for a specific part in a score.
 * Used in setlist items to assign players to instrument parts.
 */
export interface PlayerAllocation {
  part: string;      // e.g., "trp1", "hrn2", "custom-part"
  player: string;    // Free-text player name
}

/**
 * A single score item within a setlist.
 * Represents one score with its position and player allocations.
 */
export interface SetlistScoreItem {
  score: number;                      // Score ID
  order: number;                      // Position in setlist (0-based)
  allocations: PlayerAllocation[];    // Player assignments for this score
}

/**
 * Complete setlist with all metadata and items.
 * This is the main data structure for setlist management.
 */
export interface SetlistItem {
  id: number;
  displayName: string;
  items: SetlistScoreItem[];
}

/**
 * Request payload for creating a new setlist.
 */
export interface CreateSetlistRequest {
  displayName: string;
  items: SetlistScoreItem[];
}

/**
 * Response from creating a new setlist.
 */
export interface CreateSetlistResponse {
  id: number;
}

/**
 * Request payload for updating an existing setlist.
 * Both displayName and items are optional - you can update just the name or just the items.
 */
export interface UpdateSetlistRequest {
  setlistId: number;
  displayName?: string;
  items?: SetlistScoreItem[];
}

/**
 * Request payload for downloading a setlist as a ZIP file.
 */
export interface DownloadSetlistRequest {
  setlistId: number;
  fileType: 'parts' | 'fullScore';
}

/**
 * Response from download setlist endpoint.
 */
export interface DownloadSetlistResponse {
  url: string;  // Presigned S3 URL
}

/**
 * Custom error class for API-related errors.
 * This allows for structured error handling with status codes.
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
