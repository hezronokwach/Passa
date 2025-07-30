import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sponsors', (table) => {
    table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('brand_name', 255).notNullable();
    table.string('industry', 100);
    table.text('brand_description');
    table.string('brand_website');
    table.decimal('annual_budget', 12, 2);
    table.string('currency', 10).defaultTo('USD');
    table.json('target_demographics'); // JSON object with age, location, interests
    table.json('sponsorship_types'); // Array: ['event', 'artist', 'content']
    table.string('contact_person', 255);
    table.string('contact_email', 255);
    table.string('contact_phone', 20);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.integer('active_campaigns').defaultTo(0);
    table.timestamps(true, true);

    // Indexes
    table.index(['brand_name']);
    table.index(['industry']);
    table.index(['is_verified']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('sponsors');
}