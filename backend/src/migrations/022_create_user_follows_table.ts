import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_follows', (table) => {
    table.increments('follow_id').primary();
    table.integer('follower_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.integer('following_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Prevent users from following themselves
    table.check('follower_id != following_id');
    
    // Ensure unique follow relationships
    table.unique(['follower_id', 'following_id']);
    
    // Indexes for performance
    table.index(['follower_id']);
    table.index(['following_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_follows');
}