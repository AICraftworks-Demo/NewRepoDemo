import { Router, Request, Response } from 'express';
import { getFeatures, getRecordings, getReviews } from '../models/store';
import { FeatureStatus, RecordingStatus } from '../models/types';

const router = Router();

// GET /api/stats
router.get('/', (_req: Request, res: Response) => {
  const features = getFeatures();
  const recordings = getRecordings();
  const reviews = getReviews();

  const featuresByStatus = features.reduce<Record<FeatureStatus, number>>(
    (acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    },
    {} as Record<FeatureStatus, number>
  );

  const recordingsByStatus = recordings.reduce<Record<RecordingStatus, number>>(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<RecordingStatus, number>
  );

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const avgCXScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.customerExperienceScore, 0) / reviews.length
      : 0;

  res.json({
    totals: {
      features: features.length,
      recordings: recordings.length,
      reviews: reviews.length
    },
    featuresByStatus,
    recordingsByStatus,
    customerExperience: {
      averageRating: Math.round(avgRating * 10) / 10,
      averageCXScore: Math.round(avgCXScore * 10) / 10,
      totalReviews: reviews.length
    },
    flywheel: {
      planned: featuresByStatus['planned'] || 0,
      inProgress: featuresByStatus['in-progress'] || 0,
      readyToRecord: featuresByStatus['ready-to-record'] || 0,
      recorded: featuresByStatus['recorded'] || 0,
      published: featuresByStatus['published'] || 0
    }
  });
});

export default router;
