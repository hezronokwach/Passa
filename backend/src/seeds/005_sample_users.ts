import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries (in reverse order due to foreign keys)
  await knex('user_role_assignments').del();
  await knex('fans').del();
  await knex('sponsors').del();
  await knex('content_creators').del();
  await knex('artists').del();
  await knex('organizers').del();
  await knex('user_profiles').del();
  await knex('users').del();

  // Hash password for sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insert sample users
  const userIds = await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@passa.io',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      username: 'organizer1',
      email: 'organizer@passa.io',
      password_hash: hashedPassword,
      first_name: 'Event',
      last_name: 'Organizer',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      username: 'artist1',
      email: 'artist@passa.io',
      password_hash: hashedPassword,
      first_name: 'John',
      last_name: 'Musician',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      username: 'creator1',
      email: 'creator@passa.io',
      password_hash: hashedPassword,
      first_name: 'Jane',
      last_name: 'Creator',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      username: 'sponsor1',
      email: 'sponsor@passa.io',
      password_hash: hashedPassword,
      first_name: 'Brand',
      last_name: 'Manager',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    },
    {
      username: 'fan1',
      email: 'fan@passa.io',
      password_hash: hashedPassword,
      first_name: 'Music',
      last_name: 'Lover',
      status: 'active',
      email_verified: true,
      email_verified_at: knex.fn.now()
    }
  ]).returning('user_id');

  // Insert user profiles
  await knex('user_profiles').insert([
    {
      user_id: userIds[0].user_id,
      bio: 'Platform administrator with full system access',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      is_public: false
    },
    {
      user_id: userIds[1].user_id,
      bio: 'Professional event organizer specializing in music festivals',
      location: 'Austin, TX',
      timezone: 'America/Chicago',
      website_url: 'https://eventpro.com',
      is_public: true
    },
    {
      user_id: userIds[2].user_id,
      bio: 'Indie rock musician and songwriter',
      location: 'Nashville, TN',
      timezone: 'America/Chicago',
      twitter_handle: '@johnmusician',
      instagram_handle: '@johnmusician',
      is_public: true
    },
    {
      user_id: userIds[3].user_id,
      bio: 'Content creator specializing in event photography and videography',
      location: 'Los Angeles, CA',
      timezone: 'America/Los_Angeles',
      website_url: 'https://janecreator.com',
      instagram_handle: '@janecreator',
      is_public: true
    },
    {
      user_id: userIds[4].user_id,
      bio: 'Brand manager for tech company sponsorships',
      location: 'Seattle, WA',
      timezone: 'America/Los_Angeles',
      is_public: true
    },
    {
      user_id: userIds[5].user_id,
      bio: 'Music enthusiast and concert-goer',
      location: 'Denver, CO',
      timezone: 'America/Denver',
      is_public: true
    }
  ]);

  // Get role IDs
  const roles = await knex('user_roles').select('role_id', 'role_name');
  const roleMap = roles.reduce((acc, role) => {
    acc[role.role_name] = role.role_id;
    return acc;
  }, {} as Record<string, number>);

  // Insert role assignments
  await knex('user_role_assignments').insert([
    { user_id: userIds[0].user_id, role_id: roleMap.admin, is_active: true },
    { user_id: userIds[1].user_id, role_id: roleMap.organizer, is_active: true },
    { user_id: userIds[2].user_id, role_id: roleMap.artist, is_active: true },
    { user_id: userIds[3].user_id, role_id: roleMap.content_creator, is_active: true },
    { user_id: userIds[4].user_id, role_id: roleMap.sponsor, is_active: true },
    { user_id: userIds[5].user_id, role_id: roleMap.fan, is_active: true }
  ]);

  // Insert role-specific data
  await knex('organizers').insert({
    user_id: userIds[1].user_id,
    company_name: 'EventPro Productions',
    business_type: 'llc',
    business_description: 'Professional event management and production company',
    business_email: 'business@eventpro.com',
    business_website: 'https://eventpro.com',
    is_verified: true,
    verified_at: knex.fn.now(),
    commission_rate: 0.05
  });

  await knex('artists').insert({
    user_id: userIds[2].user_id,
    stage_name: 'John & The Rockers',
    genre: 'Rock',
    bio: 'Indie rock band from Nashville with 5 years of touring experience',
    genres: JSON.stringify(['Rock', 'Indie', 'Alternative']),
    instruments: JSON.stringify(['Guitar', 'Vocals', 'Bass', 'Drums']),
    performance_fee_min: 2500.00,
    performance_fee_max: 10000.00,
    is_verified: true,
    verified_at: knex.fn.now(),
    follower_count: 15000,
    rating: 4.8,
    total_performances: 127
  });

  await knex('content_creators').insert({
    user_id: userIds[3].user_id,
    portfolio_url: 'https://janecreator.com/portfolio',
    content_types: JSON.stringify(['photography', 'videography', 'social_media']),
    specialties: JSON.stringify(['concert_photography', 'event_videography', 'social_content']),
    equipment_owned: 'Canon R5, Sony FX3, DJI Ronin, Professional lighting kit',
    hourly_rate: 150.00,
    day_rate: 1200.00,
    available_for_hire: true,
    is_verified: true,
    verified_at: knex.fn.now(),
    completed_projects: 89,
    rating: 4.9,
    follower_count: 8500
  });

  await knex('sponsors').insert({
    user_id: userIds[4].user_id,
    brand_name: 'TechFlow Solutions',
    industry: 'Technology',
    brand_description: 'Leading provider of event technology solutions',
    brand_website: 'https://techflow.com',
    annual_budget: 250000.00,
    target_demographics: JSON.stringify({
      age_range: '18-45',
      interests: ['technology', 'music', 'innovation'],
      locations: ['US', 'Canada']
    }),
    sponsorship_types: JSON.stringify(['event', 'artist', 'content']),
    contact_person: 'Brand Manager',
    contact_email: 'partnerships@techflow.com',
    is_verified: true,
    verified_at: knex.fn.now(),
    active_campaigns: 3
  });

  await knex('fans').insert({
    user_id: userIds[5].user_id,
    favorite_genres: JSON.stringify(['Rock', 'Electronic', 'Hip Hop']),
    interests: JSON.stringify(['live_music', 'festivals', 'technology']),
    preferred_location: 'Denver, CO',
    max_ticket_budget: 200.00,
    notifications_enabled: true,
    notification_preferences: JSON.stringify({
      new_events: true,
      price_drops: true,
      artist_updates: true,
      event_reminders: true
    }),
    events_attended: 23,
    tickets_purchased: 31,
    total_spent: 2847.50,
    loyalty_points: 2847,
    loyalty_tier: 'gold'
  });
}