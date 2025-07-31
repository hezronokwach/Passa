import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { EventCategoryModel } from '@/models/EventCategory';
import { EventValidationError } from '@/utils/eventValidation';
import { CreateEventCategoryInput } from '@/types/event';
import { db } from '@/config/database';

describe('EventCategoryModel', () => {
  let testCategoryIds: number[] = [];

  // Helper function to generate unique test data
  const generateUniqueCategoryData = (suffix?: string): CreateEventCategoryInput => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const uniqueSuffix = suffix || `${timestamp}_${randomNum}`;

    return {
      name: `Test Category ${uniqueSuffix}`,
      description: `Test category description for ${uniqueSuffix}`,
      icon_url: 'https://example.com/icon.svg',
      color_hex: '#FF5733',
      sort_order: 1,
      is_active: true
    };
  };

  beforeAll(async () => {
    // Clean up any existing test categories
    await db('event_categories').where('name', 'like', 'Test Category%').del();
  });

  afterAll(async () => {
    // Clean up test data
    await db('event_categories').whereIn('category_id', testCategoryIds).del();
  });

  beforeEach(async () => {
    // Clean up categories created in previous tests
    await db('event_categories').whereIn('category_id', testCategoryIds).del();
    testCategoryIds = [];
  });

  describe('CRUD Operations', () => {
    it('should create a new category with validation', async () => {
      const categoryData = generateUniqueCategoryData();

      const category = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(category.category_id);

      expect(category).toBeDefined();
      expect(category.name).toBe(categoryData.name);
      expect(category.description).toBe(categoryData.description);
      expect(category.icon_url).toBe(categoryData.icon_url);
      expect(category.color_hex).toBe(categoryData.color_hex);
      expect(category.sort_order).toBe(categoryData.sort_order);
      expect(category.is_active).toBe(true);
      expect(category.slug).toBeDefined();
      expect(category.slug).toMatch(/^test-category-/);
      expect(category.parent_category_id).toBeNull();
    });

    it('should validate required fields', async () => {
      const invalidCategoryData = {
        // Missing required name field
        description: 'Test description'
      };

      await expect(EventCategoryModel.create(invalidCategoryData as any))
        .rejects.toThrow(EventValidationError);
    });

    it('should validate name length', async () => {
      const categoryData = generateUniqueCategoryData();
      categoryData.name = 'a'.repeat(101); // Too long

      await expect(EventCategoryModel.create(categoryData))
        .rejects.toThrow(EventValidationError);
    });

    it('should validate color hex format', async () => {
      const categoryData = generateUniqueCategoryData();
      categoryData.color_hex = 'invalid-color';

      await expect(EventCategoryModel.create(categoryData))
        .rejects.toThrow(EventValidationError);
    });

    it('should validate URL format', async () => {
      const categoryData = generateUniqueCategoryData();
      categoryData.icon_url = 'invalid-url';

      await expect(EventCategoryModel.create(categoryData))
        .rejects.toThrow(EventValidationError);
    });

    it('should find category by ID', async () => {
      const categoryData = generateUniqueCategoryData();
      const createdCategory = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(createdCategory.category_id);

      const foundCategory = await EventCategoryModel.findById(createdCategory.category_id);

      expect(foundCategory).toBeDefined();
      expect(foundCategory?.category_id).toBe(createdCategory.category_id);
      expect(foundCategory?.name).toBe(categoryData.name);
    });

    it('should find category by slug', async () => {
      const categoryData = generateUniqueCategoryData();
      const createdCategory = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(createdCategory.category_id);

      const foundCategory = await EventCategoryModel.findBySlug(createdCategory.slug);

      expect(foundCategory).toBeDefined();
      expect(foundCategory?.category_id).toBe(createdCategory.category_id);
      expect(foundCategory?.slug).toBe(createdCategory.slug);
    });

    it('should update category', async () => {
      const categoryData = generateUniqueCategoryData();
      const createdCategory = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(createdCategory.category_id);

      const updateData = {
        name: 'Updated Category Name',
        description: 'Updated description',
        color_hex: '#00FF00',
        sort_order: 5
      };

      const updatedCategory = await EventCategoryModel.update(createdCategory.category_id, updateData);

      expect(updatedCategory.name).toBe(updateData.name);
      expect(updatedCategory.description).toBe(updateData.description);
      expect(updatedCategory.color_hex).toBe(updateData.color_hex);
      expect(updatedCategory.sort_order).toBe(updateData.sort_order);
      expect(updatedCategory.slug).toMatch(/^updated-category-name/);
    });

    it('should soft delete category', async () => {
      const categoryData = generateUniqueCategoryData();
      const createdCategory = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(createdCategory.category_id);

      await EventCategoryModel.delete(createdCategory.category_id);

      const deletedCategory = await EventCategoryModel.findById(createdCategory.category_id);
      expect(deletedCategory?.is_active).toBe(false);
    });
  });

  describe('Hierarchical Relationships', () => {
    it('should create child category with parent', async () => {
      const parentData = generateUniqueCategoryData('parent');
      const parentCategory = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parentCategory.category_id);

      const childData = generateUniqueCategoryData('child');
      childData.parent_category_id = parentCategory.category_id;
      const childCategory = await EventCategoryModel.create(childData);
      testCategoryIds.push(childCategory.category_id);

      expect(childCategory.parent_category_id).toBe(parentCategory.category_id);
    });

    it('should validate parent category exists', async () => {
      const categoryData = generateUniqueCategoryData();
      categoryData.parent_category_id = 999999; // Non-existent parent

      await expect(EventCategoryModel.create(categoryData))
        .rejects.toThrow(EventValidationError);
    });

    it('should prevent circular references', async () => {
      const parentData = generateUniqueCategoryData('circular_parent');
      const parentCategory = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parentCategory.category_id);

      const childData = generateUniqueCategoryData('circular_child');
      childData.parent_category_id = parentCategory.category_id;
      const childCategory = await EventCategoryModel.create(childData);
      testCategoryIds.push(childCategory.category_id);

      // Try to make parent a child of its own child
      await expect(EventCategoryModel.update(parentCategory.category_id, {
        parent_category_id: childCategory.category_id
      })).rejects.toThrow(EventValidationError);
    });

    it('should prevent category from being its own parent', async () => {
      const categoryData = generateUniqueCategoryData();
      const createdCategory = await EventCategoryModel.create(categoryData);
      testCategoryIds.push(createdCategory.category_id);

      await expect(EventCategoryModel.update(createdCategory.category_id, {
        parent_category_id: createdCategory.category_id
      })).rejects.toThrow(EventValidationError);
    });

    it('should get root categories', async () => {
      const rootData1 = generateUniqueCategoryData('root1');
      const rootData2 = generateUniqueCategoryData('root2');
      
      const root1 = await EventCategoryModel.create(rootData1);
      const root2 = await EventCategoryModel.create(rootData2);
      testCategoryIds.push(root1.category_id, root2.category_id);

      const rootCategories = await EventCategoryModel.getRootCategories();

      expect(rootCategories.length).toBeGreaterThanOrEqual(2);
      expect(rootCategories.every(cat => cat.parent_category_id === null)).toBe(true);
    });

    it('should get child categories', async () => {
      const parentData = generateUniqueCategoryData('parent_for_children');
      const parentCategory = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parentCategory.category_id);

      const child1Data = generateUniqueCategoryData('child1');
      child1Data.parent_category_id = parentCategory.category_id;
      const child1 = await EventCategoryModel.create(child1Data);
      testCategoryIds.push(child1.category_id);

      const child2Data = generateUniqueCategoryData('child2');
      child2Data.parent_category_id = parentCategory.category_id;
      const child2 = await EventCategoryModel.create(child2Data);
      testCategoryIds.push(child2.category_id);

      const childCategories = await EventCategoryModel.getChildCategories(parentCategory.category_id);

      expect(childCategories).toHaveLength(2);
      expect(childCategories.every(cat => cat.parent_category_id === parentCategory.category_id)).toBe(true);
    });

    it('should get category path (breadcrumb)', async () => {
      const grandparentData = generateUniqueCategoryData('grandparent');
      const grandparent = await EventCategoryModel.create(grandparentData);
      testCategoryIds.push(grandparent.category_id);

      const parentData = generateUniqueCategoryData('parent_path');
      parentData.parent_category_id = grandparent.category_id;
      const parent = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parent.category_id);

      const childData = generateUniqueCategoryData('child_path');
      childData.parent_category_id = parent.category_id;
      const child = await EventCategoryModel.create(childData);
      testCategoryIds.push(child.category_id);

      const path = await EventCategoryModel.getCategoryPath(child.category_id);

      expect(path).toHaveLength(3);
      expect(path[0]?.category_id).toBe(grandparent.category_id);
      expect(path[1]?.category_id).toBe(parent.category_id);
      expect(path[2]?.category_id).toBe(child.category_id);
    });

    it('should build category tree', async () => {
      const parentData = generateUniqueCategoryData('tree_parent');
      const parent = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parent.category_id);

      const child1Data = generateUniqueCategoryData('tree_child1');
      child1Data.parent_category_id = parent.category_id;
      const child1 = await EventCategoryModel.create(child1Data);
      testCategoryIds.push(child1.category_id);

      const child2Data = generateUniqueCategoryData('tree_child2');
      child2Data.parent_category_id = parent.category_id;
      const child2 = await EventCategoryModel.create(child2Data);
      testCategoryIds.push(child2.category_id);

      const tree = await EventCategoryModel.getCategoryTree();

      expect(tree.length).toBeGreaterThan(0);
      const parentInTree = tree.find(cat => cat.category_id === parent.category_id);
      expect(parentInTree).toBeDefined();
      expect((parentInTree as any)?.children).toHaveLength(2);
    });
  });

  describe('Search and Filtering', () => {
    it('should get all active categories', async () => {
      const activeData = generateUniqueCategoryData('active');
      const activeCategory = await EventCategoryModel.create(activeData);
      testCategoryIds.push(activeCategory.category_id);

      const inactiveData = generateUniqueCategoryData('inactive');
      inactiveData.is_active = false;
      const inactiveCategory = await EventCategoryModel.create(inactiveData);
      testCategoryIds.push(inactiveCategory.category_id);

      const activeCategories = await EventCategoryModel.getAll({ is_active: true });

      expect(activeCategories.every(cat => cat.is_active)).toBe(true);
      expect(activeCategories.some(cat => cat.category_id === activeCategory.category_id)).toBe(true);
      expect(activeCategories.some(cat => cat.category_id === inactiveCategory.category_id)).toBe(false);
    });

    it('should search categories by name', async () => {
      const searchData = generateUniqueCategoryData('searchable');
      const searchCategory = await EventCategoryModel.create(searchData);
      testCategoryIds.push(searchCategory.category_id);

      const results = await EventCategoryModel.search('searchable');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(cat => cat.category_id === searchCategory.category_id)).toBe(true);
    });

    it('should search categories by description', async () => {
      const searchData = generateUniqueCategoryData();
      searchData.description = 'unique searchable description';
      const searchCategory = await EventCategoryModel.create(searchData);
      testCategoryIds.push(searchCategory.category_id);

      const results = await EventCategoryModel.search('searchable description');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(cat => cat.category_id === searchCategory.category_id)).toBe(true);
    });
  });

  describe('Validation and Constraints', () => {
    it('should prevent deletion of category with child categories', async () => {
      const parentData = generateUniqueCategoryData('parent_with_children');
      const parent = await EventCategoryModel.create(parentData);
      testCategoryIds.push(parent.category_id);

      const childData = generateUniqueCategoryData('child_preventing_deletion');
      childData.parent_category_id = parent.category_id;
      const child = await EventCategoryModel.create(childData);
      testCategoryIds.push(child.category_id);

      await expect(EventCategoryModel.delete(parent.category_id))
        .rejects.toThrow(EventValidationError);
    });

    it('should generate unique slugs for duplicate names', async () => {
      const timestamp = Date.now();
      const categoryData1 = generateUniqueCategoryData();
      categoryData1.name = `Duplicate Name ${timestamp}`;
      const category1 = await EventCategoryModel.create(categoryData1);
      testCategoryIds.push(category1.category_id);

      const categoryData2 = generateUniqueCategoryData();
      categoryData2.name = `Duplicate Name ${timestamp}`;

      // This should fail due to unique constraint on name, so let's test slug generation differently
      // by creating a category with a name that would generate the same slug
      categoryData2.name = `Duplicate-Name ${timestamp}`;
      const category2 = await EventCategoryModel.create(categoryData2);
      testCategoryIds.push(category2.category_id);

      expect(category1.slug).toMatch(/^duplicate-name-/);
      expect(category2.slug).toMatch(/^duplicate-name-/);
      expect(category1.slug).not.toBe(category2.slug);
    });

    it('should handle sort order properly', async () => {
      const category1Data = generateUniqueCategoryData('sort1');
      category1Data.sort_order = 3;
      const category1 = await EventCategoryModel.create(category1Data);
      testCategoryIds.push(category1.category_id);

      const category2Data = generateUniqueCategoryData('sort2');
      category2Data.sort_order = 1;
      const category2 = await EventCategoryModel.create(category2Data);
      testCategoryIds.push(category2.category_id);

      const categories = await EventCategoryModel.getAll();
      const sortedCategories = categories.filter(cat => 
        cat.category_id === category1.category_id || cat.category_id === category2.category_id
      );

      expect(sortedCategories[0]?.category_id).toBe(category2.category_id); // Lower sort_order first
      expect(sortedCategories[1]?.category_id).toBe(category1.category_id);
    });
  });
});
