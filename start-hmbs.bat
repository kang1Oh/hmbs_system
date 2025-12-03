@echo off
REM Main Startup Script for HMBS System
REM This script starts both the backend and frontend servers

title HMBS System Launcher

echo ========================================
echo   HMBS System Auto-Start Launcher
echo ========================================
echo.

echo [DEBUG] Step 1: Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version
echo.

echo [DEBUG] Step 2: Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH!
    echo.
    pause
    exit /b 1
)

echo [OK] npm detected:
call npm --version
echo.

echo [DEBUG] Step 3: Setting working directory...
REM Using pushd to avoid potential quote escaping issues with cd
pushd "%~dp0"
echo Current directory: %CD%
echo.

echo [DEBUG] Step 4: Checking configuration...
REM Check if .env file exists in express-backend
if not exist "express-backend\.env" (
    echo [ERROR] Configuration file missing!
    echo Please ensure express-backend\.env file exists with database credentials.
    echo See express-backend\.env.example for reference.
    echo.
    pause
    exit /b 1
)

echo [OK] Configuration file found
echo.

echo ========================================
echo Starting Backend Server...
echo ========================================
echo.

echo [DEBUG] Step 5: Launching Backend...
REM Start backend in a new window
start "HMBS Backend" cmd /k "scripts\start-backend.bat"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul
echo.

echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.

echo [DEBUG] Step 6: Launching Frontend...
REM Start frontend in a new window
start "HMBS Frontend" cmd /k "scripts\start-frontend.bat"

echo.
echo ========================================
echo   HMBS System Started Successfully!
echo ========================================
echo.
echo Backend Server:  http://localhost:5000
echo Frontend App:    http://localhost:5173
echo.
echo Open your browser and navigate to:
echo   http://localhost:5173
echo.
echo Press any key to close this window...
echo (The servers will continue running in separate windows)
pause >nul
