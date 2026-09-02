@echo off
echo Starting AutoCare 360 Desktop GUI Application...
if exist "bin\AutoCare360.exe" (
    start "" "bin\AutoCare360.exe"
) else (
    echo [!] Executable not found. Running build.bat first...
    call build.bat
    if exist "bin\AutoCare360.exe" (
        start "" "bin\AutoCare360.exe"
    )
)
