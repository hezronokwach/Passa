import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('permissions', (table) => {
    table.increments('permission_id').primary();
    table.string('permission_name', 100).unique().notNullable();
    table.string('display_name', 150).notNullable();
    table.text('description');
    table.string('resource', 50).notNullable(); // 'events', 'users', 'tickets', etc.
    table.string('action', 50).notNullable(); // 'create', 'read', 'update', 'delete'
    table.string('scope', 50).defaultTo('own'); // 'own', 'organization', 'all'
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index(['permission_name']);
    table.index(['resource']);
    table.index(['action']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('permissions');
}