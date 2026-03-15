import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import app from '../app';

const DATA_FILE = path.join(__dirname, '..', 'data', 'studio.json');

function cleanDataFile() {
  if (fs.existsSync(DATA_FILE)) {
    fs.unlinkSync(DATA_FILE);
  }
}

describe('Health check', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Features API', () => {
  beforeEach(cleanDataFile);
  afterAll(cleanDataFile);

  it('GET /api/features returns array', async () => {
    const res = await request(app).get('/api/features');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/features creates a feature', async () => {
    const res = await request(app).post('/api/features').send({
      title: 'Test Feature',
      description: 'A test feature description',
      status: 'planned',
      tags: ['test']
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Feature');
    expect(res.body.status).toBe('planned');
    expect(res.body.id).toBeTruthy();
  });

  it('POST /api/features returns 400 when title missing', async () => {
    const res = await request(app).post('/api/features').send({
      description: 'Missing title'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/);
  });

  it('GET /api/features/:id returns feature', async () => {
    const created = await request(app).post('/api/features').send({
      title: 'Another Feature',
      description: 'Description'
    });
    const res = await request(app).get(`/api/features/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Another Feature');
  });

  it('GET /api/features/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/features/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('PUT /api/features/:id updates a feature', async () => {
    const created = await request(app).post('/api/features').send({
      title: 'Old Title',
      description: 'Old Description'
    });
    const res = await request(app)
      .put(`/api/features/${created.body.id}`)
      .send({ title: 'New Title', status: 'in-progress' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
    expect(res.body.status).toBe('in-progress');
  });

  it('DELETE /api/features/:id deletes a feature', async () => {
    const created = await request(app).post('/api/features').send({
      title: 'To Delete',
      description: 'Will be deleted'
    });
    const del = await request(app).delete(`/api/features/${created.body.id}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/api/features/${created.body.id}`);
    expect(get.status).toBe(404);
  });
});

describe('Recordings API', () => {
  beforeEach(cleanDataFile);
  afterAll(cleanDataFile);

  it('GET /api/recordings returns array', async () => {
    const res = await request(app).get('/api/recordings');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/recordings creates a recording', async () => {
    const res = await request(app).post('/api/recordings').send({
      featureId: 'feat-001',
      title: 'Test Recording',
      description: 'A test recording',
      url: 'https://example.com/rec',
      durationSeconds: 120,
      status: 'draft'
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Recording');
    expect(res.body.featureId).toBe('feat-001');
  });

  it('POST /api/recordings returns 400 for unknown featureId', async () => {
    const res = await request(app).post('/api/recordings').send({
      featureId: 'feat-unknown',
      title: 'Bad Recording',
      description: 'Feature does not exist',
      url: 'https://example.com/rec'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Feature/);
  });

  it('GET /api/recordings?featureId filters by feature', async () => {
    const res = await request(app).get('/api/recordings?featureId=feat-001');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((r: { featureId: string }) => {
      expect(r.featureId).toBe('feat-001');
    });
  });
});

describe('Reviews API', () => {
  beforeEach(cleanDataFile);
  afterAll(cleanDataFile);

  it('GET /api/reviews returns array', async () => {
    const res = await request(app).get('/api/reviews');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/reviews creates a review', async () => {
    const res = await request(app).post('/api/reviews').send({
      recordingId: 'rec-001',
      reviewerName: 'Test Reviewer',
      rating: 5,
      comment: 'Great demo!',
      customerExperienceScore: 90
    });
    expect(res.status).toBe(201);
    expect(res.body.reviewerName).toBe('Test Reviewer');
    expect(res.body.rating).toBe(5);
  });

  it('POST /api/reviews returns 400 for invalid rating', async () => {
    const res = await request(app).post('/api/reviews').send({
      recordingId: 'rec-001',
      reviewerName: 'Test Reviewer',
      rating: 6,
      comment: 'Bad rating value',
      customerExperienceScore: 50
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rating/);
  });

  it('POST /api/reviews returns 400 for invalid CX score', async () => {
    const res = await request(app).post('/api/reviews').send({
      recordingId: 'rec-001',
      reviewerName: 'Test Reviewer',
      rating: 4,
      comment: 'Score out of range',
      customerExperienceScore: 150
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/customerExperienceScore/);
  });
});

describe('Stats API', () => {
  beforeEach(cleanDataFile);
  afterAll(cleanDataFile);

  it('GET /api/stats returns stats object', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totals');
    expect(res.body).toHaveProperty('flywheel');
    expect(res.body).toHaveProperty('customerExperience');
    expect(res.body.totals.features).toBeGreaterThan(0);
  });
});
