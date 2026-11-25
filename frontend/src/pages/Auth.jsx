import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { save } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await (isRegister ? register(form) : login(form));
      save(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="authbox" onSubmit={submit}>
      <div className="logo">+</div>
      <h1>{isRegister ? 'Create your account' : 'Log in'}</h1>
      <p className="sub">{isRegister ? 'Your checks are saved privately to your account.' : 'Log in to run a check and see your history.'}</p>

      {isRegister && (
        <label className="input">Name
          <input value={form.name} onChange={set('name')} autoComplete="name" required />
        </label>
      )}
      <label className="input">Email
        <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
      </label>
      <label className="input">Password
        <input type="password" value={form.password} onChange={set('password')} minLength={6}
          autoComplete={isRegister ? 'new-password' : 'current-password'} required />
      </label>

      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}</button>

      <p className="switch">
        {isRegister ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </form>
  );
}
