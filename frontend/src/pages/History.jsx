import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory, deleteCheck, clearHistory } from '../api';

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(setItems).catch(() => setError('Cannot load history. Is the backend running?'));
  }, []);

  const remove = async (id) => { await deleteCheck(id); setItems((p) => p.filter((i) => i._id !== id)); };
  const clearAll = async () => { if (window.confirm('Delete all history?')) { await clearHistory(); setItems([]); } };

  if (error) return <p className="error">{error}</p>;
  if (!items) return <p className="sub">Loading...</p>;

  return (
    <div>
      <div className="row">
        <h1>History</h1>
        {items.length > 0 && <button className="btn ghost small" onClick={clearAll}>Clear all</button>}
      </div>
      {items.length === 0 && <p className="sub">No checks yet. <Link to="/">Run your first check.</Link></p>}
      {items.map((i) => (
        <article key={i._id} className={`hist ${i.urgency}`}>
          <div>
            <strong>{i.conditions[0]?.name || 'No close match'}</strong>
            <span className={`tag ${i.urgency}`}>{i.urgency}</span>
            <p className="meta">{new Date(i.createdAt).toLocaleString()} · {i.symptoms.join(', ')}</p>
          </div>
          <div className="btns">
            <button className="btn small" onClick={() => navigate('/result', { state: { result: i } })}>View</button>
            <button className="btn ghost small" onClick={() => remove(i._id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
