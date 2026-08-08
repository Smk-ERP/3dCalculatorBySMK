@echo off
rem ─────────────────────────────────────────────────────────────────────
rem  Rebuilds index.html from src\app.js + src\styles.css + lib\*.js
rem  Run this after editing anything inside the src folder.
rem ─────────────────────────────────────────────────────────────────────
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\3D Print Calculater\build.ps1"
echo.
pause
