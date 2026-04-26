import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, send them to their dashboard
    React.useEffect(() => {
        if (!loading && user) {
            if (user.role === 'staff' || user.role === 'admin') {
                navigate('/staff');
            } else {
                navigate('/user');
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegistering) {
                const payload = { ...formData, name: formData.email.split('@')[0] };
                await api.post('/auth/register', payload);
                toast.success('Account created! Logging you in...');
            }
            
            const loggedInUser = await login(formData.email, formData.password);
            toast.success('Welcome back!');
            
            // Redirect based on role
            if (loggedInUser.role === 'staff' || loggedInUser.role === 'admin') {
                navigate('/staff');
            } else {
                navigate('/user');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Authentication failed';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {isRegistering ? 'Join RespondR' : 'Welcome Back'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@respondr.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                {isRegistering && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-white"
                                value={formData.role || 'user'}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">Guest (User)</option>
                                <option value="staff">Responder (Staff)</option>
                            </select>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        isRegistering ? 'Create Account' : 'Sign In'
                    )}
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
