import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('event_tag_assignments', (table) => {
    table.increments('assignment_id').primary();
    table.integer('event_id').unsigned().notNullable().references('event_id').inTable('events').onDelete('CASCADE');
    table.integer('tag_id').unsigned().notNullable().references('tag_id').inTable('event_tags').onDelete('CASCADE');
    table.timestamps(true, true);

    // Composite unique constraint
    table.unique(['event_id', 'tag_id']);
    
    // Indexes
    table.index(['event_id']);
    table.index(['tag_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('event_tag_assignments');
}