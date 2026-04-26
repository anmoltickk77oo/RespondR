import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import SOSButton from '../components/SOSButton';

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    // Default values for our dropdowns
    const [location, setLocation] = useState('Main Lobby');
    const [incidentType, setIncidentType] = useState('Medical Emergency');

    return (
        <div className="flex flex-col items-center min-h-screen py-10 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between w-full max-w-md px-6 mb-12">
                <h1 className="text-xl font-bold text-gray-800">Hi, {user?.name}</h1>
                <button onClick={() => { logout(); toast.success('Logged out safely'); }} className="font-semibold text-red-500 hover:underline">Logout</button>
            </div>

            {/* Quick Context Selectors */}
            <div className="flex flex-col w-full max-w-xs gap-4 mb-12">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                    <option>Main Lobby</option>
                    <option>Room 101</option>
                    <option>Cafeteria</option>
                    <option>Parking Lot</option>
                </select>

                <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                    <option>Medical Emergency</option>
                    <option>Fire Hazard</option>
                    <option>Security Threat</option>
                    <option>Maintenance Issue</option>
                </select>
            </div>

            {/* The Big Red Button */}
            <SOSButton location={location} incidentType={incidentType} />

            <p className="mt-8 font-medium text-gray-500">Tap instantly in case of emergency</p>
        </div>
    );
};

export default UserDashboard;