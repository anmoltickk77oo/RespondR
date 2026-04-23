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