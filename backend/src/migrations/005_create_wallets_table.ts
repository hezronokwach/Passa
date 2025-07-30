import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', (table) => {
    table.increments('wallet_id').primary();
    table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('wallet_address', 255).unique().notNullable();
    table.string('blockchain_network', 50).notNullable().defaultTo('stellar');
    table.boolean('is_primary').defaultTo(false);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.string('wallet_type', 50); // 'custodial', 'non_custodial', 'hardware'
    table.json('metadata'); // Additional wallet metadata
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index(['user_id']);
    table.index(['wallet_address']);
    table.index(['blockchain_network']);
    table.index(['is_primary']);
    table.index(['is_verified']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallets');
}