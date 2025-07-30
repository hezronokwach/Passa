import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('artists', (table) => {
    table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('stage_name', 255);
    table.string('genre', 100);
    table.text('bio');
    table.json('genres'); // Array of genres
    table.json('instruments'); // Array of instruments
    table.string('record_label', 255);
    table.string('manager_contact', 255);
    table.string('booking_email', 255);
    table.decimal('performance_fee_min', 10, 2);
    table.decimal('performance_fee_max', 10, 2);
    table.string('currency', 10).defaultTo('USD');
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.integer('follower_count').defaultTo(0);
    table.decimal('rating', 3, 2).defaultTo(0);
    table.integer('total_performances').defaultTo(0);
    table.timestamps(true, true);

    // Indexes
    table.index(['stage_name']);
    table.index(['genre']);
    table.index(['is_verified']);
    table.index(['rating']);
    table.index(['follower_count']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('artists');
}