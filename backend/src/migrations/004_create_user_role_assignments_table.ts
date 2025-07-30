import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_role_assignments', (table) => {
    table.increments('assignment_id').primary();
    table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.integer('role_id').unsigned().notNullable().references('role_id').inTable('user_roles').onDelete('CASCADE');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.integer('assigned_by').unsigned().references('user_id').inTable('users');
    table.timestamp('expires_at');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Composite unique constraint
    table.unique(['user_id', 'role_id']);
    
    // Indexes
    table.index(['user_id']);
    table.index(['role_id']);
    table.index(['is_active']);
    table.index(['assigned_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_role_assignments');
}