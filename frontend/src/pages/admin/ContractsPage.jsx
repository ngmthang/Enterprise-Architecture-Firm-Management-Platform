import { useEffect, useState } from 'react';
import { contractsAPI } from '../../api/services';

const STATUSES = ['DRAFT', 'SENT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'TERMINATED', 'CANCELLED'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'VND', 'AUD', 'CAD'];

const emptyForm = {
    code: '', projectId: '', quotationId: '', title: '', status: 'DRAFT',
    contractDate: '', startDate: '', endDate: '',
    signedByClient: false, signedByCompany: false,
    clientName: '', clientEmail: '', clientPhone: '',
    contractValue: '', currency: 'USD', documentUrl: '',
    scopeSummary: '', termsAndConditions: '', notes: '', active: true,
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

function ContractForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        ['projectId', 'quotationId', 'contractValue'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        ['contractDate', 'startDate', 'endDate'].forEach(k => {
            if (!payload[k]) delete payload[k];
        });
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Contract Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Contract Code *</label>
                        <input name="code" value={form.code} onChange={handleChange} placeholder="CON-001" required />
                    </div>
                    <div className="form-field">
                        <label>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Architectural Services Agreement" required />
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
                        <label>Quotation ID</label>
                        <input name="quotationId" type="number" value={form.quotationId} onChange={handleChange} placeholder="Optional" />
                    </div>
                </div>
                <div className="form-field">
                    <label>Contract Value</label>
                    <input name="contractValue" type="number" min="0" step="0.01" value={form.contractValue} onChange={handleChange} placeholder="0.00" />
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
                        <label>Contract Date</label>
                        <input name="contractDate" type="date" value={form.contractDate} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label>Start Date</label>
                        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-field">
                    <label>End Date</label>
                    <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Signatures</div>
                <div className="form-field form-field-inline">
                    <input name="signedByClient" type="checkbox" id="signedByClient" checked={form.signedByClient} onChange={handleChange} />
                    <label htmlFor="signedByClient" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Signed by client
                    </label>
                </div>
                <div className="form-field form-field-inline">
                    <input name="signedByCompany" type="checkbox" id="signedByCompany" checked={form.signedByCompany} onChange={handleChange} />
                    <label htmlFor="signedByCompany" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Signed by company
                    </label>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Details</div>
                <div className="form-field">
                    <label>Document URL</label>
                    <input name="documentUrl" value={form.documentUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-field">
                    <label>Scope Summary</label>
                    <textarea name="scopeSummary" value={form.scopeSummary} onChange={handleChange} rows={3} placeholder="Summary of contract scope..." />
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
                    {loading ? 'Saving...' : 'Save Contract →'}
                </button>
            </div>
        </form>
    );
}

function StatusModal({ contract, onUpdate, onClose }) {
    const [status, setStatus] = useState(contract.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await contractsAPI.updateStatus(contract.id, { status });
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
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{contract.code}</strong>
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

function DetailView({ contract }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Code</span>
                    <code className="code-badge">{contract.code}</code>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${contract.status?.toLowerCase()}`}>{contract.status}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Client</span>
                    <span className="detail-value">{contract.clientName}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Contract Value</span>
                    <span className="detail-value">{contract.currency} {Number(contract.contractValue || 0).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">End Date</span>
                    <span className="detail-value">{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Signed by Client</span>
                    <span className={`status-badge ${contract.signedByClient ? 'status-active' : 'status-pending'}`}>
            {contract.signedByClient ? 'Yes' : 'No'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Signed by Company</span>
                    <span className={`status-badge ${contract.signedByCompany ? 'status-active' : 'status-pending'}`}>
            {contract.signedByCompany ? 'Yes' : 'No'}
          </span>
                </div>
            </div>
            {contract.scopeSummary && (
                <div className="detail-item">
                    <span className="detail-label">Scope Summary</span>
                    <p className="detail-text">{contract.scopeSummary}</p>
                </div>
            )}
            {contract.notes && (
                <div className="detail-item">
                    <span className="detail-label">Notes</span>
                    <p className="detail-text">{contract.notes}</p>
                </div>
            )}
            {contract.documentUrl && (
                <div className="detail-item">
                    <span className="detail-label">Document</span>
                    <a href={contract.documentUrl} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>
                        View Document →
                    </a>
                </div>
            )}
        </div>
    );
}

export default function ContractsPage() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editContract, setEditContract] = useState(null);
    const [viewContract, setViewContract] = useState(null);
    const [statusContract, setStatusContract] = useState(null);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const res = await contractsAPI.getAll();
            setContracts(res.data?.data || []);
        } catch (e) {
            setError('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContracts(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await contractsAPI.create(form);
            setShowCreate(false);
            fetchContracts();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create contract');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await contractsAPI.update(editContract.id, form);
            setEditContract(null);
            fetchContracts();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update contract');
        } finally {
            setSaving(false);
        }
    };

    const filtered = contracts.filter(c => {
        const matchSearch = !search ||
            c.code?.toLowerCase().includes(search.toLowerCase()) ||
            c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.clientName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const activeCount = contracts.filter(c => c.status === 'ACTIVE' || c.status === 'SIGNED').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Contracts</h1>
                    <p className="page-subtitle">
                        {contracts.length} total
                        {activeCount > 0 && <span className="pending-badge">{activeCount} active</span>}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + New Contract
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
                        <div className="empty-icon">◻</div>
                        <h3>No contracts found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Create your first contract'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Contract</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Value</th>
                            <th>Signatures</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td><code className="code-badge">{c.code}</code></td>
                                <td>
                                    <div className="cell-title">{c.title}</div>
                                    {c.projectCode && <div className="cell-sub">Project: {c.projectCode}</div>}
                                </td>
                                <td>
                                    <div className="cell-title">{c.clientName}</div>
                                    {c.clientEmail && <div className="cell-sub">{c.clientEmail}</div>}
                                </td>
                                <td>
                                    {c.contractValue
                                        ? <span style={{ color: 'var(--text-primary)' }}>{c.currency} {Number(c.contractValue).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <span title="Client" className={`status-badge ${c.signedByClient ? 'status-active' : 'status-draft'}`}>C</span>
                                        <span title="Company" className={`status-badge ${c.signedByCompany ? 'status-active' : 'status-draft'}`}>F</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${c.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusContract(c)}
                                        title="Click to change status"
                                    >
                                        {c.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewContract(c)} title="View">◉</button>
                                        <button className="action-btn" onClick={() => setEditContract(c)} title="Edit">✎</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="New Contract" onClose={() => setShowCreate(false)}>
                    <ContractForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editContract && (
                <Modal title="Edit Contract" onClose={() => setEditContract(null)}>
                    <ContractForm
                        initial={{
                            ...editContract,
                            projectId: editContract.projectId || '',
                            quotationId: editContract.quotationId || '',
                            contractValue: editContract.contractValue || '',
                            contractDate: editContract.contractDate || '',
                            startDate: editContract.startDate || '',
                            endDate: editContract.endDate || '',
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditContract(null)}
                        loading={saving}
                    />
                </Modal>
            )}

            {viewContract && (
                <Modal title="Contract Details" onClose={() => setViewContract(null)}>
                    <DetailView contract={viewContract} />
                </Modal>
            )}

            {statusContract && (
                <Modal title="Update Status" onClose={() => setStatusContract(null)}>
                    <StatusModal contract={statusContract} onUpdate={fetchContracts} onClose={() => setStatusContract(null)} />
                </Modal>
            )}
        </div>
    );
}