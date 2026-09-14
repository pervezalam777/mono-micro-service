import { Router, Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { MICROSERVICES, microserviceClients } from '../microservices';

const router = Router();

// Extract API version from the request URL (e.g., "/api/v1" from "/api/v1/auth/login")
// Uses req.baseUrl which contains the mount path (e.g., "/api/v1")
const getApiVersion = (baseUrl: string): string => {
  const match = baseUrl.match(/^\/api\/v\d+/);
  return match ? match[0] : '/api/v1';
};

// Get the target service based on the request path (without API version prefix)
const getServiceFromPath = (path: string): 'auth' | 'author' | 'book' | null => {
  // Remove API version prefix first (e.g., "/api/v1/auth/login" -> "/auth/login")
  const apiVersion = getApiVersion(path);
  const pathWithoutApiVersion = path.startsWith(apiVersion) ? path.substring(apiVersion.length) : path;

  if (pathWithoutApiVersion.startsWith('/auth/')) return 'auth';
  if (pathWithoutApiVersion.startsWith('/authors/')) return 'author';
  if (pathWithoutApiVersion.startsWith('/books/')) return 'book';
  return null;
};

// Proxy request to the appropriate microservice
const proxyRequest = async (
  req: Request,
  res: Response,
  service: 'auth' | 'author' | 'book'
): Promise<void> => {
  console.log(`Proxying request to service: ${service} for path: ${req.path}`);
  const client = microserviceClients[service];
  const serviceConfig = MICROSERVICES[service];

  // Construct target path using req.baseUrl (mount path like "/api/v1") + req.path (stripped path)
  // For router.use('/api/v1', ...): req.baseUrl = "/api/v1", req.path = "/auth/login"
  // Target: /api/v1 + /auth/login = /api/v1/auth/login
  const apiVersion = getApiVersion(req.baseUrl);
  const targetPath = `${apiVersion}${req.path}${req.url.substring(req.path.length)}`;

  try {
    console.log(`Forwarding request to ${serviceConfig.url}${targetPath}`);
    const response = await client.request({
      method: req.method as any,
      url: targetPath,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || undefined,
        'Accept': req.headers.accept || 'application/json',
      },
      params: req.query,
      timeout: 30000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ETIMEDOUT') {
      res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: `Microservice ${service} is not available`,
          service: service,
          url: serviceConfig.url,
        },
      });
    } else if (axiosError.response) {
      res.status(axiosError.response.status).json(axiosError.response.data);
    } else {
      res.status(500).json({
        error: {
          code: 'GATEWAY_ERROR',
          message: 'Gateway failed to forward request',
          service: service,
          details: axiosError.message,
        },
      });
    }
  }
};

router.get('/api/health', (req: Request, res: Response, next: NextFunction) => {
  console.log(`Health in proxy check requested at ${new Date().toISOString()}`);
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway'
  });
});

// Route handler - matches all paths under /api/v1/*
router.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  const service = getServiceFromPath(req.path);
  console.log(`Proxying request to service: ${service} for path: ${req.path}`);
  if (service) {
    proxyRequest(req, res, service);
  } else {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `No service found for path: ${req.path}`,
        availableServices: Object.keys(MICROSERVICES),
      },
    });
  }
});

export default router;
