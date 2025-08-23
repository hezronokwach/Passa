#!/usr/bin/env node

const { Keypair } = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

async function fundTestnetAccount(publicKey) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    return response.ok;
  } catch (error) {
    console.error('Friendbot funding failed:', error);
    return false;
  }
}

async function setupPlatformWallet() {
  console.log('🚀 Setting up platform wallet...');
  
  // Generate new keypair
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();
  
  console.log(`📝 Generated wallet: ${publicKey}`);
  
  // Fund the account
  console.log('💰 Funding testnet account...');
  const funded = await fundTestnetAccount(publicKey);
  
  if (!funded) {
    console.error('❌ Failed to fund platform wallet');
    process.exit(1);
  }
  
  console.log('✅ Platform wallet funded successfully!');
  
  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add PLATFORM_WALLET_SECRET
  if (envContent.includes('PLATFORM_WALLET_SECRET=')) {
    envContent = envContent.replace(
      /PLATFORM_WALLET_SECRET=.*/,
      `PLATFORM_WALLET_SECRET="${secretKey}"`
    );
  } else {
    envContent += `\nPLATFORM_WALLET_SECRET="${secretKey}"\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('📄 Updated .env file with platform wallet secret');
  console.log(`🔑 Platform Wallet Public Key: ${publicKey}`);
  console.log('⚠️  Keep the secret key secure and never commit it to version control!');
}

setupPlatformWallet().catch(console.error);