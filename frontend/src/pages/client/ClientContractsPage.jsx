import { useEffect, useState } from 'react';
import { contractsAPI } from '../../api/services';

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

function ContractDetail({ contract }) {
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
                    <span className="detail-label">Contract Value</span>
                    <span className="detail-value" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
            {contract.currency} {Number(contract.contractValue || 0).toLocaleString()}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Contract Date</span>
                    <span className="detail-value">{contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : '—'}</span>
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
            {contract.signedByClient ? 'Yes' : 'Pending'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Signed by Firm</span>
                    <span className={`status-badge ${contract.signedByCompany ? 'status-active' : 'status-pending'}`}>
            {contract.signedByCompany ? 'Yes' : 'Pending'}
          </span>
                </div>
            </div>
            {contract.scopeSummary && (
                <div className="detail-item">
                    <span className="detail-label">Scope Summary</span>
                    <p className="detail-text">{contract.scopeSummary}</p>
                </div>
            )}
            {contract.termsAndConditions && (
                <div className="detail-item">
                    <span className="detail-label">Terms & Conditions</span>
                    <p className="detail-text">{contract.termsAndConditions}</p>
                </div>
            )}
            {contract.documentUrl && (
                <div className="detail-item">
                    <span className="detail-label">Contract Document</span>
                    <a href={contract.documentUrl} target="_blank" rel="noreferrer"
                       className="btn-primary" style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
                        Download Contract →
                    </a>
                </div>
            )}
        </div>
    );
}

export default function ClientContractsPage() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewContract, setViewContract] = useState(null);

    useEffect(() => {
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
        fetchContracts();
    }, []);

    const statuses = [...new Set(contracts.map(c => c.status).filter(Boolean))];

    const filtered = contracts.filter(c => {
        const matchSearch = !search ||
            c.code?.toLowerCase().includes(search.toLowerCase()) ||
            c.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Contracts</h1>
                    <p className="page-subtitle">{contracts.length} total contracts</p>
                </div>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}

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
                        <div className="empty-icon">◻</div>
                        <h3>No contracts found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'No contracts yet'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Code</th><th>Title</th><th>Value</th><th>End Date</th><th>Signatures</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td><code className="code-badge">{c.code}</code></td>
                                <td><div className="cell-title">{c.title}</div></td>
                                <td>
                                    {c.contractValue
                                        ? <span style={{ color: 'var(--text-primary)' }}>{c.currency} {Number(c.contractValue).toLocaleString()}</span>
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <span title="Client" className={`status-badge ${c.signedByClient ? 'status-active' : 'status-draft'}`}>C</span>
                                        <span title="Firm" className={`status-badge ${c.signedByCompany ? 'status-active' : 'status-draft'}`}>F</span>
                                    </div>
                                </td>
                                <td><span className={`status-badge status-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewContract(c)} title="View details">◉</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {viewContract && (
                <Modal title="Contract Details" onClose={() => setViewContract(null)}>
                    <ContractDetail contract={viewContract} />
                </Modal>
            )}
        </div>
    );
}