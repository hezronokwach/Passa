import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('organizers', (table) => {
    table.integer('user_id').unsigned().primary().references('user_id').inTable('users').onDelete('CASCADE');
    table.string('company_name', 255);
    table.string('tax_id', 50);
    table.string('business_type', 100); // 'individual', 'llc', 'corporation', etc.
    table.text('business_description');
    table.string('business_address');
    table.string('business_phone', 20);
    table.string('business_email', 255);
    table.string('business_website');
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.json('verification_documents'); // Array of document URLs/IDs
    table.decimal('commission_rate', 5, 4).defaultTo(0.05); // 5% default commission
    table.timestamps(true, true);

    // Indexes
    table.index(['company_name']);
    table.index(['is_verified']);
    table.index(['business_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organizers');
}