import knex from 'knex';
import { config } from './environment';
import { logger } from '@/utils/logger';

const knexConfig = {
  client: 'postgresql',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: process.env['NODE_ENV'] === 'test' ? `${config.database.name}_test` : config.database.name,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/seeds',
    extension: 'ts',
  },
};

export const db = knex(knexConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async (): Promise<void> => {
  await db.destroy();
};