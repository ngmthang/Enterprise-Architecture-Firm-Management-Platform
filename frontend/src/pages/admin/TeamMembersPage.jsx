import { useEffect, useState } from 'react';
import { teamAPI } from '../../api/services';

const emptyForm = {
    fullName: '', jobTitle: '', shortBio: '', fullBio: '',
    profileImageUrl: '', email: '', phone: '', linkedinUrl: '',
    displayOrder: 1, featured: false, active: true,
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

function TeamMemberForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial || emptyForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            displayOrder: parseInt(form.displayOrder) || 1,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Personal Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Full Name *</label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Smith" required />
                    </div>
                    <div className="form-field">
                        <label>Job Title *</label>
                        <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Senior Architect" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@firm.com" />
                    </div>
                    <div className="form-field">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                    </div>
                </div>
                <div className="form-field">
                    <label>LinkedIn URL</label>
                    <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/janesmith" />
                </div>
                <div className="form-field">
                    <label>Profile Image URL</label>
                    <input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Bio</div>
                <div className="form-field">
                    <label>Short Bio * (max 500 chars)</label>
                    <textarea name="shortBio" value={form.shortBio} onChange={handleChange} rows={3}
                              placeholder="Brief professional summary..." required maxLength={500} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {form.shortBio.length}/500
          </span>
                </div>
                <div className="form-field">
                    <label>Full Bio</label>
                    <textarea name="fullBio" value={form.fullBio} onChange={handleChange} rows={5}
                              placeholder="Detailed biography..." />
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Display Settings</div>
                <div className="form-field">
                    <label>Display Order *</label>
                    <input name="displayOrder" type="number" min="1" value={form.displayOrder} onChange={handleChange} required />
                </div>
                <div className="form-field form-field-inline">
                    <input name="featured" type="checkbox" id="featured" checked={form.featured} onChange={handleChange} />
                    <label htmlFor="featured" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Featured on public website
                    </label>
                </div>
                <div className="form-field form-field-inline">
                    <input name="active" type="checkbox" id="active" checked={form.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ textTransform: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Active (visible publicly)
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Member →'}
                </button>
            </div>
        </form>
    );
}

export default function TeamMembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editMember, setEditMember] = useState(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await teamAPI.getAll();
            setMembers(res.data?.data || []);
        } catch (e) {
            setError('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await teamAPI.create(form);
            setShowCreate(false);
            fetchMembers();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create team member');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (form) => {
        setSaving(true);
        try {
            await teamAPI.update(editMember.id, form);
            setEditMember(null);
            fetchMembers();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to update team member');
        } finally {
            setSaving(false);
        }
    };

    const filtered = members.filter(m =>
        !search ||
        m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        m.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-subtitle">{members.length} members</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + Add Member
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
                    placeholder="Search by name, title, or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◯</div>
                        <h3>No team members found</h3>
                        <p>{search ? 'Try adjusting your search' : 'Add your first team member'}</p>
                        {!search && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Member</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Member</th>
                            <th>Job Title</th>
                            <th>Contact</th>
                            <th>Order</th>
                            <th>Featured</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {m.profileImageUrl ? (
                                                <img
                                                    src={m.profileImageUrl}
                                                    alt={m.fullName}
                                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                                                    onError={e => e.target.style.display = 'none'}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, flexShrink: 0
                                                }}>
                                                    {m.fullName?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="cell-title">{m.fullName}</div>
                                        </div>
                                    </td>
                                    <td><span className="type-badge">{m.jobTitle}</span></td>
                                    <td>
                                        {m.email && <div className="cell-sub">{m.email}</div>}
                                        {m.phone && <div className="cell-sub">{m.phone}</div>}
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                        #{m.displayOrder}
                                    </td>
                                    <td>
                                        {m.featured
                                            ? <span className="status-badge status-active">Yes</span>
                                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                                        }
                                    </td>
                                    <td>
                    <span className={`status-badge ${m.active ? 'status-active' : 'status-cancelled'}`}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn" onClick={() => setEditMember(m)} title="Edit">✎</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Add Team Member" onClose={() => setShowCreate(false)}>
                    <TeamMemberForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {editMember && (
                <Modal title="Edit Team Member" onClose={() => setEditMember(null)}>
                    <TeamMemberForm
                        initial={editMember}
                        onSubmit={handleUpdate}
                        onClose={() => setEditMember(null)}
                        loading={saving}
                    />
                </Modal>
            )}
        </div>
    );
}