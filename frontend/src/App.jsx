import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';
import OfflineHeartbeat from './components/OfflineHeartbeat';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center animate-pulse border border-white shadow-xl">
                    <div className="w-5 h-5 rounded-full bg-rose-500/50 animate-ping" />
                </div>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    
    // If a specific role is required and user doesn't have it, redirect to their own dashboard
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const DashboardRouter = () => {
    const { user, loading } = useAuth();
    
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'staff') return <Navigate to="/staff-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            color: '#0f172a',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '700',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <OfflineHeartbeat />
      <Router>
        <div className="min-h-screen font-sans bg-slate-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Entry point that redirects based on role */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />

            {/* Unique Dashboards */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff-dashboard" 
              element={
                <ProtectedRoute role="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Redirect old routes */}
            <Route path="/user" element={<Navigate to="/user-dashboard" replace />} />
            <Route path="/staff" element={<Navigate to="/staff-dashboard" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;