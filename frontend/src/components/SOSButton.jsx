import { useState } from 'react';
import api from '../api/api';

const SOSButton = ({ location, incidentType }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSOS = async () => {
        setStatus('loading');
        try {
            // Send the POST request to your Express server
            await api.post('/sos', { location, incidentType });

            setStatus('success');
            // Reset button after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('SOS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <button
            onClick={handleSOS}
            disabled={status === 'loading'}
            className={`w-64 h-64 rounded-full text-5xl font-extrabold text-white shadow-2xl transition-all transform active:scale-95 flex items-center justify-center
            ${status === 'idle' ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}
            ${status === 'loading' ? 'bg-yellow-500' : ''}
            ${status === 'success' ? 'bg-green-500' : ''}
            ${status === 'error' ? 'bg-gray-800' : ''}`}
        >
            {status === 'loading' ? '...' : status === 'success' ? 'SENT!' : status === 'error' ? 'FAILED' : 'SOS'}
        </button>
    );
};

export default SOSButton;