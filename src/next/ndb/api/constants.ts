/**
 * Configuration constants for Notendatenbank (NDB) integration
 */

// API Configuration
export const NDB_API_BASE_URL = process.env.NDB_API_URL || '';
export const NDB_USERNAME = process.env.NDB_USERNAME || '';
export const NDB_PASSWORD = process.env.NDB_PASSWORD || '';

// Authentication Headers
export const createAuthHeaders = () => {
  const credentials = btoa(`${NDB_USERNAME}:${NDB_PASSWORD}`);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${credentials}`,
  };
};

// Music Constants
export const GENRE_CHOICES = [
  '',
  'Barock',
  'Filmmusik',
  'Klassik',
  'Moderne',
  'Musical',
  'Original',
  'Pop',
  'Renaissance',
  'Romantik',
  'Volksmusik'
] as const;

export const DIFFICULTY_CHOICES = [
  '',
  'sehr leicht',
  'leicht',
  'mittel',
  'schwer',
  'sehr schwer'
] as const;

// Default Instrumentation (Brass quintet: 4 trumpets, 2 horns, 4 trombones, 0 euphoniums, 1 tuba)
export const DEFAULT_INSTRUMENTATION = '42401';

// File Types
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'midi'] as const;
export const SUPPORTED_SCORE_FORMATS = ['pdf'] as const;

// API Endpoints
export const API_ENDPOINTS = {
  SCORES: 'scores',
  SCORE: 'score',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  UPLOAD_ANALYSIS: 'upload',
  SCORE_SAMPLES: 'scoreinfo/samples',
  PLAYERS: 'players',
} as const;

// UI Constants
export const ITEMS_PER_PAGE = 20;
export const SEARCH_DEBOUNCE_MS = 300;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Netzwerkfehler - bitte versuchen Sie es später erneut',
  AUTH_ERROR: 'Authentifizierung fehlgeschlagen',
  UPLOAD_ERROR: 'Datei konnte nicht hochgeladen werden',
  DOWNLOAD_ERROR: 'Datei konnte nicht heruntergeladen werden',
  SAVE_ERROR: 'Änderungen konnten nicht gespeichert werden',
  LOAD_ERROR: 'Daten konnten nicht geladen werden',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SCORE_CREATED: 'Noten erfolgreich erstellt',
  SCORE_UPDATED: 'Noten erfolgreich aktualisiert',
  FILE_UPLOADED: 'Datei erfolgreich hochgeladen',
} as const;

// Field Names (German labels)
export const FIELD_LABELS = {
  title: 'Titel',
  composer: 'Komponist',
  arranger: 'Arrangeur',
  genre: 'Genre',
  publisher: 'Verlag',
  difficulty: 'Schwierigkeit',
  instrumentation: 'Besetzung',
  withPercussion: 'mit Schlagzeug',
  withOrgan: 'mit Orgel',
  comment: 'Kommentar',
  moderation: 'Moderation',
  parts: 'Stimmen (PDF Upload)',
  fullScore: 'Partitur (PDF Upload)',
  audioMidi: 'Audio (MIDI Upload)',
  audioMp3: 'Audio (MP3 Upload)',
} as const;

// Quick Filters
export const QUICK_FILTERS = {
  MIN_HORNS: { field: 'instNumHorns', operator: '>=', value: 2, label: 'mind. 2 Hörner' },
  WITH_PERCUSSION: { field: 'withPercussion', operator: 'is', value: 'true', label: 'mit Schlagzeug' },
  HAS_FULL_SCORE: { field: 'fullScore', operator: 'isNotEmpty', label: 'hat Partitur' },
  QUINTET: { field: 'instNumTotal', operator: '=', value: 5, label: 'Quintett' },
} as const;

export type GenreChoice = typeof GENRE_CHOICES[number];
export type DifficultyChoice = typeof DIFFICULTY_CHOICES[number];
export type AudioFormat = typeof SUPPORTED_AUDIO_FORMATS[number];
export type ScoreFormat = typeof SUPPORTED_SCORE_FORMATS[number];
