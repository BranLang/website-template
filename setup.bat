@echo off
echo 🚀 Setting up CMS - Content Management System
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Create necessary directories
echo 📁 Creating directories...
if not exist "backend\database" mkdir backend\database
if not exist "backend\uploads" mkdir backend\uploads
if not exist "frontend\src\assets" mkdir frontend\src\assets

REM Backend setup
echo 🔧 Setting up Backend (NestJS)...
cd backend

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    npm install
) else (
    echo ✅ Backend dependencies already installed
)

echo ✅ Backend setup complete
cd ..

REM Frontend setup
echo 🎨 Setting up Frontend (Angular)...
cd frontend

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
) else (
    echo ✅ Frontend dependencies already installed
)

echo ✅ Frontend setup complete
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Start the backend server:
echo    cd backend ^&^& npm run start:dev
echo.
echo 2. Start the frontend server:
echo    cd frontend ^&^& npm start
echo.
echo 3. Access the application:
echo    - Frontend: http://localhost:4200
echo    - Backend API: http://localhost:3000
echo.
echo 4. Login with default admin account:
echo    - Email: admin@example.com
echo    - Password: admin123
echo.
echo ⚠️  Remember to change the default admin credentials!
echo.
echo 📚 For more information, see README.md
pause
