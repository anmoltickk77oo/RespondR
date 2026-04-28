import { useEffect, useState } from 'react';
import { socket } from '../socket/socket';

export const useGeolocation = (enabled = false) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            const newLoc = { lat: latitude, lng: longitude };
            setLocation(newLoc);
            
            // Emit to socket
            socket.emit('UPDATE_LOCATION', newLoc);
        };

        const handleError = (err) => {
            setError(err.message);
            console.error("Geo Error:", err);
        };

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, [enabled]);

    return { location, error };
};
