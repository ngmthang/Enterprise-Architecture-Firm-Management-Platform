import { useEffect, useState } from 'react';
import { quotationsAPI } from '../../api/services';

const STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'VND', 'AUD', 'CAD'];

const emptyForm = {
    code: '', projectId: '', consultationId: '', title: '', status: 'DRAFT',
    currency: 'USD', subtotalAmount: '', taxAmount: '', discountAmount: '',
    totalAmount: '', issueDate: '', validUntil: '', clientName: '',
    clientEmail: '', clientPhone: '', scopeSummary: '', termsAndConditions: '',
    notes: '', active: true,
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

function QuotationForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        ['projectId', 'consultationId', 'subtotalAmount', 'taxAmount',
            'discountAmount', 'totalAmount'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        ['issueDate', 'validUntil'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Quotation Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Quotation Code *</label>
                        <input name="code" value={form.code} onChange={handleChange} placeholder="QUO-001" required />
                    </div>
                    <div className="form-field">
                        <label>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Architectural Design Proposal" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Status</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Currency *</label>
                        <select name="currency" value={form.currency} onChange={handleChange}>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project ID</label>
                        <input name="projectId" type="number" value={form.projectId} onChange={handleChange} placeholder="Optional" />
                    </div>
                    <div className="form-field">
                        <label>Consultation ID</label>
                        <input name="consultationId" type="number" value={form.consultationId} onChange={handleChange} placeholder="Optional" />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Client Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Client Name *</label>
                        <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="John Smith" required />
                    </div>
                    <div className="form-field">
                        <label>Client Email</label>
                        <input name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange} placeholder="john@example.com" />
                    </div>
                </div>
                <div className="form-field">
                    <label>Client Phone</label>
                    <input name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Dates</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Issue Date</label>
                        <input name="issueDate" type="date" value={form.issueDate} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label>Valid Until</label>
                        <input name="validUntil" type="date" value={form.validUntil} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Financials</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Subtotal</label>
                        <input name="subtotalAmount" type="number" min="0" step="0.01" value={form.subtotalAmount} onChange={handleChange} placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label>Tax Amount</label>
                        <input name="taxAmount" type="number" min="0" step="0.01" value={form.taxAmount} onChange={handleChange} placeholder="0.00" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Discount Amount</label>
                        <input name="discountAmount" type="number" min="0" step="0.01" value={form.discountAmount} onChange={handleChange} placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label>Total Amount</label>
                        <input name="totalAmount" type="number" min="0" step="0.01" value={form.totalAmount} onChange={handleChange} placeholder="0.00" />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Details</div>
                <div className="form-field">
                    <label>Scope Summary</label>
                    <textarea name="scopeSummary" value={form.scopeSummary} onChange={handleChange} rows={3} placeholder="Summary of project scope..." />
                </div>
                <div className="form-field">
                    <label>Terms & Conditions</label>
                    <textarea name="termsAndConditions" value={form.termsAndConditions} onChange={handleChange} rows={3} placeholder="Payment terms, delivery conditions..." />
                </div>
                <div className="form-field">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Internal notes..." />
                </div>
                <div className="form-field form-field-inline">
                    <input name="active" type="checkbox" id="active" checked={form.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Active
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Quotation →'}
                </button>
            </div>
        </form>
    );
}

function StatusModal({ quotation, onUpdate, onClose }) {
    const [status, setStatus] = useState(quotation.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await quotationsAPI.updateStatus(quotation.id, { status });
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
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{quotation.code}</strong>
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

function DetailView({ quotation }) {
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
                    <span className="detail-label">Client</span>
                    <span className="detail-value">{quotation.clientName}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{quotation.clientEmail || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Total</span>
                    <span className="detail-value">{quotation.currency} {Number(quotation.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Valid Until</span>
                    <span className="detail-value">{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : '—'}</span>
                </div>
                {quotation.publicToken && (
                    <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="detail-label">Public Link</span>
                        <span className="detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              /api/quotations/public/{quotation.publicToken}
            </span>
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
            {quotation.notes && (
                <div className="detail-item">
                    <span className="detail-label">Notes</span>
                    <p className="detail-text">{quotation.notes}</p>
                </div>
            )}
        </div>
    );
}

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editQuotation, setEditQuotation] = useState(null);
    const [viewQuotation, setViewQuotation] = useState(null);
    const [statusQuotation, setStatusQuotation] = useState(null);

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

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await quotationsAPI.create(form);
            setShowCreate(false);
            fetchQuotations();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create quotation');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await quotationsAPI.update(editQuotation.id, form);
            setEditQuotation(null);
            fetchQuotations();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update quotation');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quotation?')) return;
        try {
            await quotationsAPI.delete(id);
            fetchQuotations();
        } catch (e) {
            setError('Failed to delete quotation');
        }
    };

    const filtered = quotations.filter(q => {
        const matchSearch = !search ||
            q.code?.toLowerCase().includes(search.toLowerCase()) ||
            q.title?.toLowerCase().includes(search.toLowerCase()) ||
            q.clientName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || q.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const pendingCount = quotations.filter(q => q.status === 'SENT').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quotations</h1>
                    <p className="page-subtitle">
                        {quotations.length} total
                        {pendingCount > 0 && <span className="pending-badge">{pendingCount} awaiting response</span>}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + New Quotation
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
                    placeholder="Search by code, title, or client..."
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
                        <div className="empty-icon">◇</div>
                        <h3>No quotations found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Create your first quotation'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Quotation</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Valid Until</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(q => (
                            <tr key={q.id}>
                                <td><code className="code-badge">{q.code}</code></td>
                                <td>
                                    <div className="cell-title">{q.title}</div>
                                    {q.projectCode && <div className="cell-sub">Project: {q.projectCode}</div>}
                                </td>
                                <td>
                                    <div className="cell-title">{q.clientName}</div>
                                    {q.clientEmail && <div className="cell-sub">{q.clientEmail}</div>}
                                </td>
                                <td>
                                    {q.totalAmount
                                        ? <span style={{ color: 'var(--text-primary)' }}>{q.currency} {Number(q.totalAmount).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${q.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusQuotation(q)}
                                        title="Click to change status"
                                    >
                                        {q.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewQuotation(q)} title="View">◉</button>
                                        <button className="action-btn" onClick={() => setEditQuotation(q)} title="Edit">✎</button>
                                        <button className="action-btn action-btn-danger" onClick={() => handleDelete(q.id)} title="Delete">✕</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="New Quotation" onClose={() => setShowCreate(false)}>
                    <QuotationForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editQuotation && (
                <Modal title="Edit Quotation" onClose={() => setEditQuotation(null)}>
                    <QuotationForm
                        initial={{
                            ...editQuotation,
                            projectId: editQuotation.projectId || '',
                            consultationId: editQuotation.consultationId || '',
                            subtotalAmount: editQuotation.subtotalAmount || '',
                            taxAmount: editQuotation.taxAmount || '',
                            discountAmount: editQuotation.discountAmount || '',
                            totalAmount: editQuotation.totalAmount || '',
                            issueDate: editQuotation.issueDate || '',
                            validUntil: editQuotation.validUntil || '',
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditQuotation(null)}
                        loading={saving}
                    />
                </Modal>
            )}

            {viewQuotation && (
                <Modal title="Quotation Details" onClose={() => setViewQuotation(null)}>
                    <DetailView quotation={viewQuotation} />
                </Modal>
            )}

            {statusQuotation && (
                <Modal title="Update Status" onClose={() => setStatusQuotation(null)}>
                    <StatusModal quotation={statusQuotation} onUpdate={fetchQuotations} onClose={() => setStatusQuotation(null)} />
                </Modal>
            )}
        </div>
    );
}