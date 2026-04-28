import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapPin, AlertTriangle, History, Navigation, Zap, PhoneCall, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import SOSButton from '../components/SOSButton';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { socket } from '../socket/socket';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    const [location, setLocation] = useState('Main Lobby');
    const [incidentType, setIncidentType] = useState('Medical Emergency');
    const [recentIncidents, setRecentIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/incidents');
                setRecentIncidents(response.data.incidents.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();

        socket.on('INCIDENT_UPDATED', (updated) => {
            setRecentIncidents(prev => 
                prev.map(inc => inc.id === updated.id ? updated : inc)
            );
        });

        return () => {
            socket.off('INCIDENT_UPDATED');
        };
    }, []);

    const quickActions = [
        { title: 'Safe Zone', icon: Navigation, desc: 'Nearest exit', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Support', icon: PhoneCall, desc: 'Live voice', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Status', icon: Zap, desc: 'Network check', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-100/40 blur-[120px] rounded-full animate-blob" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-rose-100/40 blur-[120px] rounded-full animate-blob animate-float" style={{ animationDelay: '3s' }} />

            <div className="relative z-10">
                <Navbar />
                
                <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        
                        {/* CONTENT SECTION */}
                        <div className="lg:col-span-6 space-y-12">
                            <div className="animate-fade-in-up">
                                <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                    Instant <span className="gradient-text">Assistance</span> <br /> 
                                    <span className="text-slate-400">Available Now.</span>
                                </h1>
                                <p className="text-slate-500 mt-8 text-xl max-w-md font-medium leading-relaxed">
                                    A single tap connects you to a professional response team. Secure, reliable, and priority-focused.
                                </p>
                            </div>

                            {/* Selectors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in-up [animation-delay:100ms]">
                                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Current Location</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                                            <MapPin className="w-5 h-5 text-rose-600" />
                                        </div>
                                        <select
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-transparent text-slate-900 font-black outline-none flex-1 text-lg cursor-pointer"
                                        >
                                            <option value="Main Lobby">Main Lobby</option>
                                            <option value="Room 101">Room 101</option>
                                            <option value="Cafeteria">Cafeteria</option>
                                            <option value="Parking Lot">Parking Lot</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Emergency Type</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <select
                                            value={incidentType}
                                            onChange={(e) => setIncidentType(e.target.value)}
                                            className="bg-transparent text-slate-900 font-black outline-none flex-1 text-lg cursor-pointer"
                                        >
                                            <option value="Medical Emergency">Medical</option>
                                            <option value="Fire Hazard">Fire</option>
                                            <option value="Security Threat">Security</option>
                                            <option value="Maintenance Issue">Maintenance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats/Actions */}
                            <div className="flex flex-wrap gap-4 animate-fade-in-up [animation-delay:200ms]">
                                {quickActions.map((action, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                        <div className={`p-2 rounded-lg ${action.bg.replace('500/10', '50').replace('bg-', 'bg-')} border ${action.bg.replace('500/10', '100')} ${action.color.replace('400', '600')}`}>
                                            <action.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 leading-none tracking-tight">{action.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{action.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SOS BUTTON SECTION */}
                        <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-12 animate-fade-in-up [animation-delay:300ms]">
                            <div className="relative group">
                                {/* Outer decorative rings */}
                                <div className="absolute inset-0 bg-rose-500/5 rounded-full blur-[100px] scale-[2.5] group-hover:scale-[3] transition-transform duration-700" />
                                <div className="absolute inset-0 border-2 border-rose-500/10 rounded-full animate-ping scale-150 opacity-20" />
                                <SOSButton location={location} incidentType={incidentType} />
                            </div>
                            <div className="mt-16 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Network Operations</p>
                                <div className="flex items-center gap-3 px-6 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm shadow-emerald-500/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Protocol Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RECENT FEED */}
                    <div className="mt-32 max-w-3xl mx-auto animate-fade-in-up [animation-delay:400ms]">
                        <div className="flex items-center justify-between mb-10 px-4">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <History className="w-5 h-5 text-slate-600" />
                                </div>
                                Recent Activity
                            </h2>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-full">Encrypted History</span>
                        </div>

                        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-3 border border-white/60 shadow-sm">
                            {isLoading ? (
                                <div className="py-20 text-center text-slate-300">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">Synchronizing...</p>
                                </div>
                            ) : recentIncidents.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 font-medium">
                                    <p className="text-sm">No recent signals detected from your device</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentIncidents.map((inc, i) => (
                                        <div key={inc.id || i} className="flex items-center gap-5 p-5 rounded-[1.5rem] hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md hover:shadow-slate-200/50">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${inc.status === 'pending' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {inc.status === 'pending' ? <Clock className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-black text-slate-900 tracking-tight">{inc.incident_type}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2 mt-1">
                                                    <MapPin className="w-3 h-3 text-slate-300" /> {inc.location} • {new Date(inc.created_at || inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${inc.status === 'pending' ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                                                {inc.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;