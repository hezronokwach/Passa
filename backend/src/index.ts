import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from "node:path";
import rateLimit from 'express-rate-limit';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { singleServerConfig } from './config/singleServer';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import eventRoutes from '@/routes/events';

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
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.app.env,
    version: process.env['npm_package_version'] || '1.0.0',
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// const staticPath = path.join(process.cwd(), 'public');
// app.use('/static', express.static(staticPath));

  // 1. Serve static files with caching
  app.use(
    '/static',
    express.static(singleServerConfig.frontendBuildPath, singleServerConfig.staticCache)
  );

  console.log("CONFIG: ", singleServerConfig);


  // 2. SPA fallback for defined routes
  singleServerConfig.spaFallback.routes.forEach(route => {
    app.get(route, (_req, res) => {
      res.sendFile(
        path.join(singleServerConfig.frontendBuildPath, singleServerConfig.spaFallback.indexFile)
      );
    });
  });

  // Optional: catch-all for unknown routes (if you want all non-API requests to go to index.html)
  app.get('*', (_req, res) => {
    res.sendFile(
      path.join(singleServerConfig.frontendBuildPath, singleServerConfig.spaFallback.indexFile)
    );
  });

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.app.port || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  // logger.info(`Environment: ${config.app.env}`);
  // logger.info(`CORS enabled for: ${config.cors.origin}`);
});

export default app;
