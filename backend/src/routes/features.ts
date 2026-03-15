import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Feature, FeatureStatus } from '../models/types';
import {
  getFeatures,
  getFeatureById,
  saveFeature,
  deleteFeature
} from '../models/store';

const router = Router();

const VALID_STATUSES: FeatureStatus[] = [
  'planned',
  'in-progress',
  'ready-to-record',
  'recorded',
  'published'
];

// GET /api/features
router.get('/', (_req: Request, res: Response) => {
  const features = getFeatures();
  res.json(features);
});

// GET /api/features/:id
router.get('/:id', (req: Request, res: Response) => {
  const feature = getFeatureById(req.params.id);
  if (!feature) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }
  res.json(feature);
});

// POST /api/features
router.post('/', (req: Request, res: Response) => {
  const { title, description, status, tags } = req.body as Partial<Feature>;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  if (!description || typeof description !== 'string') {
    res.status(400).json({ error: 'description is required' });
    return;
  }
  const resolvedStatus: FeatureStatus = status ?? 'planned';
  if (!VALID_STATUSES.includes(resolvedStatus)) {
    res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const now = new Date().toISOString();
  const feature: Feature = {
    id: `feat-${uuidv4()}`,
    title: title.trim(),
    description: description.trim(),
    status: resolvedStatus,
    tags: Array.isArray(tags) ? tags.map(String) : [],
    createdAt: now,
    updatedAt: now
  };

  const saved = saveFeature(feature);
  res.status(201).json(saved);
});

// PUT /api/features/:id
router.put('/:id', (req: Request, res: Response) => {
  const existing = getFeatureById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }

  const { title, description, status, tags } = req.body as Partial<Feature>;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const updated: Feature = {
    ...existing,
    title: title !== undefined ? String(title).trim() : existing.title,
    description: description !== undefined ? String(description).trim() : existing.description,
    status: status !== undefined ? status : existing.status,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags.map(String) : existing.tags) : existing.tags,
    updatedAt: new Date().toISOString()
  };

  const saved = saveFeature(updated);
  res.json(saved);
});

// DELETE /api/features/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteFeature(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Feature not found' });
    return;
  }
  res.status(204).send();
});

export default router;
