@echo off
echo Starting API Gateway...
echo.

:: Load environment variables
if exist ".env" (
    call .env
)

:: Start the gateway
ts-node src/index.ts
