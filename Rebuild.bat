@echo off
rem ─────────────────────────────────────────────────────────────────────
rem  Rebuilds index.html from src\app.js + src\styles.css + lib\*.js
rem  and copies src\sop.html to the root.
rem  Run this after editing anything inside the src folder.
rem ─────────────────────────────────────────────────────────────────────
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
echo.
pause
