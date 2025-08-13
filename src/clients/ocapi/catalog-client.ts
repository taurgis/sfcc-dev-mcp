/**
 * OCAPI Catalog Client
 *
 * This module handles all SFCC catalog related operations including
 * products, categories, and product search functionality.
 */

import { OCAPIConfig } from '../../types/types.js';
import { OCAPIAuthClient } from '../base/ocapi-auth-client.js';
import { QueryBuilder } from '../../utils/query-builder.js';

/**
 * Product parameters interface
 */
interface ProductParams {
  ids?: string[];
  expand?: string[];
  inventory_ids?: string[];
  currency?: string;
  locale?: string;
}

/**
 * Category parameters interface
 */
interface CategoryParams {
  ids?: string[];
  levels?: number;
  locale?: string;
}

/**
 * Product search parameters interface
 */
interface ProductSearchParams {
  q?: string;
  refine?: string[];
  sort?: string;
  start?: number;
  count?: number;
  expand?: string[];
  currency?: string;
  locale?: string;
}

/**
 * OCAPI Catalog Client
 * Specialized client for catalog operations (products, categories, search)
 */
export class OCAPICatalogClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    const version = config.version ?? 'v21_3';
    const baseUrl = `https://${config.hostname}/s/-/dw/data/${version}`;

    super(config);
    // Override the baseUrl for this specialized client
    (this as any).baseUrl = baseUrl;
  }

  /**
   * Get products from the catalog
   */
  async getProducts(params?: ProductParams): Promise<any> {
    let endpoint = '/products';

    if (params) {
      const queryString = QueryBuilder.fromObject(params);
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Get categories from the catalog
   */
  async getCategories(params?: CategoryParams): Promise<any> {
    let endpoint = '/categories';

    if (params) {
      const queryString = QueryBuilder.fromObject(params);
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Search products
   */
  async searchProducts(params: ProductSearchParams): Promise<any> {
    let endpoint = '/product_search';

    const queryString = QueryBuilder.fromObject(params);
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.get(endpoint);
  }
}
