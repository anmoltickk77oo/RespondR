import { useState } from "react";
import { CheckCircle2, Clock, MapPin, AlertTriangle, Flame, Shield, Wrench, ListFilter, Activity } from "lucide-react";

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

const AlertCard = ({ incident, onAcknowledge, variant = "default" }) => {
    const [showTasks, setShowTasks] = useState(false);
    const typeConf = TYPE_CONFIG[incident.type] || TYPE_CONFIG["Medical Emergency"];
    const statusConf = STATUS_CONFIG[incident.status] || STATUS_CONFIG.pending;
    const tasks = ROLE_TASKS[incident.type] || ROLE_TASKS["Medical Emergency"];
    const TypeIcon = typeConf.icon;

    const timeAgo = incident.created_at
        ? getTimeAgo(new Date(incident.created_at))
        : null;

    const isPremium = variant === "premium";

    return (
        <div
            className={`group relative ${isPremium ? 'bg-slate-50/50 hover:bg-white' : 'bg-white'} rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-slate-200 animate-fade-in-up ${
                incident.status === "pending" ? typeConf.glow : ""
            }`}
        >
            {/* Accent gradient at top */}
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${typeConf.accent}`} />

            <div className="p-6 sm:p-8">
                {/* Top row: Type + Status */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeConf.accent} flex items-center justify-center border ${typeConf.border} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                            <TypeIcon className={`w-6 h-6 ${typeConf.color}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                                {incident.type || "Emergency"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <MapPin className="w-2.5 h-2.5 text-slate-500" />
                                </div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    {incident.location || "Sector 7-G"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                        <span className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${statusConf.classes}`}>
                            <span className={`w-2 h-2 rounded-full ${statusConf.dot} ${incident.status === "pending" ? "animate-pulse" : ""}`} />
                            {statusConf.label}
                        </span>
                    </div>
                </div>

                {/* Description if available */}
                {incident.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                        "{incident.description}"
                    </p>
                )}

                {/* TASK LIST SECTION */}
                <div className={`mb-6 transition-all duration-500 overflow-hidden ${showTasks ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 flex items-center gap-2">
                        <ListFilter size={12} />
                        Response Protocol
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all group/task shadow-sm">
                                <div className="w-6 h-6 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center group-hover/task:border-rose-400 transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 opacity-0 group-hover/task:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs font-bold text-slate-600 group-hover/task:text-slate-900 transition-colors">
                                    {task}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Meta row + Protocol Toggle */}
                <div className="flex items-center justify-between gap-6">
                    {(timeAgo || incident.id) && (
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {incident.id && (
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 font-mono">
                                    <span className="text-slate-300 text-[8px]">UNIT</span> #{String(incident.id).padStart(4, "0")}
                                </span>
                            )}
                            {timeAgo && (
                                <span className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-300" />
                                    {timeAgo}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowTasks(!showTasks)}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all duration-300 ${showTasks ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                        >
                            {showTasks ? 'Hide Protocol' : 'View Protocol'}
                        </button>
                        
                        {incident.status === "pending" && (
                            <button
                                onClick={() => onAcknowledge(incident.id)}
                                className="group/btn flex items-center justify-center gap-3 px-6 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-black rounded-xl transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98] uppercase tracking-widest"
                            >
                                <CheckCircle2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                Deploy Response
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Helper ── */
function getTimeAgo(date) {
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