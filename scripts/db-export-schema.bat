@echo off
REM Script to export PostgreSQL database schema (tables only, no data)
title Export Database Schema

cd /d "%~dp0.."

if not exist "express-backend\.env" (
    echo [ERROR] .env file not found! Cannot read credentials.
    pause
    exit /b 1
)

REM Read .env file to get credentials (simple parsing)
for /f "tokens=1,2 delims==" %%a in (express-backend\.env) do (
    if "%%a"=="PGUSER" set PGUSER=%%b
    if "%%a"=="PGPASSWORD" set PGPASSWORD=%%b
    if "%%a"=="PGDATABASE" set PGDATABASE=%%b
    if "%%a"=="PGHOST" set PGHOST=%%b
    if "%%a"=="PGPORT" set PGPORT=%%b
)

echo Exporting schema for database: %PGDATABASE%
echo Host: %PGHOST%
echo User: %PGUSER%
echo.

set PGPASSWORD=%PGPASSWORD%
pg_dump -h %PGHOST% -p %PGPORT% -U %PGUSER% -s -f hmbs_schema.sql %PGDATABASE%

if %errorlevel% equ 0 (
    echo [SUCCESS] Schema exported to hmbs_schema.sql
) else (
    echo [ERROR] Export failed. Ensure pg_dump is in your PATH.
)

pause
