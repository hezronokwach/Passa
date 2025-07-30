import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_roles', (table) => {
    table.increments('role_id').primary();
    table.string('role_name', 50).unique().notNullable();
    table.string('display_name', 100).notNullable();
    table.text('description');
    table.json('permissions'); // JSON array of permission strings
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index(['role_name']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_roles');
}