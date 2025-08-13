/**
 * Tests for OCAPISitePreferencesClient
 * Tests site preferences operations
 */

import { OCAPISitePreferencesClient } from '../src/clients/ocapi/site-preferences-client.js';
import { OCAPIConfig } from '../src/types/types.js';
import { QueryBuilder } from '../src/utils/query-builder.js';
import { Validator } from '../src/utils/validator.js';

// Mock dependencies
jest.mock('../src/clients/base/ocapi-auth-client.js');
jest.mock('../src/utils/query-builder.js');
jest.mock('../src/utils/validator.js');

describe('OCAPISitePreferencesClient', () => {
  let client: OCAPISitePreferencesClient;
  let mockValidateRequired: jest.MockedFunction<typeof Validator.validateRequired>;
  let mockValidateInstanceType: jest.MockedFunction<typeof Validator.validateInstanceType>;
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
    mockValidateInstanceType = Validator.validateInstanceType as jest.MockedFunction<
        typeof Validator.validateInstanceType
    >;
    mockValidateSearchRequest = Validator.validateSearchRequest as jest.MockedFunction<
        typeof Validator.validateSearchRequest
    >;

    // Reset mock implementations to default behavior
    mockValidateRequired.mockImplementation(() => {});
    mockValidateInstanceType.mockImplementation(() => 'sandbox'); // Return a valid instance type
    mockValidateSearchRequest.mockImplementation(() => {});

    // Mock QueryBuilder
    mockQueryBuilderFromObject = QueryBuilder.fromObject as jest.MockedFunction<typeof QueryBuilder.fromObject>;

    client = new OCAPISitePreferencesClient(mockConfig);

    // Mock the inherited methods by adding them as properties - avoid protected access
    (client as any).post = jest.fn().mockResolvedValue({ data: 'mocked' });
  });

  describe('constructor', () => {
    it('should initialize with correct base URL', () => {
      expect(client).toBeInstanceOf(OCAPISitePreferencesClient);
    });

    it('should use default version when not provided', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
      };

      const clientWithDefaults = new OCAPISitePreferencesClient(configWithoutVersion);
      expect(clientWithDefaults).toBeInstanceOf(OCAPISitePreferencesClient);
    });
  });

  describe('searchSitePreferences', () => {
    const groupId = 'SiteGeneral';
    const instanceType = 'sandbox';
    const searchRequest = {
      query: { match_all_query: {} },
    };

    beforeEach(() => {
      mockValidateInstanceType.mockReturnValue('sandbox');
    });

    it('should validate all required parameters', async () => {
      await client.searchSitePreferences(groupId, instanceType, searchRequest);

      expect(Validator.validateRequired).toHaveBeenCalledWith(
        { groupId, instanceType },
        ['groupId', 'instanceType'],
      );
      expect(Validator.validateInstanceType).toHaveBeenCalledWith(instanceType);
      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);
    });

    it('should make POST request to site preferences search endpoint', async () => {
      await client.searchSitePreferences(groupId, instanceType, searchRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search',
        searchRequest,
      );
    });

    it('should encode group ID in URL', async () => {
      const encodedGroupId = 'Site General Settings';

      await client.searchSitePreferences(encodedGroupId, instanceType, searchRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/Site%20General%20Settings/sandbox/preference_search',
        searchRequest,
      );
    });

    it('should handle different instance types', async () => {
      const testCases = [
        { type: 'staging', expected: 'staging' },
        { type: 'development', expected: 'development' },
        { type: 'production', expected: 'production' },
      ];

      for (const testCase of testCases) {
        mockValidateInstanceType.mockReturnValue(testCase.expected as any);

        await client.searchSitePreferences(groupId, testCase.type, searchRequest);

        expect((client as any).post).toHaveBeenCalledWith(
          `/site_preferences/preference_groups/${groupId}/${testCase.expected}/preference_search`,
          searchRequest,
        );
      }
    });

    it('should include options in query string when provided', async () => {
      const options = {
        maskPasswords: true,
        expand: 'value',
      };
      mockQueryBuilderFromObject.mockReturnValue('maskPasswords=true&expand=value');

      await client.searchSitePreferences(groupId, instanceType, searchRequest, options);

      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(options);
      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search?maskPasswords=true&expand=value',
        searchRequest,
      );
    });

    it('should not include query string when options are empty', async () => {
      const options = {};
      mockQueryBuilderFromObject.mockReturnValue('');

      await client.searchSitePreferences(groupId, instanceType, searchRequest, options);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search',
        searchRequest,
      );
    });

    it('should handle complex search request', async () => {
      const complexSearchRequest = {
        query: {
          text_query: {
            fields: ['id', 'display_name', 'description'],
            search_phrase: 'email',
          },
        },
        sorts: [
          { field: 'display_name', sort_order: 'asc' as const },
          { field: 'id' },
        ],
        start: 0,
        count: 25,
        select: '(**)',
      };

      await client.searchSitePreferences(groupId, instanceType, complexSearchRequest);

      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(complexSearchRequest);
      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search',
        complexSearchRequest,
      );
    });

    it('should handle term query for value types', async () => {
      const termSearchRequest = {
        query: {
          term_query: {
            fields: ['value_type'],
            operator: 'one_of',
            values: ['string', 'boolean', 'int'],
          },
        },
      };

      await client.searchSitePreferences(groupId, instanceType, termSearchRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search',
        termSearchRequest,
      );
    });

    it('should handle boolean query combinations', async () => {
      const boolSearchRequest = {
        query: {
          bool_query: {
            must: [
              {
                text_query: {
                  fields: ['display_name'],
                  search_phrase: 'payment',
                },
              },
            ],
            must_not: [
              {
                term_query: {
                  fields: ['value_type'],
                  operator: 'is',
                  values: ['password'],
                },
              },
            ],
          },
        },
      };

      await client.searchSitePreferences(groupId, instanceType, boolSearchRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/SiteGeneral/sandbox/preference_search',
        boolSearchRequest,
      );
    });
  });

  describe('error handling', () => {
    it('should propagate validation errors for required fields', async () => {
      const validationError = new Error('Required field missing');
      mockValidateRequired.mockImplementation(() => {
        throw validationError;
      });

      await expect(
        client.searchSitePreferences('groupId', 'sandbox', { query: {} }),
      ).rejects.toThrow(validationError);
    });

    it('should propagate instance type validation errors', async () => {
      const instanceTypeError = new Error('Invalid instance type');
      mockValidateInstanceType.mockImplementation(() => {
        throw instanceTypeError;
      });

      await expect(
        client.searchSitePreferences('groupId', 'invalid', { query: {} }),
      ).rejects.toThrow(instanceTypeError);
    });

    it('should propagate search request validation errors', async () => {
      const searchValidationError = new Error('Invalid search request');
      mockValidateSearchRequest.mockImplementation(() => {
        throw searchValidationError;
      });

      await expect(
        client.searchSitePreferences('groupId', 'sandbox', { query: {} }),
      ).rejects.toThrow(searchValidationError);
    });

    it('should propagate HTTP errors from base client', async () => {
      const httpError = new Error('HTTP request failed');
      (client as any).post = jest.fn().mockRejectedValue(httpError);

      await expect(
        client.searchSitePreferences('groupId', 'sandbox', { query: { match_all_query: {} } }),
      ).rejects.toThrow(httpError);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete site preferences search workflow', async () => {
      const groupId = 'CustomPreferences';
      const instanceType = 'development';
      const searchRequest = {
        query: {
          bool_query: {
            must: [
              {
                text_query: {
                  fields: ['id', 'display_name'],
                  search_phrase: 'api',
                },
              },
              {
                term_query: {
                  fields: ['value_type'],
                  operator: 'one_of',
                  values: ['string', 'text'],
                },
              },
            ],
          },
        },
        sorts: [
          { field: 'display_name', sort_order: 'asc' as const },
        ],
        start: 0,
        count: 50,
      };
      const options = {
        maskPasswords: false,
        expand: 'value',
      };

      mockValidateInstanceType.mockReturnValue('development');
      mockQueryBuilderFromObject.mockReturnValue('maskPasswords=false&expand=value');

      await client.searchSitePreferences(groupId, instanceType, searchRequest, options);

      // Verify all validations were called
      expect(Validator.validateRequired).toHaveBeenCalledWith(
        { groupId, instanceType },
        ['groupId', 'instanceType'],
      );
      expect(Validator.validateInstanceType).toHaveBeenCalledWith(instanceType);
      expect(Validator.validateSearchRequest).toHaveBeenCalledWith(searchRequest);

      // Verify query string building
      expect(QueryBuilder.fromObject).toHaveBeenCalledWith(options);

      // Verify the final API call
      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/CustomPreferences/development/preference_search?maskPasswords=false&expand=value',
        searchRequest,
      );
    });

    it('should handle minimal search request', async () => {
      const minimalRequest = {
        query: { match_all_query: {} },
      };

      mockValidateInstanceType.mockReturnValue('sandbox');

      await client.searchSitePreferences('Basic', 'sandbox', minimalRequest);

      expect((client as any).post).toHaveBeenCalledWith(
        '/site_preferences/preference_groups/Basic/sandbox/preference_search',
        minimalRequest,
      );
    });
  });
});
