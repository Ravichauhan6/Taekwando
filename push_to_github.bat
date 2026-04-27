@echo off
echo Adding all changes to Git...
git add .
echo.
echo Committing changes...
git commit -m "fix(vercel): prevent serverless function crash by dynamically importing vite and removing process.exit"
echo.
echo Pushing to GitHub...
git push
echo.
echo Done! Please press any key to exit.
pause
