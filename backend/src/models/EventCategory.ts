import { db } from '@/config/database';
import {
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput
} from '@/types/event';
import { EventValidation, EventValidationError } from '@/utils/eventValidation';

export class EventCategoryModel {
  private static readonly TABLE = 'event_categories';

  /**
   * Create a new event category
   */
  static async create(categoryData: CreateEventCategoryInput): Promise<EventCategory> {
    try {
      // Validate input first
      this.validateCategoryInput(categoryData);

      // Generate slug from name (validation ensures name exists)
      const slug = EventValidation.generateSlug(categoryData.name);
      const uniqueSlug = await this.generateUniqueSlug(slug);

      // Validate parent category if provided
      if (categoryData.parent_category_id) {
        const parentCategory = await this.findById(categoryData.parent_category_id);
        if (!parentCategory) {
          throw new EventValidationError('Parent category not found', 'parent_category_id');
        }
        if (!parentCategory.is_active) {
          throw new EventValidationError('Parent category is not active', 'parent_category_id');
        }
      }

      const [category] = await db(this.TABLE)
        .insert({
          name: categoryData.name.trim(),
          slug: uniqueSlug,
          description: categoryData.description?.trim(),
          icon_url: categoryData.icon_url,
          color_hex: categoryData.color_hex,
          parent_category_id: categoryData.parent_category_id,
          sort_order: categoryData.sort_order || 0,
          is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
        })
        .returning('*');

      return category;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find category by ID
   */
  static async findById(id: number): Promise<EventCategory | null> {
    const category = await db(this.TABLE)
      .where('category_id', id)
      .first();

    return category || null;
  }

  /**
   * Find category by slug
   */
  static async findBySlug(slug: string): Promise<EventCategory | null> {
    const category = await db(this.TABLE)
      .where('slug', slug)
      .first();

    return category || null;
  }

  /**
   * Update category
   */
  static async update(id: number, categoryData: UpdateEventCategoryInput): Promise<EventCategory> {
    try {
      const existingCategory = await this.findById(id);
      if (!existingCategory) {
        throw new EventValidationError('Category not found');
      }

      // Validate input
      this.validateCategoryInput(categoryData);

      // Generate new slug if name changed
      let slug = existingCategory.slug;
      if (categoryData.name && categoryData.name !== existingCategory.name) {
        const baseSlug = EventValidation.generateSlug(categoryData.name);
        slug = await this.generateUniqueSlug(baseSlug, id);
      }

      // Validate parent category if provided
      if (categoryData.parent_category_id) {
        if (categoryData.parent_category_id === id) {
          throw new EventValidationError('Category cannot be its own parent', 'parent_category_id');
        }

        const parentCategory = await this.findById(categoryData.parent_category_id);
        if (!parentCategory) {
          throw new EventValidationError('Parent category not found', 'parent_category_id');
        }

        // Check for circular reference
        if (await this.wouldCreateCircularReference(id, categoryData.parent_category_id)) {
          throw new EventValidationError('Cannot create circular reference in category hierarchy', 'parent_category_id');
        }
      }

      const updateData: Record<string, unknown> = { ...categoryData };
      if (categoryData.name) {
        updateData['slug'] = slug;
        updateData['name'] = categoryData.name.trim();
      }
      if (categoryData.description) {
        updateData['description'] = categoryData.description.trim();
      }

      const [updatedCategory] = await db(this.TABLE)
        .where('category_id', id)
        .update(updateData)
        .returning('*');

      return updatedCategory;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete category (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<void> {
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new EventValidationError('Category not found');
    }

    // Check if category has child categories
    const childCategories = await db(this.TABLE)
      .where('parent_category_id', id)
      .where('is_active', true);

    if (childCategories.length > 0) {
      throw new EventValidationError('Cannot delete category with active child categories');
    }

    // Check if category is used by any events
    const eventsUsingCategory = await db('events')
      .where('category_id', id)
      .where('is_deleted', false);

    if (eventsUsingCategory.length > 0) {
      throw new EventValidationError('Cannot delete category that is used by events');
    }

    await db(this.TABLE)
      .where('category_id', id)
      .update({ is_active: false });
  }

  /**
   * Get all categories with optional filters
   */
  static async getAll(filters: {
    is_active?: boolean;
    parent_category_id?: number | null;
    include_inactive?: boolean;
  } = {}): Promise<EventCategory[]> {
    let query = db(this.TABLE);

    if (filters.is_active !== undefined) {
      query = query.where('is_active', filters.is_active);
    } else if (!filters.include_inactive) {
      query = query.where('is_active', true);
    }

    if (filters.parent_category_id !== undefined) {
      if (filters.parent_category_id === null) {
        query = query.whereNull('parent_category_id');
      } else {
        query = query.where('parent_category_id', filters.parent_category_id);
      }
    }

    return query.orderBy('sort_order', 'asc').orderBy('name', 'asc');
  }

  /**
   * Get category tree (hierarchical structure)
   */
  static async getCategoryTree(): Promise<EventCategory[]> {
    const allCategories = await this.getAll({ is_active: true });
    return this.buildCategoryTree(allCategories);
  }

  /**
   * Get root categories (categories without parent)
   */
  static async getRootCategories(): Promise<EventCategory[]> {
    return this.getAll({ parent_category_id: null, is_active: true });
  }

  /**
   * Get child categories of a parent category
   */
  static async getChildCategories(parentId: number): Promise<EventCategory[]> {
    return this.getAll({ parent_category_id: parentId, is_active: true });
  }

  /**
   * Get category path (breadcrumb)
   */
  static async getCategoryPath(categoryId: number): Promise<EventCategory[]> {
    const path: EventCategory[] = [];
    let currentId: number | null = categoryId;

    while (currentId) {
      const category = await this.findById(currentId);
      if (!category) break;

      path.unshift(category);
      currentId = category.parent_category_id || null;
    }

    return path;
  }

  /**
   * Search categories
   */
  static async search(query: string, limit: number = 20): Promise<EventCategory[]> {
    return db(this.TABLE)
      .where('is_active', true)
      .where(function() {
        this.where('name', 'ilike', `%${query}%`)
          .orWhere('description', 'ilike', `%${query}%`);
      })
      .orderBy('name', 'asc')
      .limit(limit);
  }

  /**
   * Get categories with event counts
   */
  static async getCategoriesWithEventCounts(): Promise<Array<EventCategory & { event_count: number }>> {
    return db(this.TABLE)
      .leftJoin('events', function() {
        this.on('event_categories.category_id', '=', 'events.category_id')
          .andOn('events.is_deleted', '=', db.raw('false'))
          .andOn('events.status', '=', db.raw('?', ['published']));
      })
      .where('event_categories.is_active', true)
      .groupBy('event_categories.category_id')
      .select(
        'event_categories.*',
        db.raw('COUNT(events.event_id) as event_count')
      )
      .orderBy('event_categories.sort_order', 'asc')
      .orderBy('event_categories.name', 'asc');
  }

  /**
   * Validate category input
   */
  private static validateCategoryInput(categoryData: CreateEventCategoryInput | UpdateEventCategoryInput): void {
    // Check if name exists and is valid
    if (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim().length === 0) {
      throw new EventValidationError('Category name is required', 'name');
    }

    if (categoryData.name.length > 100) {
      throw new EventValidationError('Category name must be less than 100 characters', 'name');
    }

    if (categoryData.description && categoryData.description.length > 1000) {
      throw new EventValidationError('Category description must be less than 1000 characters', 'description');
    }

    if (categoryData.color_hex) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(categoryData.color_hex)) {
        throw new EventValidationError('Invalid color hex format. Use #RRGGBB format', 'color_hex');
      }
    }

    if (categoryData.icon_url) {
      EventValidation.validateUrl(categoryData.icon_url, 'icon_url');
    }

    if (categoryData.sort_order !== undefined) {
      if (!Number.isInteger(categoryData.sort_order) || categoryData.sort_order < 0) {
        throw new EventValidationError('Sort order must be a non-negative integer', 'sort_order');
      }
    }
  }

  /**
   * Generate unique slug
   */
  private static async generateUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let query = db(this.TABLE).where('slug', slug);

      if (excludeId) {
        query = query.where('category_id', '!=', excludeId);
      }

      const existing = await query.first();

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Check if setting parent would create circular reference
   */
  private static async wouldCreateCircularReference(categoryId: number, parentId: number): Promise<boolean> {
    let currentId: number | null = parentId;

    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }

      const category = await this.findById(currentId);
      if (!category) break;

      currentId = category.parent_category_id || null;
    }

    return false;
  }

  /**
   * Build hierarchical category tree
   */
  private static buildCategoryTree(categories: EventCategory[], parentId: number | null = null): Array<EventCategory & { children: EventCategory[] }> {
    const children = categories.filter(cat => cat.parent_category_id === parentId);
    
    return children.map(category => ({
      ...category,
      children: this.buildCategoryTree(categories, category.category_id)
    }));
  }
}
