# API Gateway Service

A simple Node.js/Express API Gateway for local development that routes requests to microservices.

## Features

- **Request Routing**: Automatically routes requests to the correct microservice based on URL path
- **Header Passthrough**: Preserves Authorization and Content-Type headers
- **Error Handling**: Graceful handling of unavailable microservices
- **Health Check**: `/health` endpoint for monitoring
- **Multi-Port CORS**: Supports frontend applications running on ports 5173-5179

## Service Routes

| Service | Path | Port |
|---------|------|------|
| Auth | `/api/v1/auth/*` | 3000 |
| Authors | `/api/v1/authors/*` | 3001 |
| Books | `/api/v1/books/*` | 3002 |

## Local Development

### Prerequisites

- Node.js >= 18.0.0
- Microservices running on their respective ports

### Installation

```bash
cd services/api-gateway
npm install
```

### Configuration

Copy `.env.example` to `.env` and update as needed:

```bash
cp .env.example .env
```

Environment variables:

- `PORT` - Gateway port (default: 4000)
- `NODE_ENV` - Environment (default: development)
- `LOG_LEVEL` - Logging level (default: info)
- `CORS_ORIGIN` - CORS allowed origin(s). Leave empty for default (ports 5173-5179 via regex), or specify one or more comma-separated origins
- `MICROSERVICE_AUTH_URL` - Auth service URL (default: http://localhost:3000)
- `MICROSERVICE_AUTHOR_URL` - Author service URL (default: http://localhost:3001)
- `MICROSERVICE_BOOK_URL` - Book service URL (default: http://localhost:3002)

### CORS Configuration

By default, the gateway accepts CORS requests from frontend applications running on ports 5173-5179 using the regex pattern `/http:\/\/localhost:517[3-9]/`.

To customize CORS origins, set the `CORS_ORIGIN` environment variable:

```bash
# Single origin
CORS_ORIGIN=http://localhost:5173

# Multiple origins (comma-separated)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175

# Any localhost port
CORS_ORIGIN=http://localhost:*
```

### Running

```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

## Usage

### Frontend Configuration

In your frontend app, set the base URL to point to the gateway:

```env
VITE_API_ALL_URL=http://localhost:4000/api/v1
```

### Example Requests

All requests go through the gateway:

```bash
# Login
POST http://localhost:4000/api/v1/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Get all authors
GET http://localhost:4000/api/v1/authors

# Get all books
GET http://localhost:4000/api/v1/books

# Create a book
POST http://localhost:4000/api/v1/books
Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "My Book",
  "isbn": "1234567890",
  "authorId": "uuid-here"
}
```

## Docker

To run with Docker Compose:

```bash
docker-compose up api-gateway
```

The gateway will be available at `http://localhost:4000`.

## Production Deployment

**The API gateway is not deployed to production.** In production:

1. Use a proper API gateway (Kong, nginx, cloud provider gateway)
2. Or use direct service-to-service communication via internal DNS
3. Or use a service mesh (Istio, Linkerd)

For local development, the gateway provides a single entry point that:
- Hides microservice port details
- Provides consistent error handling
- Simplifies frontend configuration

## Health Check

```bash
GET http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "api-gateway"
}
```
