import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const out = () => { logout(); navigate('/login'); };

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <span className="brand">Symptom Checker</span>
        <nav>
          {user ? (
            <>
              <NavLink to="/" end>New check</NavLink>
              <NavLink to="/history">History</NavLink>
              <span className="who">{user.name}</span>
              <button className="linkbtn" onClick={out}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
