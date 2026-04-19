import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../api/services';

const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
const PROJECT_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'URBAN_PLANNING', 'INTERIOR', 'LANDSCAPE', 'INDUSTRIAL', 'OTHER'];

const emptyForm = {
    title: '', slug: '', shortDescription: '', fullDescription: '',
    location: '', projectType: 'COMMERCIAL', status: 'DRAFT',
    featured: false, displayOrder: 1, coverImageUrl: '', completedAt: '',
};

function Modal({ title, onClose, children }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

function PortfolioForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const autoSlug = (title) => title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm(f => ({
            ...f,
            title,
            slug: f.slug === autoSlug(f.title) || f.slug === '' ? autoSlug(title) : f.slug,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.displayOrder = parseInt(payload.displayOrder) || 1;
        if (!payload.fullDescription) delete payload.fullDescription;
        if (!payload.location) delete payload.location;
        if (!payload.coverImageUrl) delete payload.coverImageUrl;
        if (!payload.completedAt) delete payload.completedAt;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Project Info</div>
                <div className="form-field">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={handleTitleChange}
                           placeholder="The Meridian Tower" required />
                </div>
                <div className="form-field">
                    <label>Slug *</label>
                    <input name="slug" value={form.slug} onChange={handleChange}
                           placeholder="the-meridian-tower" required />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Auto-generated from title. Used in public URL.
          </span>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project Type *</label>
                        <select name="projectType" value={form.projectType} onChange={handleChange} required>
                            {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Status *</label>
                        <select name="status" value={form.status} onChange={handleChange} required>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Location</label>
                        <input name="location" value={form.location} onChange={handleChange}
                               placeholder="New York, USA" />
                    </div>
                    <div className="form-field">
                        <label>Completed At</label>
                        <input name="completedAt" type="date" value={form.completedAt} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-field">
                    <label>Cover Image URL</label>
                    <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange}
                           placeholder="https://example.com/image.jpg" />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Description</div>
                <div className="form-field">
                    <label>Short Description * (max 500 chars)</label>
                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange}
                              rows={3} placeholder="Brief project summary..." required maxLength={500} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {form.shortDescription.length}/500
          </span>
                </div>
                <div className="form-field">
                    <label>Full Description</label>
                    <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange}
                              rows={6} placeholder="Detailed project description..." />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Display Settings</div>
                <div className="form-field">
                    <label>Display Order *</label>
                    <input name="displayOrder" type="number" min="1" value={form.displayOrder}
                           onChange={handleChange} required />
                </div>
                <div className="form-field form-field-inline">
                    <input name="featured" type="checkbox" id="featured" checked={form.featured}
                           onChange={handleChange} />
                    <label htmlFor="featured" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Featured on homepage
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Project →'}
                </button>
            </div>
        </form>
    );
}

export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editProject, setEditProject] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await portfolioAPI.getAll();
            setProjects(res.data?.data || []);
        } catch (e) {
            setError('Failed to load portfolio projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await portfolioAPI.create(form);
            setShowCreate(false);
            fetchProjects();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create portfolio project');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await portfolioAPI.update(editProject.id, form);
            setEditProject(null);
            fetchProjects();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update portfolio project');
        } finally {
            setSaving(false);
        }
    };

    const filtered = projects.filter(p => {
        const matchSearch = !search ||
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.location?.toLowerCase().includes(search.toLowerCase()) ||
            p.projectType?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const publishedCount = projects.filter(p => p.status === 'PUBLISHED').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Portfolio</h1>
                    <p className="page-subtitle">
                        {projects.length} total
                        {publishedCount > 0 && (
                            <span className="pending-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                {publishedCount} published
              </span>
                        )}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + Add Project
                </button>
            </div>

            {error && (
                <div className="page-error" onClick={() => setError('')}>
                    ⚠ {error} <span style={{ opacity: 0.5 }}>✕</span>
                </div>
            )}

            <div className="page-filters">
                <input
                    className="filter-search"
                    placeholder="Search by title, location, or type..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◰</div>
                        <h3>No portfolio projects found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Add your first portfolio project'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Project</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Project</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Order</th>
                            <th>Featured</th>
                            <th>Completed</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {p.coverImageUrl ? (
                                                <img src={p.coverImageUrl} alt={p.title}
                                                     style={{ width: 40, height: 40, objectFit: 'cover',
                                                         borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexShrink: 0 }}
                                                     onError={e => e.target.style.display = 'none'} />
                                            ) : (
                                                <div style={{
                                                    width: 40, height: 40, background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0
                                                }}>◰</div>
                                            )}
                                            <div>
                                                <div className="cell-title">{p.title}</div>
                                                <div className="cell-sub">/{p.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="type-badge">{p.projectType?.replace(/_/g, ' ')}</span></td>
                                    <td>{p.location || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                        #{p.displayOrder}
                                    </td>
                                    <td>
                                        {p.featured
                                            ? <span className="status-badge status-active">Yes</span>
                                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                                        }
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : '—'}
                                    </td>
                                    <td>
                    <span className={`status-badge status-${p.status?.toLowerCase()}`}>
                      {p.status}
                    </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn" onClick={() => setEditProject(p)} title="Edit">✎</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Add Portfolio Project" onClose={() => setShowCreate(false)}>
                    <PortfolioForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editProject && (
                <Modal title="Edit Portfolio Project" onClose={() => setEditProject(null)}>
                    <PortfolioForm
                        initial={{
                            ...editProject,
                            completedAt: editProject.completedAt || '',
                            displayOrder: editProject.displayOrder || 1,
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditProject(null)}
                        loading={saving}
                    />
                </Modal>
            )}
        </div>
    );
}