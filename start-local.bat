@echo off
echo Starting Microservices Local Environment...
echo.

echo Starting API Gateway on port 8000...
start "API Gateway" cmd /k "cd /d %~dp0services\api-gateway && npm run dev"

echo Starting Auth Service on port 3000...
start "Auth Service" cmd /k "cd /d %~dp0services\auth-service && npm run dev"

echo Starting Author Service on port 3001...
start "Author Service" cmd /k "cd /d %~dp0services\author-service && npm run dev"

echo Starting Book Service on port 3002...
start "Book Service" cmd /k "cd /d %~dp0services\book-service && npm run dev"

echo.
echo All services started!
echo.
echo API Gateway: http://localhost:8000
echo Auth Service: http://localhost:3000
echo Author Service: http://localhost:3001
echo Book Service: http://localhost:3002
echo.
echo Press any key to open the API Gateway health check in your browser...
pause >nul
start http://localhost:8000/health
