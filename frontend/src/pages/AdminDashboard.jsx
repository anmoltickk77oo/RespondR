import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, BarChart3, Clock, CheckCircle2, Activity, Bell, Users, Server, Zap, ShieldAlert } from "lucide-react";

import { socket } from "../socket/socket";
import api from "../api/api";

import AlertCard from "../components/AlertCard";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [responders, setResponders] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        resolved: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Incidents
                const incResponse = await api.get("/incidents");
                const incData = incResponse.data.incidents;
                setIncidents(incData);

                // Fetch Responders
                const respResponse = await api.get("/users/responders");
                setResponders(respResponse.data.responders);

                const pending = incData.filter(i => i.status === "pending").length;
                const active = incData.filter(i => i.status === "responding" || i.status === "acknowledged").length;
                const resolved = incData.filter(i => i.status === "resolved").length;

                setStats({
                    total: incData.length,
                    pending,
                    active,
                    resolved,
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load system intelligence data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        socket.on("NEW_INCIDENT", (newIncident) => {
            setIncidents((prev) => [newIncident, ...prev]);
            setStats((prev) => ({
                ...prev,
                total: prev.total + 1,
                pending: prev.pending + 1,
            }));
            toast.success("New incident reported!", {
                icon: '🚨',
                duration: 5000,
            });
        });

        socket.on("INCIDENT_UPDATED", (updated) => {
            setIncidents((prev) =>
                prev.map((i) => (i.id === updated.id ? updated : i))
            );
            
            // Re-calculate stats or update incrementally
            // For simplicity in real-time, let's just refresh stats logic if needed
            // but we can also just update the counts based on transition
        });

        return () => {
            socket.off("NEW_INCIDENT");
            socket.off("INCIDENT_UPDATED");
        };
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await api.patch(`/incidents/${id}`, {
                status: "acknowledged",
            });
            toast.success("Incident assigned to response team");
        } catch (error) {
            console.error("Action failed:", error);
            toast.error("Failed to update incident");
        }
    };

    const activeIncidents = incidents.filter(i => i.status !== 'resolved');

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden font-sans">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.15),_transparent)] pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
            
            <Navbar transparent />

            <div className="max-w-[1800px] mx-auto px-8 py-10 relative z-10">
                
                {/* GLOBAL COMMAND CENTER HEADER */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-16">
                    <div className="space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            Command Center v4.0.2-Live
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
                            System <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-3xl leading-relaxed">
                            Global infrastructure monitoring, real-time emergency telemetry, and multi-sector responder deployment orchestration.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex flex-col items-end px-8 py-5 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">Satellite Uplink</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> 100% Operational
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end px-8 py-5 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20">
                            <span className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest mb-2 text-right">Field Personnel</span>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-200" />
                                <span className="text-lg font-black text-white">{responders.length} Active Units</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 2xl:grid-cols-12 gap-10">
                    
                    {/* LEFT PANEL: MAP & ANALYTICS */}
                    <div className="2xl:col-span-8 space-y-10">
                        
                        {/* PERFORMANCE METRICS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
                            <StatCard icon={Activity} label="System Traffic" value={stats.total} color="blue" variant="dark" />
                            <StatCard icon={Clock} label="Critical Alerts" value={stats.pending} color="amber" pulse={stats.pending > 0} variant="dark" />
                            <StatCard icon={Zap} label="Deployments" value={stats.active} color="purple" variant="dark" />
                            <StatCard icon={CheckCircle2} label="Resolution" value={`${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%`} color="emerald" variant="dark" />
                        </div>

                        {/* GLOBAL INTELLIGENCE MAP (SIMULATED) */}
                        <div className="bg-slate-900/50 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                            
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Global Telemetry</h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time incident localization</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/20">Secure Link</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-[10px] font-black uppercase border border-white/10">v2.4.0-Sat</span>
                                </div>
                            </div>

                            <div className="aspect-[21/9] bg-[#020617] rounded-[2rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                                {/* SIMULATED MAP UI */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
                                    <svg viewBox="0 0 1000 400" className="w-full h-full stroke-blue-500/30 stroke-1 fill-none">
                                        <path d="M100,200 Q250,100 400,200 T700,200 T1000,100" />
                                        <path d="M0,300 Q200,350 400,250 T800,300" />
                                        <circle cx="200" cy="150" r="2" />
                                        <circle cx="500" cy="250" r="2" />
                                        <circle cx="800" cy="100" r="2" />
                                    </svg>
                                </div>

                                {/* ACTIVE INCIDENT DOTS */}
                                {activeIncidents.map((inc, i) => (
                                    <div 
                                        key={inc.id}
                                        className="absolute group/pin cursor-pointer"
                                        style={{ 
                                            left: `${20 + (i * 15) % 60}%`, 
                                            top: `${30 + (i * 10) % 50}%` 
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <div className={`absolute w-12 h-12 rounded-full ${inc.status === 'pending' ? 'bg-rose-500/20' : 'bg-blue-500/20'} animate-ping`} />
                                            <div className={`w-3 h-3 rounded-full ${inc.status === 'pending' ? 'bg-rose-500' : 'bg-blue-500'} shadow-[0_0_20px_rgba(244,63,94,0.6)]`} />
                                        </div>
                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none z-50">
                                            <p className="text-[10px] font-black uppercase text-slate-400">{inc.type}</p>
                                            <p className="text-xs font-bold text-white">{inc.location}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                                    [ Encrypted Data Visualization ]
                                </div>
                                
                                {/* SCANLINE EFFECT */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-scanline pointer-events-none" />
                            </div>
                        </div>

                        {/* LIVE INCIDENT STREAM */}
                        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="flex items-center justify-between px-6">
                                <h2 className="text-3xl font-black text-white">Incident Stream</h2>
                                <div className="flex items-center gap-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {activeIncidents.length} Critical Events
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6 p-2">
                                {isLoading ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Filtering streams...</p>
                                    </div>
                                ) : activeIncidents.length === 0 ? (
                                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
                                        <ShieldAlert className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                                        <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tighter">All sectors clear</h3>
                                        <p className="text-slate-600 mt-2 font-medium">Global emergency response systems reporting zero active alerts.</p>
                                    </div>
                                ) : (
                                    activeIncidents.map(inc => (
                                        <AlertCard 
                                            key={inc.id} 
                                            incident={inc} 
                                            onAcknowledge={handleAcknowledge}
                                            variant="premium"
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: RESPONDERS & HEALTH */}
                    <div className="2xl:col-span-4 space-y-10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        
                        {/* RESPONDER NETWORK */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
                            <div className="px-10 py-10 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-[1.5rem] bg-blue-500 text-white shadow-2xl shadow-blue-500/20">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">Field Units</h2>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-time deployment status</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 px-6 py-10 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                                {responders.map(u => (
                                    <div key={u.id} className="group flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
                                        {/* Status indicator on hover */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
                                        
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-black text-2xl text-slate-600 border border-white/5 shadow-inner group-hover:text-blue-400 transition-colors">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-black text-white group-hover:text-blue-300 transition-colors truncate">{u.name}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                                                    u.role === 'admin' 
                                                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' 
                                                    : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                                }`}>
                                                    {u.role}
                                                </span>
                                                {u.team && (
                                                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                                                        {u.team}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">{u.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-10 bg-slate-950/50">
                                <button className="w-full py-6 rounded-[1.5rem] bg-white/5 hover:bg-white/10 text-white text-xs font-black transition-all border border-white/10 flex items-center justify-center gap-4 group">
                                    <Server className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                    SYNC INFRASTRUCTURE
                                </button>
                            </div>
                        </div>

                        {/* SYSTEM HEALTH MONITOR */}
                        <div className="bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-10">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    Core Telemetry
                                </h3>
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            </div>
                            
                            <div className="space-y-8">
                                <HealthMetric label="API Gateway" status="optimal" value="14ms" variant="dark" />
                                <HealthMetric label="WebSocket" status="optimal" value="Online" variant="dark" />
                                <HealthMetric label="DB Pipeline" status="warning" value="Active" variant="dark" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── SUBCOMPONENTS ── */

const StatCard = ({ icon: Icon, label, value, color = "blue", pulse = false, variant = "light" }) => {
    const colorMap = {
        blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
        amber:   { text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]" },
        emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]" },
        purple:  { text: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]" },
    };
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className={`bg-slate-900/50 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 transition-all duration-500 hover:border-white/20 hover:scale-[1.02] shadow-2xl group ${pulse ? c.glow : ""}`}>
            <div className={`w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${c.text}`} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">{label}</p>
            <p className={`text-4xl font-black ${c.text} tracking-tighter`}>{value}</p>
        </div>
    );
};

const HealthMetric = ({ label, status, value, variant = "light" }) => (
    <div className="flex items-center justify-between group">
        <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <span className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">{value}</span>
        </div>
        <div className={`w-1.5 h-8 rounded-full ${status === 'optimal' ? 'bg-emerald-500/40' : 'bg-amber-500/40'} relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full ${status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'} h-full animate-pulse`} />
        </div>
    </div>
);

export default AdminDashboard;