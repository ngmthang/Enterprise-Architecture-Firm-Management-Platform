import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, invoicesAPI, consultationsAPI, contractsAPI, quotationsAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';

const ROLE_SUBTITLES = {
  SUPER_ADMIN: "Here's the full picture of your firm today.",
  ADMIN: "Here's what's happening with your firm today.",
  PROJECT_MANAGER: "Here's an overview of your active projects and pipeline.",
  ARCHITECT: "Here's your design work and portfolio activity.",
  STAFF: "Here's your activity summary for today.",
  CLIENT: "Here's the latest on your ongoing engagements.",
};

function StatCard({ label, value, icon, color, to }) {
  return (
      <Link to={to} className="stat-card" style={{ '--card-accent': color }}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
          <span className="stat-value">{value ?? '—'}</span>
          <span className="stat-label">{label}</span>
        </div>
        <span className="stat-arrow">→</span>
      </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({});
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, invoices, consultations, contracts, quotations] = await Promise.allSettled([
          projectsAPI.getAll(),
          invoicesAPI.getAll(),
          consultationsAPI.getAll(),
          contractsAPI.getAll(),
          quotationsAPI.getAll(),
        ]);

        const p = projects.value?.data?.data || [];
        const i = invoices.value?.data?.data || [];
        const c = consultations.value?.data?.data || [];
        const ct = contracts.value?.data?.data || [];
        const q = quotations.value?.data?.data || [];

        const totalDue = i
            .filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
            .reduce((sum, inv) => sum + (Number(inv.balanceDue) || 0), 0);

        setStats({
          projects: p.length,
          activeProjects: p.filter(x => x.status === 'IN_PROGRESS').length,
          invoices: i.length,
          totalDue,
          consultations: c.length,
          pendingConsultations: c.filter(x => x.status === 'PENDING').length,
          contracts: ct.length,
          activeContracts: ct.filter(x => x.status === 'ACTIVE' || x.status === 'SIGNED').length,
          quotations: q.length,
          pendingQuotations: q.filter(x => x.status === 'SENT').length,
        });

        setRecentProjects(p.slice(0, 5));
        setRecentConsultations(c.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const roles = user?.roles || [];
  const primaryRole = ['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'ARCHITECT', 'STAFF', 'CLIENT']
      .find(r => roles.includes(r));
  const subtitle = ROLE_SUBTITLES[primaryRole] || "Here's what's happening today.";
  const displayName = user?.fullname || user?.email || 'Admin';

  return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-greeting">{greeting}, {displayName}.</h1>
            <p className="dashboard-subtitle">{subtitle}</p>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
        ) : (
            <>
              <div className="stats-grid">
                <StatCard label="Total Projects" value={stats.projects} icon="◈" color="var(--accent)" to="/admin/projects" />
                <StatCard label="Active Projects" value={stats.activeProjects} icon="◉" color="#6366f1" to="/admin/projects" />
                <StatCard label="Quotations" value={stats.quotations} icon="◇" color="#0ea5e9" to="/admin/quotations" />
                <StatCard label="Contracts" value={stats.contracts} icon="◻" color="#10b981" to="/admin/contracts" />
                <StatCard label="Consultations" value={stats.consultations} icon="◑" color="#f59e0b" to="/admin/consultations" />
                <StatCard label="Pending Reviews" value={stats.pendingConsultations} icon="◈" color="#ef4444" to="/admin/consultations" />
              </div>

              <div className="dashboard-tables">
                <div className="dashboard-table-card">
                  <div className="table-card-header">
                    <h3>Recent Projects</h3>
                    <Link to="/admin/projects" className="table-view-all">View all →</Link>
                  </div>
                  {recentProjects.length === 0 ? (
                      <div className="table-empty">No projects yet</div>
                  ) : (
                      <table className="dash-table">
                        <thead>
                        <tr><th>Project</th><th>Code</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                        {recentProjects.map(p => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td><code>{p.code}</code></td>
                              <td><span className={`status-badge status-${p.status?.toLowerCase()}`}>{p.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                  )}
                </div>

                <div className="dashboard-table-card">
                  <div className="table-card-header">
                    <h3>Recent Consultations</h3>
                    <Link to="/admin/consultations" className="table-view-all">View all →</Link>
                  </div>
                  {recentConsultations.length === 0 ? (
                      <div className="table-empty">No consultations yet</div>
                  ) : (
                      <table className="dash-table">
                        <thead>
                        <tr><th>Client</th><th>Project Type</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                        {recentConsultations.map(c => (
                            <tr key={c.id}>
                              <td>{c.fullname}</td>
                              <td>{c.projectType || '—'}</td>
                              <td><span className={`status-badge status-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                  )}
                </div>
              </div>
            </>
        )}
      </div>
  );
}