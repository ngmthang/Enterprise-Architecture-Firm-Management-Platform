import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function UnauthorizedPage() {
    const { logout } = useAuthStore();
    return (
        <div className="success-page">
            <div className="success-icon" style={{ color: '#ef4444' }}>⊗</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300 }}>Access Denied</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', textAlign: 'center' }}>
                You don't have permission to view this page.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/" className="btn-primary">Go Home</Link>
                <button className="btn-ghost" onClick={logout}>Sign Out</button>
            </div>
        </div>
    );
}