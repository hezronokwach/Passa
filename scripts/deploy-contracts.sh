#!/bin/bash

# Soroban Contract Deployment Script
set -e

echo "🚀 Deploying Passa Smart Contracts to Testnet"

# Check if soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI not found. Install with: cargo install --locked soroban-cli"
    exit 1
fi

# Navigate to contracts directory
cd passa-contracts

# Configure network
echo "📡 Configuring Testnet..."
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate deployment identity if not exists
if ! soroban keys show deployer 2>/dev/null; then
    echo "🔑 Generating deployment keypair..."
    soroban keys generate deployer --network testnet
fi

# Fund the deployer account
echo "💰 Funding deployer account..."
DEPLOYER_ADDRESS=$(soroban keys address deployer)
curl -X POST "https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"

# Build the contract
echo "🔨 Building contract..."
cd contracts/hello-world
soroban contract build
cd ../..

# Deploy the contract
echo "🚀 Deploying splitter contract..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source deployer \
  --network testnet \
  --network-passphrase "Test SDF Network ; September 2015")

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Update .env file automatically
cd ..
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    if grep -q "SPLITTER_CONTRACT_ID" "$ENV_FILE"; then
        # Update existing line
        sed -i.bak "s/SPLITTER_CONTRACT_ID=.*/SPLITTER_CONTRACT_ID=\"$CONTRACT_ID\"/" "$ENV_FILE"
        echo "📝 Updated SPLITTER_CONTRACT_ID in $ENV_FILE"
    else
        # Add new line
        echo "SPLITTER_CONTRACT_ID=\"$CONTRACT_ID\"" >> "$ENV_FILE"
        echo "📝 Added SPLITTER_CONTRACT_ID to $ENV_FILE"
    fi
else
    echo "⚠️  .env file not found. Please add: SPLITTER_CONTRACT_ID=\"$CONTRACT_ID\""
fi

# Generate TypeScript bindings
echo "📦 Generating TypeScript bindings..."
cd passa-contracts/packages/splitter_v1
soroban contract bindings typescript \
  --contract-id $CONTRACT_ID \
  --network testnet \
  --network-passphrase "Test SDF Network ; September 2015" \
  --output-dir src \
  --overwrite

echo "🎉 Deployment complete!"
echo "Contract ID automatically added to .env file"
echo "Ready to use the deployed contract!"