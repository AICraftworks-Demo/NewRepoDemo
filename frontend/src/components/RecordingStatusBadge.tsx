import React from 'react';
import { RecordingStatus } from '../types';

const STATUS_COLORS: Record<RecordingStatus, string> = {
  draft: '#6b7280',
  review: '#f59e0b',
  approved: '#3b82f6',
  published: '#10b981'
};

const STATUS_LABELS: Record<RecordingStatus, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  published: 'Published'
};

interface Props {
  status: RecordingStatus;
}

const RecordingStatusBadge: React.FC<Props> = ({ status }) => (
  <span
    style={{
      backgroundColor: STATUS_COLORS[status],
      color: '#fff',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block'
    }}
  >
    {STATUS_LABELS[status]}
  </span>
);

export default RecordingStatusBadge;
