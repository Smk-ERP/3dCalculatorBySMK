@echo off
setlocal
cd /d "D:\3D Print Calculater"

echo ==========================================================
echo   Push 3D Print Calculator to GitHub
echo ==========================================================
echo.

for /f "delims=" %%r in ('git remote get-url origin 2^>nul') do set CURRENT=%%r

if defined CURRENT (
    echo Current remote: %CURRENT%
    echo.
    echo Press ENTER to use it, or paste a different repo URL.
) else (
    echo No remote set yet.
    echo Open your repo on github.com and copy the URL from the
    echo green "Code" button, then paste it below.
)
echo.

set "URL="
set /p "URL=Repo URL: "

if not defined URL set "URL=%CURRENT%"

if not defined URL (
    echo.
    echo No URL given. Nothing to do.
    echo.
    pause
    exit /b 1
)

echo.
echo Using: %URL%
echo.

git remote remove origin >nul 2>&1
git remote add origin "%URL%"

echo Pushing... a GitHub login window may appear - please complete it.
echo.
git push -u origin main

echo.
if %errorlevel% == 0 (
    echo ==========================================================
    echo   SUCCESS - code is now on GitHub
    echo ==========================================================
) else (
    echo ==========================================================
    echo   PUSH FAILED
    echo.
    echo   If it says "Repository not found":
    echo     - check the URL is exactly right
    echo     - check you are logged in as the account that owns it
    echo ==========================================================
)
echo.
pause
