@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo           AUTOCARE 360 - SMART VEHICLE SERVICE MANAGEMENT
echo                     Automated C++ Build System
echo ======================================================================

:: Auto-detect and prepend w64devkit/MinGW bin path
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\w64devkit\bin" (
    set "PATH=C:\Users\%USERNAME%\AppData\Local\Programs\w64devkit\bin;!PATH!"
)

:: Check for g++
where g++ >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] C++ compiler g++ was not found in PATH.
    echo Please ensure MinGW/w64devkit is installed.
    exit /b 1
)

echo [*] Compiler detected: g++
echo [*] Compiling AutoCare 360 modular source files...

if not exist "bin" mkdir bin
if not exist "data" mkdir data
if not exist "reports" mkdir reports

g++ -std=c++17 -O2 -Wall -Wextra ^
    src/Person.cpp ^
    src/Customer.cpp ^
    src/Vehicle.cpp ^
    src/Service.cpp ^
    src/BasicService.cpp ^
    src/PremiumService.cpp ^
    src/EmergencyService.cpp ^
    src/MaintenancePlanner.cpp ^
    src/VehicleHealthAnalyzer.cpp ^
    src/DataManager.cpp ^
    src/AppController.cpp ^
    src/GUIApp.cpp ^
    src/main.cpp ^
    -o bin/AutoCare360.exe ^
    -lgdi32 -luser32 -lcomctl32

if %errorlevel% equ 0 (
    echo ======================================================================
    echo [SUCCESS] AutoCare 360 built successfully: bin/AutoCare360.exe
    echo ======================================================================
    exit /b 0
) else (
    echo [ERROR] Build failed! Please review compiler output above.
    exit /b 1
)
