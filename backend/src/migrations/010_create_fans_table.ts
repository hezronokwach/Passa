import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fans', (table) => {
    table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
    table.json('favorite_genres'); // Array of preferred music/event genres
    table.json('interests'); // Array of interests
    table.string('preferred_location', 255);
    table.decimal('max_ticket_budget', 8, 2);
    table.string('currency', 10).defaultTo('USD');
    table.boolean('notifications_enabled').defaultTo(true);
    table.json('notification_preferences'); // What types of notifications they want
    table.integer('events_attended').defaultTo(0);
    table.integer('tickets_purchased').defaultTo(0);
    table.decimal('total_spent', 10, 2).defaultTo(0);
    table.integer('loyalty_points').defaultTo(0);
    table.string('loyalty_tier', 50).defaultTo('bronze'); // bronze, silver, gold, platinum
    table.timestamps(true, true);

    // Indexes
    table.index(['preferred_location']);
    table.index(['loyalty_tier']);
    table.index(['events_attended']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('fans');
}