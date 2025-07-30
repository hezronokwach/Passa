import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('transaction_id').primary();
    table.string('transaction_hash', 255).unique().notNullable();
    table.bigInteger('block_number');
    table.string('from_address', 255).notNullable();
    table.string('to_address', 255).notNullable();
    table.decimal('amount', 20, 8).notNullable();
    table.string('currency', 20).notNullable(); // 'XLM', 'USDC', etc.
    table.string('transaction_type', 50); // 'ticket_purchase', 'revenue_distribution', 'contract_deployment'
    table.enum('status', ['pending', 'confirmed', 'failed', 'cancelled']).defaultTo('pending');
    table.integer('confirmations').defaultTo(0);
    table.decimal('gas_fee', 20, 8);
    table.string('gas_currency', 20);
    table.json('transaction_data'); // Additional transaction data
    table.string('blockchain_network', 50).defaultTo('stellar');
    table.integer('related_event_id').unsigned().references('event_id').inTable('events');
    table.integer('related_user_id').unsigned().references('user_id').inTable('users');
    table.timestamp('blockchain_timestamp');
    table.text('error_message'); // For failed transactions
    table.timestamps(true, true);

    // Indexes
    table.index(['transaction_hash']);
    table.index(['from_address']);
    table.index(['to_address']);
    table.index(['status']);
    table.index(['transaction_type']);
    table.index(['blockchain_network']);
    table.index(['related_event_id']);
    table.index(['related_user_id']);
    table.index(['blockchain_timestamp']);
    table.index(['block_number']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}