import { useEffect, useState } from 'react';
import { projectsAPI, documentsAPI } from '../../api/services';
import apiClient from '../../api/client';

const DOC_TYPES = ['BLUEPRINT', 'CONTRACT', 'REPORT', 'INVOICE', 'PERMIT', 'SPECIFICATION', 'PHOTO', 'CAD_FILE', 'OTHER'];

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
    const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setForm(f => ({
            ...f,
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            fileSizeBytes: file.size,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        payload.projectId = parseInt(payload.projectId);
        if (payload.fileSizeBytes) payload.fileSizeBytes = parseInt(payload.fileSizeBytes);
        else delete payload.fileSizeBytes;
        if (!payload.fileName) delete payload.fileName;
        if (!payload.mimeType) delete payload.mimeType;
        if (!payload.description) delete payload.description;

        // If file mode but no URL yet, use filename as placeholder URL
        if (uploadMode === 'file' && selectedFile && !payload.documentUrl) {
            payload.documentUrl = `uploaded://${selectedFile.name}`;
        }

        onSubmit(payload, selectedFile);
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
                            {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={handleChange}
                           placeholder="Floor Plan — Level 1" required />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">File</div>

                {/* Toggle upload mode */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button type="button"
                            onClick={() => setUploadMode('file')}
                            style={{
                                padding: '0.4rem 1rem', borderRadius: 'var(--radius)', border: '1px solid', cursor: 'pointer',
                                background: uploadMode === 'file' ? 'var(--accent)' : 'transparent',
                                color: uploadMode === 'file' ? 'var(--bg-base)' : 'var(--text-muted)',
                                borderColor: uploadMode === 'file' ? 'var(--accent)' : 'var(--border)',
                                fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
                            }}>
                        ↑ Upload File
                    </button>
                    <button type="button"
                            onClick={() => setUploadMode('url')}
                            style={{
                                padding: '0.4rem 1rem', borderRadius: 'var(--radius)', border: '1px solid', cursor: 'pointer',
                                background: uploadMode === 'url' ? 'var(--accent)' : 'transparent',
                                color: uploadMode === 'url' ? 'var(--bg-base)' : 'var(--text-muted)',
                                borderColor: uploadMode === 'url' ? 'var(--accent)' : 'var(--border)',
                                fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
                            }}>
                        🔗 Enter URL
                    </button>
                </div>

                {uploadMode === 'file' ? (
                    <div className="form-field">
                        <label>Select File</label>
                        <div style={{
                            border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
                            padding: '2rem', textAlign: 'center', cursor: 'pointer',
                            background: selectedFile ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                            borderColor: selectedFile ? 'var(--accent)' : 'var(--border)',
                            transition: 'all 0.2s',
                        }}
                             onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                                accept=".pdf,.dwg,.dxf,.rvt,.skp,.3dm,.obj,.ifc,.psd,.ai,.png,.jpg,.jpeg,.xlsx,.docx,.pptx,.zip,.rar"
                            />
                            {selectedFile ? (
                                <div>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                                    <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{selectedFile.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                    <button type="button"
                                            onClick={e => { e.stopPropagation(); setSelectedFile(null); setForm(f => ({ ...f, fileName: '', mimeType: '', fileSizeBytes: '' })); }}
                                            style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>↑</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Click to select a file</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                        Supports: PDF, DWG, DXF, RVT, SKP, IFC, images, Office files, ZIP
                                    </div>
                                </div>
                            )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Note: File will be stored as a reference URL. Contact your admin to set up cloud storage.
            </span>
                    </div>
                ) : (
                    <div className="form-field">
                        <label>Document URL *</label>
                        <input name="documentUrl" value={form.documentUrl} onChange={handleChange}
                               placeholder="https://storage.example.com/doc.pdf" required={uploadMode === 'url'} />
                    </div>
                )}

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
                <button type="submit" className="btn-primary" disabled={loading || uploading}>
                    {loading ? 'Submitting...' : 'Submit Document →'}
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
                documentsAPI.getAll(),
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

    const handleCreate = async (form, file) => {
        setSaving(true);
        try {
            await documentsAPI.create(form);
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
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
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
                                <td><span className="type-badge">{d.documentType?.replace(/_/g, ' ')}</span></td>
                                <td>{d.projectCode ? <code className="code-badge">{d.projectCode}</code> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatFileSize(d.fileSizeBytes)}</td>
                                <td>{d.publicVisible ? <span className="status-badge status-active">Yes</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>}</td>
                                <td><span className={`status-badge ${d.active ? 'status-active' : 'status-pending'}`}>{d.active ? 'Active' : 'Pending'}</span></td>
                                <td>
                                    <div className="action-btns">
                                        {d.documentUrl && !d.documentUrl.startsWith('uploaded://') && (
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