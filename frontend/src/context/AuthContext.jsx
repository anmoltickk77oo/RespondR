/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { connectSocket, disconnectSocket, socket } from '../socket/socket';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (user && token) {
            connectSocket(); // Connect to real-time updates
            socket.emit('JOIN_ROOMS', user);
        }
    }, [user]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        connectSocket(); // Turn on sockets when they log in
        socket.emit('JOIN_ROOMS', userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        disconnectSocket(); // Turn off sockets
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};