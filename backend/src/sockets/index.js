const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    // Attach Socket.IO to the Node HTTP server
    io = new Server(server, {
        cors: {
            origin: "*", // For the hackathon MVP, allow any frontend to connect
            methods: ["GET", "POST", "PATCH"]
        }
    });

    const activeResponders = new Map(); // socket.id -> { userId, name, role, team, location: { lat, lng } }

    // Listen for new frontend connections
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Handle joining rooms
        socket.on('JOIN_ROOMS', (userData) => {
            const { id, role, team, name } = userData;
            
            // Store initial metadata for the responder
            if (role === 'admin' || role === 'staff') {
                activeResponders.set(socket.id, { userId: id, name, role, team, location: null });
            }

            if (role === 'admin') {
                socket.join('room:admin');
                console.log(`👑 Admin ${socket.id} joined room:admin`);
            } else if (role === 'staff' && team) {
                const teamRoom = `room:${team.toLowerCase()}`;
                socket.join(teamRoom);
                console.log(`👨‍🚒 Staff ${socket.id} joined ${teamRoom}`);
            } else if (role === 'user') {
                const userRoom = `room:user:${id}`;
                socket.join(userRoom);
                console.log(`👤 User ${socket.id} joined ${userRoom}`);
            }
        });

        // Handle Live Location Heartbeat
        socket.on('UPDATE_LOCATION', (location) => {
            const responder = activeResponders.get(socket.id);
            if (responder) {
                responder.location = location;
                // Broadcast updated locations to admins and the same team
                const updatePayload = { socketId: socket.id, ...responder };
                
                io.to('room:admin').emit('RESPONDER_MOVED', updatePayload);
                if (responder.team) {
                    io.to(`room:${responder.team.toLowerCase()}`).emit('RESPONDER_MOVED', updatePayload);
                }
            }
        });

        socket.on('disconnect', () => {
            if (activeResponders.has(socket.id)) {
                const responder = activeResponders.get(socket.id);
                activeResponders.delete(socket.id);
                // Notify others that this responder is offline
                io.to('room:admin').emit('RESPONDER_OFFLINE', { socketId: socket.id, userId: responder.userId });
            }
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

// This helper function lets us grab the 'io' instance in our controllers
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIo };