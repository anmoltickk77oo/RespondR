import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { Loader2, LogOut, Radio, Bell } from 'lucide-react';
import { socket } from '../socket/socket';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import AlertCard from '../components/AlertCard';

const StaffDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch existing incidents on mount
        const fetchIncidents = async () => {
            try {
                const response = await api.get('/incidents');
                setIncidents(response.data.incidents);
            } catch (error) {
                console.error('Failed to fetch incidents:', error);
                toast.error('Failed to load incident feed');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncidents();

        // Listen for new incidents
        socket.on('NEW_INCIDENT', (newIncident) => {
            console.log('🚨 NEW INCIDENT RECEIVED:', newIncident);
            setIncidents((prevIncidents) => [newIncident, ...prevIncidents]);
        });

        // Listen for incident updates (e.g., status changes)
        socket.on('INCIDENT_UPDATED', (updatedIncident) => {
            console.log('🔄 INCIDENT UPDATED:', updatedIncident);
            setIncidents((prevIncidents) => 
                prevIncidents.map(inc => 
                    inc.id === updatedIncident.id ? updatedIncident : inc
                )
            );
        });

        return () => {
            socket.off('NEW_INCIDENT');
            socket.off('INCIDENT_UPDATED');
        };
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await api.patch(`/incidents/${id}`, { status: 'acknowledged' });
            toast.success('Incident acknowledged');
        } catch (error) {
            console.error('Failed to acknowledge incident:', error);
            toast.error('Action failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 mb-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Radio className="w-6 h-6 text-red-600 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Command Center</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">On Duty</span>
                        <span className="font-semibold text-gray-700">{user?.name}</span>
                    </div>
                    <button 
                        onClick={logout} 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Incident Feed */}
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="font-medium">Connecting to live feed...</p>
                    </div>
                ) : incidents.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium text-lg">No active emergencies. All clear.</p>
                    </div>
                ) : (
                    incidents.map((inc) => (
                        <AlertCard 
                            key={inc.id} 
                            incident={inc} 
                            onAcknowledge={handleAcknowledge} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;