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

    // Listen for new frontend connections
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Handle joining rooms
        socket.on('JOIN_ROOMS', (userData) => {
            const { role, team } = userData;
            
            if (role === 'admin') {
                socket.join('room:admin');
                console.log(`👑 Admin ${socket.id} joined room:admin`);
            } else if (role === 'staff' && team) {
                const teamRoom = `room:${team.toLowerCase()}`;
                socket.join(teamRoom);
                console.log(`👨‍🚒 Staff ${socket.id} joined ${teamRoom}`);
            } else if (role === 'user') {
                // Regular users can join their own private room for status updates
                const userRoom = `room:user:${userData.id}`;
                socket.join(userRoom);
                console.log(`👤 User ${socket.id} joined ${userRoom}`);
            }
        });

        socket.on('disconnect', () => {
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