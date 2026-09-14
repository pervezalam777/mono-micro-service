FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY services/book-service/package*.json ./services/book-service/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY services/book-service/ ./services/book-service/

# Build
WORKDIR /app/services/book-service
RUN pnpm build

# Expose port
EXPOSE 3002

# Start server
CMD ["node", "dist/index.js"]
