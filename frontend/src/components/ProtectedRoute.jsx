import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait for the context to finish checking local storage
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    // 1. If nobody is logged in, kick them to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the route requires specific roles, check if the user has it
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect them to their proper dashboard based on their actual role
        return <Navigate to={user.role === 'user' ? '/user' : '/staff'} replace />;
    }

    // 3. If everything is good, let them see the page!
    return children;
};

export default ProtectedRoute;
