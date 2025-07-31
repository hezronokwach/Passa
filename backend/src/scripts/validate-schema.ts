#!/usr/bin/env ts-node

import { db, testConnection, closeConnection } from '../config/database';
import { logger } from '../utils/logger';

interface TableInfo {
  table_name: string;
}

interface QueryResult {
  rows: TableInfo[];
}



async function validateSchema() {
  try {
    logger.info('🔄 Validating database schema...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.error('❌ Database connection failed');
      process.exit(1);
    }

    // Get all tables
    const tables = await db.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `) as QueryResult;

    logger.info(`📊 Found ${tables.rows.length} tables:`);
    tables.rows.forEach((table: TableInfo) => {
      logger.info(`  - ${table.table_name}`);
    });

    // Validate core tables exist
    const expectedTables = [
      'users', 'user_profiles', 'user_roles', 'user_role_assignments',
      'wallets', 'organizers', 'artists', 'content_creators', 'sponsors', 'fans',
      'events', 'event_categories', 'event_tags', 'event_tag_assignments',
      'smart_contracts', 'transactions', 'tickets', 'attribution',
      'permissions', 'audit_logs'
    ];

    const existingTables = tables.rows.map((t: TableInfo) => t.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      logger.error(`❌ Missing tables: ${missingTables.join(', ')}`);
    } else {
      logger.info('✅ All expected tables exist');
    }

    // Check foreign key constraints
    const foreignKeys = await db.raw(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `);

    logger.info(`🔗 Found ${foreignKeys.rows.length} foreign key constraints`);

    // Check indexes
    const indexes = await db.raw(`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    logger.info(`📇 Found ${indexes.rows.length} indexes`);

    // Validate sample data
    const userCount = await db('users').count('* as count').first();
    const roleCount = await db('user_roles').count('* as count').first();
    const categoryCount = await db('event_categories').count('* as count').first();
    const tagCount = await db('event_tags').count('* as count').first();
    const permissionCount = await db('permissions').count('* as count').first();

    logger.info('📈 Sample data counts:');
    logger.info(`  - Users: ${userCount?.['count']}`);
    logger.info(`  - Roles: ${roleCount?.['count']}`);
    logger.info(`  - Categories: ${categoryCount?.['count']}`);
    logger.info(`  - Tags: ${tagCount?.['count']}`);
    logger.info(`  - Permissions: ${permissionCount?.['count']}`);

    // Test a complex query to validate relationships
    const complexQuery = await db('users')
      .select(
        'users.username',
        'user_profiles.bio',
        'user_roles.display_name as role'
      )
      .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
      .leftJoin('user_role_assignments', 'users.user_id', 'user_role_assignments.user_id')
      .leftJoin('user_roles', 'user_role_assignments.role_id', 'user_roles.role_id')
      .where('user_role_assignments.is_active', true)
      .limit(5);

    logger.info('🔍 Sample query results:');
    complexQuery.forEach(user => {
      logger.info(`  - ${user.username} (${user.role}): ${user.bio?.substring(0, 50)}...`);
    });

    logger.info('✅ Schema validation completed successfully!');

  } catch (error) {
    logger.error('❌ Schema validation failed:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run if called directly
if (require.main === module) {
  validateSchema();
}

export { validateSchema };