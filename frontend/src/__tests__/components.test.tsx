import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureStatusBadge from '../components/FeatureStatusBadge';
import RecordingStatusBadge from '../components/RecordingStatusBadge';
import StatCard from '../components/StatCard';

describe('FeatureStatusBadge', () => {
  it('renders planned status', () => {
    render(<FeatureStatusBadge status="planned" />);
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });

  it('renders published status', () => {
    render(<FeatureStatusBadge status="published" />);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders in-progress status', () => {
    render(<FeatureStatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
});

describe('RecordingStatusBadge', () => {
  it('renders draft status', () => {
    render(<RecordingStatusBadge status="draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders published status', () => {
    render(<RecordingStatusBadge status="published" />);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Features" value={42} />);
    expect(screen.getByText('Total Features')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatCard label="Avg. Rating" value="4.5 / 5" />);
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatCard label="Features" value={5} icon="🚀" />);
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });
});
