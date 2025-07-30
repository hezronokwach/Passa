import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tickets', (table) => {
    table.increments('ticket_id').primary();
    table.integer('event_id').unsigned().notNullable().references('event_id').inTable('events').onDelete('RESTRICT');
    table.integer('owner_user_id').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
    table.string('token_id', 255).unique().notNullable(); // NFT token ID
    table.integer('smart_contract_id').unsigned().notNullable().references('contract_id').inTable('smart_contracts');
    table.string('ticket_type', 50).defaultTo('general'); // 'general', 'vip', 'backstage', etc.
    table.enum('ticket_status', ['available', 'reserved', 'purchased', 'used', 'cancelled', 'refunded']).defaultTo('available');
    table.decimal('original_price', 10, 2).notNullable();
    table.decimal('current_price', 10, 2); // For resale
    table.string('currency', 10).defaultTo('USD');
    table.string('seat_section', 50);
    table.string('seat_row', 10);
    table.string('seat_number', 10);
    table.timestamp('purchase_date');
    table.integer('purchase_transaction_id').unsigned().references('transaction_id').inTable('transactions');
    table.timestamp('used_at');
    table.string('qr_code_data', 500); // QR code for entry
    table.json('metadata'); // Additional ticket metadata
    table.json('transfer_history'); // Array of previous owners
    table.boolean('is_transferable').defaultTo(true);
    table.boolean('is_refundable').defaultTo(false);
    table.timestamp('refund_deadline');
    table.boolean('is_resaleable').defaultTo(true);
    table.decimal('max_resale_price', 10, 2);
    table.timestamps(true, true);

    // Indexes
    table.index(['event_id']);
    table.index(['owner_user_id']);
    table.index(['token_id']);
    table.index(['smart_contract_id']);
    table.index(['ticket_status']);
    table.index(['ticket_type']);
    table.index(['purchase_date']);
    table.index(['used_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tickets');
}