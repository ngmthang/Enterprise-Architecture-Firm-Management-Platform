import { useEffect, useState } from 'react';
import { usersAPI } from '../../api/services';
import apiClient from '../../api/client';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'ARCHITECT', 'PROJECT_MANAGER', 'STAFF', 'CLIENT'];

const emptyForm = {
    fullname: '', email: '', password: '', phone: '', role: 'CLIENT',
};

const roleColors = {
    SUPER_ADMIN: { bg: 'rgba(201,169,110,0.15)', color: '#c9a96e' },
    ADMIN: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
    ARCHITECT: { bg: 'rgba(14,165,233,0.15)', color: '#7dd3fc' },
    PROJECT_MANAGER: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
    STAFF: { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
    CLIENT: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
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

function UserForm({ onSubmit, onClose, loading }) {
    const [form, setForm] = useState(emptyForm);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.phone) delete payload.phone;
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">User Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Full Name *</label>
                        <input name="fullname" value={form.fullname} onChange={handleChange}
                               placeholder="John Smith" required />
                    </div>
                    <div className="form-field">
                        <label>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange}
                               placeholder="john@example.com" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                               placeholder="+1 234 567 8900" />
                    </div>
                    <div className="form-field">
                        <label>Role *</label>
                        <select name="role" value={form.role} onChange={handleChange} required>
                            {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Password *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 8 characters"
                            required
                            minLength={8}
                            style={{ paddingRight: '3rem' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '0.75rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                fontSize: '0.75rem', cursor: 'pointer', background: 'none', border: 'none'
                            }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User →'}
                </button>
            </div>
        </form>
    );
}

function UserDetail({ user }) {
    const roleColor = roleColors[user.roles?.[0]] || roleColors.CLIENT;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-dim)',
                    border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 600
                }}>
                    {user.fullname?.charAt(0) || user.email?.charAt(0)}
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>
                        {user.fullname}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</div>
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{user.phone || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Roles</span>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                        {user.roles?.map(r => {
                            const rc = roleColors[r] || roleColors.CLIENT;
                            return (
                                <span key={r} style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
                                    textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px',
                                    background: rc.bg, color: rc.color
                                }}>{r.replace(/_/g, ' ')}</span>
                            );
                        })}
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Account Status</span>
                    <span className={`status-badge ${user.enabled ? 'status-active' : 'status-cancelled'}`}>
            {user.enabled ? 'Active' : 'Disabled'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Email Verified</span>
                    <span className={`status-badge ${user.emailVerified ? 'status-active' : 'status-pending'}`}>
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}
          </span>
                </div>
            </div>
        </div>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await usersAPI.getAll();
            setUsers(res.data?.data || []);
        } catch (e) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await apiClient.post('/api/v1/users', form);
            setShowCreate(false);
            setSuccess('User created successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchUsers();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.phone?.toLowerCase().includes(search.toLowerCase());
        const matchRole = !filterRole || u.roles?.includes(filterRole);
        return matchSearch && matchRole;
    });

    const activeCount = users.filter(u => u.enabled).length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">
                        {users.length} total
                        <span className="pending-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
              {activeCount} active
            </span>
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + New User
                </button>
            </div>

            {error && (
                <div className="page-error" onClick={() => setError('')}>
                    ⚠ {error} <span style={{ opacity: 0.5 }}>✕</span>
                </div>
            )}
            {success && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    ✓ {success}
                </div>
            )}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by name, email, or phone..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                    <option value="">All Roles</option>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◯</div>
                        <h3>No users found</h3>
                        <p>{search || filterRole ? 'Try adjusting your filters' : 'Create your first user'}</p>
                        {!search && !filterRole && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New User</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Roles</th>
                            <th>Email Verified</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)',
                                            border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '0.8rem', color: 'var(--accent)',
                                            fontWeight: 600, flexShrink: 0
                                        }}>
                                            {u.fullname?.charAt(0) || u.email?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="cell-title">{u.fullname}</div>
                                            <div className="cell-sub">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{u.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                        {u.roles?.map(r => {
                                            const rc = roleColors[r] || roleColors.CLIENT;
                                            return (
                                                <span key={r} style={{
                                                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
                                                    textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '2px',
                                                    background: rc.bg, color: rc.color
                                                }}>{r.replace(/_/g, ' ')}</span>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td>
                    <span className={`status-badge ${u.emailVerified ? 'status-active' : 'status-pending'}`}>
                      {u.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                                </td>
                                <td>
                    <span className={`status-badge ${u.enabled ? 'status-active' : 'status-cancelled'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn" onClick={() => setViewUser(u)} title="View details">◉</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Create New User" onClose={() => setShowCreate(false)}>
                    <UserForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={saving} />
                </Modal>
            )}

            {viewUser && (
                <Modal title="User Details" onClose={() => setViewUser(null)}>
                    <UserDetail user={viewUser} />
                </Modal>
            )}
        </div>
    );
}