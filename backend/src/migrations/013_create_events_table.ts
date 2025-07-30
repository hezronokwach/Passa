import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', (table) => {
    table.increments('event_id').primary();
    table.integer('organizer_user_id').unsigned().notNullable().references('user_id').inTable('organizers').onDelete('RESTRICT');
    table.integer('category_id').unsigned().references('category_id').inTable('event_categories');
    table.string('event_name', 255).notNullable();
    table.string('slug', 255).unique().notNullable();
    table.text('description');
    table.string('short_description', 500);
    table.string('location', 255).notNullable();
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('venue_name', 255);
    table.text('venue_address');
    table.timestamp('start_datetime').notNullable();
    table.timestamp('end_datetime').notNullable();
    table.string('timezone', 50).defaultTo('UTC');
    table.integer('total_tickets_available').notNullable();
    table.integer('tickets_sold').defaultTo(0);
    table.decimal('min_ticket_price', 10, 2);
    table.decimal('max_ticket_price', 10, 2);
    table.string('currency', 10).defaultTo('USD');
    table.enum('status', ['draft', 'published', 'cancelled', 'completed', 'postponed']).defaultTo('draft');
    table.string('cover_image_url');
    table.json('gallery_images');
    table.json('metadata');
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_private').defaultTo(false);
    table.string('access_code', 50);
    table.timestamp('published_at');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('deleted_at');
    table.timestamps(true, true);

    // Indexes
    table.index(['organizer_user_id']);
    table.index(['category_id']);
    table.index(['slug']);
    table.index(['status']);
    table.index(['start_datetime']);
    table.index(['location']);
    table.index(['is_featured']);
    table.index(['is_private']);
    table.index(['is_deleted']);
    table.index(['published_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('events');
}