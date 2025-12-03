@echo off
REM Script to import SQL file into PostgreSQL database
title Import Database

cd /d "%~dp0.."

if "%~1"=="" (
    echo [ERROR] Please drag and drop a .sql file onto this script to import it.
    echo Usage: db-import.bat [filename.sql]
    pause
    exit /b 1
)

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

echo Importing %~1 into database: %PGDATABASE%
echo Host: %PGHOST%
echo User: %PGUSER%
echo.
echo [WARNING] This will overwrite existing tables/data if they exist in the dump.
pause

set PGPASSWORD=%PGPASSWORD%
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDATABASE% -f "%~1"

if %errorlevel% equ 0 (
    echo [SUCCESS] Import completed.
) else (
    echo [ERROR] Import failed. Ensure psql is in your PATH.
)

pause
