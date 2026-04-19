import { useEffect, useState } from 'react';
import { invoicesAPI, paymentsAPI } from '../../api/services';

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

function InvoiceDetail({ invoice }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Code</span>
                    <code className="code-badge">{invoice.code}</code>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${invoice.status?.toLowerCase()}`}>{invoice.status}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
            {invoice.currency} {Number(invoice.totalAmount || 0).toLocaleString()}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Balance Due</span>
                    <span className="detail-value" style={{ color: Number(invoice.balanceDue) > 0 ? '#f87171' : '#34d399', fontSize: '1.1rem' }}>
            {invoice.currency} {Number(invoice.balanceDue || 0).toLocaleString()}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Invoice Date</span>
                    <span className="detail-value">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}</span>
                </div>
                {invoice.subtotalAmount && (
                    <div className="detail-item">
                        <span className="detail-label">Subtotal</span>
                        <span className="detail-value">{invoice.currency} {Number(invoice.subtotalAmount).toLocaleString()}</span>
                    </div>
                )}
                {invoice.taxAmount && (
                    <div className="detail-item">
                        <span className="detail-label">Tax</span>
                        <span className="detail-value">{invoice.currency} {Number(invoice.taxAmount).toLocaleString()}</span>
                    </div>
                )}
            </div>
            {invoice.description && (
                <div className="detail-item">
                    <span className="detail-label">Description</span>
                    <p className="detail-text">{invoice.description}</p>
                </div>
            )}
            {invoice.documentUrl && (
                <div className="detail-item">
                    <span className="detail-label">Invoice Document</span>
                    <a href={invoice.documentUrl} target="_blank" rel="noreferrer"
                       className="btn-primary" style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
                        Download Invoice →
                    </a>
                </div>
            )}
        </div>
    );
}

function PaymentRequestForm({ invoice, onSubmit, onClose, loading }) {
    const PAYMENT_METHODS = ['BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'CHECK', 'ONLINE', 'OTHER'];
    const [form, setForm] = useState({
        invoiceId: invoice.id,
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PENDING',
        amount: invoice.balanceDue || invoice.totalAmount || '',
        currency: invoice.currency || 'USD',
        paymentReference: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.amount = parseFloat(payload.amount);
        if (!payload.paymentReference) delete payload.paymentReference;
        if (!payload.notes) delete payload.notes;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="architect-notice">
                <span>◎</span>
                <span>Submit your payment details and our team will confirm receipt.</span>
            </div>
            <div className="form-section">
                <div className="form-section-title">Payment Details</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Amount *</label>
                        <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>Currency</label>
                        <input value={form.currency} readOnly style={{ opacity: 0.6 }} />
                    </div>
                </div>
                <div className="form-field">
                    <label>Payment Method *</label>
                    <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required>
                        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                    </select>
                </div>
                <div className="form-field">
                    <label>Payment Reference / Transaction ID</label>
                    <input name="paymentReference" value={form.paymentReference} onChange={handleChange}
                           placeholder="e.g. TXN-12345 or bank transfer reference" />
                </div>
                <div className="form-field">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}
                              rows={2} placeholder="Any additional payment details..." />
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Payment →'}
                </button>
            </div>
        </form>
    );
}

export default function ClientInvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewInvoice, setViewInvoice] = useState(null);
    const [payInvoice, setPayInvoice] = useState(null);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await invoicesAPI.getAll();
            setInvoices(res.data?.data || []);
        } catch (e) {
            setError('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInvoices(); }, []);

    const handlePaymentRequest = async (form) => {
        setSaving(true);
        try {
            await paymentsAPI.create(form);
            setPayInvoice(null);
            setSuccess('Payment submitted successfully. Our team will confirm receipt shortly.');
            setTimeout(() => setSuccess(''), 5000);
            fetchInvoices();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to submit payment');
        } finally {
            setSaving(false);
        }
    };

    const statuses = [...new Set(invoices.map(i => i.status).filter(Boolean))];
    const totalDue = invoices
        .filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
        .reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);

    const filtered = invoices.filter(i => {
        const matchSearch = !search ||
            i.code?.toLowerCase().includes(search.toLowerCase()) ||
            i.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || i.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Invoices</h1>
                    <p className="page-subtitle">
                        {invoices.length} total
                        {totalDue > 0 && <span className="pending-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>${totalDue.toLocaleString()} due</span>}
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
                        <div className="empty-icon">▤</div>
                        <h3>No invoices found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'No invoices yet'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Code</th><th>Title</th><th>Total</th><th>Balance Due</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(i => (
                            <tr key={i.id}>
                                <td><code className="code-badge">{i.code}</code></td>
                                <td><div className="cell-title">{i.title}</div></td>
                                <td>
                                    {i.totalAmount
                                        ? <span style={{ color: 'var(--text-primary)' }}>{i.currency} {Number(i.totalAmount).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td>
                                    {Number(i.balanceDue) > 0
                                        ? <span style={{ color: '#f87171', fontWeight: 500 }}>{i.currency} {Number(i.balanceDue).toLocaleString()}</span>
                                        : <span style={{ color: '#34d399' }}>Paid</span>
                                    }
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '—'}
                                </td>
                                <td><span className={`status-badge status-${i.status?.toLowerCase()}`}>{i.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewInvoice(i)} title="View details">◉</button>
                                        {i.status !== 'PAID' && i.status !== 'CANCELLED' && Number(i.balanceDue) > 0 && (
                                            <button className="action-btn" onClick={() => setPayInvoice(i)} title="Make payment"
                                                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>$</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {viewInvoice && (
                <Modal title="Invoice Details" onClose={() => setViewInvoice(null)}>
                    <InvoiceDetail invoice={viewInvoice} />
                </Modal>
            )}

            {payInvoice && (
                <Modal title="Submit Payment" onClose={() => setPayInvoice(null)}>
                    <PaymentRequestForm invoice={payInvoice} onSubmit={handlePaymentRequest} onClose={() => setPayInvoice(null)} loading={saving} />
                </Modal>
            )}
        </div>
    );
}