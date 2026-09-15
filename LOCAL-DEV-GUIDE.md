# Local Development Guide

This document describes how to run the microservices and API gateway locally.

## Overview

For local development, we use:
- **API Gateway** (port 4000) - Single entry point for all microservices
- **Auth Service** (port 3000) - Authentication service
- **Author Service** (port 3001) - Author management service
- **Book Service** (port 3002) - Book management service

## Quick Start

### Windows

```bash
# Start all services with one command
start-local.bat
```

### Manual Start

```bash
# Terminal 1: Start API Gateway
cd services/api-gateway
npm install
npm run dev

# Terminal 2: Start Auth Service
cd services/auth-service
npm install
npm run dev

# Terminal 3: Start Author Service
cd services/author-service
npm install
npm run dev

# Terminal 4: Start Book Service
cd services/book-service
npm install
npm run dev
```

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (for Auth Service)
- PostgreSQL (for Author & Book Services)
- Redis (for caching)

## Environment Setup

### API Gateway

Copy `.env.example` to `.env` in `services/api-gateway/`:

```bash
cd services/api-gateway
cp .env.example .env
```

### Microservices

Each service has its own `.env.example` file. Copy to `.env`:

```bash
# Auth Service
cd services/auth-service
cp .env.example .env

# Author Service
cd services/author-service
cp .env.example .env

# Book Service
cd services/book-service
cp .env.example .env
```

## Frontend Configuration

Update `apps/web/.env` to use the gateway:

```env
VITE_API_ALL_URL=http://localhost:4000/api/v1
```

## Testing the Setup

### Health Check

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "api-gateway"
}
```

### Test Auth Service via Gateway

```bash
# Register a new user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Author Service via Gateway

```bash
# Get all authors
curl http://localhost:4000/api/v1/authors

# Create author (requires auth)
curl -X POST http://localhost:4000/api/v1/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "bio": "Author bio"
  }'
```

### Test Book Service via Gateway

```bash
# Get all books
curl http://localhost:4000/api/v1/books

# Create book (requires auth)
curl -X POST http://localhost:4000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Test Book",
    "isbn": "1234567890",
    "authorId": "<uuid>"
  }'
```

## Production Deployment

**The API gateway is NOT deployed to production.** In production:

1. Use a proper API gateway (Kong, nginx, cloud provider gateway)
2. Or use direct service-to-service communication via internal DNS
3. Or use a service mesh (Istio, Linkerd)

For production, update the frontend to use the production gateway URL:

```env
VITE_API_ALL_URL=https://api.yourdomain.com/v1
```

## Troubleshooting

### Gateway returns 503 Service Unavailable

This means the target microservice is not running. Check:
1. Is the microservice running?
2. Is it accessible at the configured URL?
3. Check the gateway logs for details

### CORS Errors

Ensure `CORS_ORIGIN` is set to your frontend URL in each service:
- Auth Service: `http://localhost:5173`
- Author Service: `http://localhost:5173`
- Book Service: `http://localhost:5173`

### TypeScript Errors

Run `npm install` to ensure all dependencies are installed:
```bash
cd services/api-gateway
npm install
```
