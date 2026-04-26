const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sosRoutes = require('./routes/sosRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { initializeSocket } = require('./sockets/index');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// 1. Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors());
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// 3. Performance & Utility
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10kb' })); // Body parser with size limit

// 4. API Documentation (Swagger)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RespondR API Documentation',
      version: '1.0.0',
      description: 'Emergency response and coordination system API',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 5. Database Connection
connectDB();

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/notifications', notificationRoutes);

// 7. Real-time Communications
initializeSocket(server);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'RespondR API is running smoothly.' });
});

// 8. Error Handling Middleware (Global)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📖 Documentation available at http://localhost:${PORT}/api-docs`);
});