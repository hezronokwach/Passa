import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('event_tags').del();

  // Insert event tags
  await knex('event_tags').insert([
    { name: 'Live Music', slug: 'live-music', description: 'Live musical performances', color_hex: '#FF6B6B', usage_count: 0, is_active: true },
    { name: 'Festival', slug: 'festival', description: 'Multi-day festival events', color_hex: '#4ECDC4', usage_count: 0, is_active: true },
    { name: 'Concert', slug: 'concert', description: 'Single artist or band concerts', color_hex: '#45B7D1', usage_count: 0, is_active: true },
    { name: 'Outdoor', slug: 'outdoor', description: 'Outdoor venue events', color_hex: '#96CEB4', usage_count: 0, is_active: true },
    { name: 'Indoor', slug: 'indoor', description: 'Indoor venue events', color_hex: '#FFEAA7', usage_count: 0, is_active: true },
    { name: 'VIP Available', slug: 'vip-available', description: 'VIP tickets available', color_hex: '#FD79A8', usage_count: 0, is_active: true },
    { name: 'All Ages', slug: 'all-ages', description: 'Suitable for all ages', color_hex: '#FDCB6E', usage_count: 0, is_active: true },
    { name: '18+', slug: '18-plus', description: 'Adults only event', color_hex: '#E17055', usage_count: 0, is_active: true },
    { name: '21+', slug: '21-plus', description: 'Ages 21 and over', color_hex: '#D63031', usage_count: 0, is_active: true },
    { name: 'Free', slug: 'free', description: 'Free admission', color_hex: '#00B894', usage_count: 0, is_active: true },
    { name: 'Paid', slug: 'paid', description: 'Paid admission required', color_hex: '#0984E3', usage_count: 0, is_active: true },
    { name: 'Limited Capacity', slug: 'limited-capacity', description: 'Limited seating/capacity', color_hex: '#A29BFE', usage_count: 0, is_active: true },
    { name: 'Food Available', slug: 'food-available', description: 'Food vendors or service available', color_hex: '#FD79A8', usage_count: 0, is_active: true },
    { name: 'Parking Available', slug: 'parking-available', description: 'Parking facilities available', color_hex: '#6C5CE7', usage_count: 0, is_active: true },
    { name: 'Accessible', slug: 'accessible', description: 'Wheelchair accessible venue', color_hex: '#00CEC9', usage_count: 0, is_active: true },
    { name: 'Virtual', slug: 'virtual', description: 'Online/virtual event', color_hex: '#74B9FF', usage_count: 0, is_active: true },
    { name: 'Hybrid', slug: 'hybrid', description: 'Both in-person and virtual attendance', color_hex: '#A29BFE', usage_count: 0, is_active: true },
    { name: 'Networking', slug: 'networking', description: 'Networking opportunities available', color_hex: '#FDCB6E', usage_count: 0, is_active: true },
    { name: 'Workshop', slug: 'workshop', description: 'Educational workshop format', color_hex: '#E17055', usage_count: 0, is_active: true },
    { name: 'Conference', slug: 'conference', description: 'Professional conference', color_hex: '#0984E3', usage_count: 0, is_active: true }
  ]);
}