import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('smart_contracts', (table) => {
    table.increments('contract_id').primary();
    table.string('contract_address', 255).unique().notNullable();
    table.json('contract_abi').notNullable();
    table.string('contract_type', 50).notNullable();
    table.string('contract_name', 100);
    table.string('contract_version', 20);
    table.string('deployer_wallet_address', 255).notNullable();
    table.integer('deployment_transaction_id').unsigned();
    table.string('blockchain_network', 50).defaultTo('stellar');
    table.enum('status', ['deploying', 'active', 'paused', 'deprecated']).defaultTo('deploying');
    table.json('configuration');
    table.json('metadata');
    table.timestamp('deployed_at');
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.timestamps(true, true);

    // Indexes
    table.index(['contract_address']);
    table.index(['contract_type']);
    table.index(['deployer_wallet_address']);
    table.index(['blockchain_network']);
    table.index(['status']);
    table.index(['deployed_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('smart_contracts');
}