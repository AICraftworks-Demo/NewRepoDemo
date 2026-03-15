import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { Stats } from '../types';
import StatCard from '../components/StatCard';

const FLYWHEEL_STEPS = [
  { key: 'planned' as const, label: 'Planned', color: '#6366f1', icon: '📋' },
  { key: 'inProgress' as const, label: 'In Progress', color: '#f59e0b', icon: '🔧' },
  { key: 'readyToRecord' as const, label: 'Ready to Record', color: '#3b82f6', icon: '🎯' },
  { key: 'recorded' as const, label: 'Recorded', color: '#8b5cf6', icon: '🎬' },
  { key: 'published' as const, label: 'Published', color: '#10b981', icon: '🚀' }
];

function PipelineBar({ data }: { data: { label: string; count: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 180, padding: '0 8px' }}>
      {data.map(d => (
        <div
          key={d.label}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.count}</span>
          <div
            style={{
              width: '100%',
              height: `${Math.max((d.count / max) * 140, 4)}px`,
              background: d.color,
              borderRadius: '6px 6px 0 0',
              transition: 'height 0.4s ease'
            }}
          />
          <span style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', lineHeight: 1.2 }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ padding: 40, color: 'red' }}>Failed to load stats.</div>;

  const flywheelData = FLYWHEEL_STEPS.map(s => ({
    label: s.label,
    count: stats.flywheel[s.key],
    color: s.color,
    icon: s.icon
  }));

  return (
    <div style={{ padding: '32px 40px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>🎥 Demo Studio Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Feature Flywheel — from idea to published demo
      </p>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
        <StatCard label="Total Features" value={stats.totals.features} color="#6366f1" icon="🚀" />
        <StatCard label="Total Recordings" value={stats.totals.recordings} color="#8b5cf6" icon="🎬" />
        <StatCard label="Total Reviews" value={stats.totals.reviews} color="#3b82f6" icon="⭐" />
        <StatCard
          label="Avg. Rating"
          value={`${stats.customerExperience.averageRating} / 5`}
          color="#f59e0b"
          icon="🏆"
        />
        <StatCard
          label="Avg. CX Score"
          value={`${stats.customerExperience.averageCXScore}%`}
          color="#10b981"
          icon="💚"
        />
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Pipeline bar chart */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            flex: '1 1 400px'
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            🔄 Feature Pipeline
          </h2>
          <PipelineBar data={flywheelData} />
        </div>

        {/* CX score card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            flex: '1 1 260px'
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            💚 Customer Experience
          </h2>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Average Rating</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    style={{
                      color:
                        i <= Math.round(stats.customerExperience.averageRating)
                          ? '#f59e0b'
                          : '#e5e7eb',
                      fontSize: 20
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                {stats.customerExperience.averageRating}/5
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Avg. CX Score</div>
            <div
              style={{
                height: 12,
                background: '#f3f4f6',
                borderRadius: 6,
                overflow: 'hidden',
                marginBottom: 4
              }}
            >
              <div
                style={{
                  width: `${stats.customerExperience.averageCXScore}%`,
                  height: '100%',
                  background: '#10b981',
                  borderRadius: 6
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
              {stats.customerExperience.averageCXScore}%
            </span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Total Reviews</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>
              {stats.customerExperience.totalReviews}
            </div>
          </div>
        </div>
      </div>

      {/* Flywheel stages */}
      <div
        style={{
          marginTop: 40,
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔄 Flywheel Stages</h2>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap' }}>
          {flywheelData.map((step, i) => (
            <React.Fragment key={step.label}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: 10,
                  background: `${step.color}18`,
                  border: `2px solid ${step.color}40`,
                  minWidth: 110
                }}
              >
                <div style={{ fontSize: 26 }}>{step.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: step.color, lineHeight: 1.2 }}>
                  {step.count}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, textAlign: 'center' }}>
                  {step.label}
                </div>
              </div>
              {i < flywheelData.length - 1 && (
                <div style={{ fontSize: 20, color: '#d1d5db', padding: '0 4px' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
