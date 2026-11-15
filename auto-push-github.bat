@echo off
chcp 65001 >nul
set "REPO_DIR=%~dp0"
if not exist "%REPO_DIR%.git" (
    set "REPO_DIR=C:\Users\kitsu\.gemini\antigravity\scratch\fourpart-harmony-grader"
)
cd /d "%REPO_DIR%"

echo ===================================================
echo   Auto Commit & Push to GitHub (Pohpeya/Harmony-Studio)
echo   Repo: %CD%
echo ===================================================

git add -A
git diff --cached --quiet
if %errorlevel%==0 (
    echo [INFO] Working tree clean. Pushing existing commits to GitHub...
) else (
    git commit -m "Update Harmony Studio (%date% %time:~0,5%)"
)

git push -u origin main
echo.
if %errorlevel%==0 (
    echo [SUCCESS] Pushed to https://github.com/Pohpeya/Harmony-Studio successfully!
    echo           Wait 1-2 mins for https://pohpeya.github.io/Harmony-Studio/ to update.
) else (
    echo [ERROR] Push failed. Please check GitHub login / internet connection.
)
pause
