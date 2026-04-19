import { useEffect, useState } from 'react';
import { servicesAPI } from '../../api/services';

const emptyForm = {
    name: '', slug: '', shortDescription: '', fullDescription: '',
    icon: '', featured: false, displayOrder: 1, active: true,
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

function ServiceForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const autoSlug = (name) => name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const handleNameChange = (e) => {
        const name = e.target.value;
        setForm(f => ({
            ...f,
            name,
            slug: f.slug === autoSlug(f.name) || f.slug === '' ? autoSlug(name) : f.slug,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.displayOrder = parseInt(payload.displayOrder) || 1;
        if (!payload.fullDescription) delete payload.fullDescription;
        if (!payload.icon) delete payload.icon;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Service Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Name *</label>
                        <input name="name" value={form.name} onChange={handleNameChange}
                               placeholder="Architectural Design" required />
                    </div>
                    <div className="form-field">
                        <label>Slug *</label>
                        <input name="slug" value={form.slug} onChange={handleChange}
                               placeholder="architectural-design" required />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Auto-generated. Used in public URL.
            </span>
                    </div>
                </div>
                <div className="form-field">
                    <label>Icon</label>
                    <input name="icon" value={form.icon} onChange={handleChange}
                           placeholder="◈ or icon name/emoji" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Use an emoji, symbol, or icon class name
          </span>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Description</div>
                <div className="form-field">
                    <label>Short Description * (max 500 chars)</label>
                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange}
                              rows={3} placeholder="Brief service summary shown on cards..." required maxLength={500} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {form.shortDescription.length}/500
          </span>
                </div>
                <div className="form-field">
                    <label>Full Description</label>
                    <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange}
                              rows={6} placeholder="Detailed service description..." />
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
                <div className="form-field form-field-inline">
                    <input name="active" type="checkbox" id="active" checked={form.active}
                           onChange={handleChange} />
                    <label htmlFor="active" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Active (visible publicly)
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Service →'}
                </button>
            </div>
        </form>
    );
}

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editService, setEditService] = useState(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await servicesAPI.getAll();
            setServices(res.data?.data || []);
        } catch (e) {
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await servicesAPI.create(form);
            setShowCreate(false);
            fetchServices();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create service');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await servicesAPI.update(editService.id, form);
            setEditService(null);
            fetchServices();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update service');
        } finally {
            setSaving(false);
        }
    };

    const filtered = services.filter(s =>
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.slug?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = services.filter(s => s.active).length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Service Offerings</h1>
                    <p className="page-subtitle">
                        {services.length} total
                        {activeCount > 0 && (
                            <span className="pending-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                {activeCount} active
              </span>
                        )}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + Add Service
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
                    placeholder="Search by name or slug..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◱</div>
                        <h3>No services found</h3>
                        <p>{search ? 'Try adjusting your search' : 'Add your first service offering'}</p>
                        {!search && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Service</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Service</th>
                            <th>Slug</th>
                            <th>Order</th>
                            <th>Featured</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {s.icon && (
                                                <div style={{
                                                    width: 36, height: 36, background: 'var(--accent-dim)',
                                                    border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1rem', color: 'var(--accent)', flexShrink: 0
                                                }}>
                                                    {s.icon}
                                                </div>
                                            )}
                                            <div>
                                                <div className="cell-title">{s.name}</div>
                                                <div className="cell-sub" style={{
                                                    maxWidth: '280px', overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {s.shortDescription}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <code className="code-badge">/{s.slug}</code>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                        #{s.displayOrder}
                                    </td>
                                    <td>
                                        {s.featured
                                            ? <span className="status-badge status-active">Yes</span>
                                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                                        }
                                    </td>
                                    <td>
                    <span className={`status-badge ${s.active ? 'status-active' : 'status-cancelled'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn" onClick={() => setEditService(s)} title="Edit">✎</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Add Service Offering" onClose={() => setShowCreate(false)}>
                    <ServiceForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editService && (
                <Modal title="Edit Service Offering" onClose={() => setEditService(null)}>
                    <ServiceForm
                        initial={{
                            ...editService,
                            displayOrder: editService.displayOrder || 1,
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditService(null)}
                        loading={saving}
                    />
                </Modal>
            )}
        </div>
    );
}