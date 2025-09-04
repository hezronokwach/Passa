#!/bin/bash

# Setup script for Passa application

echo "Setting up Passa application..."

# Check for .env file first
if [ ! -f .env ]; then
    echo ".env file not found. Copying from .env.bak..."
    cp .env.bak .env
fi

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Run database setup
echo "Running database migration..."
npx prisma migrate dev --name init

echo "Seeding database..."
npx prisma db seed

echo "Setup complete! You can now run the application with 'npm run dev'"