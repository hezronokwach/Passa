import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('content_creators', (table) => {
    table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('portfolio_url');
    table.json('content_types'); // Array: ['photography', 'videography', 'social_media', 'graphic_design']
    table.json('specialties'); // Array of specialties
    table.string('equipment_owned', 1000); // Text description of equipment
    table.decimal('hourly_rate', 8, 2);
    table.decimal('day_rate', 10, 2);
    table.string('currency', 10).defaultTo('USD');
    table.boolean('available_for_hire').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.integer('completed_projects').defaultTo(0);
    table.decimal('rating', 3, 2).defaultTo(0);
    table.integer('follower_count').defaultTo(0);
    table.timestamps(true, true);

    // Indexes
    table.index(['is_verified']);
    table.index(['available_for_hire']);
    table.index(['rating']);
    table.index(['hourly_rate']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('content_creators');
}