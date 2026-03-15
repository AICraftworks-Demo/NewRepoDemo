import React, { useEffect, useState } from 'react';
import { getRecordings, getFeatures, createRecording, updateRecording, deleteRecording } from '../api';
import { Recording, Feature, RecordingStatus } from '../types';
import RecordingStatusBadge from '../components/RecordingStatusBadge';

const STATUSES: RecordingStatus[] = ['draft', 'review', 'approved', 'published'];

const emptyForm = {
  featureId: '',
  title: '',
  description: '',
  url: '',
  thumbnailUrl: '',
  durationSeconds: 0,
  status: 'draft' as RecordingStatus
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Recording | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterFeature, setFilterFeature] = useState('');

  const load = async () => {
    const [recs, feats] = await Promise.all([getRecordings(), getFeatures()]);
    setRecordings(recs);
    setFeatures(feats);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const featureMap = React.useMemo(
    () => Object.fromEntries(features.map(f => [f.id, f])),
    [features]
  );

  const filtered = filterFeature
    ? recordings.filter(r => r.featureId === filterFeature)
    : recordings;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, featureId: features[0]?.id || '' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (r: Recording) => {
    setEditing(r);
    setForm({
      featureId: r.featureId,
      title: r.title,
      description: r.description,
      url: r.url,
      thumbnailUrl: r.thumbnailUrl,
      durationSeconds: r.durationSeconds,
      status: r.status
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateRecording(editing.id, form);
        setRecordings(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      } else {
        const created = await createRecording(form);
        setRecordings(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this recording?')) return;
    await deleteRecording(id);
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  const handleStatusChange = async (rec: Recording, status: RecordingStatus) => {
    const updated = await updateRecording(rec.id, { status });
    setRecordings(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading recordings...</div>;

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
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🎬 Recordings</h1>
          <p style={{ color: '#6b7280' }}>Manage demo recordings for each feature</p>
        </div>
        <button
          onClick={openCreate}
          style={{
            background: '#8b5cf6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          + Add Recording
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={filterFeature}
          onChange={e => setFilterFeature(e.target.value)}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          <option value="">All Features</option>
          {features.map(f => (
            <option key={f.id} value={f.id}>
              {f.title}
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
            maxWidth: 560
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            {editing ? 'Edit Recording' : 'New Recording'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Feature *</label>
              <select
                style={inputStyle}
                value={form.featureId}
                onChange={e => setForm(p => ({ ...p, featureId: e.target.value }))}
                required
              >
                {features.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                style={{ ...inputStyle, height: 64, resize: 'vertical' }}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Recording URL *</label>
              <input
                style={inputStyle}
                value={form.url}
                onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Thumbnail URL</label>
              <input
                style={inputStyle}
                value={form.thumbnailUrl}
                onChange={e => setForm(p => ({ ...p, thumbnailUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Duration (seconds)</label>
              <input
                style={inputStyle}
                type="number"
                min={0}
                value={form.durationSeconds}
                onChange={e =>
                  setForm(p => ({ ...p, durationSeconds: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as RecordingStatus }))}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
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
          <p style={{ color: '#9ca3af' }}>No recordings yet.</p>
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
            <div style={{ flex: 1 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}
              >
                <span style={{ fontWeight: 700, fontSize: 15 }}>{r.title}</span>
                <RecordingStatusBadge status={r.status} />
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 6px' }}>
                {r.description}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9ca3af' }}>
                <span>
                  🚀{' '}
                  {featureMap[r.featureId]?.title || r.featureId}
                </span>
                <span>⏱ {formatDuration(r.durationSeconds)}</span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6366f1' }}
                >
                  🔗 View
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={r.status}
                onChange={e => handleStatusChange(r, e.target.value as RecordingStatus)}
                style={{
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  padding: '4px 8px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => openEdit(r)}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  background: '#f9fafb',
                  padding: '4px 12px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
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

export default Recordings;
