import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('event_categories', (table) => {
    table.increments('category_id').primary();
    table.string('name', 100).unique().notNullable();
    table.string('slug', 100).unique().notNullable();
    table.text('description');
    table.string('icon_url');
    table.string('color_hex', 7); // #FFFFFF format
    table.integer('parent_category_id').unsigned().references('category_id').inTable('event_categories');
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index(['slug']);
    table.index(['parent_category_id']);
    table.index(['is_active']);
    table.index(['sort_order']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('event_categories');
}