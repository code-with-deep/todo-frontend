import api from '../api/axios';
import { Link } from 'react-router-dom';
import './TodoItem.css';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const toggle = async () => {
    const { data } = await api.put(`/todos/${todo._id}`, { isCompleted: !todo.isCompleted });
    onUpdate(data);
  };

  const remove = async () => {
    if (!confirm('Delete this todo?')) return;
    await api.delete(`/todos/${todo._id}`);
    onDelete(todo._id);
  };

  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      <button
        className={`check-btn ${todo.isCompleted ? 'checked' : ''}`}
        onClick={toggle}
        aria-label="Toggle complete"
      >
        {todo.isCompleted && <span className="check-mark">✓</span>}
      </button>

      <div className="todo-content">
        <p className="todo-title">{todo.title}</p>
        {todo.description && <p className="todo-desc">{todo.description}</p>}
        <div className="todo-meta">
          <span className="todo-date">
            🗓 {new Date(todo.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </span>
          <span className={`status-pill ${todo.isCompleted ? 'done' : 'active'}`}>
            {todo.isCompleted ? '✦ Completed' : '◉ Active'}
          </span>
        </div>
      </div>

      <div className="todo-actions">
        <Link className="edit-btn" to={`/edit/${todo._id}`}>
          <span>✎</span> Edit
        </Link>
        <button className="delete-btn" onClick={remove} aria-label="Delete">
          🗑
        </button>
      </div>
    </div>
  );
}
