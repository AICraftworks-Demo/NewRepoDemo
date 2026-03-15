import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Recordings from './pages/Recordings';
import Reviews from './pages/Reviews';

const App: React.FC = () => (
  <BrowserRouter>
    <div style={{ display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', background: '#f8f9fb' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
