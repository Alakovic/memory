@echo off
REM up.bat - Commit and push changes to GitHub

REM Pull latest changes from remote
git pull

REM Prompt for commit message
set /p msg="Enter commit message: "

REM Add all changes
git add .

REM Commit with the provided message
git commit -m "%msg%"

REM Push to the current branch
git push

echo Push complete!
pause
