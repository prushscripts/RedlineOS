@echo off
echo.
echo  ==========================================
echo   RedlineOS — Deploying to Vercel
echo  ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Staging all changes...
git add .

echo [2/3] Committing...
set /p msg="Commit message (or press Enter for 'update'): "
if "%msg%"=="" set msg=update
git commit -m "%msg%"

echo [3/3] Pushing to main...
git push origin main

echo.
echo  ✅ Done! Vercel will auto-deploy from main.
echo  🔗 Check: https://vercel.com/dashboard
echo.
pause
