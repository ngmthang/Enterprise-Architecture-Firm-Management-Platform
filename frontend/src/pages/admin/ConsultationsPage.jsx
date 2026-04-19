import { useEffect, useState } from 'react';
import { consultationsAPI } from '../../api/services';

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

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

function DetailView({ consultation }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{consultation.fullname}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{consultation.email}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{consultation.phone || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Contact Method</span>
                    <span className="detail-value">{consultation.preferredContactMethod}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Project Type</span>
                    <span className="detail-value">{consultation.projectType}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{consultation.projectLocation || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">{consultation.projectBudget || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${consultation.status?.toLowerCase()}`}>
            {consultation.status}
          </span>
                </div>
            </div>
            <div className="detail-item">
                <span className="detail-label">Project Details</span>
                <p className="detail-text">{consultation.projectDetails}</p>
            </div>
            <div className="detail-item">
                <span className="detail-label">Submitted</span>
                <span className="detail-value">
          {consultation.createdAt ? new Date(consultation.createdAt).toLocaleString() : '—'}
        </span>
            </div>
        </div>
    );
}

function StatusModal({ consultation, onUpdate, onClose }) {
    const [status, setStatus] = useState(consultation.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await consultationsAPI.updateStatus(consultation.id, { status });
            onUpdate();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{consultation.fullname}</strong>
                </p>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="form-actions">
                <button className="btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Status →'}
                </button>
            </div>
        </div>
    );
}

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewConsultation, setViewConsultation] = useState(null);
    const [statusConsultation, setStatusConsultation] = useState(null);

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

    const filtered = consultations.filter(c => {
        const matchSearch = !search ||
            c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.projectType?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const pending = consultations.filter(c => c.status === 'PENDING').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Consultations</h1>
                    <p className="page-subtitle">
                        {consultations.length} total
                        {pending > 0 && <span className="pending-badge">{pending} pending</span>}
                    </p>
                </div>
            </div>

            {error && (
                <div className="page-error" onClick={() => setError('')}>
                    ⚠ {error} <span style={{ opacity: 0.5 }}>✕</span>
                </div>
            )}

            <div className="page-filters">
                <input
                    className="filter-search"
                    placeholder="Search by name, email, or project type..."
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
                        <div className="empty-icon">◑</div>
                        <h3>No consultations found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Consultation requests will appear here'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Client</th>
                            <th>Project Type</th>
                            <th>Budget</th>
                            <th>Contact</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td>
                                    <div className="cell-title">{c.fullname}</div>
                                    <div className="cell-sub">{c.email}</div>
                                </td>
                                <td><span className="type-badge">{c.projectType}</span></td>
                                <td>{c.projectBudget || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td>{c.preferredContactMethod}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${c.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusConsultation(c)}
                                        title="Click to change status"
                                    >
                                        {c.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button
                                            className="action-btn"
                                            onClick={() => setViewConsultation(c)}
                                            title="View details"
                                        >
                                            ◉
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {viewConsultation && (
                <Modal title="Consultation Details" onClose={() => setViewConsultation(null)}>
                    <DetailView consultation={viewConsultation} />
                </Modal>
            )}

            {statusConsultation && (
                <Modal title="Update Status" onClose={() => setStatusConsultation(null)}>
                    <StatusModal
                        consultation={statusConsultation}
                        onUpdate={fetchConsultations}
                        onClose={() => setStatusConsultation(null)}
                    />
                </Modal>
            )}
        </div>
    );
}