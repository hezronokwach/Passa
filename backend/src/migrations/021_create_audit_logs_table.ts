import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('audit_logs', (table) => {
    table.increments('log_id').primary();
    table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
    table.string('action', 100).notNullable(); // 'create_event', 'purchase_ticket', etc.
    table.string('resource_type', 50).notNullable(); // 'event', 'ticket', 'user', etc.
    table.integer('resource_id').unsigned(); // ID of the affected resource
    table.json('old_values'); // Previous values (for updates)
    table.json('new_values'); // New values
    table.string('ip_address', 45);
    table.string('user_agent', 500);
    table.json('metadata'); // Additional context
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['user_id']);
    table.index(['action']);
    table.index(['resource_type']);
    table.index(['resource_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('audit_logs');
}