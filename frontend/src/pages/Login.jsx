import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ShieldCheck, Loader2, Siren, ArrowRight, CheckCircle2, Shield, Zap, Globe } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user', team: '' });
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

    const features = [
        { icon: Shield, title: 'Secure Response', desc: 'End-to-end encrypted signals.' },
        { icon: Zap, title: 'Instant Dispatch', desc: 'Responders notified in < 1s.' },
        { icon: Globe, title: 'Universal Coverage', desc: 'Available system-wide.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden relative">
            
            {/* Background Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100/50 blur-[120px] rounded-full animate-blob" style={{ animationDelay: '2s' }} />
            </div>

            {/* LEFT PANEL: CONTENT & FEATURES (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16 border-r border-slate-200 z-10">
                <div className="max-w-lg">
                    <div className="flex items-center gap-4 mb-16 animate-fade-in-up">
                        <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <Siren className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            Respond<span className="gradient-text">R</span>
                        </h1>
                    </div>

                    <h2 className="text-6xl font-black text-slate-900 leading-[1.1] mb-10 animate-fade-in-up [animation-delay:100ms]">
                        Reliable assistance when <span className="text-slate-400 italic">seconds count.</span>
                    </h2>

                    <div className="space-y-10 animate-fade-in-up [animation-delay:200ms]">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="mt-1 w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <f.icon className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{f.title}</h3>
                                    <p className="text-slate-500 text-base mt-1.5 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-200 flex items-center gap-4 animate-fade-in-up [animation-delay:300ms]">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-200 shadow-sm" />
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Response Infrastructure</p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="lg:hidden flex flex-col items-center mb-12">
                        <div className="w-16 h-16 rounded-[2rem] bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20 mb-6">
                            <Siren className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">RespondR</h1>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-12 border border-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full" />
                        
                        <header className="mb-12 relative z-10 text-center">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {isRegistering ? 'Create Profile' : 'Portal Access'}
                            </h2>
                            <p className="text-slate-500 mt-2 font-medium">
                                {isRegistering ? 'Join the secure response network' : 'Identify yourself to the system'}
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="officer@respondr.io"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all font-bold placeholder:text-slate-300"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all font-bold placeholder:text-slate-300"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {isRegistering && (
                                <div className="space-y-2 animate-fade-in-up">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all appearance-none cursor-pointer font-bold"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="user" className="bg-white">Regular User</option>
                                            <option value="staff" className="bg-white">Response Staff</option>
                                            <option value="admin" className="bg-white">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {isRegistering && formData.role === 'staff' && (
                                <div className="space-y-2 animate-fade-in-up">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responder Team</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                        <select
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all appearance-none cursor-pointer font-bold"
                                            value={formData.team}
                                            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                        >
                                            <option value="" disabled className="bg-white">Select Specialization</option>
                                            <option value="medical" className="bg-white">Medical</option>
                                            <option value="security" className="bg-white">Security</option>
                                            <option value="maintenance" className="bg-white">Maintenance</option>
                                            <option value="fire" className="bg-white">Fire</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-[1.25rem] shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group mt-10 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest text-xs">
                                            {isRegistering ? 'Establish Identity' : 'Initiate Session'}
                                        </span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center relative z-10">
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                {isRegistering ? 'Existing Account?' : 'New Personnel?'}
                                <span className="text-rose-600 ml-2 border-b-2 border-rose-100 group-hover:border-rose-300">{isRegistering ? 'Sign In' : 'Join Network'}</span>
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-12 font-black">
                        © 2026 RespondR Systems • Encrypted Uplink Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
