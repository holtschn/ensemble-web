/**
 * Configuration constants for Notendatenbank (NDB) integration
 */

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
  'Volksmusik',
] as const;

export const DIFFICULTY_CHOICES = ['', 'sehr leicht', 'leicht', 'mittel', 'schwer', 'sehr schwer'] as const;

// Default Instrumentation (Brass quintet: 4 trumpets, 2 horns, 4 trombones, 0 euphoniums, 1 tuba)
export const DEFAULT_INSTRUMENTATION = '42401';

// File Types
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'midi'] as const;
export const SUPPORTED_SCORE_FORMATS = ['pdf'] as const;

// The base URL (proxy within this project) for the NDB API
export const API_BASE = '/api/ndb/';

// API Endpoints
export const API_ENDPOINTS = {
  SCORES: 'scores',
  SCORE: 'score',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  SCORE_SAMPLES: 'scoreinfo/samples',
  PLAYERS: 'players',
  SETLISTS: 'setlists',
  SETLIST: 'setlist',
  DOWNLOAD_SETLIST: 'download/setlist',
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
  SETLIST_CREATED: 'Setlist erfolgreich erstellt',
  SETLIST_UPDATED: 'Setlist erfolgreich aktualisiert',
  SETLIST_DOWNLOADED: 'Setlist wird heruntergeladen...',
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

export type GenreChoice = (typeof GENRE_CHOICES)[number];
export type DifficultyChoice = (typeof DIFFICULTY_CHOICES)[number];
export type AudioFormat = (typeof SUPPORTED_AUDIO_FORMATS)[number];
export type ScoreFormat = (typeof SUPPORTED_SCORE_FORMATS)[number];
