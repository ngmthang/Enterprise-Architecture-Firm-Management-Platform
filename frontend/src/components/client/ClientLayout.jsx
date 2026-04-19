import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
    { section: 'My Account', items: [
            { path: '/client', label: 'Overview', icon: '▦' },
            { path: '/client/projects', label: 'My Projects', icon: '◈' },
            { path: '/client/quotations', label: 'Quotations', icon: '◇' },
            { path: '/client/contracts', label: 'Contracts', icon: '◻' },
            { path: '/client/invoices', label: 'Invoices', icon: '▤' },
        ]},
    { section: 'Support', items: [
            { path: '/client/consultations', label: 'Consultations', icon: '◑' },
            { path: '/client/notifications', label: 'Notifications', icon: '◉' },
        ]},
];

export default function ClientLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path) => {
        if (path === '/client') return location.pathname === '/client';
        return location.pathname.startsWith(path);
    };

    return (
        <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-brand">
                        <span className="brand-mark">◆</span>
                        {!collapsed && <span className="brand-name">ARCVAULT</span>}
                    </Link>
                    <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? '▷' : '◁'}
                    </button>
                </div>
                {!collapsed && (
                    <div className="sidebar-role-badge">
                        <span className="role-tag role-client">CLIENT PORTAL</span>
                    </div>
                )}
                <nav className="sidebar-nav">
                    {navItems.map((section) => (
                        <div key={section.section} className="nav-section">
                            {!collapsed && <span className="nav-section-label">{section.section}</span>}
                            {section.items.map((item) => (
                                <Link key={item.path} to={item.path}
                                      className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                      title={collapsed ? item.label : ''}>
                                    <span className="nav-icon">{item.icon}</span>
                                    {!collapsed && <span className="nav-label">{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">{user?.email?.charAt(0).toUpperCase() || 'C'}</div>
                        {!collapsed && (
                            <div className="user-info">
                                <span className="user-name">{user?.email}</span>
                                <span className="user-role">Client</span>
                            </div>
                        )}
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Sign out">⏻</button>
                </div>
            </aside>
            <main className="admin-main"><Outlet /></main>
        </div>
    );
}