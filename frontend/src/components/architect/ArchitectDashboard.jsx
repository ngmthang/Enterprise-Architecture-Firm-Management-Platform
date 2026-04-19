import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, expensesAPI } from '../../api/services';

export default function ArchitectDashboard() {
    const [projects, setProjects] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, e] = await Promise.allSettled([
                    projectsAPI.getAll(),
                    expensesAPI.getAll(),
                ]);
                setProjects(p.value?.data?.data || []);
                setExpenses(e.value?.data?.data || []);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ACTIVE');
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-greeting">Good day.</h1>
                    <p className="dashboard-subtitle">Here's your work overview for today.</p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {loading ? (
                <div className="loading-grid">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-card" />)}
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <Link to="/architect/projects" className="stat-card" style={{ '--card-accent': 'var(--accent)' }}>
                            <div className="stat-icon">◈</div>
                            <div className="stat-info">
                                <span className="stat-value">{projects.length}</span>
                                <span className="stat-label">Total Projects</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/architect/projects" className="stat-card" style={{ '--card-accent': '#6366f1' }}>
                            <div className="stat-icon">◉</div>
                            <div className="stat-info">
                                <span className="stat-value">{activeProjects.length}</span>
                                <span className="stat-label">Active Projects</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/architect/expenses" className="stat-card" style={{ '--card-accent': '#10b981' }}>
                            <div className="stat-icon">▽</div>
                            <div className="stat-info">
                                <span className="stat-value">{expenses.length}</span>
                                <span className="stat-label">Expenses</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/architect/expenses" className="stat-card" style={{ '--card-accent': '#f59e0b' }}>
                            <div className="stat-icon">▤</div>
                            <div className="stat-info">
                                <span className="stat-value">${totalExpenses.toLocaleString()}</span>
                                <span className="stat-label">Total Expenses</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                    </div>

                    <div className="dashboard-tables">
                        <div className="dashboard-table-card">
                            <div className="table-card-header">
                                <h3>My Projects</h3>
                                <Link to="/architect/projects" className="table-view-all">View all →</Link>
                            </div>
                            {projects.length === 0 ? (
                                <div className="table-empty">No projects assigned yet</div>
                            ) : (
                                <table className="dash-table">
                                    <thead><tr><th>Project</th><th>Code</th><th>Status</th></tr></thead>
                                    <tbody>
                                    {projects.slice(0, 6).map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.name || p.title}</td>
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
                                <h3>Recent Expenses</h3>
                                <Link to="/architect/expenses" className="table-view-all">View all →</Link>
                            </div>
                            {expenses.length === 0 ? (
                                <div className="table-empty">No expenses recorded yet</div>
                            ) : (
                                <table className="dash-table">
                                    <thead><tr><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                                    <tbody>
                                    {expenses.slice(0, 6).map((e) => (
                                        <tr key={e.id}>
                                            <td>{e.description}</td>
                                            <td>${e.amount?.toLocaleString()}</td>
                                            <td><span className={`status-badge status-${e.status?.toLowerCase()}`}>{e.status}</span></td>
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