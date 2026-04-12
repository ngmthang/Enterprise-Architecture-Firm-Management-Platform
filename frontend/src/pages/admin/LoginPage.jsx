import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) navigate('/admin');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-mark">◆</span>
          <span className="brand-name">ARCVAULT</span>
        </div>
        <div className="login-headline">
          <h1>Enterprise<br />Architecture<br />Platform</h1>
          <p>Manage your firm's projects, clients, and financial operations from one unified workspace.</p>
        </div>
        <div className="login-grid-decoration">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="grid-dot" />
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@architectureplatform.com"
                required
                autoFocus
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner" /> Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="/">← Back to website</a>
          </div>
        </div>
      </div>
    </div>
  );
}
