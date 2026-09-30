import { useContext, useMemo } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, MapPinned, Recycle, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboardPage from './pages/CitizenDashboardPage';
import ReportWastePage from './pages/ReportWastePage';
import PickupRequestPage from './pages/PickupRequestPage';
import ComplaintTrackingPage from './pages/ComplaintTrackingPage';
import AwarenessPage from './pages/AwarenessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container dashboard-shell"><div className="card">Loading your workspace...</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Awareness', path: '/awareness' },
    { label: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/dashboard' },
    { label: 'Report Waste', path: '/report' },
    { label: 'Track Complaint', path: '/track' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><Leaf size={18} /></span>
            WasteFlow
          </Link>

          <nav className="nav-links">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>{item.label}</Link>
            ))}
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <span className="text-muted">Hi, {user.name}</span>
                <button className="btn btn-ghost" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {children}
    </>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/track" element={<ProtectedRoute><ComplaintTrackingPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportWastePage /></ProtectedRoute>} />
        <Route path="/pickup" element={<ProtectedRoute><PickupRequestPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="citizen"><CitizenDashboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
