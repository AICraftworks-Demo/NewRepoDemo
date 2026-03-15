import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = '#6366f1', icon }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 12,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`,
      minWidth: 160
    }}
  >
    <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
  </div>
);

export default StatCard;
