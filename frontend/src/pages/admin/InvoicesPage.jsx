import { useEffect, useState } from 'react';
import { invoicesAPI } from '../../api/services';

const STATUSES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'VND', 'AUD', 'CAD'];

const emptyForm = {
    code: '', projectId: '', contractId: '', title: '', status: 'DRAFT',
    invoiceDate: '', dueDate: '', paidDate: '', currency: 'USD',
    subtotalAmount: '', taxAmount: '', discountAmount: '', totalAmount: '',
    amountPaid: '', balanceDue: '', clientName: '', clientEmail: '',
    clientPhone: '', documentUrl: '', description: '', notes: '', active: true,
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

function InvoiceForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        ['projectId', 'contractId', 'subtotalAmount', 'taxAmount', 'discountAmount',
            'totalAmount', 'amountPaid', 'balanceDue'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        ['invoiceDate', 'dueDate', 'paidDate'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Invoice Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Invoice Code *</label>
                        <input name="code" value={form.code} onChange={handleChange} placeholder="INV-001" required />
                    </div>
                    <div className="form-field">
                        <label>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Project Phase 1 Invoice" required />
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
                        <label>Contract ID</label>
                        <input name="contractId" type="number" value={form.contractId} onChange={handleChange} placeholder="Optional" />
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
                        <label>Invoice Date</label>
                        <input name="invoiceDate" type="date" value={form.invoiceDate} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label>Due Date</label>
                        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-field">
                    <label>Paid Date</label>
                    <input name="paidDate" type="date" value={form.paidDate} onChange={handleChange} />
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
                <div className="form-row">
                    <div className="form-field">
                        <label>Amount Paid</label>
                        <input name="amountPaid" type="number" min="0" step="0.01" value={form.amountPaid} onChange={handleChange} placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label>Balance Due</label>
                        <input name="balanceDue" type="number" min="0" step="0.01" value={form.balanceDue} onChange={handleChange} placeholder="0.00" />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Additional</div>
                <div className="form-field">
                    <label>Document URL</label>
                    <input name="documentUrl" value={form.documentUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-field">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Invoice description..." />
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
                    {loading ? 'Saving...' : 'Save Invoice →'}
                </button>
            </div>
        </form>
    );
}

function StatusModal({ invoice, onUpdate, onClose }) {
    const [status, setStatus] = useState(invoice.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await invoicesAPI.updateStatus(invoice.id, { status });
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
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{invoice.code}</strong>
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

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editInvoice, setEditInvoice] = useState(null);
    const [statusInvoice, setStatusInvoice] = useState(null);

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

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await invoicesAPI.create(form);
            setShowCreate(false);
            fetchInvoices();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create invoice');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await invoicesAPI.update(editInvoice.id, form);
            setEditInvoice(null);
            fetchInvoices();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update invoice');
        } finally {
            setSaving(false);
        }
    };

    const filtered = invoices.filter(i => {
        const matchSearch = !search ||
            i.code?.toLowerCase().includes(search.toLowerCase()) ||
            i.title?.toLowerCase().includes(search.toLowerCase()) ||
            i.clientName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || i.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalDue = invoices
        .filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
        .reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Invoices</h1>
                    <p className="page-subtitle">
                        {invoices.length} total
                        {totalDue > 0 && (
                            <span className="pending-badge">${totalDue.toLocaleString()} outstanding</span>
                        )}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + New Invoice
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
                        <div className="empty-icon">▤</div>
                        <h3>No invoices found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Create your first invoice'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Invoice</button>
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
                            <th>Balance Due</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(i => (
                            <tr key={i.id}>
                                <td><code className="code-badge">{i.code}</code></td>
                                <td>
                                    <div className="cell-title">{i.title}</div>
                                    {i.projectCode && <div className="cell-sub">Project: {i.projectCode}</div>}
                                </td>
                                <td>
                                    <div className="cell-title">{i.clientName}</div>
                                    {i.clientEmail && <div className="cell-sub">{i.clientEmail}</div>}
                                </td>
                                <td>
                                    {i.totalAmount
                                        ? <span style={{ color: 'var(--text-primary)' }}>{i.currency} {Number(i.totalAmount).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td>
                                    {i.balanceDue > 0
                                        ? <span style={{ color: '#f87171' }}>{i.currency} {Number(i.balanceDue).toLocaleString()}</span>
                                        : <span style={{ color: '#34d399' }}>Paid</span>
                                    }
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${i.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusInvoice(i)}
                                        title="Click to change status"
                                    >
                                        {i.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setEditInvoice(i)} title="Edit">✎</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="New Invoice" onClose={() => setShowCreate(false)}>
                    <InvoiceForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editInvoice && (
                <Modal title="Edit Invoice" onClose={() => setEditInvoice(null)}>
                    <InvoiceForm
                        initial={{
                            ...editInvoice,
                            projectId: editInvoice.projectId || '',
                            contractId: editInvoice.contractId || '',
                            subtotalAmount: editInvoice.subtotalAmount || '',
                            taxAmount: editInvoice.taxAmount || '',
                            discountAmount: editInvoice.discountAmount || '',
                            totalAmount: editInvoice.totalAmount || '',
                            amountPaid: editInvoice.amountPaid || '',
                            balanceDue: editInvoice.balanceDue || '',
                            invoiceDate: editInvoice.invoiceDate || '',
                            dueDate: editInvoice.dueDate || '',
                            paidDate: editInvoice.paidDate || '',
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditInvoice(null)}
                        loading={saving}
                    />
                </Modal>
            )}

            {statusInvoice && (
                <Modal title="Update Status" onClose={() => setStatusInvoice(null)}>
                    <StatusModal invoice={statusInvoice} onUpdate={fetchInvoices} onClose={() => setStatusInvoice(null)} />
                </Modal>
            )}
        </div>
    );
}