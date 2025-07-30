import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add foreign key constraint to smart_contracts table
  await knex.schema.alterTable('smart_contracts', (table) => {
    table.foreign('deployment_transaction_id').references('transaction_id').inTable('transactions');
  });

  // Add foreign key constraint to events table for smart contract
  await knex.schema.alterTable('events', (table) => {
    table.integer('smart_contract_id').unsigned().references('contract_id').inTable('smart_contracts');
    table.index(['smart_contract_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.dropForeign(['smart_contract_id']);
    table.dropColumn('smart_contract_id');
  });

  await knex.schema.alterTable('smart_contracts', (table) => {
    table.dropForeign(['deployment_transaction_id']);
  });
}