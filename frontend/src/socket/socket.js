import { io } from 'socket.io-client';

// Point to your Express server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// We set autoConnect to false so it doesn't randomly connect 
// until the user actually logs in.
export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};