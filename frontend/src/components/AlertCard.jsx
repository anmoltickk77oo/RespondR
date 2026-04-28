import { useState } from "react";
import { CheckCircle2, Clock, MapPin, AlertTriangle, Flame, Shield, Wrench, ListFilter, Activity, Search } from "lucide-react";
import TimelineModal from "./TimelineModal";

const TYPE_CONFIG = {
    "Medical Emergency": { icon: AlertTriangle, color: "text-rose-600",    glow: "shadow-glow-red",   accent: "from-rose-500/10 to-transparent",   border: "border-rose-200" },
    "Fire Hazard":       { icon: Flame,         color: "text-orange-600", glow: "shadow-glow-amber", accent: "from-orange-500/10 to-transparent", border: "border-orange-200" },
    "Security Threat":   { icon: Shield,        color: "text-indigo-600", glow: "shadow-glow-blue",  accent: "from-indigo-500/10 to-transparent", border: "border-indigo-200" },
    "Maintenance Issue": { icon: Wrench,        color: "text-amber-600",  glow: "shadow-glow-amber", accent: "from-amber-500/10 to-transparent",  border: "border-amber-200" },
};

const STATUS_CONFIG = {
    pending: {
        label: "Awaiting Action",
        icon: Clock,
        classes: "bg-rose-50 text-rose-600 border-rose-100 shadow-sm",
        dot: "bg-rose-500",
    },
    responding: {
        label: "Responding",
        icon: Activity,
        classes: "bg-blue-50 text-blue-600 border-blue-100 shadow-sm",
        dot: "bg-blue-500",
    },
    acknowledged: {
        label: "Acknowledged",
        icon: CheckCircle2,
        classes: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm",
        dot: "bg-indigo-500",
    },
    resolved: {
        label: "Resolved",
        icon: CheckCircle2,
        classes: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm",
        dot: "bg-emerald-500",
    },
};

const ROLE_TASKS = {
    "Medical Emergency": [
        "Assess pulse and respiratory rate",
        "Clear immediate airway obstructions",
        "Deploy AED if unconscious",
        "Prepare vitals for paramedic handover"
    ],
    "Fire Hazard": [
        "Confirm evacuation of nearest sector",
        "Seal fire doors and ventilation",
        "Verify fire suppression activation",
        "Designate safe assembly point"
    ],
    "Security Threat": [
        "Initiate zone lockdown protocols",
        "Monitor surveillance feed ID-9",
        "Verify identity of nearby personnel",
        "Establish secure perimeter"
    ],
    "Maintenance Issue": [
        "Isolate power/water source",
        "Mark zone with hazard tape",
        "Document structural damage",
        "Notify engineering team"
    ]
};

const AlertCard = ({ incident, onAcknowledge, onResolve, variant = "default" }) => {
    const [showTasks, setShowTasks] = useState(false);
    const [showAudit, setShowAudit] = useState(false);

    const type = TYPE_CONFIG[incident.incident_type] || TYPE_CONFIG["Medical Emergency"];
    const Icon = type.icon;
    const status = STATUS_CONFIG[incident.status] || STATUS_CONFIG.pending;
    
    const timeAgo = incident.created_at ? getTimeAgo(new Date(incident.created_at)) : null;

    if (variant === "premium") {
        return (
            <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-8 relative z-10">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500 relative">
                                <div className={`absolute inset-0 ${type.color.replace('text', 'bg')}/10 blur-xl rounded-full`} />
                                <Icon className={`w-10 h-10 ${type.color} relative z-10`} />
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-2xl font-black text-white tracking-tight">{incident.incident_type}</h3>
                                    <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${status.classes.replace('bg-rose-50', 'bg-rose-500/10').replace('text-rose-600', 'text-rose-400').replace('border-rose-100', 'border-rose-500/20')}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        {incident.location}
                                    </div>
                                    {timeAgo && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-purple-400" />
                                            {timeAgo}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setShowAudit(true)}
                                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
                            >
                                <Activity className="w-4 h-4 text-blue-400" />
                                Mission Audit
                            </button>

                            {incident.status === "pending" && onAcknowledge && (
                                <button
                                    onClick={() => onAcknowledge(incident.id)}
                                    className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Assign Unit
                                </button>
                            )}

                            {incident.status !== "resolved" && onResolve && (
                                <button
                                    onClick={() => onResolve(incident.id)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Close Case
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <TimelineModal 
                    isOpen={showAudit} 
                    onClose={() => setShowAudit(false)} 
                    incidentId={incident.id} 
                />
            </div>
        );
    }

    return (
        <div className={`relative group animate-fade-in-up`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${type.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]`} />
            
            <div className={`relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border ${type.border} shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg ${type.glow} flex items-center justify-center border border-slate-50 shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                            <Icon className={`w-8 h-8 ${type.color}`} />
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{incident.incident_type}</h3>
                                <div className={`px-3 py-1 rounded-full border ${status.classes} flex items-center gap-2`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-slate-400">
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <MapPin className="w-3 h-3 text-rose-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{incident.location}</span>
                                </div>
                                {timeAgo && (
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                        <Clock className="w-3 h-3 text-blue-500" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{timeAgo}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowAudit(true)}
                            className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl border border-slate-100 transition-all"
                            title="Mission Audit"
                        >
                            <Clock className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={() => setShowTasks(!showTasks)}
                            className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border transition-all duration-300 ${showTasks ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                        >
                            {showTasks ? 'Hide Protocol' : 'View Protocol'}
                        </button>
                        
                        {incident.status === "pending" && onAcknowledge && (
                            <button
                                onClick={() => onAcknowledge(incident.id)}
                                className="group/btn flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-black rounded-xl transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98] uppercase tracking-widest"
                            >
                                <CheckCircle2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                Deploy Response
                            </button>
                        )}

                        {incident.status !== "resolved" && onResolve && (
                            <button
                                onClick={() => onResolve(incident.id)}
                                className="group/btn flex items-center justify-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl transition-all duration-300 shadow-xl shadow-emerald-200 active:scale-[0.98] uppercase tracking-widest"
                            >
                                <CheckCircle2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                Close Case
                            </button>
                        )}
                    </div>
                </div>

                {showTasks && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(ROLE_TASKS[incident.incident_type] || []).map((task, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/task cursor-pointer hover:bg-white hover:border-emerald-200 transition-all">
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover/task:border-emerald-500 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover/task:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover/task:text-slate-900 transition-colors">{task}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TimelineModal 
                isOpen={showAudit} 
                onClose={() => setShowAudit(false)} 
                incidentId={incident.id} 
            />
        </div>
    );
};

/* ── Helper ── */
function getTimeAgo(date) {
    if (!date || isNaN(date.getTime())) return null;
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default AlertCard;