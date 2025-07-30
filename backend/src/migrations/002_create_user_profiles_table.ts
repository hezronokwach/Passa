import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_profiles', (table) => {
    table.increments('profile_id').primary();
    table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.text('bio');
    table.string('avatar_url');
    table.string('cover_image_url');
    table.string('website_url');
    table.string('twitter_handle', 50);
    table.string('instagram_handle', 50);
    table.string('linkedin_handle', 50);
    table.string('location', 255);
    table.string('timezone', 50);
    table.string('language', 10).defaultTo('en');
    table.json('preferences'); // JSON object for user preferences
    table.json('notification_settings'); // JSON object for notification preferences
    table.boolean('is_public').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.unique(['user_id']);
    table.index(['is_public']);
    table.index(['location']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_profiles');
}