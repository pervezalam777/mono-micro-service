import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const app: Application = express();

// CORS origin configuration - support frontend ports 5173-5179
const corsOrigin = process.env.CORS_ORIGIN;
const corsConfig = corsOrigin
  ? {
      origin: corsOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
    }
  : {
      // Use regex to match ports 5173-5179
      origin: /http:\/\/localhost:517[3-9]/,
      credentials: true,
    };

// Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  console.log(`Health check requested at ${new Date().toISOString()}`);
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway'
  });
});

// Export app without starting the server
// The 404 and error handlers should be added after routes are mounted
export const createServer = (port: number = process.env.PORT ? parseInt(process.env.PORT) : 4000) => {
  app.listen(port, () => {
    logger.info(`API Gateway running on port ${port}`);
    console.log(`API Gateway listening at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
};

export { app };
