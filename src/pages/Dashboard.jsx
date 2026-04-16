import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TodoItem from '../components/TodoItem';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8, search };
      if (filter === 'active') params.completed = false;
      if (filter === 'completed') params.completed = true;
      const { data } = await api.get('/todos', { params });
      setTodos(data.todos);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const markAllComplete = async () => {
    await api.patch('/todos/mark-all-complete');
    fetchTodos();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = todos.filter(t => t.isCompleted).length;
  const activeCount = todos.length - completedCount;
  const completionRate = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-left">
          <p className="dash-greeting">Good day,</p>
          <h1 className="dash-name">{user?.name || 'there'} 👋</h1>
          <p className="dash-sub">Stay focused. One task at a time.</p>
          <p className="dash-date-chip">{currentDate}</p>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <section className="stats-grid" aria-label="Todo summary">
        <article className="stat-card stat-total">
          <span className="stat-label">Total</span>
          <strong className="stat-value">{todos.length}</strong>
          <span className="stat-icon">📋</span>
        </article>
        <article className="stat-card stat-active">
          <span className="stat-label">Active</span>
          <strong className="stat-value">{activeCount}</strong>
          <span className="stat-icon">⚡</span>
        </article>
        <article className="stat-card stat-done">
          <span className="stat-label">Done</span>
          <strong className="stat-value">{completionRate}%</strong>
          <span className="stat-icon">✅</span>
        </article>
      </section>

      <div className="progress-wrap">
        <div className="progress-label">
          <span>Progress</span>
          <span>{completedCount}/{todos.length} completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <section className="analytics-grid" aria-label="Work distribution and insights">
        <article className="pie-card">
          <div className="pie-card-head">
            <h2>Work Split</h2>
            <span className="pie-percentage">{completionRate}% done</span>
          </div>

          <div className="pie-chart-wrap">
            <div
              className="pie-chart"
              role="img"
              aria-label={`Completed ${completedCount} tasks and ${activeCount} remaining tasks`}
              style={{ background: `conic-gradient(#5edb97 0 ${completionRate}%, #ffc35e ${completionRate}% 100%)` }}
            >
              <div className="pie-center">
                <strong>{todos.length}</strong>
                <span>Tasks</span>
              </div>
            </div>

            <div className="pie-legend">
              <div className="legend-row">
                <span className="legend-dot legend-done" />
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>
              <div className="legend-row">
                <span className="legend-dot legend-left" />
                <span>Left</span>
                <strong>{activeCount}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="insight-card">
          <h2>Daily Focus</h2>
          <p className="insight-copy">
            {activeCount === 0
              ? 'Everything is done. Nice work, keep the streak alive.'
              : `You have ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'} to close today.`}
          </p>

          <div className="insight-metrics">
            <div><span>Completion</span><strong>{completionRate}%</strong></div>
            <div><span>Completed</span><strong>{completedCount}</strong></div>
            <div><span>Pending</span><strong>{activeCount}</strong></div>
          </div>
        </article>
      </section>

      <div className="controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search todos..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-tabs">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="action-btns">
          <button className="secondary-btn" onClick={markAllComplete}>✔ Mark all</button>
          <button className="primary-btn" onClick={() => navigate('/add')}>+ New Task</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>Loading your tasks…</p>
        </div>
      ) : (
        <div className="todo-list" aria-live="polite">
          {todos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🗂️</span>
              <p>No todos here. Add one to get started!</p>
            </div>
          ) : (
            todos.map(t => (
              <TodoItem
                key={t._id}
                todo={t}
                onUpdate={updated => setTodos(ts => ts.map(x => x._id === updated._id ? updated : x))}
                onDelete={id => setTodos(ts => ts.filter(x => x._id !== id))}
              />
            ))
          )}
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
          <span>{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}
    </div>
  );
}
