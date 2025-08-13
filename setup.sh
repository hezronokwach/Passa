#!/bin/bash

# Setup script for Passa application

echo "Setting up Passa application..."

# Create database
echo "Creating database..."
sudo -u postgres createdb passa_db || echo "Database might already exist or there was an error creating it."

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Seed database (if you have a seed script)
# echo "Seeding database..."
# npx prisma db seed

echo "Setup complete! You can now run the application with 'npm run dev'"