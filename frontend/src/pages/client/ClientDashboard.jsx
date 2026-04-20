import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, invoicesAPI, quotationsAPI, contractsAPI, consultationsAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';

export default function ClientDashboard() {
    const { user } = useAuthStore();
    const [data, setData] = useState({
        projects: [], invoices: [], quotations: [], contracts: [], consultations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, i, q, c, con] = await Promise.allSettled([
                    projectsAPI.getAll(),
                    invoicesAPI.getAll(),
                    quotationsAPI.getAll(),
                    contractsAPI.getAll(),
                    consultationsAPI.getAll(),
                ]);
                setData({
                    projects: p.value?.data?.data || [],
                    invoices: i.value?.data?.data || [],
                    quotations: q.value?.data?.data || [],
                    contracts: c.value?.data?.data || [],
                    consultations: con.value?.data?.data || [],
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const displayName = user?.fullname || user?.email || 'there';

    const pendingInvoices = data.invoices.filter(i =>
        i.status !== 'PAID' && i.status !== 'CANCELLED' && Number(i.balanceDue) > 0
    );
    const totalDue = pendingInvoices.reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);
    const pendingQuotations = data.quotations.filter(q => q.status === 'SENT');
    const activeContracts = data.contracts.filter(c => c.status === 'ACTIVE' || c.status === 'SIGNED');

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-greeting">{greeting}, {displayName}.</h1>
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
                                <span className="stat-label">My Projects</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/client/quotations" className="stat-card" style={{ '--card-accent': '#6366f1' }}>
                            <div className="stat-icon">◇</div>
                            <div className="stat-info">
                                <span className="stat-value">{pendingQuotations.length}</span>
                                <span className="stat-label">Pending Quotations</span>
                            </div>
                            <span className="stat-arrow">→</span>
                        </Link>
                        <Link to="/client/contracts" className="stat-card" style={{ '--card-accent': '#0ea5e9' }}>
                            <div className="stat-icon">◻</div>
                            <div className="stat-info">
                                <span className="stat-value">{activeContracts.length}</span>
                                <span className="stat-label">Active Contracts</span>
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
                                    <thead>
                                    <tr><th>Project</th><th>Code</th><th>Status</th></tr>
                                    </thead>
                                    <tbody>
                                    {data.projects.slice(0, 5).map(p => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td><code>{p.code}</code></td>
                                            <td><span className={`status-badge status-${p.status?.toLowerCase()}`}>{p.status?.replace(/_/g, ' ')}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="dashboard-table-card">
                            <div className="table-card-header">
                                <h3>Outstanding Invoices</h3>
                                <Link to="/client/invoices" className="table-view-all">View all →</Link>
                            </div>
                            {pendingInvoices.length === 0 ? (
                                <div className="table-empty">No outstanding invoices 🎉</div>
                            ) : (
                                <table className="dash-table">
                                    <thead>
                                    <tr><th>Invoice</th><th>Balance Due</th><th>Status</th></tr>
                                    </thead>
                                    <tbody>
                                    {pendingInvoices.slice(0, 5).map(i => (
                                        <tr key={i.id}>
                                            <td><code>{i.code}</code></td>
                                            <td style={{ color: '#f87171' }}>{i.currency} {Number(i.balanceDue).toLocaleString()}</td>
                                            <td><span className={`status-badge status-${i.status?.toLowerCase()}`}>{i.status}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {pendingQuotations.length > 0 && (
                        <div className="client-cta">
                            <div className="client-cta-content">
                                <h3>You have {pendingQuotations.length} quotation{pendingQuotations.length > 1 ? 's' : ''} awaiting your response</h3>
                                <p>Review and accept or decline your pending quotations.</p>
                            </div>
                            <Link to="/client/quotations" className="btn-primary">Review Quotations →</Link>
                        </div>
                    )}

                    {pendingQuotations.length === 0 && (
                        <div className="client-cta">
                            <div className="client-cta-content">
                                <h3>Need something new?</h3>
                                <p>Start a consultation request and our team will get back to you within 24 hours.</p>
                            </div>
                            <Link to="/client/consultations" className="btn-primary">Book a Consultation →</Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}