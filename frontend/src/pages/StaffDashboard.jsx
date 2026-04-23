import { useState, useEffect, useContext } from 'react';
import { socket } from '../socket/socket';
import { AuthContext } from '../context/AuthContext';

const StaffDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        // 1. Listen for new incidents triggered by ANY user
        socket.on('NEW_INCIDENT', (newIncident) => {
            console.log('🚨 NEW INCIDENT RECEIVED:', newIncident);
            // Add the new incident to the TOP of the list
            setIncidents((prevIncidents) => [newIncident, ...prevIncidents]);
        });

        // 2. Cleanup the listener when the component unmounts
        return () => {
            socket.off('NEW_INCIDENT');
        };
    }, []);

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
                    incidents.map((inc, index) => (
                        <div key={index} className="flex items-center justify-between p-5 bg-white border-l-8 border-red-500 rounded-lg shadow-md animate-pulse">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-800">{inc.incident_type}</h3>
                                <p className="text-lg text-gray-600">Location: <span className="font-bold text-black">{inc.location}</span></p>
                                <p className="mt-2 text-sm font-semibold tracking-wider text-red-500 uppercase">
                                    Status: {inc.status}
                                </p>
                            </div>
                            <button className="px-6 py-3 font-bold text-white transition-colors bg-yellow-500 rounded shadow hover:bg-yellow-600">
                                Acknowledge
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;