import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Form.css';

export default function AddTodo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '' });
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/todos', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>➕ Add New Todo</h1>
        <p className="form-subtitle">Plan clearly and capture tasks in a focused flow.</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="date-picker-wrap">
            <label className="field-label" htmlFor="todo-date">Task date</label>
            <div className="date-row">
              <input
                id="todo-date"
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
              <button type="button" className="today-btn" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}>Use today</button>
            </div>
            <p className="date-note">Quick planner date for easier task creation.</p>
          </div>

          <input
            placeholder="📝 Title"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required
          />

          <textarea
            placeholder="📄 Description (optional)"
            rows={4}
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="primary-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
