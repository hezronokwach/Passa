#!/bin/bash

# Test Soroban Contracts
set -e

echo "🧪 Testing Passa Smart Contracts"

cd passa-contracts/contracts/hello-world

# Run contract tests
echo "🔬 Running Rust tests..."
cargo test

# Test contract deployment locally
echo "🏠 Testing local deployment..."
soroban contract build

# Create test data
echo "📊 Creating test agreement..."
soroban contract invoke \
  --id $(cat .soroban/contract-ids/hello-world.txt) \
  --source-account alice \
  --network testnet \
  -- \
  create_agreement \
  --id "test_event_123" \
  --payer "GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B" \
  --token "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA" \
  --payees '[{"recipient":"GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B","bps":5000},{"recipient":"GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B","bps":5000}]' \
  --budget "1000000000" \
  --deadline "1735689600" \
  --approvers "[]"

echo "✅ Contract tests completed!"