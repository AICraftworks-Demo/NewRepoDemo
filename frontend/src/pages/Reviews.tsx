import React, { useEffect, useState } from 'react';
import { getReviews, getRecordings, createReview, deleteReview } from '../api';
import { Review, Recording, ReviewRating } from '../types';

const STAR_COLORS = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{ color: i <= rating ? '#f59e0b' : '#e5e7eb', fontSize: 16 }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function CXScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 100,
          height: 8,
          background: '#f3f4f6',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <div
          style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 4 }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}%</span>
    </div>
  );
}

const emptyForm = {
  recordingId: '',
  reviewerName: '',
  rating: 5 as ReviewRating,
  comment: '',
  customerExperienceScore: 0
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterRecording, setFilterRecording] = useState('');

  const load = async () => {
    const [revs, recs] = await Promise.all([getReviews(), getRecordings()]);
    setReviews(revs);
    setRecordings(recs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const recordingMap = React.useMemo(
    () => Object.fromEntries(recordings.map(r => [r.id, r])),
    [recordings]
  );

  const filtered = filterRecording
    ? reviews.filter(r => r.recordingId === filterRecording)
    : reviews;

  const avgRating =
    filtered.length > 0
      ? Math.round((filtered.reduce((s, r) => s + r.rating, 0) / filtered.length) * 10) / 10
      : 0;
  const avgCX =
    filtered.length > 0
      ? Math.round(
          (filtered.reduce((s, r) => s + r.customerExperienceScore, 0) / filtered.length) * 10
        ) / 10
      : 0;

  const openCreate = () => {
    setForm({ ...emptyForm, recordingId: recordings[0]?.id || '' });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const created = await createReview(form);
      setReviews(prev => [created, ...prev]);
      setShowForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    await deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading reviews...</div>;

  return (
    <div style={{ padding: '32px 40px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>⭐ Reviews</h1>
          <p style={{ color: '#6b7280' }}>Customer experience reviews for demo recordings</p>
        </div>
        <button
          onClick={openCreate}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          + Add Review
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '14px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #f59e0b'
          }}
        >
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Avg. Rating</div>
          <Stars rating={Math.round(avgRating)} />
          <span style={{ fontSize: 13, fontWeight: 700, marginLeft: 6 }}>{avgRating} / 5</span>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '14px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #10b981'
          }}
        >
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Avg. CX Score</div>
          <CXScoreBar score={avgCX} />
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '14px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #6366f1'
          }}
        >
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Total Reviews</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#6366f1' }}>{filtered.length}</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={filterRecording}
          onChange={e => setFilterRecording(e.target.value)}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          <option value="">All Recordings</option>
          {recordings.map(r => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            marginBottom: 24,
            maxWidth: 520
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>New Review</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Recording *</label>
              <select
                style={inputStyle}
                value={form.recordingId}
                onChange={e => setForm(p => ({ ...p, recordingId: e.target.value }))}
                required
              >
                {recordings.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Your Name *</label>
              <input
                style={inputStyle}
                value={form.reviewerName}
                onChange={e => setForm(p => ({ ...p, reviewerName: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Rating (1–5) *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([1, 2, 3, 4, 5] as ReviewRating[]).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, rating: n }))}
                    style={{
                      fontSize: 22,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: n <= form.rating ? '#f59e0b' : '#e5e7eb',
                      padding: 0
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Comment *</label>
              <textarea
                style={{ ...inputStyle, height: 72, resize: 'vertical' }}
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                Customer Experience Score (0–100): <strong>{form.customerExperienceScore}</strong>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.customerExperienceScore}
                onChange={e =>
                  setForm(p => ({ ...p, customerExperienceScore: parseInt(e.target.value, 10) }))
                }
                style={{ width: '100%' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: '#9ca3af'
                }}
              >
                <span>0 — Poor</span>
                <span>100 — Excellent</span>
              </div>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <p style={{ color: '#9ca3af' }}>No reviews yet. Be the first to review a recording!</p>
        )}
        {filtered.map(r => (
          <div
            key={r.id}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '16px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `hsl(${r.reviewerName.charCodeAt(0) * 5}, 60%, 60%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                flexShrink: 0
              }}
            >
              {r.reviewerName[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.reviewerName}</span>
                <Stars rating={r.rating} />
                <span
                  style={{
                    fontSize: 11,
                    color: STAR_COLORS[r.rating],
                    fontWeight: 700
                  }}
                >
                  {r.rating}/5
                </span>
              </div>
              <p
                style={{
                  color: '#374151',
                  fontSize: 13,
                  margin: '0 0 6px',
                  lineHeight: 1.5
                }}
              >
                {r.comment}
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  🎬 {recordingMap[r.recordingId]?.title || r.recordingId}
                </span>
                <CXScoreBar score={r.customerExperienceScore} />
              </div>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              style={{
                border: '1px solid #fecaca',
                borderRadius: 6,
                background: '#fef2f2',
                color: '#ef4444',
                padding: '4px 12px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 4
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box'
};

export default Reviews;
