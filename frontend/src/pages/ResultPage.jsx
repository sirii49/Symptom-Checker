import { Link, Navigate, useLocation } from 'react-router-dom';

const TITLES = { 'self-care': 'Self-care is likely enough', 'see-doctor': 'See a doctor soon', emergency: 'Seek emergency care now' };

export default function ResultPage() {
  const { state } = useLocation();
  const r = state?.result;
  if (!r) return <Navigate to="/" />;

  return (
    <div>
      <div className={`banner ${r.urgency}`}>
        <h1>{TITLES[r.urgency]}</h1>
        <p>{r.message}</p>
      </div>

      <p className="meta">
        Symptoms: {r.symptoms.length ? r.symptoms.join(', ') : 'none recognised'}. Age group: {r.ageGroup}. Duration: {r.duration}. Severity: {r.severity}.
      </p>

      {r.unrecognized?.length > 0 && (
        <p className="note">We could not match: {r.unrecognized.join(', ')}. These were not used in the analysis.</p>
      )}

      <h2 className="result-h">Possible conditions</h2>
      {r.conditions.length === 0 ? (
        <p className="sub">No condition matched closely. If you still feel unwell, see a doctor.</p>
      ) : (
        r.conditions.map((c) => (
          <article key={c.name} className="cond">
            <div className="cond-top">
              <h3>{c.name}</h3>
              <span>{c.score}% match</span>
            </div>
            <div className="bar"><i style={{ width: `${c.score}%` }} /></div>
            <p>{c.advice}</p>
          </article>
        ))
      )}

      <div className="actions">
        <Link className="btn" to="/">Start a new check</Link>
        <Link className="btn ghost" to="/history">View history</Link>
      </div>
    </div>
  );
}
