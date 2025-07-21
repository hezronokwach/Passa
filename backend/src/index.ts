import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import eventRoutes from '@/routes/events';
import creatorRoutes from '@/routes/creators';
import brandRoutes from '@/routes/brands';
import ticketRoutes from '@/routes/tickets';
import analyticsRoutes from '@/routes/analytics';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan(config.log.format));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.app.env,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/brands', authMiddleware, brandRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.app.port || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 Passa Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.app.env}`);
  logger.info(`🌐 CORS enabled for: ${config.cors.origin}`);
});

export default app;
