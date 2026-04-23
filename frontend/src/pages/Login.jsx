import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegistering ? '/auth/register' : '/auth/login';
            const payload = isRegistering
                ? { ...formData, name: formData.email.split('@')[0] }
                : formData;

            const response = await api.post(endpoint, payload);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {isRegistering ? 'Join RespondR' : 'Welcome Back'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="admin@respondr.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {isRegistering && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.role || 'user'}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="user">Guest (User)</option>
                            <option value="staff">Responder (Staff)</option>
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
                >
                    {isRegistering ? 'Create Account' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-red-600 font-bold hover:underline"
                >
                    {isRegistering ? 'Sign In' : 'Register Now'}
                </button>
            </p>
        </div>
    );
};

export default Login;
