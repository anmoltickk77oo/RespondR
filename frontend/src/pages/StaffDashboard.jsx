import { useState, useEffect, useContext } from 'react';
import { socket } from '../socket/socket';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import AlertCard from '../components/AlertCard';

const StaffDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        // Fetch existing incidents on mount
        const fetchIncidents = async () => {
            try {
                const response = await api.get('/incidents');
                setIncidents(response.data.incidents);
            } catch (error) {
                console.error('Failed to fetch incidents:', error);
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
            // The socket will broadcast the update and update our state
        } catch (error) {
            console.error('Failed to acknowledge incident:', error);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 mb-8 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-red-600">🚨 Command Center</h1>
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700">Dispatcher: {user?.name}</span>
                    <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
                </div>
            </div>

            {/* Incident Feed */}
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                {incidents.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow">
                        No active emergencies. All clear.
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