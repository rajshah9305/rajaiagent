#!/bin/bash

# RAJ AI Agent Builder - Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 RAJ AI Agent Builder - Deployment Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run db:generate

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp env.example .env.local
    echo "📝 Please edit .env.local with your AWS credentials before running the application."
fi

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Build completed successfully!"

# Check if we should run the development server
if [ "$1" = "dev" ]; then
    echo "🚀 Starting development server..."
    npm run dev
elif [ "$1" = "start" ]; then
    echo "🚀 Starting production server..."
    npm start
else
    echo ""
    echo "🎉 Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your AWS credentials"
    echo "2. Run 'npm run dev' for development"
    echo "3. Run 'npm start' for production"
    echo "4. Deploy to Vercel: 'vercel --prod'"
    echo ""
    echo "For more information, see README.md"
fi
