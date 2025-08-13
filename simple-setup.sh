#!/bin/bash

# Simple setup script for Passa application

echo "Setting up Passa application..."

# Run Prisma migrations (this will create the database if it doesn't exist)
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Setup complete! You can now run the application with 'npm run dev'"