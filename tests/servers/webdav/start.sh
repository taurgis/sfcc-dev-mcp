#!/bin/bash

# SFCC Mock WebDAV Server - Quick Start Script

echo "🚀 Starting SFCC Mock WebDAV Server for Testing"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the tests/servers/webdav directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Setup mock logs if they don't exist
if [ ! -d "mock-logs" ]; then
    echo "📁 Setting up mock log files..."
    npm run setup
fi

echo ""
echo "✅ Setup complete! Starting server..."
echo ""
echo "🌐 Server will be available at: http://localhost:3000"
echo "📁 WebDAV logs endpoint: http://localhost:3000/Logs/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start
