import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSymptoms, checkSymptoms } from '../api';

function Pills({ label, options, value, onChange }) {
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="pills">
        {options.map((o) => (
          <label key={o} className={value === o ? 'pill on' : 'pill'}>
            <input type="radio" checked={value === o} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SymptomForm() {
  const [groups, setGroups] = useState({});
  const [typed, setTyped] = useState('');
  const [custom, setCustom] = useState([]);
  const [selected, setSelected] = useState([]);
  const [ageGroup, setAgeGroup] = useState('adult');
  const [duration, setDuration] = useState('1 day');
  const [severity, setSeverity] = useState('mild');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSymptoms().then(setGroups).catch(() => setError('Cannot reach the server. Start the backend with "npm run dev" in the backend folder.'));
  }, []);

  const toggle = (s) => setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const known = Object.values(groups).flat();

  // Add typed symptoms (comma separated). Known names tick the matching option.
  const addTyped = () => {
    const parts = typed.split(',').map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    parts.forEach((t) => {
      const match = known.find((k) => k === t.toLowerCase());
      if (match) setSelected((p) => (p.includes(match) ? p : [...p, match]));
      else setCustom((p) => (p.some((c) => c.toLowerCase() === t.toLowerCase()) ? p : [...p, t]));
    });
    setTyped('');
    setError('');
  };

  const total = selected.length + custom.length;

  const submit = async (e) => {
    e.preventDefault();
    if (total === 0) return setError('Select at least one symptom to continue.');
    setError('');
    setLoading(true);
    try {
      const result = await checkSymptoms({ symptoms: [...selected, ...custom], ageGroup, duration, severity });
      navigate('/result', { state: { result } });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not check symptoms. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <span className="eyebrow">Step 1 of 1</span>
      <h1>What are you experiencing?</h1>
      <p className="sub">Type your symptoms or pick from the lists below, then tell us a little more.</p>

      <div className="card">
        <h2>Type your symptoms</h2>
        <div className="typebox">
          <input
            list="symptom-options"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTyped(); } }}
            placeholder="e.g. stomach ache, chest pain, loose motion"
            aria-label="Type a symptom"
          />
          <datalist id="symptom-options">{known.map((k) => <option key={k} value={k} />)}</datalist>
          <button type="button" className="btn" onClick={addTyped}>Add</button>
        </div>
        <p className="hint">Press Enter or Add. Use commas to enter several at once.</p>
        {custom.length > 0 && (
          <div className="pills chips">
            {custom.map((c) => (
              <span key={c} className="pill on">
                {c}
                <button type="button" className="x" aria-label={`Remove ${c}`} onClick={() => setCustom((p) => p.filter((x) => x !== c))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {Object.entries(groups).map(([group, list]) => (
        <section key={group} className="card group">
          <h2>{group}</h2>
          <div className="pills">
            {list.map((s) => (
              <label key={s} className={selected.includes(s) ? 'pill on' : 'pill'}>
                <input type="checkbox" checked={selected.includes(s)} onChange={() => toggle(s)} />
                {s}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="card extras">
        <Pills label="Age group" options={['child', 'adult', 'senior']} value={ageGroup} onChange={setAgeGroup} />
        <Pills label="How long?" options={['1 day', '2-3 days', '1 week+']} value={duration} onChange={setDuration} />
        <Pills label="How severe?" options={['mild', 'moderate', 'severe']} value={severity} onChange={setSeverity} />
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      <div className="submitbar">
      <span className="count">{total} symptom{total === 1 ? '' : 's'} added</span>
      <button className="btn" disabled={loading}>
        {loading ? 'Checking...' : 'Check symptoms'}
      </button>
      </div>
    </form>
  );
}
