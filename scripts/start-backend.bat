@echo off
REM Backend Startup Script for HMBS System
title HMBS Backend Server

echo ========================================
echo Starting HMBS Backend Server...
echo ========================================
echo.

cd /d "%~dp0..\express-backend"

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found in express-backend directory!
    echo Please create a .env file with your database credentials.
    echo See .env.example for reference.
    echo.
    pause
    exit /b 1
)

echo Starting Express server on port 5000...
echo.

call npm start

pause
