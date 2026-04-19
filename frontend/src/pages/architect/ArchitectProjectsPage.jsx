import { useEffect, useState } from 'react';
import { projectsAPI } from '../../api/services';

const PROJECT_STATUSES = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

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

function DetailView({ project }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Code</span>
                    <code className="code-badge">{project.code}</code>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge status-${project.status?.toLowerCase()}`}>{project.status}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="type-badge">{project.projectType?.replace(/_/g, ' ')}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{project.location || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Client</span>
                    <span className="detail-value">{project.clientName}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Client Email</span>
                    <span className="detail-value">{project.clientEmail || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">
            {project.estimatedBudget ? `$${Number(project.estimatedBudget).toLocaleString()}` : '—'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Area Size</span>
                    <span className="detail-value">
            {project.areaSizeSqft ? `${Number(project.areaSizeSqft).toLocaleString()} sqft` : '—'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Target End Date</span>
                    <span className="detail-value">{project.targetEndDate ? new Date(project.targetEndDate).toLocaleDateString() : '—'}</span>
                </div>
            </div>
            {project.description && (
                <div className="detail-item">
                    <span className="detail-label">Description</span>
                    <p className="detail-text">{project.description}</p>
                </div>
            )}
            {project.notes && (
                <div className="detail-item">
                    <span className="detail-label">Notes</span>
                    <p className="detail-text">{project.notes}</p>
                </div>
            )}
        </div>
    );
}

function StatusRequestModal({ project, onSubmit, onClose }) {
    const [status, setStatus] = useState(project.status);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(project.id, status, note);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="architect-notice">
                <span>◈</span>
                <span>Status update requests are sent to admin for approval.</span>
            </div>
            <div className="form-field">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Request new status for <strong style={{ color: 'var(--text-primary)' }}>{project.name}</strong>
                </label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', marginTop: '0.5rem' }}>
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>
            <div className="form-field">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Reason / Notes
                </label>
                <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    placeholder="Explain why this status change is needed..."
                    style={{ marginTop: '0.5rem' }}
                />
            </div>
            <div className="form-actions">
                <button className="btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request →'}
                </button>
            </div>
        </div>
    );
}

export default function ArchitectProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewProject, setViewProject] = useState(null);
    const [statusProject, setStatusProject] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await projectsAPI.getAll();
            setProjects(res.data?.data || []);
        } catch (e) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleStatusRequest = async (id, status, note) => {
        try {
            await projectsAPI.updateStatus(id, { status, notes: note });
            setSuccess('Status update submitted — pending admin review.');
            setTimeout(() => setSuccess(''), 4000);
            fetchProjects();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to submit status update');
        }
    };

    const filtered = projects.filter(p => {
        const matchSearch = !search ||
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.code?.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Projects</h1>
                    <p className="page-subtitle">{projects.length} total projects</p>
                </div>
            </div>

            {error && (
                <div className="page-error" onClick={() => setError('')}>
                    ⚠ {error} <span style={{ opacity: 0.5 }}>✕</span>
                </div>
            )}

            {success && (
                <div style={{
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                    fontSize: '0.85rem', marginBottom: '1.5rem'
                }}>
                    ✓ {success}
                </div>
            )}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by name, code, or client..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◈</div>
                        <h3>No projects found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'No projects assigned yet'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Project</th>
                            <th>Type</th>
                            <th>Client</th>
                            <th>Timeline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td><code className="code-badge">{p.code}</code></td>
                                <td>
                                    <div className="cell-title">{p.name}</div>
                                    {p.location && <div className="cell-sub">{p.location}</div>}
                                </td>
                                <td><span className="type-badge">{p.projectType?.replace(/_/g, ' ')}</span></td>
                                <td>
                                    <div className="cell-title">{p.clientName}</div>
                                    {p.clientEmail && <div className="cell-sub">{p.clientEmail}</div>}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}
                                    {p.targetEndDate && ` → ${new Date(p.targetEndDate).toLocaleDateString()}`}
                                </td>
                                <td>
                    <span className={`status-badge status-${p.status?.toLowerCase()}`}>
                      {p.status?.replace(/_/g, ' ')}
                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewProject(p)} title="View details">◉</button>
                                        <button className="action-btn" onClick={() => setStatusProject(p)} title="Request status change">↻</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {viewProject && (
                <Modal title="Project Details" onClose={() => setViewProject(null)}>
                    <DetailView project={viewProject} />
                </Modal>
            )}

            {statusProject && (
                <Modal title="Request Status Change" onClose={() => setStatusProject(null)}>
                    <StatusRequestModal
                        project={statusProject}
                        onSubmit={handleStatusRequest}
                        onClose={() => setStatusProject(null)}
                    />
                </Modal>
            )}
        </div>
    );
}