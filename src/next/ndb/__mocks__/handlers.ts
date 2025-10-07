/**
 * MSW (Mock Service Worker) handlers for NDB API endpoints
 * These handlers intercept fetch requests in tests and return mock data
 */

import { http, HttpResponse } from 'msw';
import { mockScores, mockScore, mockUpdatedScore } from './mockData';

const API_BASE = '/api/ndb';

export const handlers = [
  // GET /api/ndb/scores - Get all scores
  http.get(`${API_BASE}/scores`, () => {
    return HttpResponse.json(mockScores);
  }),

  // GET /api/ndb/score/:id - Get a single score
  http.get(`${API_BASE}/score/:id`, ({ params }) => {
    const { id } = params;
    const score = mockScores.find((s) => s.id === Number(id));

    if (!score) {
      return HttpResponse.json({ error: 'Score not found' }, { status: 404 });
    }

    return HttpResponse.json(score);
  }),

  // POST /api/ndb/score - Create a new score
  http.post(`${API_BASE}/score`, async ({ request }) => {
    const body = await request.json();
    const newScore = {
      id: mockScores.length + 1,
      ...body,
    };

    return HttpResponse.json(newScore, { status: 201 });
  }),

  // PUT /api/ndb/score/:id - Update a score
  http.put(`${API_BASE}/score/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const score = mockScores.find((s) => s.id === Number(id));

    if (!score) {
      return HttpResponse.json({ error: 'Score not found' }, { status: 404 });
    }

    const updatedScore = {
      ...score,
      ...body,
    };

    return HttpResponse.json(updatedScore);
  }),

  // DELETE /api/ndb/score/:id - Delete a score
  http.delete(`${API_BASE}/score/:id`, ({ params }) => {
    const { id } = params;
    const score = mockScores.find((s) => s.id === Number(id));

    if (!score) {
      return HttpResponse.json({ error: 'Score not found' }, { status: 404 });
    }

    return HttpResponse.json({ success: true });
  }),

  // GET /api/ndb/download/:type/:id - Download a file
  http.get(`${API_BASE}/download/:type/:id`, ({ params }) => {
    const { type, id } = params;

    // Return a mock blob response
    const blob = new Blob(['mock file content'], { type: 'application/pdf' });
    return HttpResponse.arrayBuffer(blob as any);
  }),

  // POST /api/ndb/upload - Upload a file
  http.post(`${API_BASE}/upload`, async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return HttpResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    return HttpResponse.json({
      url: 'https://example.com/uploaded-file.pdf',
      filename: 'test-file.pdf',
    });
  }),

  // GET /api/ndb/scoreinfo/samples/:id - Get score samples
  http.get(`${API_BASE}/scoreinfo/samples/:id`, ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      spotify: 'https://open.spotify.com/track/test',
      youtube: 'https://www.youtube.com/watch?v=test',
    });
  }),

  // GET /api/ndb/players - Get all players
  http.get(`${API_BASE}/players`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Player 1',
        instruments: ['Trumpet'],
      },
      {
        id: 2,
        name: 'Player 2',
        instruments: ['Horn'],
      },
    ]);
  }),
];

/**
 * Error handlers for testing error states
 */
export const errorHandlers = [
  // Network error
  http.get(`${API_BASE}/scores`, () => {
    return HttpResponse.error();
  }),

  // 404 error
  http.get(`${API_BASE}/score/:id`, () => {
    return HttpResponse.json({ error: 'Score not found' }, { status: 404 });
  }),

  // 500 error
  http.post(`${API_BASE}/score`, () => {
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }),
];
