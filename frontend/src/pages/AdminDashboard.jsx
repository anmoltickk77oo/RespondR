import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Activity, Shield, CheckCircle } from 'lucide-react';
import { socket } from '../socket/socket';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import AlertCard from '../components/AlertCard';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, acknowledged: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/incidents');
                const data = response.data.incidents;
                setIncidents(data);
                
                const pending = data.filter(i => i.status === 'pending').length;
                const acknowledged = data.filter(i => i.status === 'acknowledged').length;
                setStats({ total: data.length, pending, acknowledged });
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load system stats');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        socket.on('NEW_INCIDENT', (newIncident) => {
            setIncidents((prev) => [newIncident, ...prev]);
            setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
        });

        socket.on('INCIDENT_UPDATED', (updated) => {
            setIncidents((prev) => prev.map(i => i.id === updated.id ? updated : i));
            if (updated.status === 'acknowledged') {
                setStats(prev => ({ ...prev, pending: prev.pending - 1, acknowledged: prev.acknowledged + 1 }));
            }
        });

        return () => {
            socket.off('NEW_INCIDENT');
            socket.off('INCIDENT_UPDATED');
        };
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await api.patch(`/incidents/${id}`, { status: 'acknowledged' });
            toast.success('Incident resolved');
        } catch (error) {
            console.error('Action failed:', error);
            toast.error('Failed to update incident');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center min-w-[120px]">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center min-w-[120px]">
                            <p className="text-sm text-red-500 uppercase tracking-wider font-semibold">Pending</p>
                            <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center min-w-[120px]">
                            <p className="text-sm text-green-500 uppercase tracking-wider font-semibold">Handled</p>
                            <p className="text-2xl font-bold text-green-600">{stats.acknowledged}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="font-medium">Fetching system logs...</p>
                        </div>
                    ) : incidents.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                            <p className="text-gray-400 text-lg font-medium">No incident logs found.</p>
                        </div>
                    ) : (
                        incidents.map(inc => (
                            <AlertCard key={inc.id} incident={inc} onAcknowledge={handleAcknowledge} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
