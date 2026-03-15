import * as fs from 'fs';
import * as path from 'path';
import { StudioData, Feature, Recording, Review } from './types';

const DATA_FILE = path.join(__dirname, '..', 'data', 'studio.json');

const defaultData: StudioData = {
  features: [
    {
      id: 'feat-001',
      title: 'Real-time Code Collaboration',
      description: 'Enable multiple developers to edit code simultaneously with live cursor tracking.',
      status: 'recorded',
      tags: ['collaboration', 'realtime', 'editor'],
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-02-15T14:30:00.000Z'
    },
    {
      id: 'feat-002',
      title: 'AI-Powered Code Suggestions',
      description: 'Intelligent code completions and suggestions powered by a large language model.',
      status: 'published',
      tags: ['AI', 'autocomplete', 'productivity'],
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-02-20T16:00:00.000Z'
    },
    {
      id: 'feat-003',
      title: 'One-click Demo Recording',
      description: 'Record your screen and code together with automatic chapter markers at key moments.',
      status: 'in-progress',
      tags: ['recording', 'screen-capture', 'demo'],
      createdAt: '2026-02-01T08:00:00.000Z',
      updatedAt: '2026-03-01T11:00:00.000Z'
    },
    {
      id: 'feat-004',
      title: 'Customer Experience Dashboard',
      description: 'Aggregated view of all customer feedback and experience scores across recordings.',
      status: 'planned',
      tags: ['analytics', 'customer-experience', 'dashboard'],
      createdAt: '2026-03-01T09:00:00.000Z',
      updatedAt: '2026-03-01T09:00:00.000Z'
    }
  ],
  recordings: [
    {
      id: 'rec-001',
      featureId: 'feat-001',
      title: 'Real-time Collaboration Demo',
      description: 'Walk-through of real-time code collaboration between two developers.',
      url: 'https://example.com/recordings/rec-001',
      thumbnailUrl: 'https://example.com/thumbnails/rec-001.png',
      durationSeconds: 180,
      status: 'approved',
      createdAt: '2026-02-16T10:00:00.000Z',
      updatedAt: '2026-02-20T12:00:00.000Z'
    },
    {
      id: 'rec-002',
      featureId: 'feat-002',
      title: 'AI Suggestions in Action',
      description: 'Demonstration of AI-powered suggestions as a developer writes a REST API.',
      url: 'https://example.com/recordings/rec-002',
      thumbnailUrl: 'https://example.com/thumbnails/rec-002.png',
      durationSeconds: 240,
      status: 'published',
      createdAt: '2026-02-22T14:00:00.000Z',
      updatedAt: '2026-03-01T09:00:00.000Z'
    }
  ],
  reviews: [
    {
      id: 'rev-001',
      recordingId: 'rec-001',
      reviewerName: 'Alice Johnson',
      rating: 5,
      comment: 'Incredible feature! The real-time sync is seamless and the demo is very clear.',
      customerExperienceScore: 95,
      createdAt: '2026-02-21T15:00:00.000Z'
    },
    {
      id: 'rev-002',
      recordingId: 'rec-002',
      reviewerName: 'Bob Martinez',
      rating: 4,
      comment: 'The AI suggestions are impressive. Would love to see more complex code examples.',
      customerExperienceScore: 82,
      createdAt: '2026-03-02T11:00:00.000Z'
    },
    {
      id: 'rev-003',
      recordingId: 'rec-002',
      reviewerName: 'Carol White',
      rating: 5,
      comment: 'This completely changed how I write boilerplate code. Excellent demo quality.',
      customerExperienceScore: 98,
      createdAt: '2026-03-05T09:30:00.000Z'
    }
  ]
};

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

export function readData(): StudioData {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as StudioData;
}

export function writeData(data: StudioData): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getFeatures(): Feature[] {
  return readData().features;
}

export function getFeatureById(id: string): Feature | undefined {
  return readData().features.find(f => f.id === id);
}

export function saveFeature(feature: Feature): Feature {
  const data = readData();
  const idx = data.features.findIndex(f => f.id === feature.id);
  if (idx >= 0) {
    data.features[idx] = feature;
  } else {
    data.features.push(feature);
  }
  writeData(data);
  return feature;
}

export function deleteFeature(id: string): boolean {
  const data = readData();
  const idx = data.features.findIndex(f => f.id === id);
  if (idx < 0) return false;
  data.features.splice(idx, 1);
  writeData(data);
  return true;
}

export function getRecordings(): Recording[] {
  return readData().recordings;
}

export function getRecordingById(id: string): Recording | undefined {
  return readData().recordings.find(r => r.id === id);
}

export function getRecordingsByFeature(featureId: string): Recording[] {
  return readData().recordings.filter(r => r.featureId === featureId);
}

export function saveRecording(recording: Recording): Recording {
  const data = readData();
  const idx = data.recordings.findIndex(r => r.id === recording.id);
  if (idx >= 0) {
    data.recordings[idx] = recording;
  } else {
    data.recordings.push(recording);
  }
  writeData(data);
  return recording;
}

export function deleteRecording(id: string): boolean {
  const data = readData();
  const idx = data.recordings.findIndex(r => r.id === id);
  if (idx < 0) return false;
  data.recordings.splice(idx, 1);
  writeData(data);
  return true;
}

export function getReviews(): Review[] {
  return readData().reviews;
}

export function getReviewById(id: string): Review | undefined {
  return readData().reviews.find(r => r.id === id);
}

export function getReviewsByRecording(recordingId: string): Review[] {
  return readData().reviews.filter(r => r.recordingId === recordingId);
}

export function saveReview(review: Review): Review {
  const data = readData();
  const idx = data.reviews.findIndex(r => r.id === review.id);
  if (idx >= 0) {
    data.reviews[idx] = review;
  } else {
    data.reviews.push(review);
  }
  writeData(data);
  return review;
}

export function deleteReview(id: string): boolean {
  const data = readData();
  const idx = data.reviews.findIndex(r => r.id === id);
  if (idx < 0) return false;
  data.reviews.splice(idx, 1);
  writeData(data);
  return true;
}
