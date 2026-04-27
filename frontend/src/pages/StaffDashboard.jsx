import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Loader2, Siren, ShieldCheck, ListFilter, CheckCircle2 } from "lucide-react";

import { socket } from "../socket/socket";
import api from "../api/api";

import AlertCard from "../components/AlertCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const StaffDashboard = () => {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all"); // all, pending, acknowledged

    useEffect(() => {
        // 1. Request browser notification permission on load
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        const fetchIncidents = async () => {
            try {
                const response = await api.get("/incidents");
                setIncidents(response.data.incidents);
            } catch (error) {
                console.error("Failed to fetch incidents:", error);
                toast.error("Failed to load incident feed");
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncidents();

        // 2. Listen for new incidents
        socket.on('NEW_INCIDENT', (newIncident) => {
            console.log('🚨 NEW INCIDENT RECEIVED:', newIncident);
            setIncidents((prev) => [newIncident, ...prev]);

            // Play audio alert for 3 seconds
            const audio = new Audio('/MKBAaagAlert.mp3');
            audio.loop = true;
            audio.play().catch(e => {
                console.error('🚨 Audio play blocked by browser. User must interact with the page first:', e.message);
            });
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 3000);

            // Show toast
            toast.error(`🚨 NEW EMERGENCY: ${newIncident.incident_type}`, {
                duration: 6000,
                position: 'top-center',
            });

            // 3. Trigger the native browser pop-up
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('🚨 RespondR Emergency', {
                    body: `${newIncident.incident_type} reported at ${newIncident.location}`,
                    icon: '/favicon.ico'
                });
            }
        });

        // Listen for incident updates (e.g., status changes)
        socket.on('INCIDENT_UPDATED', (updatedIncident) => {
            console.log('🔄 INCIDENT UPDATED:', updatedIncident);
            setIncidents((prev) =>
                prev.map((inc) =>
                    inc.id === updatedIncident.id ? updatedIncident : inc
                )
            );
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
            toast.success("Incident acknowledged");
        } catch (error) {
            console.error("Failed to acknowledge incident:", error);
            toast.error("Action failed. Try again.");
        }
    };

    // Derived stats
    const stats = useMemo(() => {
        return {
            total: incidents.length,
            pending: incidents.filter(i => i.status === 'pending').length,
            acknowledged: incidents.filter(i => i.status === 'acknowledged').length,
        };
    }, [incidents]);

    const filteredIncidents = useMemo(() => {
        if (activeFilter === "all") return incidents;
        return incidents.filter(i => i.status === activeFilter);
    }, [incidents, activeFilter]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-400/5 blur-[120px] rounded-full animate-blob" style={{ animationDelay: '2s' }} />

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                
                {/* HERO / HEADER SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-fade-in-up">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-emerald-500/10 border border-emerald-100 flex items-center justify-center shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Siren className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {user?.team ? user.team.charAt(0).toUpperCase() + user.team.slice(1) : 'Response'} <span className="text-emerald-600">Command</span>
                            </h1>
                            <p className="text-slate-500 mt-2 max-w-md font-medium leading-relaxed">
                                Live emergency monitoring system. Monitor, acknowledge, and coordinate responses in real-time.
                            </p>
                        </div>
                    </div>

                    {/* STATS STRIP */}
                    <div className="flex items-center gap-4 p-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm">
                        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                        </div>
                        <div className={`px-5 py-3 rounded-2xl border transition-all duration-500 ${stats.pending > 0 ? 'bg-rose-50 border-rose-100 shadow-lg shadow-rose-500/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                            <p className={`text-2xl font-black ${stats.pending > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{stats.pending}</p>
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Handled</p>
                            <p className="text-2xl font-black text-emerald-600">{stats.acknowledged}</p>
                        </div>
                    </div>
                </div>

                {/* FILTER TABS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeFilter === 'all' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                        >
                            All Logs
                        </button>
                        <button
                            onClick={() => setActiveFilter("pending")}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeFilter === 'pending' ? 'bg-rose-50 text-rose-600 shadow-md border border-rose-100' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                        >
                            Pending
                            {stats.pending > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                        </button>
                        <button
                            onClick={() => setActiveFilter("acknowledged")}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeFilter === 'acknowledged' ? 'bg-emerald-50 text-emerald-600 shadow-md border border-emerald-100' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                        >
                            Acknowledged
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2 px-6 py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-l border-slate-200 hidden sm:flex">
                        <ListFilter className="w-4 h-4" />
                        Live Feed: {activeFilter}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT SIDE: INCIDENT FEED */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6 stagger-children">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-40 text-slate-400 animate-fade-in-up">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex items-center justify-center mb-8 relative">
                                        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                                    </div>
                                    <p className="font-bold text-2xl text-slate-800">Synchronizing Feed</p>
                                </div>
                            ) : filteredIncidents.length === 0 ? (
                                <div className="bg-white/40 backdrop-blur-md rounded-[3rem] py-32 text-center animate-fade-in-up border border-dashed border-slate-200">
                                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <ShieldCheck className="w-12 h-12 text-emerald-600" />
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 mb-3">All Clear</p>
                                </div>
                            ) : (
                                [...filteredIncidents]
                                    .sort((a, b) => a.status === "pending" && b.status !== "pending" ? -1 : 0)
                                    .map((inc) => (
                                        <AlertCard key={inc.id} incident={inc} onAcknowledge={handleAcknowledge} />
                                    ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: WORKFLOW CHECKLIST */}
                    <div className="lg:col-span-4 space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-xl">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <ListFilter className="w-5 h-5 text-emerald-600" />
                                {user?.team?.toUpperCase()} Protocol
                            </h2>
                            <div className="space-y-4">
                                {getChecklist(user?.team).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group cursor-pointer">
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">Team Health</h3>
                            <p className="text-2xl font-black mb-6">Status: Operational</p>
                            <div className="space-y-4">
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[85%] animate-pulse" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Latency: 12ms</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

/* ── SUBCOMPONENTS & HELPERS ── */

const getChecklist = (team) => {
    const defaultList = ["Acknowledge Incident", "Deploy to Location", "Secure Perimeter", "Provide Status Update"];
    const protocols = {
        medical: ["Verify Vital Signs", "Administer First Aid", "Prepare for Extraction", "Coordinate with Hospital"],
        security: ["Identify Threat Level", "Evacuate Civilians", "Establish Lockdown", "Apprehend if Possible"],
        maintenance: ["Shut Down Utilities", "Assess Structural Integrity", "Begin Cleanup/Repair", "Safety Inspection"],
        fire: ["Connect to Hydrants", "Extinguish Flames", "Search and Rescue", "Ventilate Area"]
    };
    return protocols[team?.toLowerCase()] || defaultList;
};

export default StaffDashboard;