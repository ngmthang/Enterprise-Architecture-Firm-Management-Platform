import { useEffect, useState } from 'react';
import { notificationsAPI, usersAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';

const NOTIFICATION_TYPES = ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'PROJECT', 'INVOICE', 'PAYMENT', 'CONSULTATION'];

const emptyForm = {
    userId: '', title: '', message: '', type: 'INFO',
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

function NotificationForm({ onSubmit, onClose, loading, users }) {
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, userId: parseInt(form.userId) });
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
                <div className="form-section-title">Notification Info</div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Send To (User) *</label>
                        <select name="userId" value={form.userId} onChange={handleChange} required>
                            <option value="">Select user...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.fullname || u.email}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Type *</label>
                        <select name="type" value={form.type} onChange={handleChange} required>
                            {NOTIFICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={handleChange}
                           placeholder="Notification title" required />
                </div>
                <div className="form-field">
                    <label>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                              rows={4} placeholder="Notification message..." required />
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Notification →'}
                </button>
            </div>
        </form>
    );
}

const typeColors = {
    INFO: { bg: 'rgba(14,165,233,0.1)', color: '#7dd3fc' },
    SUCCESS: { bg: 'rgba(16,185,129,0.1)', color: '#34d399' },
    WARNING: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24' },
    ERROR: { bg: 'rgba(239,68,68,0.1)', color: '#f87171' },
    PROJECT: { bg: 'rgba(99,102,241,0.1)', color: '#a5b4fc' },
    INVOICE: { bg: 'rgba(201,169,110,0.1)', color: '#c9a96e' },
    PAYMENT: { bg: 'rgba(16,185,129,0.1)', color: '#34d399' },
    CONSULTATION: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24' },
};

export default function NotificationsPage() {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterRead, setFilterRead] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [notifRes, usersRes] = await Promise.allSettled([
                notificationsAPI.getAll(),
                usersAPI.getAll(),
            ]);
            setNotifications(notifRes.value?.data?.data || []);
            setUsers(usersRes.value?.data?.data || []);
        } catch (e) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        try {
            await notificationsAPI.create(form);
            setShowCreate(false);
            fetchData();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to send notification');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationsAPI.markRead(id, { read: true });
            fetchData();
        } catch (e) {
            setError('Failed to mark as read');
        }
    };

    const filtered = notifications.filter(n => {
        const matchSearch = !search ||
            n.title?.toLowerCase().includes(search.toLowerCase()) ||
            n.message?.toLowerCase().includes(search.toLowerCase());
        const matchType = !filterType || n.type === filterType;
        const matchRead = !filterRead ||
            (filterRead === 'unread' && !n.read) ||
            (filterRead === 'read' && n.read);
        return matchSearch && matchType && matchRead;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">
                        {notifications.length} total
                        {unreadCount > 0 && <span className="pending-badge">{unreadCount} unread</span>}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                    + Send Notification
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
                    placeholder="Search by title or message..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    {NOTIFICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="filter-select" value={filterRead} onChange={e => setFilterRead(e.target.value)}>
                    <option value="">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                </select>
            </div>

            <div className="page-table-card">
                {loading ? (
                    <div className="table-loading">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="table-empty-state">
                        <div className="empty-icon">◉</div>
                        <h3>No notifications found</h3>
                        <p>{search || filterType || filterRead ? 'Try adjusting your filters' : 'Send your first notification'}</p>
                        {!search && !filterType && !filterRead && (
                            <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Send Notification</button>
                        )}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Type</th>
                            <th>Title</th>
                            <th>User ID</th>
                            <th>Sent</th>
                            <th>Read</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(n => {
                                const colors = typeColors[n.type] || typeColors.INFO;
                                return (
                                    <tr key={n.id} style={{ opacity: n.read ? 0.6 : 1 }}>
                                        <td>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '0.2rem 0.6rem', borderRadius: '2px',
                            background: colors.bg, color: colors.color
                        }}>
                          {n.type}
                        </span>
                                        </td>
                                        <td>
                                            <div className="cell-title" style={{ fontWeight: n.read ? 400 : 600 }}>
                                                {n.title}
                                            </div>
                                            <div className="cell-sub" style={{
                                                maxWidth: '300px', overflow: 'hidden',
                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                            }}>
                                                {n.message}
                                            </div>
                                        </td>
                                        <td>
                                            <code className="code-badge">#{n.userId}</code>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td>
                                            {n.read
                                                ? <span className="status-badge status-active">Read</span>
                                                : <span className="status-badge status-pending">Unread</span>
                                            }
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                {!n.read && (
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleMarkRead(n.id)}
                                                        title="Mark as read"
                                                    >
                                                        ✓
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && (
                <Modal title="Send Notification" onClose={() => setShowCreate(false)}>
                    <NotificationForm
                        onSubmit={handleCreate}
                        onClose={() => setShowCreate(false)}
                        loading={saving}
                        users={users}
                    />
                </Modal>
            )}
        </div>
    );
}