import { walletService } from '../src/lib/services/wallet-service';
import fs from 'fs';
import path from 'path';

async function setupPlatformWallet() {
  console.log('🚀 Setting up platform wallet...');
  
  // Generate new wallet
  const wallet = walletService.generateWallet();
  
  console.log(`📝 Generated wallet: ${wallet.publicKey}`);
  
  // Fund the account
  console.log('💰 Funding testnet account...');
  const funded = await walletService.fundTestnetAccount(wallet.publicKey);
  
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
      `PLATFORM_WALLET_SECRET="${wallet.secretKey}"`
    );
  } else {
    envContent += `\nPLATFORM_WALLET_SECRET="${wallet.secretKey}"\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('📄 Updated .env file with platform wallet secret');
  console.log(`🔑 Platform Wallet Public Key: ${wallet.publicKey}`);
  console.log('⚠️  Keep the secret key secure and never commit it to version control!');
}

setupPlatformWallet().catch(console.error);