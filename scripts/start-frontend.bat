@echo off
REM Frontend Startup Script for HMBS System
title HMBS Frontend Server

echo ========================================
echo Starting HMBS Frontend Server...
echo ========================================
echo.

cd /d "%~dp0..\react-frontend"

echo Starting Vite dev server...
echo Frontend will be available at: http://localhost:5173
echo.

call npm run dev

pause
