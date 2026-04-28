import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldAlert, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../api/api';

const SOSButton = ({ location, incidentType }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSOS = async () => {
        setStatus('loading');
        const toastId = toast.loading('Sending emergency alert...');

        const payload = { location, incidentType };

        try {
            await api.post('/sos', payload);

            setStatus('success');
            toast.success('Alert broadcasted! Help is on the way.', { id: toastId });

            // Reset button after 4 seconds
            setTimeout(() => setStatus('idle'), 4000);
        } catch (error) {
            console.error('SOS Error:', error);
            
            // If we're offline, queue it!
            if (!navigator.onLine) {
                const pending = JSON.parse(localStorage.getItem('pending_sos') || '[]');
                pending.push(payload);
                localStorage.setItem('pending_sos', JSON.stringify(pending));
                
                setStatus('success'); // Show success even if queued, but with specific toast
                toast.success('Offline: Signal queued. Help is on the way!', { 
                    id: toastId,
                    duration: 6000,
                    icon: '📡'
                });
                setTimeout(() => setStatus('idle'), 4000);
                return;
            }

            setStatus('error');
            toast.error('Failed to send alert. Please try again or call 911.', { id: toastId });
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const config = {
        idle:    { bg: "from-rose-600 to-rose-700", border: "border-rose-400/30", ring: "bg-rose-500", glow: "shadow-2xl shadow-rose-500/40" },
        loading: { bg: "from-amber-500 to-amber-600", border: "border-amber-400/30", ring: "bg-amber-400", glow: "shadow-2xl shadow-amber-500/40" },
        success: { bg: "from-emerald-500 to-emerald-600", border: "border-emerald-400/30", ring: "bg-emerald-400", glow: "shadow-2xl shadow-emerald-500/40" },
        error:   { bg: "from-slate-700 to-slate-800", border: "border-slate-600/30", ring: "bg-slate-500", glow: "shadow-2xl shadow-slate-900/40" },
    };

    const c = config[status];

    return (
        <div className="relative flex items-center justify-center">
            {/* Outer animated ring */}
            {status === 'idle' && (
                <>
                    <div className={`absolute w-96 h-96 rounded-full ${c.ring} opacity-[0.03] animate-pulse-ring`} />
                    <div className={`absolute w-[28rem] h-[28rem] rounded-full ${c.ring} opacity-[0.02] animate-pulse-ring`} style={{ animationDelay: '1s' }} />
                </>
            )}

            {/* The Button */}
            <button
                onClick={handleSOS}
                disabled={status !== 'idle'}
                className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br ${c.bg} border-8 ${c.border} ${c.glow}
                    text-white font-black transition-all duration-500 transform
                    ${status === 'idle' ? 'cursor-pointer hover:scale-105 active:scale-[0.85] shadow-glow-red' : ''}
                    ${status === 'loading' ? 'cursor-wait animate-pulse' : ''}
                    flex flex-col items-center justify-center gap-4
                    disabled:cursor-default overflow-hidden z-20 group`}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                
                {status === 'idle' && (
                    <>
                        <div className="bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <ShieldAlert size={80} strokeWidth={2.5} className="drop-shadow-2xl" />
                        </div>
                        <span className="text-5xl font-black tracking-tighter drop-shadow-2xl uppercase">SOS</span>
                    </>
                )}
                {status === 'loading' && (
                    <>
                        <Loader2 size={80} strokeWidth={2.5} className="animate-spin drop-shadow-2xl" />
                        <span className="text-xl uppercase tracking-[0.3em] font-black">Linking...</span>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle2 size={80} strokeWidth={2.5} className="drop-shadow-2xl animate-bounce" />
                        <span className="text-xl uppercase tracking-[0.3em] font-black">Broadcast</span>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertTriangle size={80} strokeWidth={2.5} className="drop-shadow-2xl" />
                        <span className="text-xl uppercase tracking-[0.3em] font-black">Failed</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SOSButton;