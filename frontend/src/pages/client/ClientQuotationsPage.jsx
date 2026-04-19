import { useEffect, useState } from 'react';
import { quotationsAPI } from '../../api/services';

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

function QuotationDetail({ quotation, onRespond }) {
    const canRespond = quotation.status === 'SENT';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Code</span>
                    <code className="code-badge">{quotation.code}</code>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${quotation.status?.toLowerCase()}`}>{quotation.status}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
            {quotation.currency} {Number(quotation.totalAmount || 0).toLocaleString()}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Valid Until</span>
                    <span className="detail-value">{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Issue Date</span>
                    <span className="detail-value">{quotation.issueDate ? new Date(quotation.issueDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Currency</span>
                    <span className="detail-value">{quotation.currency}</span>
                </div>
                {quotation.subtotalAmount && (
                    <div className="detail-item">
                        <span className="detail-label">Subtotal</span>
                        <span className="detail-value">{quotation.currency} {Number(quotation.subtotalAmount).toLocaleString()}</span>
                    </div>
                )}
                {quotation.taxAmount && (
                    <div className="detail-item">
                        <span className="detail-label">Tax</span>
                        <span className="detail-value">{quotation.currency} {Number(quotation.taxAmount).toLocaleString()}</span>
                    </div>
                )}
            </div>
            {quotation.scopeSummary && (
                <div className="detail-item">
                    <span className="detail-label">Scope Summary</span>
                    <p className="detail-text">{quotation.scopeSummary}</p>
                </div>
            )}
            {quotation.termsAndConditions && (
                <div className="detail-item">
                    <span className="detail-label">Terms & Conditions</span>
                    <p className="detail-text">{quotation.termsAndConditions}</p>
                </div>
            )}
            {canRespond && (
                <div className="client-response-actions">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Please review the quotation above and respond:
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" onClick={() => onRespond('ACCEPTED')}
                                style={{ background: '#10b981', flex: 1 }}>✓ Accept Quotation</button>
                        <button className="btn-ghost" onClick={() => onRespond('REJECTED')}
                                style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1 }}>✕ Decline Quotation</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClientQuotationsPage() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewQuotation, setViewQuotation] = useState(null);

    const fetchQuotations = async () => {
        setLoading(true);
        try {
            const res = await quotationsAPI.getAll();
            setQuotations(res.data?.data || []);
        } catch (e) {
            setError('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuotations(); }, []);

    const handleRespond = async (status) => {
        try {
            await quotationsAPI.updateStatus(viewQuotation.id, { status });
            setSuccess(`Quotation ${status.toLowerCase()} successfully.`);
            setTimeout(() => setSuccess(''), 4000);
            setViewQuotation(null);
            fetchQuotations();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to respond to quotation');
        }
    };

    const statuses = [...new Set(quotations.map(q => q.status).filter(Boolean))];
    const pendingCount = quotations.filter(q => q.status === 'SENT').length;

    const filtered = quotations.filter(q => {
        const matchSearch = !search ||
            q.code?.toLowerCase().includes(search.toLowerCase()) ||
            q.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || q.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Quotations</h1>
                    <p className="page-subtitle">
                        {quotations.length} total
                        {pendingCount > 0 && <span className="pending-badge">{pendingCount} awaiting response</span>}
                    </p>
                </div>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}
            {success && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    ✓ {success}
                </div>
            )}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by code or title..."
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
                        <div className="empty-icon">◇</div>
                        <h3>No quotations found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'No quotations yet'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Code</th><th>Title</th><th>Total</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(q => (
                            <tr key={q.id}>
                                <td><code className="code-badge">{q.code}</code></td>
                                <td><div className="cell-title">{q.title}</div></td>
                                <td>
                                    {q.totalAmount
                                        ? <span style={{ color: 'var(--text-primary)' }}>{q.currency} {Number(q.totalAmount).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : '—'}
                                </td>
                                <td><span className={`status-badge status-${q.status?.toLowerCase()}`}>{q.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewQuotation(q)} title="View & respond">
                                            {q.status === 'SENT' ? '↩' : '◉'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {viewQuotation && (
                <Modal title="Quotation Details" onClose={() => setViewQuotation(null)}>
                    <QuotationDetail quotation={viewQuotation} onRespond={handleRespond} />
                </Modal>
            )}
        </div>
    );
}