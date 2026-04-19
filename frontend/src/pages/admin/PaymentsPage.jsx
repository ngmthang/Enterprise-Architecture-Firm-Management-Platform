import { useEffect, useState } from 'react';
import { paymentsAPI } from '../../api/services';

const PAYMENT_METHODS = ['BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'CHECK', 'ONLINE', 'OTHER'];
const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'VND', 'AUD', 'CAD'];

const emptyForm = {
    invoiceId: '', paymentReference: '', paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PENDING', amount: '', currency: 'USD', paidAt: '', notes: '',
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

function PaymentForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.invoiceId = parseInt(payload.invoiceId);
        payload.amount = parseFloat(payload.amount);
        if (!payload.paidAt) delete payload.paidAt;
        if (!payload.paymentReference) delete payload.paymentReference;
        if (!payload.notes) delete payload.notes;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Payment Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Invoice ID *</label>
                        <input name="invoiceId" type="number" value={form.invoiceId} onChange={handleChange} placeholder="Invoice ID" required />
                    </div>
                    <div className="form-field">
                        <label>Payment Reference</label>
                        <input name="paymentReference" value={form.paymentReference} onChange={handleChange} placeholder="TXN-12345" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Payment Method *</label>
                        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required>
                            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Payment Status *</label>
                        <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} required>
                            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Amount *</label>
                        <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required />
                    </div>
                    <div className="form-field">
                        <label>Currency *</label>
                        <select name="currency" value={form.currency} onChange={handleChange}>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Paid At</label>
                    <input name="paidAt" type="datetime-local" value={form.paidAt} onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Payment notes..." />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Payment →'}
                </button>
            </div>
        </form>
    );
}

function StatusModal({ payment, onUpdate, onClose }) {
    const [status, setStatus] = useState(payment.paymentStatus);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await paymentsAPI.updateStatus(payment.id, { paymentStatus: status });
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
                    Update status for payment <strong style={{ color: 'var(--text-primary)' }}>#{payment.id}</strong>
                </p>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%' }}>
                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
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

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [statusPayment, setStatusPayment] = useState(null);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await paymentsAPI.getAll();
            setPayments(res.data?.data || []);
        } catch (e) {
            setError('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPayments(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await paymentsAPI.create(form);
            setShowCreate(false);
            fetchPayments();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create payment');
        } finally {
            setSaving(false);
        }
    };

    const filtered = payments.filter(p => {
        const matchSearch = !search ||
            p.paymentReference?.toLowerCase().includes(search.toLowerCase()) ||
            p.paymentMethod?.toLowerCase().includes(search.toLowerCase()) ||
            String(p.invoiceId).includes(search);
        const matchStatus = !filterStatus || p.paymentStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalCollected = payments
        .filter(p => p.paymentStatus === 'COMPLETED')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payments</h1>
                    <p className="page-subtitle">
                        {payments.length} total
                        {totalCollected > 0 && (
                            <span className="pending-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                ${totalCollected.toLocaleString()} collected
              </span>
                        )}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + Record Payment
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
                    placeholder="Search by reference, method, or invoice ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◎</div>
                        <h3>No payments found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Record your first payment'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Record Payment</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Reference</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Paid At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <code className="code-badge">#{p.invoiceId}</code>
                                </td>
                                <td>
                                    {p.paymentReference
                                        ? <code className="code-badge">{p.paymentReference}</code>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td>
                                    <span className="type-badge">{p.paymentMethod?.replace('_', ' ')}</span>
                                </td>
                                <td>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {p.currency} {Number(p.amount).toLocaleString()}
                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${p.paymentStatus?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusPayment(p)}
                                        title="Click to change status"
                                    >
                                        {p.paymentStatus}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {p.notes && (
                                            <span title={p.notes} style={{ color: 'var(--text-muted)', cursor: 'help', fontSize: '0.9rem' }}>◉</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Record Payment" onClose={() => setShowCreate(false)}>
                    <PaymentForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {statusPayment && (
                <Modal title="Update Status" onClose={() => setStatusPayment(null)}>
                    <StatusModal payment={statusPayment} onUpdate={fetchPayments} onClose={() => setStatusPayment(null)} />
                </Modal>
            )}
        </div>
    );
}