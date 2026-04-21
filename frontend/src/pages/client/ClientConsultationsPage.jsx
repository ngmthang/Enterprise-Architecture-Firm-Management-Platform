import { useEffect, useState } from 'react';
import { consultationsAPI } from '../../api/services';

const PROJECT_TYPES = [
    'ARCHITECTURAL_DESIGN', 'LANDSCAPE_DESIGN', 'RENOVATION',
    'CONSULTATION', 'MASTER_PLANNING', 'INTERIOR_DESIGN'
];

const CONTACT_METHODS = ['EMAIL', 'PHONE', 'VIDEO_CALL', 'IN_PERSON'];

const emptyForm = {
    fullname: '', email: '', phone: '', projectType: 'ARCHITECTURAL_DESIGN',
    projectLocation: '', projectBudget: '', preferredContactMethod: 'EMAIL',
    projectDetails: '',
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

function ConsultationForm({ onSubmit, onClose, loading }) {
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.phone) delete payload.phone;
        // Always send projectLocation — send empty string if blank to satisfy NOT NULL
        if (!payload.projectLocation) payload.projectLocation = 'Not specified';
        if (!payload.projectBudget) delete payload.projectBudget;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Your Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Full Name *</label>
                        <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="John Smith" required />
                    </div>
                    <div className="form-field">
                        <label>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                    </div>
                    <div className="form-field">
                        <label>Preferred Contact Method *</label>
                        <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange} required>
                            {CONTACT_METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Project Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project Type *</label>
                        <select name="projectType" value={form.projectType} onChange={handleChange} required>
                            {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Budget Range</label>
                        <input name="projectBudget" value={form.projectBudget} onChange={handleChange} placeholder="e.g. $100K - $500K" />
                    </div>
                </div>
                <div className="form-field">
                    <label>Project Location</label>
                    <input name="projectLocation" value={form.projectLocation} onChange={handleChange} placeholder="City, State" />
                </div>
                <div className="form-field">
                    <label>Project Details *</label>
                    <textarea name="projectDetails" value={form.projectDetails} onChange={handleChange}
                              rows={5} placeholder="Tell us about your project vision, requirements, and timeline..." required />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request →'}
                </button>
            </div>
        </form>
    );
}

function ConsultationDetail({ consultation }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${consultation.status?.toLowerCase()}`}>{consultation.status}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Contact Method</span>
                    <span className="detail-value">{consultation.preferredContactMethod?.replace(/_/g, ' ')}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Project Type</span>
                    <span className="detail-value">{consultation.projectType}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">{consultation.projectBudget || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{consultation.projectLocation || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Submitted</span>
                    <span className="detail-value">{consultation.createdAt ? new Date(consultation.createdAt).toLocaleString() : '—'}</span>
                </div>
            </div>
            <div className="detail-item">
                <span className="detail-label">Project Details</span>
                <p className="detail-text">{consultation.projectDetails}</p>
            </div>
        </div>
    );
}

export default function ClientConsultationsPage() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [viewConsultation, setViewConsultation] = useState(null);

    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const res = await consultationsAPI.getAll();
            setConsultations(res.data?.data || []);
        } catch (e) {
            setError('Failed to load consultations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchConsultations(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await consultationsAPI.create(form);
            setShowCreate(false);
            setSuccess('Consultation request submitted! Our team will contact you shortly.');
            setTimeout(() => setSuccess(''), 5000);
            fetchConsultations();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to submit consultation');
        } finally {
            setSaving(false);
        }
    };

    const statuses = [...new Set(consultations.map(c => c.status).filter(Boolean))];

    const filtered = consultations.filter(c => {
        const matchSearch = !search ||
            c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            c.projectType?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Consultations</h1>
                    <p className="page-subtitle">{consultations.length} total requests</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Request</button>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}
            {success && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    ✓ {success}
                </div>
            )}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by name or project type..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◑</div>
                        <h3>No consultations found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Submit your first consultation request'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Request</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Project Type</th><th>Contact Method</th><th>Budget</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td><span className="type-badge">{c.projectType}</span></td>
                                <td>{c.preferredContactMethod?.replace(/_/g, ' ')}</td>
                                <td>{c.projectBudget || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td><span className={`status-badge status-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewConsultation(c)} title="View details">◉</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="New Consultation Request" onClose={() => setShowCreate(false)}>
                    <ConsultationForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {viewConsultation && (
                <Modal title="Consultation Details" onClose={() => setViewConsultation(null)}>
                    <ConsultationDetail consultation={viewConsultation} />
                </Modal>
            )}
        </div>
    );
}