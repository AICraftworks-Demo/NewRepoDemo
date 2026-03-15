import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Recording, RecordingStatus } from '../models/types';
import {
  getRecordings,
  getRecordingById,
  getRecordingsByFeature,
  saveRecording,
  deleteRecording,
  getFeatureById
} from '../models/store';

const router = Router();

const VALID_STATUSES: RecordingStatus[] = ['draft', 'review', 'approved', 'published'];

// GET /api/recordings
router.get('/', (req: Request, res: Response) => {
  const { featureId } = req.query;
  if (typeof featureId === 'string' && featureId) {
    res.json(getRecordingsByFeature(featureId));
    return;
  }
  res.json(getRecordings());
});

// GET /api/recordings/:id
router.get('/:id', (req: Request, res: Response) => {
  const recording = getRecordingById(req.params.id);
  if (!recording) {
    res.status(404).json({ error: 'Recording not found' });
    return;
  }
  res.json(recording);
});

// POST /api/recordings
router.post('/', (req: Request, res: Response) => {
  const { featureId, title, description, url, thumbnailUrl, durationSeconds, status } =
    req.body as Partial<Recording>;

  if (!featureId || typeof featureId !== 'string') {
    res.status(400).json({ error: 'featureId is required' });
    return;
  }
  if (!getFeatureById(featureId)) {
    res.status(400).json({ error: `Feature with id '${featureId}' not found` });
    return;
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  if (!description || typeof description !== 'string') {
    res.status(400).json({ error: 'description is required' });
    return;
  }
  if (!url || typeof url !== 'string' || url.trim() === '') {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  const resolvedStatus: RecordingStatus = status ?? 'draft';
  if (!VALID_STATUSES.includes(resolvedStatus)) {
    res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const now = new Date().toISOString();
  const recording: Recording = {
    id: `rec-${uuidv4()}`,
    featureId,
    title: title.trim(),
    description: description.trim(),
    url: url.trim(),
    thumbnailUrl: typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : '',
    durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : 0,
    status: resolvedStatus,
    createdAt: now,
    updatedAt: now
  };

  const saved = saveRecording(recording);
  res.status(201).json(saved);
});

// PUT /api/recordings/:id
router.put('/:id', (req: Request, res: Response) => {
  const existing = getRecordingById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Recording not found' });
    return;
  }

  const { title, description, url, thumbnailUrl, durationSeconds, status } =
    req.body as Partial<Recording>;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const updated: Recording = {
    ...existing,
    title: title !== undefined ? String(title).trim() : existing.title,
    description: description !== undefined ? String(description).trim() : existing.description,
    url: url !== undefined ? String(url).trim() : existing.url,
    thumbnailUrl: thumbnailUrl !== undefined ? String(thumbnailUrl).trim() : existing.thumbnailUrl,
    durationSeconds:
      durationSeconds !== undefined ? Number(durationSeconds) : existing.durationSeconds,
    status: status !== undefined ? status : existing.status,
    updatedAt: new Date().toISOString()
  };

  const saved = saveRecording(updated);
  res.json(saved);
});

// DELETE /api/recordings/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteRecording(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Recording not found' });
    return;
  }
  res.status(204).send();
});

export default router;
