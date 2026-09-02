@echo off
echo ======================================================================
echo           AUTOCARE 360 - LOCAL HTTP LIVE SERVER
echo ======================================================================
echo Starting local web server on http://localhost:8000 ...
start "" "http://localhost:8000"
python -m http.server 8000
pause
