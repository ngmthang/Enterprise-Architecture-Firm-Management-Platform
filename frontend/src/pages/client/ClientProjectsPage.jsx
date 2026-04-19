import { useEffect, useState } from 'react';
import { projectsAPI } from '../../api/services';

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

function ProjectDetail({ project }) {
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
        </div>
    );
}

export default function ClientProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewProject, setViewProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await projectsAPI.getPublic();
                setProjects(res.data?.data || []);
            } catch (e) {
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const statuses = [...new Set(projects.map(p => p.status).filter(Boolean))];

    const filtered = projects.filter(p => {
        const matchSearch = !search ||
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.code?.toLowerCase().includes(search.toLowerCase());
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

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by name or code..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◈</div>
                        <h3>No projects found</h3>
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'No active projects yet'}</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Code</th><th>Project</th><th>Type</th><th>Timeline</th><th>Status</th><th>Actions</th></tr>
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
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}
                                    {p.targetEndDate && ` → ${new Date(p.targetEndDate).toLocaleDateString()}`}
                                </td>
                                <td><span className={`status-badge status-${p.status?.toLowerCase()}`}>{p.status?.replace(/_/g, ' ')}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewProject(p)} title="View details">◉</button>
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
                    <ProjectDetail project={viewProject} />
                </Modal>
            )}
        </div>
    );
}