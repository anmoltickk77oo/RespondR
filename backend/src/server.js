const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sosRoutes = require('./routes/sosRoutes'); // NEW: Import SOS routes
const { initializeSocket } = require('./sockets/index');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes); // NEW: Tell app to use SOS routes

initializeSocket(server);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'RespondR API is running smoothly.' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});