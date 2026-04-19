import { useEffect, useState } from 'react';
import { notificationsAPI } from '../../api/services';

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

export default function ClientNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRead, setFilterRead] = useState('');
    const [filterType, setFilterType] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationsAPI.getAll();
            setNotifications(res.data?.data || []);
        } catch (e) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleMarkRead = async (id) => {
        try {
            await notificationsAPI.markRead(id, { read: true });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (e) {
            setError('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.read);
        try {
            await Promise.all(unread.map(n => notificationsAPI.markRead(n.id, { read: true })));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (e) {
            setError('Failed to mark all as read');
        }
    };

    const types = [...new Set(notifications.map(n => n.type).filter(Boolean))];
    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = notifications.filter(n => {
        const matchRead = !filterRead ||
            (filterRead === 'unread' && !n.read) ||
            (filterRead === 'read' && n.read);
        const matchType = !filterType || n.type === filterType;
        return matchRead && matchType;
    });

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
                {unreadCount > 0 && (
                    <button className="btn-ghost" onClick={handleMarkAllRead}>Mark all as read</button>
                )}
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}

            <div className="page-filters">
                <select className="filter-select" value={filterRead} onChange={e => setFilterRead(e.target.value)}>
                    <option value="">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                </select>
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-row" style={{ height: '80px' }} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="table-empty-state">
                    <div className="empty-icon">◉</div>
                    <h3>No notifications</h3>
                    <p>{filterRead || filterType ? 'Try adjusting your filters' : "You're all caught up!"}</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {filtered
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(n => {
                            const colors = typeColors[n.type] || typeColors.INFO;
                            return (
                                <div key={n.id} className={`notification-item ${n.read ? 'notification-read' : ''}`}>
                                    <div className="notification-type-dot" style={{ background: colors.color }} />
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <span className="notification-title" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '2px', background: colors.bg, color: colors.color }}>{n.type}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}</span>
                                            </div>
                                        </div>
                                        <p className="notification-message">{n.message}</p>
                                    </div>
                                    {!n.read && (
                                        <button className="action-btn" onClick={() => handleMarkRead(n.id)} title="Mark as read" style={{ flexShrink: 0 }}>✓</button>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}