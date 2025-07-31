// Event-related TypeScript interfaces and types

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed' | 'postponed';

export interface Event {
  event_id: number;
  organizer_user_id: number;
  category_id?: number;
  event_name: string;
  slug: string;
  description?: string;
  short_description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  venue_name?: string;
  venue_address?: string;
  start_datetime: Date;
  end_datetime: Date;
  timezone: string;
  total_tickets_available: number;
  tickets_sold: number;
  min_ticket_price?: number;
  max_ticket_price?: number;
  currency: string;
  status: EventStatus;
  cover_image_url?: string;
  gallery_images?: string[];
  metadata?: Record<string, unknown>;
  is_featured: boolean;
  is_private: boolean;
  access_code?: string;
  published_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  smart_contract_id?: number;
  is_deleted: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEventInput {
  organizer_user_id: number;
  category_id?: number;
  event_name: string;
  description?: string;
  short_description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  venue_name?: string;
  venue_address?: string;
  start_datetime: Date;
  end_datetime: Date;
  timezone?: string;
  total_tickets_available: number;
  min_ticket_price?: number;
  max_ticket_price?: number;
  currency?: string;
  cover_image_url?: string;
  gallery_images?: string[];
  metadata?: Record<string, unknown>;
  is_featured?: boolean;
  is_private?: boolean;
  access_code?: string;
  smart_contract_id?: number;
  tag_ids?: number[];
}

export interface UpdateEventInput {
  category_id?: number;
  event_name?: string;
  description?: string;
  short_description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  venue_name?: string;
  venue_address?: string;
  start_datetime?: Date;
  end_datetime?: Date;
  timezone?: string;
  total_tickets_available?: number;
  min_ticket_price?: number;
  max_ticket_price?: number;
  currency?: string;
  cover_image_url?: string;
  gallery_images?: string[];
  metadata?: Record<string, unknown>;
  is_featured?: boolean;
  is_private?: boolean;
  access_code?: string;
  smart_contract_id?: number;
  tag_ids?: number[];
}

export interface EventSearchFilters {
  event_name?: string;
  organizer_user_id?: number;
  category_id?: number;
  status?: EventStatus;
  location?: string;
  start_date_from?: Date;
  start_date_to?: Date;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_private?: boolean;
  tag_ids?: number[];
  page?: number;
  limit?: number;
  sort_by?: 'start_datetime' | 'created_at' | 'event_name' | 'tickets_sold';
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Event Category types
export interface EventCategory {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  color_hex?: string;
  parent_category_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEventCategoryInput {
  name: string;
  description?: string;
  icon_url?: string;
  color_hex?: string;
  parent_category_id?: number;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateEventCategoryInput {
  name?: string;
  description?: string;
  icon_url?: string;
  color_hex?: string;
  parent_category_id?: number;
  sort_order?: number;
  is_active?: boolean;
}

// Event Tag types
export interface EventTag {
  tag_id: number;
  name: string;
  slug: string;
  description?: string;
  color_hex?: string;
  usage_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEventTagInput {
  name: string;
  description?: string;
  color_hex?: string;
  is_active?: boolean;
}

export interface UpdateEventTagInput {
  name?: string;
  description?: string;
  color_hex?: string;
  is_active?: boolean;
}

export interface EventTagAssignment {
  assignment_id: number;
  event_id: number;
  tag_id: number;
  created_at: Date;
  updated_at: Date;
}

// Extended Event interface with related data
export interface EventWithDetails extends Event {
  category?: EventCategory;
  tags?: EventTag[];
  organizer?: {
    user_id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

// Event statistics interface
export interface EventStatistics {
  total_events: number;
  published_events: number;
  draft_events: number;
  cancelled_events: number;
  completed_events: number;
  total_tickets_sold: number;
  total_revenue: number;
  average_ticket_price: number;
}
