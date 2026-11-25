import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Disclaimer from './components/Disclaimer';
import SymptomForm from './pages/SymptomForm';
import ResultPage from './pages/ResultPage';
import History from './pages/History';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

const Private = ({ children }) => (useAuth().user ? children : <Navigate to="/login" />);
const Guest = ({ children }) => (useAuth().user ? <Navigate to="/" /> : children);

export default function App() {
  return (
    <>
      <Navbar />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Private><SymptomForm /></Private>} />
          <Route path="/result" element={<Private><ResultPage /></Private>} />
          <Route path="/history" element={<Private><History /></Private>} />
          <Route path="/login" element={<Guest><Auth mode="login" /></Guest>} />
          <Route path="/register" element={<Guest><Auth mode="register" /></Guest>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Disclaimer />
    </>
  );
}
