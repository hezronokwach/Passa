import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('permissions').del();

  // Insert permissions
  await knex('permissions').insert([
    // User permissions
    { permission_name: 'users.create', display_name: 'Create Users', description: 'Create new user accounts', resource: 'users', action: 'create', scope: 'all' },
    { permission_name: 'users.read', display_name: 'Read Users', description: 'View user information', resource: 'users', action: 'read', scope: 'own' },
    { permission_name: 'users.update', display_name: 'Update Users', description: 'Update user information', resource: 'users', action: 'update', scope: 'own' },
    { permission_name: 'users.delete', display_name: 'Delete Users', description: 'Delete user accounts', resource: 'users', action: 'delete', scope: 'own' },
    { permission_name: 'users.admin', display_name: 'Admin Users', description: 'Full user management', resource: 'users', action: 'admin', scope: 'all' },

    // Event permissions
    { permission_name: 'events.create', display_name: 'Create Events', description: 'Create new events', resource: 'events', action: 'create', scope: 'own' },
    { permission_name: 'events.read', display_name: 'Read Events', description: 'View event information', resource: 'events', action: 'read', scope: 'all' },
    { permission_name: 'events.update', display_name: 'Update Events', description: 'Update event information', resource: 'events', action: 'update', scope: 'own' },
    { permission_name: 'events.delete', display_name: 'Delete Events', description: 'Delete events', resource: 'events', action: 'delete', scope: 'own' },
    { permission_name: 'events.publish', display_name: 'Publish Events', description: 'Publish events to public', resource: 'events', action: 'publish', scope: 'own' },

    // Ticket permissions
    { permission_name: 'tickets.create', display_name: 'Create Tickets', description: 'Create new tickets', resource: 'tickets', action: 'create', scope: 'organization' },
    { permission_name: 'tickets.read', display_name: 'Read Tickets', description: 'View ticket information', resource: 'tickets', action: 'read', scope: 'own' },
    { permission_name: 'tickets.transfer', display_name: 'Transfer Tickets', description: 'Transfer ticket ownership', resource: 'tickets', action: 'transfer', scope: 'own' },
    { permission_name: 'tickets.refund', display_name: 'Refund Tickets', description: 'Process ticket refunds', resource: 'tickets', action: 'refund', scope: 'organization' },

    // Attribution permissions
    { permission_name: 'attribution.create', display_name: 'Create Attribution', description: 'Create attribution records', resource: 'attribution', action: 'create', scope: 'organization' },
    { permission_name: 'attribution.approve', display_name: 'Approve Attribution', description: 'Approve attribution records', resource: 'attribution', action: 'approve', scope: 'organization' },
    { permission_name: 'attribution.payout', display_name: 'Process Payouts', description: 'Process attribution payouts', resource: 'attribution', action: 'payout', scope: 'organization' },

    // Smart contract permissions
    { permission_name: 'contracts.deploy', display_name: 'Deploy Contracts', description: 'Deploy smart contracts', resource: 'contracts', action: 'deploy', scope: 'organization' },
    { permission_name: 'contracts.manage', display_name: 'Manage Contracts', description: 'Manage smart contracts', resource: 'contracts', action: 'manage', scope: 'organization' },
  ]);
}