/**
 * Category Utilities
 *
 * Shared utilities for category-based document organization.
 * Used by ISML, SFRA, and other documentation clients.
 */

export interface CategoryInfo {
  displayName: string;
  description: string;
}

export interface CategoryWithCount extends CategoryInfo {
  name: string;
  count?: number;
}

/**
 * Get a category for an item based on mappings, with fallback
 */
export function getCategoryForItem<T extends string>(
  itemName: string,
  mappings: Record<string, T>,
  fallback: T,
): T {
  return (mappings[itemName.toLowerCase()] ?? fallback) as T;
}

/**
 * Build category list with counts from items
 */
export function buildCategoryList<T extends string>(
  items: Array<{ category: T }>,
  categoryDescriptions: Record<T, CategoryInfo>,
): CategoryWithCount[] {
  const categoryCounts = new Map<T, number>();

  // Count elements per category
  for (const item of items) {
    const count = categoryCounts.get(item.category) ?? 0;
    categoryCounts.set(item.category, count + 1);
  }

  // Build category info
  const categories: CategoryWithCount[] = [];
  for (const [categoryKey, count] of categoryCounts.entries()) {
    const categoryInfo = categoryDescriptions[categoryKey];
    if (categoryInfo) {
      categories.push({
        name: categoryKey,
        displayName: categoryInfo.displayName,
        description: categoryInfo.description,
        count,
      });
    }
  }

  // Sort by display name
  return categories.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Filter items by category
 */
export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string,
): T[] {
  return items.filter(item => item.category === category);
}
