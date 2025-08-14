/**
 * Tests for OCAPISystemObjectsClient
 * Tests system objects operations
 */

import { OCAPISystemObjectsClient } from '../src/clients/ocapi/system-objects-client.js';
import { OCAPIConfig } from '../src/types/types.js';
import { QueryBuilder } from '../src/utils/query-builder.js';
import { Validator } from '../src/utils/validator.js';

// Mock dependencies
jest.mock('../src/clients/base/ocapi-auth-client.js');
jest.mock('../src/utils/query-builder.js');
jest.mock('../src/utils/validator.js');

describe('OCAPISystemObjectsClient', () => {
  let client: OCAPISystemObjectsClient;
  let mockValidateRequired: jest.MockedFunction<typeof Validator.validateRequired>;
  let mockValidateObjectType: jest.MockedFunction<typeof Validator.validateObjectType>;
  let mockValidateSearchRequest: jest.MockedFunction<typeof Validator.validateSearchRequest>;
  let mockQueryBuilderFromObject: jest.MockedFunction<typeof QueryBuilder.fromObject>;

  const mockConfig: OCAPIConfig = {
    hostname: 'test-instance.demandware.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    version: 'v21_3',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Validator methods
    mockValidateRequired = Validator.validateRequired as jest.MockedFunction<typeof Validator.validateRequired>;
    mockValidateObjectType = Validator.validateObjectType as jest.MockedFunction<typeof Validator.validateObjectType>;
    mockValidateSearchRequest = Validator.validateSearchRequest as jest.MockedFunction<
        typeof Validator.validateSearchRequest
    >;

    // Reset mock implementations to default behavior
    mockValidateRequired.mockImplementation(() => {});
    mockValidateObjectType.mockImplementation(() => {});
    mockValidateSearchRequest.mockImplementation(() => {});

    // Mock QueryBuilder
    mockQueryBuilderFromObject = QueryBuilder.fromObject as jest.MockedFunction<typeof QueryBuilder.fromObject>;

    client = new OCAPISystemObjectsClient(mockConfig);

    // Mock the inherited methods by adding them as properties - avoid protected access
    (client as any).get = jest.fn().mockResolvedValue({ data: 'mocked' });
    (client as any).post = jest.fn().mockResolvedValue({ data: 'mocked' });
  });

  describe('constructor', () => {
    it('should initialize with correct base URL', () => {
      expect(client).toBeInstanceOf(OCAPISystemObjectsClient);
    });

    it('should use default version when not provided', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
      };

      const clientWithDefaults = new OCAPISystemObjectsClient(configWithoutVersion);
      expect(clientWithDefaults).toBeInstanceOf(OCAPISystemObjectsClient);
    });
  });

  describe('getSystemObjectDefinitions', () => {
    it('should make GET request to system_object_definitions endpoint', async () => {
      await client.getSystemObjectDefinitions();

      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions');
    });

    it('should include query parameters when provided', async () => {
      const params = { start: 0, count: 10, select: '(**)' };
      mockQueryBuilderFromObject.mockReturnValue('start=0&count=10&select=%28%2A%2A%29');

      await client.getSystemObjectDefinitions(params);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(params);
      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions?start=0&count=10&select=%28%2A%2A%29');
    });

    it('should not include query string when no parameters provided', async () => {
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.getSystemObjectDefinitions({});

      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions');
    });
  });

  describe('getSystemObjectDefinition', () => {
    it('should validate required parameters', async () => {
      const objectType = 'Product';

      await client.getSystemObjectDefinition(objectType);

      expect(Validator.validateRequired).toHaveBeenCalledWith({ objectType }, ['objectType']);
      expect(Validator.validateObjectType).toHaveBeenCalledWith(objectType);
    });

    it('should make GET request with encoded object type', async () => {
      const objectType = 'Custom Object';

      await client.getSystemObjectDefinition(objectType);

      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions/Custom%20Object');
    });

    it('should handle special characters in object type', async () => {
      const objectType = 'Product/Variant';

      await client.getSystemObjectDefinition(objectType);

      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions/Product%2FVariant');
    });
  });

  describe('searchSystemObjectDefinitions', () => {
    it('should validate search request', async () => {
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'product',
          },
        },
      };

      await client.searchSystemObjectDefinitions(searchRequest);

      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);
    });

    it('should make POST request to system object definition search endpoint', async () => {
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'product',
          },
        },
      };

      await client.searchSystemObjectDefinitions(searchRequest);

      expect((client as any).post).toHaveBeenCalledWith('/system_object_definition_search', searchRequest);
    });
  });

  describe('searchSystemObjectAttributeDefinitions', () => {
    it('should validate all required parameters', async () => {
      const objectType = 'Product';
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'custom',
          },
        },
      };

      await client.searchSystemObjectAttributeDefinitions(objectType, searchRequest);

      expect(Validator.validateRequired).toHaveBeenCalledWith({ objectType }, ['objectType']);
      expect(Validator.validateObjectType).toHaveBeenCalledWith(objectType);
      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);
    });

    it('should make POST request to attribute definition search endpoint', async () => {
      const objectType = 'Product';
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'custom',
          },
        },
      };

      await client.searchSystemObjectAttributeDefinitions(objectType, searchRequest);

      expect((client as any).post).toHaveBeenCalledWith('/system_object_definitions/Product/attribute_definition_search', searchRequest);
    });
  });

  describe('searchSystemObjectAttributeGroups', () => {
    it('should validate all required parameters', async () => {
      const objectType = 'SitePreferences';
      const searchRequest = {
        query: { match_all_query: {} },
      };

      await client.searchSystemObjectAttributeGroups(objectType, searchRequest);

      expect(Validator.validateRequired).toHaveBeenCalledWith({ objectType }, ['objectType']);
      expect(Validator.validateObjectType).toHaveBeenCalledWith(objectType);
      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);
    });

    it('should make POST request to attribute group search endpoint', async () => {
      const objectType = 'SitePreferences';
      const searchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name'],
            search_phrase: 'general',
          },
        },
        sorts: [{ field: 'position', sort_order: 'asc' as const }],
      };

      await client.searchSystemObjectAttributeGroups(objectType, searchRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/system_object_definitions/SitePreferences/attribute_group_search',
        searchRequest,
      );
    });
  });

  describe('error handling', () => {
    it('should propagate validation errors', async () => {
      const validationError = new Error('Validation failed');
      mockValidateRequired.mockImplementation(() => {
        throw validationError;
      });

      await expect(client.getSystemObjectDefinition('Product')).rejects.toThrow(validationError);
    });

    it('should propagate HTTP errors from base client', async () => {
      const httpError = new Error('HTTP request failed');
      (client as any).get = jest.fn().mockRejectedValue(httpError);

      await expect(client.getSystemObjectDefinitions()).rejects.toThrow(httpError);
    });

    it('should propagate search validation errors', async () => {
      const searchValidationError = new Error('Invalid search request');
      mockValidateSearchRequest.mockImplementation(() => {
        throw searchValidationError;
      });

      const searchRequest = { query: {} };
      await expect(client.searchSystemObjectDefinitions(searchRequest)).rejects.toThrow(searchValidationError);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex search with all options', async () => {
      const objectType = 'Product';
      const searchRequest = {
        query: {
          bool_query: {
            must: [
              {
                text_query: {
                  fields: ['id'],
                  search_phrase: 'custom',
                },
              },
            ],
            must_not: [
              {
                term_query: {
                  fields: ['system'],
                  operator: 'is',
                  values: [true],
                },
              },
            ],
          },
        },
        sorts: [
          { field: 'display_name', sort_order: 'asc' as const },
          { field: 'id' },
        ],
        start: 10,
        count: 25,
        select: '(**)',
      };

      await client.searchSystemObjectAttributeDefinitions(objectType, searchRequest);

      expect(Validator.validateRequired).toHaveBeenCalled();
      expect(Validator.validateObjectType).toHaveBeenCalled();
      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);
      expect((client as any).post).toHaveBeenCalledWith(
        '/system_object_definitions/Product/attribute_definition_search',
        searchRequest,
      );
    });

    it('should handle empty query parameters gracefully', async () => {
      const params = {};
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.getSystemObjectDefinitions(params);

      expect((client as any).get).toHaveBeenCalledWith('/system_object_definitions');
    });
  });
});
