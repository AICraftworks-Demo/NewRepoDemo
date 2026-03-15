import React, { useEffect, useState } from 'react';
import { getFeatures, createFeature, updateFeature, deleteFeature } from '../api';
import { Feature, FeatureStatus } from '../types';
import FeatureStatusBadge from '../components/FeatureStatusBadge';

const STATUSES: FeatureStatus[] = [
  'planned',
  'in-progress',
  'ready-to-record',
  'recorded',
  'published'
];

const emptyForm = {
  title: '',
  description: '',
  status: 'planned' as FeatureStatus,
  tags: ''
};

const Features: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    getFeatures()
      .then(setFeatures)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (f: Feature) => {
    setEditing(f);
    setForm({ title: f.title, description: f.description, status: f.status, tags: f.tags.join(', ') });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      if (editing) {
        const updated = await updateFeature(editing.id, { ...form, tags });
        setFeatures(prev => prev.map(f => (f.id === updated.id ? updated : f)));
      } else {
        const created = await createFeature({ ...form, tags });
        setFeatures(prev => [created, ...prev]);
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
    if (!window.confirm('Delete this feature?')) return;
    await deleteFeature(id);
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const handleStatusChange = async (feature: Feature, status: FeatureStatus) => {
    const updated = await updateFeature(feature.id, { status });
    setFeatures(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading features...</div>;

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🚀 Features</h1>
          <p style={{ color: '#6b7280' }}>Manage your product features through the flywheel stages</p>
        </div>
        <button
          onClick={openCreate}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          + Add Feature
        </button>
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
            {editing ? 'Edit Feature' : 'New Feature'}
          </h2>
          <form onSubmit={handleSubmit}>
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
                style={{ ...inputStyle, height: 72, resize: 'vertical' }}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as FeatureStatus }))}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input
                style={inputStyle}
                value={form.tags}
                onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                placeholder="e.g. AI, collaboration"
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#6366f1',
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
        {features.length === 0 && (
          <p style={{ color: '#9ca3af' }}>No features yet. Add your first feature to get started.</p>
        )}
        {features.map(f => (
          <div
            key={f.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</span>
                <FeatureStatusBadge status={f.status} />
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 8px' }}>{f.description}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {f.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#ede9fe',
                      color: '#5b21b6',
                      borderRadius: 6,
                      padding: '1px 8px',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={f.status}
                onChange={e => handleStatusChange(f, e.target.value as FeatureStatus)}
                style={{
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  padding: '4px 8px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => openEdit(f)}
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
                onClick={() => handleDelete(f.id)}
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

export default Features;
