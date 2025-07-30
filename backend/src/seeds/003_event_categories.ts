import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('event_categories').del();

  // Insert event categories
  await knex('event_categories').insert([
    {
      name: 'Music',
      slug: 'music',
      description: 'Live music performances and concerts',
      icon_url: '/icons/music.svg',
      color_hex: '#FF6B6B',
      sort_order: 1,
      is_active: true
    },
    {
      name: 'Rock',
      slug: 'rock',
      description: 'Rock music concerts and festivals',
      icon_url: '/icons/rock.svg',
      color_hex: '#FF4757',
      parent_category_id: 1,
      sort_order: 1,
      is_active: true
    },
    {
      name: 'Electronic',
      slug: 'electronic',
      description: 'Electronic music and DJ performances',
      icon_url: '/icons/electronic.svg',
      color_hex: '#3742FA',
      parent_category_id: 1,
      sort_order: 2,
      is_active: true
    },
    {
      name: 'Hip Hop',
      slug: 'hip-hop',
      description: 'Hip hop and rap performances',
      icon_url: '/icons/hiphop.svg',
      color_hex: '#2F3542',
      parent_category_id: 1,
      sort_order: 3,
      is_active: true
    },
    {
      name: 'Arts & Culture',
      slug: 'arts-culture',
      description: 'Art exhibitions, theater, and cultural events',
      icon_url: '/icons/arts.svg',
      color_hex: '#5F27CD',
      sort_order: 2,
      is_active: true
    },
    {
      name: 'Theater',
      slug: 'theater',
      description: 'Live theater performances and plays',
      icon_url: '/icons/theater.svg',
      color_hex: '#6C5CE7',
      parent_category_id: 5,
      sort_order: 1,
      is_active: true
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sporting events and competitions',
      icon_url: '/icons/sports.svg',
      color_hex: '#00D2D3',
      sort_order: 3,
      is_active: true
    },
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech conferences, workshops, and meetups',
      icon_url: '/icons/tech.svg',
      color_hex: '#FF9FF3',
      sort_order: 4,
      is_active: true
    },
    {
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Food festivals, wine tastings, and culinary events',
      icon_url: '/icons/food.svg',
      color_hex: '#54A0FF',
      sort_order: 5,
      is_active: true
    },
    {
      name: 'Community',
      slug: 'community',
      description: 'Local community events and gatherings',
      icon_url: '/icons/community.svg',
      color_hex: '#5F27CD',
      sort_order: 6,
      is_active: true
    }
  ]);
}