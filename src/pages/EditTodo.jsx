import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import './Form.css';

export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    isCompleted: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const getApiErrorMessage = (err, fallback) => {
    if (err?.code === 'ERR_NETWORK') {
      return 'Cannot connect to server. Please make sure backend is running on port 5000.';
    }
    if (err?.response?.status === 404) {
      return 'Todo not found or you do not have access to it.';
    }
    if (err?.response?.status === 401) {
      return 'Your session expired. Please login again.';
    }
    return err?.response?.data?.message || fallback;
  };

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      try {
        setError('');
        const { data } = await api.get(`/todos/${id}`);
        setForm({
          title: data?.title || '',
          description: data?.description || '',
          isCompleted: data?.isCompleted || false
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load todo'));
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      await api.put(`/todos/${id}`, form);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update todo'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading">Loading todo...</p>;

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Edit Todo</h1>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="todo-title">Title</label>
          <input
            id="todo-title"
            placeholder="Update your task title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />

          <label className="field-label" htmlFor="todo-description">Description</label>
          <textarea
            id="todo-description"
            placeholder="Add details (optional)"
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isCompleted}
              onChange={e => setForm({ ...form, isCompleted: e.target.checked })}
            />
            Mark as completed
          </label>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
