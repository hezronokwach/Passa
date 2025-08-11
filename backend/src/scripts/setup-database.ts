#!/usr/bin/env ts-node

import 'tsconfig-paths/register';
import { db, testConnection, closeConnection } from '../config/database';
import { logger } from '../utils/logger';

async function setupDatabase() {
  try {
    logger.info('🔄 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      logger.error('❌ Database connection failed');
      process.exit(1);
    }
    
    logger.info('✅ Database connection successful');
    
    logger.info('🔄 Running migrations...');
    await db.migrate.latest();
    logger.info('✅ Migrations completed');
    
    logger.info('🔄 Running seeds...');
    await db.seed.run();
    logger.info('✅ Seeds completed');
    
    logger.info('🎉 Database setup completed successfully!');
    
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase };