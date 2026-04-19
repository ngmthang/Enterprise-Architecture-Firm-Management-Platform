import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, invoicesAPI, quotationsAPI, contractsAPI } from '../../api/services.js';

export default function ClientDashboard() {
    const [data, setData] = useState({ projects: [], invoices: [], quotations: [], contracts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, i, q, c] = await Promise.allSettled([
                    projectsAPI.getPublic(),
                    invoicesAPI.getAll(),
                    quotationsAPI.getAll(),
                    contractsAPI.getAll(),
                ]);
                setData({
                    projects: p.value?.data?.data || [],
                    invoices: i.value?.data?.data || [],
                    quotations: q.value?.data?.data || [],
                    contracts: c.value?.data?.data || [],
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const pendingInvoices = data.invoices.filter(i => i.status === 'PENDING' || i.status === 'UNPAID');
    const totalDue = pendingInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-greeting">Welcome back.</h1>
                    <p className="dashboard-subtitle">Here's an overview of your projects and account.</p>
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
                        <Link to="/client/projects" className="stat-card" style={{ '--card-accent': 'var(--accent)' }}>
                            <div className="stat-icon">◈</div>
                            <div className="stat-info">
                                <span className="stat-value">{data.projects.length}</span>
                                <span className="stat-label">Active Projects</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/client/quotations" className="stat-card" style={{ '--card-accent': '#6366f1' }}>
                            <div className="stat-icon">◇</div>
                            <div className="stat-info">
                                <span className="stat-value">{data.quotations.length}</span>
                                <span className="stat-label">Quotations</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/client/contracts" className="stat-card" style={{ '--card-accent': '#0ea5e9' }}>
                            <div className="stat-icon">◻</div>
                            <div className="stat-info">
                                <span className="stat-value">{data.contracts.length}</span>
                                <span className="stat-label">Contracts</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/client/invoices" className="stat-card" style={{ '--card-accent': '#ef4444' }}>
                            <div className="stat-icon">▤</div>
                            <div className="stat-info">
                                <span className="stat-value">${totalDue.toLocaleString()}</span>
                                <span className="stat-label">Amount Due</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                    </div>

                    <div className="dashboard-tables">
                        <div className="dashboard-table-card">
                            <div className="table-card-header">
                                <h3>My Projects</h3>
                                <Link to="/client/projects" className="table-view-all">View all →</Link>
                            </div>
                            {data.projects.length === 0 ? (
                                <div className="table-empty">No active projects</div>
                            ) : (
                                <table className="dash-table">
                                    <thead><tr><th>Project</th><th>Code</th><th>Status</th></tr></thead>
                                    <tbody>
                                    {data.projects.slice(0, 5).map((p) => (
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
                                <h3>Pending Invoices</h3>
                                <Link to="/client/invoices" className="table-view-all">View all →</Link>
                            </div>
                            {pendingInvoices.length === 0 ? (
                                <div className="table-empty">No pending invoices 🎉</div>
                            ) : (
                                <table className="dash-table">
                                    <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th></tr></thead>
                                    <tbody>
                                    {pendingInvoices.slice(0, 5).map((i) => (
                                        <tr key={i.id}>
                                            <td><code>{i.code}</code></td>
                                            <td>${i.amount?.toLocaleString()}</td>
                                            <td><span className={`status-badge status-${i.status?.toLowerCase()}`}>{i.status}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="client-cta">
                        <div className="client-cta-content">
                            <h3>Need something new?</h3>
                            <p>Start a consultation request and our team will get back to you within 24 hours.</p>
                        </div>
                        <Link to="/consultation" className="btn-primary">Book a Consultation →</Link>
                    </div>
                </>
            )}
        </div>
    );
}