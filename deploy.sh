#!/bin/bash

# NutriQR Website - Deployment Script
# This script handles the deployment process on the VPS

set -e

PROJECT_DIR="/opt/projects/nutriqr"
BACKUP_DIR="/var/backups/nutriqr"

echo "🚀 Starting deployment..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Navigate to project directory
cd "$PROJECT_DIR"

# Create backup of current state
echo "📦 Creating backup..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker compose logs app > "$BACKUP_DIR/logs_$TIMESTAMP.log" 2>&1 || true

# Pull latest changes
echo "⬇️  Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

# Stop current containers
echo "🛑 Stopping current containers..."
docker compose down

# Build and start new containers
echo "🔨 Building and starting containers..."
docker compose up -d --build

# Wait for container to be healthy
echo "⏳ Waiting for container to start..."
sleep 10

# Check container status
echo "✅ Checking deployment status..."
if docker compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    docker compose logs --tail=20 app
else
    echo "❌ Deployment failed! Rolling back..."
    git reset --hard HEAD@{1}
    docker compose up -d --build
    exit 1
fi

# Cleanup old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✨ Deployment complete!"
