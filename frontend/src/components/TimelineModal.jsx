import React, { useState, useEffect } from 'react';
import { X, Clock, User, Info, Loader2, CheckCircle2, Siren, Zap } from 'lucide-react';
import api from '../api/api';

const TimelineModal = ({ isOpen, onClose, incidentId }) => {
    const [timeline, setTimeline] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && incidentId) {
            const fetchTimeline = async () => {
                try {
                    setIsLoading(true);
                    const response = await api.get(`/incidents/${incidentId}/timeline`);
                    setTimeline(response.data.timeline);
                } catch (error) {
                    console.error("Failed to fetch timeline:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTimeline();
        }
    }, [isOpen, incidentId]);

    if (!isOpen) return null;

    const getActionIcon = (action) => {
        switch (action) {
            case 'TRIGGERED': return <Siren className="w-4 h-4 text-rose-500" />;
            case 'ACKNOWLEDGED': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
            case 'RESOLVED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            default: return <Zap className="w-4 h-4 text-amber-500" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh] animate-scale-up">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Mission Audit</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence ID: #{String(incidentId).padStart(4, '0')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-xl transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reconstructing events...</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100" />
                            
                            <div className="space-y-10 relative">
                                {timeline.map((event, idx) => (
                                    <div key={event.id} className="flex gap-6 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        {/* Icon Node */}
                                        <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                            {getActionIcon(event.action)}
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                                                    {event.action}
                                                </h3>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            
                                            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                                        {event.user_name || 'System Auto-Trigger'}
                                                    </span>
                                                </div>
                                                
                                                {event.details && Object.keys(event.details).length > 0 && (
                                                    <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                                                        <Info className="w-3 h-3 text-slate-300 mt-0.5" />
                                                        <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                                            {Object.entries(event.details).map(([key, val]) => (
                                                                <div key={key}><span className="font-bold">{key}:</span> {String(val)}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Trail Immutable</span>
                    </div>
                    <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelineModal;
