import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '📊 Dashboard' },
  { to: '/features', label: '🚀 Features' },
  { to: '/recordings', label: '🎬 Recordings' },
  { to: '/reviews', label: '⭐ Reviews' }
];

const Sidebar: React.FC = () => (
  <nav
    style={{
      width: 220,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      padding: '28px 0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0
    }}
  >
    <div
      style={{
        padding: '0 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: 16
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
        🎥 Demo Studio
      </div>
      <div style={{ fontSize: 11, color: '#a5b4fc', marginTop: 4 }}>
        Feature Flywheel Platform
      </div>
    </div>
    {links.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        style={({ isActive }) => ({
          display: 'block',
          padding: '10px 24px',
          color: isActive ? '#fff' : '#c7d2fe',
          textDecoration: 'none',
          fontWeight: isActive ? 700 : 400,
          background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
          borderLeft: isActive ? '3px solid #a5b4fc' : '3px solid transparent',
          fontSize: 14,
          transition: 'all 0.15s'
        })}
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default Sidebar;
