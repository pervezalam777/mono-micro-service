FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY services/author-service/package*.json ./services/author-service/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY services/author-service/ ./services/author-service/

# Build
WORKDIR /app/services/author-service
RUN pnpm build

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/index.js"]
