import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import api from '../api/api';
import toast from 'react-hot-toast';

const OfflineHeartbeat = () => {
    const isOnline = useNetworkStatus();
    const [pendingSOS, setPendingSOS] = useState([]);

    useEffect(() => {
        // Load pending SOS from localStorage on mount
        const saved = JSON.parse(localStorage.getItem('pending_sos') || '[]');
        setPendingSOS(saved);
    }, []);

    useEffect(() => {
        // When we come back online, try to sync pending SOS
        if (isOnline && pendingSOS.length > 0) {
            syncPendingSOS();
        }
    }, [isOnline]);

    const syncPendingSOS = async () => {
        const queue = [...pendingSOS];
        let successCount = 0;

        toast.loading('Connection restored. Syncing emergency signals...', { id: 'syncing' });

        for (const sos of queue) {
            try {
                await api.post('/sos', sos);
                successCount++;
            } catch (err) {
                console.error("Failed to sync SOS:", err);
            }
        }

        if (successCount > 0) {
            const remaining = queue.slice(successCount);
            setPendingSOS(remaining);
            localStorage.setItem('pending_sos', JSON.stringify(remaining));
            toast.success(`Successfully synced ${successCount} emergency signals!`, { id: 'syncing' });
        } else {
            toast.error('Sync failed. Will retry later.', { id: 'syncing' });
        }
    };

    if (isOnline && pendingSOS.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-fade-in-up">
            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 ${
                !isOnline ? 'bg-rose-500 text-white border-rose-400' : 'bg-emerald-500 text-white border-emerald-400'
            }`}>
                <div className="relative">
                    {!isOnline ? (
                        <WifiOff className="w-5 h-5 animate-pulse" />
                    ) : (
                        <Wifi className="w-5 h-5" />
                    )}
                    {pendingSOS.length > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-rose-500 text-[10px] font-black rounded-full flex items-center justify-center border border-rose-200 shadow-sm">
                            {pendingSOS.length}
                        </span>
                    )}
                </div>
                
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                        {!isOnline ? 'OFFLINE MODE' : 'BACK ONLINE'}
                    </p>
                    <p className="text-[12px] font-bold mt-1 opacity-90">
                        {!isOnline 
                            ? (pendingSOS.length > 0 ? `${pendingSOS.length} signals queued` : 'Sync suspended')
                            : 'All systems operational'
                        }
                    </p>
                </div>

                {!isOnline && pendingSOS.length > 0 && (
                    <div className="ml-2 pl-4 border-l border-white/20">
                        <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfflineHeartbeat;
