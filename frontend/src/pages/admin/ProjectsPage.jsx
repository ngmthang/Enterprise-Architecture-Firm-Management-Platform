import { useEffect, useState } from 'react';
import { projectsAPI } from '../../api/services';

const PROJECT_TYPES = ['ARCHITECTURAL_DESIGN', 'LANDSCAPE_DESIGN', 'RENOVATION',
    'CONSULTATION', 'MASTER_PLANNING', 'INTERIOR_DESIGN'];
const PROJECT_STATUSES = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

const emptyForm = {
    code: '', name: '', projectType: '', status: 'PLANNING',
    clientName: '', clientEmail: '', clientPhone: '',
    location: '', areaSizeSqft: '', estimatedBudget: '',
    startDate: '', targetEndDate: '', actualEndDate: '',
    description: '', notes: '', active: true,
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

function ProjectForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.areaSizeSqft) delete payload.areaSizeSqft;
        if (!payload.estimatedBudget) delete payload.estimatedBudget;
        if (!payload.startDate) delete payload.startDate;
        if (!payload.targetEndDate) delete payload.targetEndDate;
        if (!payload.actualEndDate) delete payload.actualEndDate;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Project Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project Code *</label>
                        <input name="code" value={form.code} onChange={handleChange} placeholder="PRJ-001" required />
                    </div>
                    <div className="form-field">
                        <label>Project Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="The Meridian Tower" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project Type *</label>
                        <select name="projectType" value={form.projectType} onChange={handleChange} required>
                            <option value="">Select type...</option>
                            {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Status</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Location</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="123 Main St, City" />
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
                <div className="form-section-title">Financials & Timeline</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Area Size (sqft)</label>
                        <input name="areaSizeSqft" type="number" min="0" value={form.areaSizeSqft} onChange={handleChange} placeholder="5000" />
                    </div>
                    <div className="form-field">
                        <label>Estimated Budget ($)</label>
                        <input name="estimatedBudget" type="number" min="0" value={form.estimatedBudget} onChange={handleChange} placeholder="500000" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Start Date</label>
                        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label>Target End Date</label>
                        <input name="targetEndDate" type="date" value={form.targetEndDate} onChange={handleChange} />
                    </div>
                </div>
                {initial && (
                    <div className="form-field">
                        <label>Actual End Date</label>
                        <input name="actualEndDate" type="date" value={form.actualEndDate} onChange={handleChange} />
                    </div>
                )}
            </div>

            <div className="form-section">
                <div className="form-section-title">Details</div>
                <div className="form-field">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Project overview..." />
                </div>
                <div className="form-field">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Internal notes..." />
                </div>
                <div className="form-field form-field-inline">
                    <input name="active" type="checkbox" id="active" checked={form.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Active project (visible publicly)
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Project →'}
                </button>
            </div>
        </form>
    );
}

function StatusModal({ project, onUpdate, onClose }) {
    const [status, setStatus] = useState(project.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await projectsAPI.updateStatus(project.id, { status });
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
                    Update status for <strong style={{ color: 'var(--text-primary)' }}>{project.name}</strong>
                </p>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%' }}>
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editProject, setEditProject] = useState(null);
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

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await projectsAPI.create(form);
            setShowCreate(false);
            fetchProjects();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create project');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await projectsAPI.update(editProject.id, form);
            setEditProject(null);
            fetchProjects();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update project');
        } finally {
            setSaving(false);
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
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">{projects.length} total projects</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + New Project
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
                    placeholder="Search by name, code, or client..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
                        <p>{search || filterStatus ? 'Try adjusting your filters' : 'Create your first project to get started'}</p>
                        {!search && !filterStatus && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Project</th>
                            <th>Type</th>
                            <th>Client</th>
                            <th>Budget</th>
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
                                <td>
                                    {p.estimatedBudget
                                        ? `$${Number(p.estimatedBudget).toLocaleString()}`
                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    }
                                </td>
                                <td>
                                    <button
                                        className={`status-badge status-${p.status?.toLowerCase()} status-clickable`}
                                        onClick={() => setStatusProject(p)}
                                        title="Click to change status"
                                    >
                                        {p.status?.replace('_', ' ')}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setEditProject(p)} title="Edit">✎</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="New Project" onClose={() => setShowCreate(false)}>
                    <ProjectForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editProject && (
                <Modal title="Edit Project" onClose={() => setEditProject(null)}>
                    <ProjectForm
                        initial={{
                            ...editProject,
                            areaSizeSqft: editProject.areaSizeSqft || '',
                            estimatedBudget: editProject.estimatedBudget || '',
                            startDate: editProject.startDate || '',
                            targetEndDate: editProject.targetEndDate || '',
                            actualEndDate: editProject.actualEndDate || '',
                        }}
                        onSubmit={handleUpdate}
                        onClose={() => setEditProject(null)}
                        loading={saving}
                    />
                </Modal>
            )}

            {statusProject && (
                <Modal title="Update Status" onClose={() => setStatusProject(null)}>
                    <StatusModal project={statusProject} onUpdate={fetchProjects} onClose={() => setStatusProject(null)} />
                </Modal>
            )}
        </div>
    );
}