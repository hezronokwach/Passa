import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('username', 255).unique().notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.string('phone', 20);
    table.date('date_of_birth');
    table.enum('status', ['active', 'inactive', 'suspended', 'pending_verification']).defaultTo('pending_verification');
    table.boolean('email_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.string('verification_token');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamp('last_login_at');
    table.string('last_login_ip', 45);
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('deleted_at');
    table.timestamps(true, true);

    // Indexes
    table.index(['email']);
    table.index(['username']);
    table.index(['status']);
    table.index(['is_deleted']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}