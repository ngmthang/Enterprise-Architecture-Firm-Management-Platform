import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Nav items with required roles — empty array means all authenticated users can see it
const NAV_CONFIG = [
  {
    section: 'Overview',
    items: [
      { path: '/admin', label: 'Dashboard', icon: '▦', roles: [] },
      { path: '/admin/notifications', label: 'Notifications', icon: '◉', roles: [] },
    ],
  },
  {
    section: 'Operations',
    items: [
      { path: '/admin/projects', label: 'Projects', icon: '◈', roles: [] },
      { path: '/admin/quotations', label: 'Quotations', icon: '◇', roles: ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'] },
      { path: '/admin/contracts', label: 'Contracts', icon: '◻', roles: ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'] },
      { path: '/admin/invoices', label: 'Invoices', icon: '▤', roles: ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'] },
      { path: '/admin/payments', label: 'Payments', icon: '◎', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { path: '/admin/expenses', label: 'Expenses', icon: '▽', roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    section: 'Clients',
    items: [
      { path: '/admin/consultations', label: 'Consultations', icon: '◑', roles: [] },
      { path: '/admin/contacts', label: 'Contact Inquiries', icon: '◐', roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
    ],
  },
  {
    section: 'Firm',
    items: [
      { path: '/admin/team', label: 'Team Members', icon: '◯', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { path: '/admin/portfolio', label: 'Portfolio', icon: '◰', roles: ['SUPER_ADMIN', 'ADMIN', 'ARCHITECT'] },
      { path: '/admin/services', label: 'Services', icon: '◱', roles: ['SUPER_ADMIN', 'ADMIN', 'ARCHITECT'] },
      { path: '/admin/company', label: 'Company Profile', icon: '◲', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { path: '/admin/reports', label: 'Reports', icon: '▣', roles: ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'] },
    ],
  },
];

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ARCHITECT: 'Architect',
  PROJECT_MANAGER: 'Project Manager',
  STAFF: 'Staff',
  CLIENT: 'Client',
};

// Role priority for display — higher index = lower priority
const ROLE_PRIORITY = ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ARCHITECT', 'STAFF', 'CLIENT'];

function canAccess(itemRoles, userRoles) {
  if (!itemRoles || itemRoles.length === 0) return true;
  return userRoles.some((r) => itemRoles.includes(r));
}

function getPrimaryRole(roles = []) {
  return ROLE_PRIORITY.find((r) => roles.includes(r)) || roles[0];
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const userRoles = user?.roles || [];
  const primaryRole = getPrimaryRole(userRoles);
  const displayName = user?.fullName || user?.email || 'Admin';
  const avatarChar = displayName.charAt(0).toUpperCase();

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
          {NAV_CONFIG.map((section) => {
            const visibleItems = section.items.filter((item) =>
              canAccess(item.roles, userRoles)
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.section} className="nav-section">
                {!collapsed && (
                  <span className="nav-section-label">{section.section}</span>
                )}
                {visibleItems.map((item) => (
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
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{avatarChar}</div>
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">
                  {ROLE_LABELS[primaryRole] || primaryRole || 'Staff'}
                </span>
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
