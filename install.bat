@echo off
echo Starting AlgoLab Installation...

echo =======================================
echo 1. Installing Frontend Dependencies...
echo =======================================
call npm install

echo.
echo =======================================
echo 2. Installing Backend Dependencies...
echo =======================================
cd server
call npm install
cd ..

echo.
echo =======================================
echo Installation Complete! 🎉
echo =======================================
echo.
echo To build the project for production, run:
echo npm run build (in the main folder and the server folder)
echo.
echo To run in development mode:
echo 1. In one terminal, run 'npm run dev' in the root folder.
echo 2. In another terminal, run 'npm run dev' in the server folder.
pause
