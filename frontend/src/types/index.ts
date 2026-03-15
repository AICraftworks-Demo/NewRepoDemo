export type FeatureStatus = 'planned' | 'in-progress' | 'ready-to-record' | 'recorded' | 'published';
export type RecordingStatus = 'draft' | 'review' | 'approved' | 'published';
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Recording {
  id: string;
  featureId: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  durationSeconds: number;
  status: RecordingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  recordingId: string;
  reviewerName: string;
  rating: ReviewRating;
  comment: string;
  customerExperienceScore: number;
  createdAt: string;
}

export interface Stats {
  totals: {
    features: number;
    recordings: number;
    reviews: number;
  };
  featuresByStatus: Partial<Record<FeatureStatus, number>>;
  recordingsByStatus: Partial<Record<RecordingStatus, number>>;
  customerExperience: {
    averageRating: number;
    averageCXScore: number;
    totalReviews: number;
  };
  flywheel: {
    planned: number;
    inProgress: number;
    readyToRecord: number;
    recorded: number;
    published: number;
  };
}
