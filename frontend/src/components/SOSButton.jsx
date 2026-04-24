import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldAlert, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../api/api';

const SOSButton = ({ location, incidentType }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSOS = async () => {
        setStatus('loading');
        const toastId = toast.loading('Sending emergency alert...');

        try {
            await api.post('/sos', { location, incidentType });

            setStatus('success');
            toast.success('Alert broadcasted! Help is on the way.', { id: toastId });

            // Reset button after 4 seconds
            setTimeout(() => setStatus('idle'), 4000);
        } catch (error) {
            console.error('SOS Error:', error);
            setStatus('error');
            toast.error('Failed to send alert. Please try again or call 911.', { id: toastId });
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <div className="relative">
            {/* Outer Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-500
                ${status === 'idle' ? 'bg-red-600 animate-pulse' : ''}
                ${status === 'loading' ? 'bg-yellow-400' : ''}
                ${status === 'success' ? 'bg-green-500' : ''}
                ${status === 'error' ? 'bg-gray-900' : ''}`}
            />

            <button
                onClick={handleSOS}
                disabled={status !== 'idle'}
                className={`relative w-72 h-72 rounded-full text-5xl font-black text-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 transform active:scale-90 flex flex-col items-center justify-center gap-4 border-8
                ${status === 'idle' ? 'bg-red-600 hover:bg-red-500 border-red-500/50 cursor-pointer' : ''}
                ${status === 'loading' ? 'bg-yellow-500 border-yellow-400/50 cursor-wait' : ''}
                ${status === 'success' ? 'bg-green-600 border-green-500/50' : ''}
                ${status === 'error' ? 'bg-gray-900 border-gray-800/50' : ''}`}
            >
                {status === 'idle' && (
                    <>
                        <ShieldAlert size={80} strokeWidth={2.5} />
                        <span className="text-4xl tracking-tighter">SOS</span>
                    </>
                )}
                {status === 'loading' && (
                    <>
                        <Loader2 size={80} className="animate-spin" />
                        <span className="text-2xl uppercase tracking-widest font-bold">Alerting</span>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle2 size={80} />
                        <span className="text-2xl uppercase tracking-widest font-bold">Sent</span>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertTriangle size={80} />
                        <span className="text-2xl uppercase tracking-widest font-bold">Retry</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SOSButton;