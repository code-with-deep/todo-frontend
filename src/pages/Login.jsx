import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <aside className="auth-brand-panel" aria-hidden="true">
          <div className="brand-orb" />
          <p className="brand-kicker">✦ TodoFlow</p>
          <h2>Build momentum,<br />one task at a time.</h2>
          <p className="brand-copy">
            Shape your day with clear priorities, quick wins,
            and a dashboard that keeps your progress visible.
          </p>
          <div className="brand-features">
            <div className="brand-feature"><span className="feature-icon">⚡</span><span>Lightning-fast task management</span></div>
            <div className="brand-feature"><span className="feature-icon">📊</span><span>Track your progress visually</span></div>
            <div className="brand-feature"><span className="feature-icon">🎯</span><span>Stay focused on what matters</span></div>
          </div>
        </aside>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p className="subtitle">Sign in to continue your task flow.</p>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠</span> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="field-group">
              <label className="field-label" htmlFor="login-email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  name="login-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="off"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Signing in…</> : <>Sign In →</>}
            </button>
          </form>

          <p className="switch">
            No account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}