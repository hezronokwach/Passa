import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('user_roles').del();

  // Insert user roles
  await knex('user_roles').insert([
    {
      role_name: 'admin',
      display_name: 'Administrator',
      description: 'Full system access and management capabilities',
      permissions: JSON.stringify([
        'users.admin', 'events.create', 'events.read', 'events.update', 'events.delete', 'events.publish',
        'tickets.create', 'tickets.read', 'tickets.transfer', 'tickets.refund',
        'attribution.create', 'attribution.approve', 'attribution.payout',
        'contracts.deploy', 'contracts.manage'
      ]),
      is_active: true
    },
    {
      role_name: 'organizer',
      display_name: 'Event Organizer',
      description: 'Can create and manage events, handle tickets and attribution',
      permissions: JSON.stringify([
        'users.read', 'users.update', 'events.create', 'events.read', 'events.update', 'events.delete', 'events.publish',
        'tickets.create', 'tickets.read', 'tickets.refund',
        'attribution.create', 'attribution.approve', 'attribution.payout',
        'contracts.deploy', 'contracts.manage'
      ]),
      is_active: true
    },
    {
      role_name: 'artist',
      display_name: 'Artist',
      description: 'Can view events they are part of and manage their attribution',
      permissions: JSON.stringify([
        'users.read', 'users.update', 'events.read',
        'tickets.read', 'attribution.create'
      ]),
      is_active: true
    },
    {
      role_name: 'content_creator',
      display_name: 'Content Creator',
      description: 'Can create content and manage attribution for their work',
      permissions: JSON.stringify([
        'users.read', 'users.update', 'events.read',
        'attribution.create'
      ]),
      is_active: true
    },
    {
      role_name: 'sponsor',
      display_name: 'Sponsor',
      description: 'Can sponsor events and manage their sponsorship attribution',
      permissions: JSON.stringify([
        'users.read', 'users.update', 'events.read',
        'attribution.create'
      ]),
      is_active: true
    },
    {
      role_name: 'fan',
      display_name: 'Fan',
      description: 'Can purchase tickets and view events',
      permissions: JSON.stringify([
        'users.read', 'users.update', 'events.read',
        'tickets.read', 'tickets.transfer'
      ]),
      is_active: true
    }
  ]);
}