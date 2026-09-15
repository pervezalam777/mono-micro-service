# Microservices Mono-Repo

A modern microservices architecture with Author and Books services, built with Node.js, TypeScript, React, and deployed to AWS.

## Architecture

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Tech Stack

### Backend
- Node.js 20+ (LTS)
- TypeScript 5+
- Express.js
- MongoDB (Authentication)
- PostgreSQL (Authors & Books)
- Redis (Caching)

### Frontend
- React 19+
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit (State Management)

### Plugin Architecture
- Module-based packages with internal routing
- Lazy loading support via React.lazy
- Redux encapsulation per package
- Zero tight coupling with host applications

### DevOps
- Docker & docker-compose
- AWS (ECS, ALB, RDS, DynamoDB)
- Terraform (IaC)
- GitHub Actions (CI/CD)

## Project Structure

```
mono-repo/
├── apps/                   # Frontend applications
│   ├── web/               # Main web application
│   ├── author/            # Author package (plugin-based)
│   │   ├── src/
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── pages/        # Page containers
│   │   │   ├── routes/       # Internal routing
│   │   │   ├── store/        # Redux store
│   │   │   ├── hooks/        # Custom hooks
│   │   │   └── types/        # Type definitions
│   │   └── README.md         # Package documentation
│   └── books/             # Books package (plugin-based)
├── services/              # Backend microservices
│   ├── auth-service/      # Authentication service
│   ├── author-service/    # Author management service
│   └── book-service/      # Book management service
├── docker/                # Docker configurations
│   ├── docker-compose.yml
│   └── *.Dockerfile
├── terraform/             # AWS infrastructure
├── scripts/               # Helper scripts
├── .github/               # GitHub workflows
├── ARCHITECTURE.md        # Architecture documentation
├── scripts/quality-rules.md  # Quality standards
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- Docker & Docker Compose (optional, for local development)
- Yarn
- AWS CLI (for deployment)

### Local Development (Recommended for Development)

The project includes an API Gateway that routes requests to microservices. For local development, use the gateway to avoid managing multiple ports.

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start local services:
   - **Windows**: Run `start-local.bat`
   - **Linux/Mac**: `bash start-local.sh`
   - **Docker**: `docker-compose up -d`

4. Start the web application:
   ```bash
   cd apps/web
   yarn dev
   ```

### API Gateway

For local development, the API Gateway (`services/api-gateway/`) provides a single entry point for all microservices:

- Gateway URL: `http://localhost:8000/api/v1`
- Auth: `/api/v1/auth/*`
- Authors: `/api/v1/authors/*`
- Books: `/api/v1/books/*`

**Note**: The gateway is for local development only. In production, use a proper API gateway or direct service communication.

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Building Services

```bash
# Build all services
npm run build

# Build specific service
cd services/auth-service && npm run build
```

## API Documentation

Once services are running:

- **API Gateway (Local Dev)**: `http://localhost:8000/api/v1`
  - Auth: `/api/v1/auth/*`
  - Authors: `/api/v1/authors/*`
  - Books: `/api/v1/books/*`
- **Auth Service**: `http://localhost:3000/api/v1/auth`
- **Author Service**: `http://localhost:3001/api/v1/authors`
- **Book Service**: `http://localhost:3002/api/v1/books`

For local development, always use the API Gateway URL as your base URL in the frontend.

## Deployment

### Local (Docker)

```bash
docker-compose up -d
```

### AWS (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Testing

```bash
# Run all tests
npm run test

# Run linters
npm run lint

# Type check
npx tsc --noEmit
```

## Quality Standards

See [scripts/quality-rules.md](scripts/quality-rules.md) for:

- Code style standards
- Commit message conventions
- Branching strategy
- Testing requirements
- Static analysis rules

## Contributing

1. Create a feature branch: `feature/your-feature`
2. Make your changes
3. Run linting and tests
4. Commit with conventional commit format
5. Push and open a PR

## License

MIT
