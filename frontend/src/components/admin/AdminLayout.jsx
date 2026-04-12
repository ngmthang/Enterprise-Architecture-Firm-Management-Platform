import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { section: 'Overview', items: [
    { path: '/admin', label: 'Dashboard', icon: '▦' },
    { path: '/admin/notifications', label: 'Notifications', icon: '◉' },
  ]},
  { section: 'Operations', items: [
    { path: '/admin/projects', label: 'Projects', icon: '◈' },
    { path: '/admin/quotations', label: 'Quotations', icon: '◇' },
    { path: '/admin/contracts', label: 'Contracts', icon: '◻' },
    { path: '/admin/invoices', label: 'Invoices', icon: '▤' },
    { path: '/admin/payments', label: 'Payments', icon: '◎' },
    { path: '/admin/expenses', label: 'Expenses', icon: '▽' },
  ]},
  { section: 'Clients', items: [
    { path: '/admin/consultations', label: 'Consultations', icon: '◑' },
    { path: '/admin/contacts', label: 'Contact Inquiries', icon: '◐' },
  ]},
  { section: 'Firm', items: [
    { path: '/admin/team', label: 'Team Members', icon: '◯' },
    { path: '/admin/portfolio', label: 'Portfolio', icon: '◰' },
    { path: '/admin/services', label: 'Services', icon: '◱' },
    { path: '/admin/company', label: 'Company Profile', icon: '◲' },
    { path: '/admin/reports', label: 'Reports', icon: '▣' },
  ]},
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
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

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="nav-section">
              {!collapsed && <span className="nav-section-label">{section.section}</span>}
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.name || 'Admin'}</span>
                <span className="user-role">{user?.roles?.[0] || 'Administrator'}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign out">
            ⏻
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
