import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Smart redirect for the root path
const Home = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={user.role === 'user' ? '/user' : '/staff'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <div className="min-h-screen font-sans bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Route - ANY logged in user can access, but we restrict it to 'user' */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Route - ONLY Staff and Admins can access */}
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffDashboard />
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