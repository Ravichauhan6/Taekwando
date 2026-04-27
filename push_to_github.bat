@echo off
echo Adding all changes to Git...
git add .
echo.
echo Committing changes...
git commit -m "Update Dashboard Admin and other recent changes"
echo.
echo Pushing to GitHub...
git push
echo.
echo Done! Please press any key to exit.
pause
