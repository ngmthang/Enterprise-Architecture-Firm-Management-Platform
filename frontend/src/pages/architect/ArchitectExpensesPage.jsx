import { useEffect, useState } from 'react';
import { expensesAPI } from '../../api/services';

const CATEGORIES = ['MATERIALS', 'LABOR', 'EQUIPMENT', 'SOFTWARE', 'TRAVEL', 'UTILITIES', 'MARKETING', 'OFFICE', 'PROFESSIONAL_SERVICES', 'OTHER'];
const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'VND', 'AUD', 'CAD'];

const emptyForm = {
    title: '', expenseReference: '', description: '', category: 'OTHER',
    status: 'PENDING', amount: '', currency: 'USD', expenseDate: '',
    vendorName: '', receiptUrl: '', notes: '',
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

function ExpenseForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.amount = parseFloat(payload.amount);
        if (!payload.expenseReference) delete payload.expenseReference;
        if (!payload.vendorName) delete payload.vendorName;
        if (!payload.receiptUrl) delete payload.receiptUrl;
        if (!payload.notes) delete payload.notes;
        if (!payload.description) delete payload.description;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Expense Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Site visit travel" required />
                    </div>
                    <div className="form-field">
                        <label>Reference</label>
                        <input name="expenseReference" value={form.expenseReference} onChange={handleChange} placeholder="EXP-001" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} required>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
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
                    <label>Expense Date *</label>
                    <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Vendor & Details</div>
                <div className="form-field">
                    <label>Vendor Name</label>
                    <input name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Vendor or supplier name" />
                </div>
                <div className="form-field">
                    <label>Receipt URL</label>
                    <input name="receiptUrl" value={form.receiptUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-field">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Expense description..." />
                </div>
                <div className="form-field">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Internal notes..." />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Expense →'}
                </button>
            </div>
        </form>
    );
}

export default function ArchitectExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editExpense, setEditExpense] = useState(null);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await expensesAPI.getAll();
            setExpenses(res.data?.data || []);
        } catch (e) {
            setError('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await expensesAPI.create(form);
            setShowCreate(false);
            fetchExpenses();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create expense');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await expensesAPI.update(editExpense.id, form);
            setEditExpense(null);
            fetchExpenses();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update expense');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await expensesAPI.delete(id);
            fetchExpenses();
        } catch (e) {
            setError('Failed to delete expense');
        }
    };

    const filtered = expenses.filter(e => {
        const matchSearch = !search ||
            e.title?.toLowerCase().includes(search.toLowerCase()) ||
            e.vendorName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || e.status === filterStatus;
        const matchCategory = !filterCategory || e.category === filterCategory;
        return matchSearch && matchStatus && matchCategory;
    });

    const totalAmount = filtered.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const pendingCount = expenses.filter(e => e.status === 'PENDING').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Expenses</h1>
                    <p className="page-subtitle">
                        {expenses.length} total
                        {pendingCount > 0 && <span className="pending-badge">{pendingCount} pending</span>}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Expense</button>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by title or vendor..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                </select>
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {filtered.length > 0 && (
                <div className="expenses-summary">
                    Showing {filtered.length} expenses — Total: <strong>${totalAmount.toLocaleString()}</strong>
                </div>
            )}

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">▽</div>
                        <h3>No expenses found</h3>
                        <p>{search || filterStatus || filterCategory ? 'Try adjusting your filters' : 'Add your first expense'}</p>
                        {!search && !filterStatus && !filterCategory && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Expense</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Title</th><th>Category</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(e => (
                            <tr key={e.id}>
                                <td>
                                    <div className="cell-title">{e.title}</div>
                                    {e.expenseReference && <div className="cell-sub">{e.expenseReference}</div>}
                                </td>
                                <td><span className="type-badge">{e.category?.replace(/_/g, ' ')}</span></td>
                                <td>{e.vendorName || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{e.currency} {Number(e.amount).toLocaleString()}</span></td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : '—'}</td>
                                <td><span className={`status-badge status-${e.status?.toLowerCase()}`}>{e.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setEditExpense(e)} title="Edit">✎</button>
                                        <button className="action-btn action-btn-danger" onClick={() => handleDelete(e.id)} title="Delete">✕</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Add Expense" onClose={() => setShowCreate(false)}>
                    <ExpenseForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editExpense && (
                <Modal title="Edit Expense" onClose={() => setEditExpense(null)}>
                    <ExpenseForm
                        initial={{ ...editExpense, amount: editExpense.amount || '', expenseDate: editExpense.expenseDate || '' }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditExpense(null)}
                        loading={saving}
                    />
                </Modal>
            )}
        </div>
    );
}