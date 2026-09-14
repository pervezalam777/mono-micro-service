FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY services/auth-service/package*.json ./services/auth-service/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY services/auth-service/ ./services/auth-service/

# Build
WORKDIR /app/services/auth-service
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]
