# Memory

This file contains important facts about this project for future reference.

---

- [Architecture Documentation](ARCHITECTURE.md) — Comprehensive architecture documentation covering tech stack, monorepo structure, backend services (auth, author, books), frontend packages, testing strategy, and deployment architecture. Created on 2026-09-11.

- [Local Setup](docker-compose.yml) — Docker Compose configuration for local development with MongoDB (auth service), PostgreSQL (author & book services), Redis (caching), and Kong API Gateway. Services are accessible on ports 27017, 5432, 5433, 6379, and 8000.

- [Backend Services](services/) — Three Node.js microservices using Express, TypeScript, and clean architecture pattern: auth-service (MongoDB, JWT), author-service (PostgreSQL), and book-service (PostgreSQL). All follow domain-driven design with repositories, services, controllers, and middleware layers.

- [Frontend Packages](apps/) — React 19 application with package-based architecture: web (main app), author (reusable author components), and books (reusable book components). Uses Redux Toolkit for state management, Axios for API calls, and follows React hooks best practices.

- [Monorepo Management](package.json) — Yarn Workspaces-based monorepo using Turbo for build orchestration. Root scripts include `dev`, `build`, `test`, `lint`, `format`, and `clean`. TypeScript strict mode with ESLint (AirBnB) and Prettier for code quality.

- [Testing Strategy](scripts/quality-rules.md) — Multi-layered testing approach: Unit tests (80%+ coverage), Integration tests, Contract testing (Pact), and E2E tests (Cypress). All tests run via CI/CD pipeline on every PR and push to main/develop branches.

- [Quality Standards](scripts/quality-rules.md) — Strict code quality rules: TypeScript strict mode, ESLint with AirBnB config, Prettier formatting, conventional commits (feat/fix/docs/refactor), branch naming conventions, and pre-commit hooks via Husky.

- [AWS Deployment](terraform/) — Terraform infrastructure for AWS ECS Fargate deployment with VPC, ALB, ECS cluster, CloudWatch logging, IAM roles, and S3 backend for state. Uses Docker images from GitHub Container Registry.

- [Authentication](services/auth-service/) — OAuth2/OIDC integration with Auth0 for authentication. JWT-based access tokens (15min expiry) with refresh tokens (7day expiry). User management stored in MongoDB with bcrypt password hashing.

- [API Gateway](docker-compose.yml) — Kong API Gateway routes requests to backend services: /auth/* to auth-service, /authors/* to author-service, /books/* to book-service. Handles CORS, rate limiting, and request forwarding.
