import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('event_tags', (table) => {
    table.increments('tag_id').primary();
    table.string('name', 50).unique().notNullable();
    table.string('slug', 50).unique().notNullable();
    table.text('description');
    table.string('color_hex', 7); // #FFFFFF format
    table.integer('usage_count').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index(['slug']);
    table.index(['usage_count']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('event_tags');
}