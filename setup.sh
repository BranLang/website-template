#!/bin/bash

echo "🚀 Setting up CMS - Content Management System"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/database
mkdir -p backend/uploads
mkdir -p frontend/src/assets

# Backend setup
echo "🔧 Setting up Backend (NestJS)..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo "✅ Backend setup complete"
cd ..

# Frontend setup
echo "🎨 Setting up Frontend (Angular)..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo "✅ Frontend setup complete"
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   cd backend && npm run start:dev"
echo ""
echo "2. Start the frontend server:"
echo "   cd frontend && npm start"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:4200"
echo "   - Backend API: http://localhost:3000"
echo ""
echo "4. Login with default admin account:"
echo "   - Email: admin@example.com"
echo "   - Password: admin123"
echo ""
echo "⚠️  Remember to change the default admin credentials!"
echo ""
echo "📚 For more information, see README.md"
