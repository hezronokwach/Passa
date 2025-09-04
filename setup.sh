#!/bin/bash

# Setup script for Passa application

echo "Setting up Passa application..."

# Check for .env file
if [ ! -f .env ]; then
    echo ".env file not found. Copying from .env.bak..."
    cp .env.bak .env
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database setup
echo "Running database setup (reset, migrate, seed)..."
npm run db:setup

echo "Setup complete! You can now run the application with 'npm run dev'"