import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return children;
};

const DashboardRouter = () => {
    const { user } = useContext(AuthContext);
    
    if (user?.role === 'staff' || user?.role === 'admin') {
        return <StaffDashboard />;
    }
    return <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;