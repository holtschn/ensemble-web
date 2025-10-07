/**
 * Mock data for testing NDB components and utilities
 */

import { ScoreItem } from '../types';

export const mockScores: ScoreItem[] = [
  {
    id: 1,
    title: 'Test Score 1',
    composer: 'Mozart',
    arranger: 'Arranger 1',
    genre: 'Klassik',
    publisher: 'Publisher 1',
    difficulty: 'mittel',
    instrumentation: '42401',
    withPercussion: false,
    withOrgan: false,
    comment: 'Test comment 1',
    moderation: 'Test moderation 1',
    parts: 'https://example.com/parts1.pdf',
    fullScore: 'https://example.com/score1.pdf',
    audioMidi: null,
    audioMp3: null,
  },
  {
    id: 2,
    title: 'Test Score 2',
    composer: 'Beethoven',
    arranger: null,
    genre: 'Klassik',
    publisher: 'Publisher 2',
    difficulty: 'schwer',
    instrumentation: '42401',
    withPercussion: true,
    withOrgan: true,
    comment: null,
    moderation: null,
    parts: 'https://example.com/parts2.pdf',
    fullScore: null,
    audioMidi: 'https://example.com/audio2.midi',
    audioMp3: 'https://example.com/audio2.mp3',
  },
  {
    id: 3,
    title: 'Quintet Test',
    composer: 'Bach',
    arranger: 'Arranger 3',
    genre: 'Barock',
    publisher: null,
    difficulty: 'leicht',
    instrumentation: '12200', // Quintet: 1 trumpet, 2 horns, 2 trombones
    withPercussion: false,
    withOrgan: false,
    comment: 'Quintet test score',
    moderation: null,
    parts: null,
    fullScore: 'https://example.com/score3.pdf',
    audioMidi: null,
    audioMp3: null,
  },
  {
    id: 4,
    title: 'Large Ensemble',
    composer: 'Wagner',
    arranger: null,
    genre: 'Romantik',
    publisher: 'Publisher 4',
    difficulty: 'sehr schwer',
    instrumentation: '84804', // 10+ players
    withPercussion: true,
    withOrgan: false,
    comment: 'Large ensemble piece',
    moderation: 'Special instructions',
    parts: 'https://example.com/parts4.pdf',
    fullScore: 'https://example.com/score4.pdf',
    audioMidi: null,
    audioMp3: 'https://example.com/audio4.mp3',
  },
];

export const mockScore: ScoreItem = mockScores[0];

export const mockNewScore: Partial<ScoreItem> = {
  title: 'New Test Score',
  composer: 'New Composer',
  arranger: null,
  genre: 'Original',
  publisher: null,
  difficulty: 'mittel',
  instrumentation: '42401',
  withPercussion: false,
  withOrgan: false,
  comment: null,
  moderation: null,
};

export const mockUpdatedScore: ScoreItem = {
  ...mockScore,
  title: 'Updated Test Score',
  difficulty: 'schwer',
};
