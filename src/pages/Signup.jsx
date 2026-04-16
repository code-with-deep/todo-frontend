import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const { data } = await api.post('/auth/signup', form);
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.response?.data?.errors || [{ msg: err.response?.data?.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <aside className="auth-brand-panel" aria-hidden="true">
          <div className="brand-orb" />
          <p className="brand-kicker">Fresh Start</p>
          <h2>Turn plans into progress.</h2>
          <p className="brand-copy">
            Create your workspace in seconds and keep every task moving with
            a clean, motivating interface.
          </p>
          <div className="brand-features">
            <div className="brand-feature"><span className="feature-icon">⚡</span><span>Simple setup, fast start</span></div>
            <div className="brand-feature"><span className="feature-icon">🗓</span><span>Plan tasks around your day</span></div>
            <div className="brand-feature"><span className="feature-icon">✅</span><span>Keep work clear and organized</span></div>
          </div>
        </aside>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create Account</h1>
            <p className="subtitle">Start organizing your day with clarity.</p>
          </div>

          {errors.map((e, i) => (
            <div key={i} className="error-box">
              <span>⚠</span>
              <div>{e.msg}</div>
            </div>
          ))}

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="field-group">
              <label className="field-label" htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                name="signup-name"
                placeholder="Your full name"
                autoComplete="off"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="off"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="signup-password"
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Creating account...</> : <>Sign Up →</>}
            </button>
          </form>

          <p className="switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
