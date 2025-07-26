#!/bin/bash

# Script to create GitHub issues for Passa development phases
# Usage: ./scripts/create-issues.sh

echo "🚀 Passa GitHub Issues Creator"
echo "=============================="
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js and try again."
    exit 1
fi

# Get GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "🔑 GitHub Personal Access Token required."
    echo "Please enter your GitHub token (or set GITHUB_TOKEN environment variable):"
    read -s GITHUB_TOKEN
    echo ""
fi

# Get repository information
REPO_OWNER=${REPO_OWNER:-"hezronokwach"}
REPO_NAME=${REPO_NAME:-"Passa"}

echo "📋 Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Confirm before creating issues
echo "⚠️  This will create GitHub issues for Phase 1 and Phase 2 development."
echo "Are you sure you want to continue? (y/N)"
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled by user."
    exit 0
fi

echo ""
echo "🔄 Creating GitHub issues..."

# Run the Node.js script
node scripts/create-github-issues.js "$GITHUB_TOKEN" "$REPO_OWNER" "$REPO_NAME"

# Check if the script was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All issues created successfully!"
    echo "🔗 View issues at: https://github.com/$REPO_OWNER/$REPO_NAME/issues"
else
    echo ""
    echo "❌ Failed to create some issues. Please check the output above."
    exit 1
fi
