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

