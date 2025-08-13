import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file in the backend directory
// This makes it work correctly when run from the project root.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env['DATABASE_HOST'] || 'localhost',
      port: parseInt(process.env['DATABASE_PORT'] || '5432', 10),
      user: process.env['DATABASE_USER'] || 'brav',
      password: process.env['DATABASE_PASSWORD'] || 'password',
      database: process.env['DATABASE_NAME'] || 'passa_dev',
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
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env['DATABASE_HOST'] || 'localhost',
      port: parseInt(process.env['DATABASE_PORT'] || '5432', 10),
      user: process.env['DATABASE_USER'] || 'brav',
      password: process.env['DATABASE_PASSWORD'] || 'password',
      database: `${process.env['DATABASE_NAME'] || 'passa_dev'}_test`,
    },
    pool: {
      min: 1,
      max: 5,
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
  },

  production: {
    client: 'postgresql',
    connection: process.env['DATABASE_URL'] || 'postgresql://brav:password@localhost:5432/passa_dev',
    pool: {
      min: 2,
      max: 20,
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
  },
};

export default knexConfig;