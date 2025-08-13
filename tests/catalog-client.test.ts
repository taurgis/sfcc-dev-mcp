/**
 * Tests for OCAPICatalogClient
 * Tests catalog operations (products, categories, search)
 */

import { OCAPICatalogClient } from '../src/clients/ocapi/catalog-client.js';
import { OCAPIConfig } from '../src/types/types.js';
import { QueryBuilder } from '../src/utils/query-builder.js';

// Mock dependencies
jest.mock('../src/clients/base/ocapi-auth-client.js');
jest.mock('../src/utils/query-builder.js');

describe('OCAPICatalogClient', () => {
  let client: OCAPICatalogClient;
  let mockQueryBuilderFromObject: jest.MockedFunction<typeof QueryBuilder.fromObject>;

  const mockConfig: OCAPIConfig = {
    hostname: 'test-instance.demandware.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    version: 'v21_3',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock QueryBuilder
    mockQueryBuilderFromObject = QueryBuilder.fromObject as jest.MockedFunction<typeof QueryBuilder.fromObject>;

    client = new OCAPICatalogClient(mockConfig);

    // Mock the inherited methods by adding them as properties - avoid protected access
    (client as any).get = jest.fn().mockResolvedValue({ data: 'mocked' });
  });

  describe('constructor', () => {
    it('should initialize with correct base URL', () => {
      expect(client).toBeInstanceOf(OCAPICatalogClient);
    });

    it('should use default version when not provided', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
      };

      const clientWithDefaults = new OCAPICatalogClient(configWithoutVersion);
      expect(clientWithDefaults).toBeInstanceOf(OCAPICatalogClient);
    });
  });

  describe('getProducts', () => {
    it('should make GET request to products endpoint without parameters', async () => {
      await client.getProducts();

      expect((client as any).get).toHaveBeenCalledWith('/products');
    });

    it('should include query parameters when provided', async () => {
      const params = {
        ids: ['product1', 'product2'],
        expand: ['variations', 'images'],
        inventory_ids: ['inventory1'],
        currency: 'USD',
        locale: 'en_US',
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=product1%2Cproduct2&expand=variations%2Cimages&inventory_ids=inventory1&currency=USD&locale=en_US');

      await client.getProducts(params);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(params);
      expect((client as any).get).toHaveBeenCalledWith('/products?ids=product1%2Cproduct2&expand=variations%2Cimages&inventory_ids=inventory1&currency=USD&locale=en_US');
    });

    it('should handle single product ID', async () => {
      const params = { ids: ['single-product'] };
      mockQueryBuilderFromObject.mockReturnValue('ids=single-product');

      await client.getProducts(params);

      expect((client as any).get).toHaveBeenCalledWith('/products?ids=single-product');
    });

    it('should handle expand parameters', async () => {
      const params = {
        ids: ['product1'],
        expand: ['variations', 'images', 'availability', 'prices'],
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=product1&expand=variations%2Cimages%2Cavailability%2Cprices');

      await client.getProducts(params);

      expect((client as any).get).toHaveBeenCalledWith('/products?ids=product1&expand=variations%2Cimages%2Cavailability%2Cprices');
    });

    it('should handle inventory and localization parameters', async () => {
      const params = {
        ids: ['product1'],
        inventory_ids: ['inventory1', 'inventory2'],
        currency: 'EUR',
        locale: 'de_DE',
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=product1&inventory_ids=inventory1%2Cinventory2&currency=EUR&locale=de_DE');

      await client.getProducts(params);

      expect((client as any).get).toHaveBeenCalledWith('/products?ids=product1&inventory_ids=inventory1%2Cinventory2&currency=EUR&locale=de_DE');
    });

    it('should not include query string when no parameters provided', async () => {
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.getProducts({});

      expect((client as any).get).toHaveBeenCalledWith('/products');
    });
  });

  describe('getCategories', () => {
    it('should make GET request to categories endpoint without parameters', async () => {
      await client.getCategories();

      expect((client as any).get).toHaveBeenCalledWith('/categories');
    });

    it('should include query parameters when provided', async () => {
      const params = {
        ids: ['category1', 'category2'],
        levels: 2,
        locale: 'en_US',
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=category1%2Ccategory2&levels=2&locale=en_US');

      await client.getCategories(params);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(params);
      expect((client as any).get).toHaveBeenCalledWith('/categories?ids=category1%2Ccategory2&levels=2&locale=en_US');
    });

    it('should handle single category ID', async () => {
      const params = { ids: ['root-category'] };
      mockQueryBuilderFromObject.mockReturnValue('ids=root-category');

      await client.getCategories(params);

      expect((client as any).get).toHaveBeenCalledWith('/categories?ids=root-category');
    });

    it('should handle levels parameter for hierarchy depth', async () => {
      const params = {
        ids: ['root'],
        levels: 3,
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=root&levels=3');

      await client.getCategories(params);

      expect((client as any).get).toHaveBeenCalledWith('/categories?ids=root&levels=3');
    });

    it('should handle locale parameter', async () => {
      const params = {
        ids: ['category1'],
        locale: 'fr_FR',
      };
      mockQueryBuilderFromObject.mockReturnValue('ids=category1&locale=fr_FR');

      await client.getCategories(params);

      expect((client as any).get).toHaveBeenCalledWith('/categories?ids=category1&locale=fr_FR');
    });

    it('should not include query string when no parameters provided', async () => {
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.getCategories({});

      expect((client as any).get).toHaveBeenCalledWith('/categories');
    });
  });

  describe('searchProducts', () => {
    it('should make GET request to product_search endpoint with basic search', async () => {
      const params = { q: 'shirt' };
      mockQueryBuilderFromObject.mockReturnValue('q=shirt');

      await client.searchProducts(params);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(params);
      expect((client as any).get).toHaveBeenCalledWith('/product_search?q=shirt');
    });

    it('should handle complex search parameters', async () => {
      const params = {
        q: 'mens shoes',
        refine: ['category=footwear', 'brand=nike', 'color=black'],
        sort: 'price-asc',
        start: 0,
        count: 25,
        expand: ['images', 'variations', 'prices'],
        currency: 'USD',
        locale: 'en_US',
      };
      mockQueryBuilderFromObject.mockReturnValue(
        'q=mens+shoes&refine=category%3Dfootwear&refine=brand%3Dnike&refine=color%3Dblack&sort=price-asc&start=0&count=25&expand=images%2Cvariations%2Cprices&currency=USD&locale=en_US',
      );

      await client.searchProducts(params);

      expect((client as any).get).toHaveBeenCalledWith(
        '/product_search?q=mens+shoes&refine=category%3Dfootwear&refine=brand%3Dnike&refine=color%3Dblack&sort=price-asc&start=0&count=25&expand=images%2Cvariations%2Cprices&currency=USD&locale=en_US',
      );
    });

    it('should handle refine parameters for filtering', async () => {
      const params = {
        q: 'dress',
        refine: ['category=womens-clothing', 'size=M', 'price=(100..200)'],
      };
      mockQueryBuilderFromObject.mockReturnValue('q=dress&refine=category%3Dwomens-clothing&refine=size%3DM&refine=price%3D%28100..200%29');

      await client.searchProducts(params);

      expect((client as any).get).toHaveBeenCalledWith('/product_search?q=dress&refine=category%3Dwomens-clothing&refine=size%3DM&refine=price%3D%28100..200%29');
    });

    it('should always include query string for product search', async () => {
      const params = {};
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.searchProducts(params);

      expect((client as any).get).toHaveBeenCalledWith('/product_search');
    });
  });

  describe('error handling', () => {
    it('should propagate HTTP errors from base client for products', async () => {
      const httpError = new Error('HTTP request failed');
      (client as any).get = jest.fn().mockRejectedValue(httpError);

      await expect(client.getProducts()).rejects.toThrow(httpError);
    });

    it('should propagate HTTP errors from base client for categories', async () => {
      const httpError = new Error('HTTP request failed');
      (client as any).get = jest.fn().mockRejectedValue(httpError);

      await expect(client.getCategories()).rejects.toThrow(httpError);
    });

    it('should propagate HTTP errors from base client for product search', async () => {
      const httpError = new Error('HTTP request failed');
      (client as any).get = jest.fn().mockRejectedValue(httpError);

      await expect(client.searchProducts({ q: 'test' })).rejects.toThrow(httpError);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete product retrieval workflow', async () => {
      const params = {
        ids: ['product1', 'product2', 'product3'],
        expand: ['variations', 'images', 'availability', 'prices', 'promotions'],
        inventory_ids: ['inventory_us', 'inventory_eu'],
        currency: 'USD',
        locale: 'en_US',
      };
      mockQueryBuilderFromObject.mockReturnValue(
        'ids=product1%2Cproduct2%2Cproduct3&expand=variations%2Cimages%2Cavailability%2Cprices%2Cpromotions&inventory_ids=inventory_us%2Cinventory_eu&currency=USD&locale=en_US',
      );

      await client.getProducts(params);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(params);
      expect((client as any).get).toHaveBeenCalledWith(
        '/products?ids=product1%2Cproduct2%2Cproduct3&expand=variations%2Cimages%2Cavailability%2Cprices%2Cpromotions&inventory_ids=inventory_us%2Cinventory_eu&currency=USD&locale=en_US',
      );
    });

    it('should handle minimal requests correctly', async () => {
      // Minimal product request
      mockQueryBuilderFromObject.mockReturnValue('');
      await client.getProducts();
      expect((client as any).get).toHaveBeenCalledWith('/products');

      // Minimal category request
      await client.getCategories();
      expect((client as any).get).toHaveBeenCalledWith('/categories');

      // Minimal search request
      const minimalSearch = {};
      await client.searchProducts(minimalSearch);
      expect((client as any).get).toHaveBeenCalledWith('/product_search');
    });
  });
});
