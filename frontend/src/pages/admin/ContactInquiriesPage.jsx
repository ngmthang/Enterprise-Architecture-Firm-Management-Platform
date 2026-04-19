import { useEffect, useState } from 'react';
import { contactAPI } from '../../api/services';

const STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

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

function DetailView({ inquiry }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{inquiry.fullName}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{inquiry.email}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{inquiry.phone || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${inquiry.status?.toLowerCase()}`}>
            {inquiry.status}
          </span>
                </div>
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                    <span className="detail-label">Subject</span>
                    <span className="detail-value">{inquiry.subject}</span>
                </div>
            </div>
            <div className="detail-item">
                <span className="detail-label">Message</span>
                <p className="detail-text">{inquiry.message}</p>
            </div>
            <div className="detail-item">
                <span className="detail-label">Received</span>
                <span className="detail-value">
          {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : '—'}
        </span>
            </div>
        </div>
    );
}

function StatusModal({ inquiry, onUpdate, onClose }) {
    const [status, setStatus] = useState(inquiry.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await contactAPI.updateStatus(inquiry.id, { status });
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
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{inquiry.fullName}</strong>
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

export default function ContactInquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewInquiry, setViewInquiry] = useState(null);
    const [statusInquiry, setStatusInquiry] = useState(null);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await contactAPI.getAll();
            setInquiries(res.data?.data || []);
        } catch (e) {
            setError('Failed to load contact inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInquiries(); }, []);

    const filtered = inquiries.filter(i => {
        const matchSearch = !search ||
            i.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            i.email?.toLowerCase().includes(search.toLowerCase()) ||
            i.subject?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || i.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const newCount = inquiries.filter(i => i.status === 'NEW').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Contact Inquiries</h1>
                    <p className="page-subtitle">
                        {inquiries.length} total
                        {newCount > 0 && <span className="pending-badge">{newCount} new</span>}
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
                    placeholder="Search by name, email, or subject..."
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
                        <div className="empty-icon">◐</div>
                        <h3>No inquiries found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Contact inquiries will appear here'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>From</th>
                            <th>Subject</th>
                            <th>Phone</th>
                            <th>Received</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(i => (
                            <tr key={i.id}>
                                <td>
                                    <div className="cell-title">{i.fullName}</div>
                                    <div className="cell-sub">{i.email}</div>
                                </td>
                                <td>
                                    <div className="cell-title" style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {i.subject}
                                    </div>
                                </td>
                                <td>{i.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${i.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusInquiry(i)}
                                        title="Click to change status"
                                    >
                                        {i.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button
                                            className="action-btn"
                                            onClick={() => setViewInquiry(i)}
                                            title="View message"
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

            {viewInquiry && (
                <Modal title="Contact Inquiry" onClose={() => setViewInquiry(null)}>
                    <DetailView inquiry={viewInquiry} />
                </Modal>
            )}

            {statusInquiry && (
                <Modal title="Update Status" onClose={() => setStatusInquiry(null)}>
                    <StatusModal
                        inquiry={statusInquiry}
                        onUpdate={fetchInquiries}
                        onClose={() => setStatusInquiry(null)}
                    />
                </Modal>
            )}
        </div>
    );
}