# API Gateway Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY services/api-gateway/package*.json ./
RUN npm install --production

# Copy source code
COPY services/api-gateway/src ./src
COPY services/api-gateway/tsconfig.json ./

# Build the application
RUN npm run build

# Expose the gateway port
EXPOSE 8000

# Start the gateway
CMD ["node", "dist/index.js"]
