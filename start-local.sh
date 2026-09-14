#!/bin/bash

echo "Starting Microservices Local Environment..."
echo ""

echo "Starting API Gateway on port 8000..."
cd services/api-gateway
npm run dev &

echo "Starting Auth Service on port 3000..."
cd ../auth-service
npm run dev &

echo "Starting Author Service on port 3001..."
cd ../author-service
npm run dev &

echo "Starting Book Service on port 3002..."
cd ../book-service
npm run dev &

echo ""
echo "All services started!"
echo ""
echo "API Gateway: http://localhost:8000"
echo "Auth Service: http://localhost:3000"
echo "Author Service: http://localhost:3001"
echo "Book Service: http://localhost:3002"
echo ""
echo "Press any key to open the API Gateway health check in your browser..."
read -n 1 -s
xdg-open http://localhost:8000/health
