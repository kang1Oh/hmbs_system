@echo off
REM Script to export PostgreSQL database (Schema + Data)
title Export Full Database

cd /d "%~dp0.."

if not exist "express-backend\.env" (
    echo [ERROR] .env file not found! Cannot read credentials.
    pause
    exit /b 1
)

REM Read .env file to get credentials
for /f "tokens=1,2 delims==" %%a in (express-backend\.env) do (
    if "%%a"=="PGUSER" set PGUSER=%%b
    if "%%a"=="PGPASSWORD" set PGPASSWORD=%%b
    if "%%a"=="PGDATABASE" set PGDATABASE=%%b
    if "%%a"=="PGHOST" set PGHOST=%%b
    if "%%a"=="PGPORT" set PGPORT=%%b
)

echo Exporting full database: %PGDATABASE%
echo Host: %PGHOST%
echo User: %PGUSER%
echo.

set PGPASSWORD=%PGPASSWORD%
pg_dump -h %PGHOST% -p %PGPORT% -U %PGUSER% -f hmbs_full_backup.sql %PGDATABASE%

if %errorlevel% equ 0 (
    echo [SUCCESS] Database exported to hmbs_full_backup.sql
) else (
    echo [ERROR] Export failed. Ensure pg_dump is in your PATH.
)

pause
