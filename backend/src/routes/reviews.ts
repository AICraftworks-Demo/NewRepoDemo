import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Review, ReviewRating } from '../models/types';
import {
  getReviews,
  getReviewById,
  getReviewsByRecording,
  saveReview,
  deleteReview,
  getRecordingById
} from '../models/store';

const router = Router();

const VALID_RATINGS: ReviewRating[] = [1, 2, 3, 4, 5];

// GET /api/reviews
router.get('/', (req: Request, res: Response) => {
  const { recordingId } = req.query;
  if (typeof recordingId === 'string' && recordingId) {
    res.json(getReviewsByRecording(recordingId));
    return;
  }
  res.json(getReviews());
});

// GET /api/reviews/:id
router.get('/:id', (req: Request, res: Response) => {
  const review = getReviewById(req.params.id);
  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json(review);
});

// POST /api/reviews
router.post('/', (req: Request, res: Response) => {
  const { recordingId, reviewerName, rating, comment, customerExperienceScore } =
    req.body as Partial<Review>;

  if (!recordingId || typeof recordingId !== 'string') {
    res.status(400).json({ error: 'recordingId is required' });
    return;
  }
  if (!getRecordingById(recordingId)) {
    res.status(400).json({ error: `Recording with id '${recordingId}' not found` });
    return;
  }
  if (!reviewerName || typeof reviewerName !== 'string' || reviewerName.trim() === '') {
    res.status(400).json({ error: 'reviewerName is required' });
    return;
  }
  if (!VALID_RATINGS.includes(rating as ReviewRating)) {
    res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    return;
  }
  if (!comment || typeof comment !== 'string') {
    res.status(400).json({ error: 'comment is required' });
    return;
  }

  const score = typeof customerExperienceScore === 'number' ? customerExperienceScore : 0;
  if (score < 0 || score > 100) {
    res.status(400).json({ error: 'customerExperienceScore must be between 0 and 100' });
    return;
  }

  const review: Review = {
    id: `rev-${uuidv4()}`,
    recordingId,
    reviewerName: reviewerName.trim(),
    rating: rating as ReviewRating,
    comment: comment.trim(),
    customerExperienceScore: score,
    createdAt: new Date().toISOString()
  };

  const saved = saveReview(review);
  res.status(201).json(saved);
});

// DELETE /api/reviews/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteReview(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.status(204).send();
});

export default router;
