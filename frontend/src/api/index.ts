import axios from 'axios';
import { Feature, Recording, Review, Stats } from '../types';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const api = axios.create({ baseURL: BASE });

// Features
export const getFeatures = () => api.get<Feature[]>('/api/features').then(r => r.data);
export const getFeature = (id: string) => api.get<Feature>(`/api/features/${id}`).then(r => r.data);
export const createFeature = (payload: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.post<Feature>('/api/features', payload).then(r => r.data);
export const updateFeature = (id: string, payload: Partial<Feature>) =>
  api.put<Feature>(`/api/features/${id}`, payload).then(r => r.data);
export const deleteFeature = (id: string) => api.delete(`/api/features/${id}`);

// Recordings
export const getRecordings = (featureId?: string) =>
  api
    .get<Recording[]>('/api/recordings', { params: featureId ? { featureId } : undefined })
    .then(r => r.data);
export const getRecording = (id: string) =>
  api.get<Recording>(`/api/recordings/${id}`).then(r => r.data);
export const createRecording = (payload: Omit<Recording, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.post<Recording>('/api/recordings', payload).then(r => r.data);
export const updateRecording = (id: string, payload: Partial<Recording>) =>
  api.put<Recording>(`/api/recordings/${id}`, payload).then(r => r.data);
export const deleteRecording = (id: string) => api.delete(`/api/recordings/${id}`);

// Reviews
export const getReviews = (recordingId?: string) =>
  api
    .get<Review[]>('/api/reviews', { params: recordingId ? { recordingId } : undefined })
    .then(r => r.data);
export const createReview = (payload: Omit<Review, 'id' | 'createdAt'>) =>
  api.post<Review>('/api/reviews', payload).then(r => r.data);
export const deleteReview = (id: string) => api.delete(`/api/reviews/${id}`);

// Stats
export const getStats = () => api.get<Stats>('/api/stats').then(r => r.data);
