import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('attribution', (table) => {
    table.increments('attribution_id').primary();
    table.integer('event_id').unsigned().notNullable().references('event_id').inTable('events').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('contribution_type', 50).notNullable(); // 'artist_performance', 'content_creation', 'sponsorship', 'organization'
    table.decimal('percentage_share', 5, 4).notNullable(); // 0.0000 to 1.0000 (0% to 100%)
    table.decimal('fixed_amount', 10, 2); // Alternative to percentage
    table.string('currency', 10).defaultTo('USD');
    table.text('description');
    table.json('contribution_details'); // Detailed information about the contribution
    table.string('blockchain_txn_id', 255); // On-chain transaction verifying attribution
    table.enum('status', ['pending', 'approved', 'rejected', 'paid']).defaultTo('pending');
    table.integer('approved_by').unsigned().references('user_id').inTable('users');
    table.timestamp('approved_at');
    table.decimal('amount_earned', 10, 2).defaultTo(0);
    table.timestamp('last_payout_at');
    table.integer('payout_transaction_id').unsigned().references('transaction_id').inTable('transactions');
    table.timestamps(true, true);

    // Indexes
    table.index(['event_id']);
    table.index(['user_id']);
    table.index(['contribution_type']);
    table.index(['status']);
    table.index(['approved_by']);
    table.index(['last_payout_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('attribution');
}