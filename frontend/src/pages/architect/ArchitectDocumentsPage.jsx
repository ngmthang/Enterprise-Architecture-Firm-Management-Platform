import { useEffect, useState } from 'react';
import { projectsAPI } from '../../api/services';
import apiClient from '../../api/client';

const DOC_TYPES = ['BLUEPRINT', 'CONTRACT', 'REPORT', 'INVOICE', 'PERMIT', 'SPECIFICATION', 'PHOTO', 'OTHER'];

const emptyForm = {
    projectId: '', title: '', documentType: 'BLUEPRINT', documentUrl: '',
    fileName: '', mimeType: '', fileSizeBytes: '', description: '',
    publicVisible: false, active: true,
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

function DocumentForm({ onSubmit, onClose, loading, projects }) {
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.projectId = parseInt(payload.projectId);
        if (payload.fileSizeBytes) payload.fileSizeBytes = parseInt(payload.fileSizeBytes);
        else delete payload.fileSizeBytes;
        if (!payload.fileName) delete payload.fileName;
        if (!payload.mimeType) delete payload.mimeType;
        if (!payload.description) delete payload.description;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="architect-notice">
                <span>◈</span>
                <span>Uploaded documents are submitted for admin review before becoming active.</span>
            </div>

            <div className="form-section">
                <div className="form-section-title">Document Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Project *</label>
                        <select name="projectId" value={form.projectId} onChange={handleChange} required>
                            <option value="">Select project...</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Document Type *</label>
                        <select name="documentType" value={form.documentType} onChange={handleChange} required>
                            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={handleChange}
                           placeholder="Floor Plan — Level 1" required />
                </div>
                <div className="form-field">
                    <label>Document URL *</label>
                    <input name="documentUrl" value={form.documentUrl} onChange={handleChange}
                           placeholder="https://storage.example.com/doc.pdf" required />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">File Details</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>File Name</label>
                        <input name="fileName" value={form.fileName} onChange={handleChange}
                               placeholder="floor-plan-level-1.pdf" />
                    </div>
                    <div className="form-field">
                        <label>MIME Type</label>
                        <input name="mimeType" value={form.mimeType} onChange={handleChange}
                               placeholder="application/pdf" />
                    </div>
                </div>
                <div className="form-field">
                    <label>File Size (bytes)</label>
                    <input name="fileSizeBytes" type="number" min="0" value={form.fileSizeBytes}
                           onChange={handleChange} placeholder="1048576" />
                </div>
                <div className="form-field">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                              rows={2} placeholder="Brief document description..." />
                </div>
                <div className="form-field form-field-inline">
                    <input name="publicVisible" type="checkbox" id="publicVisible"
                           checked={form.publicVisible} onChange={handleChange} />
                    <label htmlFor="publicVisible" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Visible to client publicly
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit Document →'}
                </button>
            </div>
        </form>
    );
}

const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ArchitectDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [docsRes, projRes] = await Promise.allSettled([
                apiClient.get('/api/project-documents'),
                projectsAPI.getAll(),
            ]);
            setDocuments(docsRes.value?.data?.data || []);
            setProjects(projRes.value?.data?.data || []);
        } catch (e) {
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await apiClient.post('/api/project-documents', form);
            setShowCreate(false);
            setSuccess('Document submitted for admin review.');
            setTimeout(() => setSuccess(''), 4000);
            fetchData();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to upload document');
        } finally {
            setSaving(false);
        }
    };

    const filtered = documents.filter(d => {
        const matchSearch = !search ||
            d.title?.toLowerCase().includes(search.toLowerCase()) ||
            d.fileName?.toLowerCase().includes(search.toLowerCase()) ||
            d.projectName?.toLowerCase().includes(search.toLowerCase());
        const matchType = !filterType || d.documentType === filterType;
        const matchProject = !filterProject || String(d.projectId) === filterProject;
        return matchSearch && matchType && matchProject;
    });

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Documents</h1>
                    <p className="page-subtitle">{documents.length} total documents</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Upload Document</button>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}
            {success && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    ✓ {success}
                </div>
            )}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by title, file, or project..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="filter-select" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                    <option value="">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">▤</div>
                        <h3>No documents found</h3>
                        <p>{search || filterType || filterProject ? 'Try adjusting your filters' : 'Upload your first document'}</p>
                        {!search && !filterType && !filterProject && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Upload Document</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr><th>Title</th><th>Type</th><th>Project</th><th>File Size</th><th>Public</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {filtered.map(d => (
                            <tr key={d.id}>
                                <td>
                                    <div className="cell-title">{d.title}</div>
                                    {d.fileName && <div className="cell-sub">{d.fileName}</div>}
                                </td>
                                <td><span className="type-badge">{d.documentType}</span></td>
                                <td>{d.projectCode ? <code className="code-badge">{d.projectCode}</code> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatFileSize(d.fileSizeBytes)}</td>
                                <td>{d.publicVisible ? <span className="status-badge status-active">Yes</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>}</td>
                                <td><span className={`status-badge ${d.active ? 'status-active' : 'status-pending'}`}>{d.active ? 'Active' : 'Pending'}</span></td>
                                <td>
                                    <div className="action-btns">
                                        {d.documentUrl && (
                                            <a href={d.documentUrl} target="_blank" rel="noreferrer" className="action-btn" title="View document"
                                               style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↗</a>
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
                <Modal title="Upload Document" onClose={() => setShowCreate(false)}>
                    <DocumentForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} projects={projects} />
                </Modal>
            )}
        </div>
    );
}