import React from 'react';
import { FeatureStatus } from '../types';

const STATUS_COLORS: Record<FeatureStatus, string> = {
  planned: '#6366f1',
  'in-progress': '#f59e0b',
  'ready-to-record': '#3b82f6',
  recorded: '#8b5cf6',
  published: '#10b981'
};

const STATUS_LABELS: Record<FeatureStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  'ready-to-record': 'Ready to Record',
  recorded: 'Recorded',
  published: 'Published'
};

interface Props {
  status: FeatureStatus;
}

const FeatureStatusBadge: React.FC<Props> = ({ status }) => (
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

export default FeatureStatusBadge;
