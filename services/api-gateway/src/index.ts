import { app } from './app';
import router from './routes/proxy';
import { Request, Response, NextFunction } from 'express';

// Mount proxy routes
app.use(router);

// 404 handler - must come after routes are mounted
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handling middleware - must come after 404 handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway listening at http://localhost:${PORT}`);
});

export default app;
