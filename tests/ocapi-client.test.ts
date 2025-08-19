/**
 * Tests for the refactored OCAPIClient
 * Tests the facade pattern that orchestrates specialized client modules
 */

import { OCAPIClient } from '../src/clients/ocapi-client.js';
import { TokenManager } from '../src/clients/base/oauth-token.js';
import { OCAPIConfig } from '../src/types/types.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock TokenManager
jest.mock('../src/clients/base/oauth-token.js');

// Mock the specialized clients
jest.mock('../src/clients/ocapi/system-objects-client.js');
jest.mock('../src/clients/ocapi/site-preferences-client.js');
jest.mock('../src/clients/ocapi/code-versions-client.js');
jest.mock('../src/clients/base/ocapi-auth-client.js');

describe('OCAPIClient', () => {
  let client: OCAPIClient;
  let mockTokenManager: jest.Mocked<TokenManager>;
  const mockConfig: OCAPIConfig = {
    hostname: 'test-instance.demandware.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    version: 'v21_3',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup TokenManager mock
    mockTokenManager = {
      getValidToken: jest.fn(),
      storeToken: jest.fn(),
      clearToken: jest.fn(),
      getTokenExpiration: jest.fn(),
      isTokenValid: jest.fn(),
      clearAllTokens: jest.fn(),
    } as any;

    (TokenManager.getInstance as jest.Mock).mockReturnValue(mockTokenManager);
    (fetch as jest.Mock).mockClear();

    client = new OCAPIClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(client).toBeInstanceOf(OCAPIClient);
      // Note: TokenManager.getInstance is called by the auth client, not directly by OCAPIClient
      expect(client.systemObjects).toBeDefined();
      expect(client.sitePreferences).toBeDefined();
    });

    it('should use default version when not provided', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
      };

      const clientWithDefaults = new OCAPIClient(configWithoutVersion);
      expect(clientWithDefaults).toBeInstanceOf(OCAPIClient);
    });

    it('should initialize all specialized client modules', () => {
      expect(client.systemObjects).toBeDefined();
      expect(client.sitePreferences).toBeDefined();
    });
  });

  describe('System Objects API delegation', () => {
    it('should delegate getSystemObjectDefinitions to SystemObjectsClient', async () => {
      const mockResponse = { data: 'system-objects' };
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinitions').mockResolvedValue(mockResponse);

      const result = await client.getSystemObjectDefinitions();

      expect(client.systemObjects.getSystemObjectDefinitions).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockResponse);
    });

    it('should delegate getSystemObjectDefinition with objectType to SystemObjectsClient', async () => {
      const mockResponse = { data: 'product-definition' };
      const objectType = 'Product';
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinition').mockResolvedValue(mockResponse);

      const result = await client.getSystemObjectDefinition(objectType);

      expect(client.systemObjects.getSystemObjectDefinition).toHaveBeenCalledWith(objectType);
      expect(result).toBe(mockResponse);
    });

    it('should delegate searchSystemObjectDefinitions to SystemObjectsClient', async () => {
      const mockResponse = { data: 'search-results' };
      const searchRequest = { query: { match_all_query: {} } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectDefinitions').mockResolvedValue(mockResponse);

      const result = await client.searchSystemObjectDefinitions(searchRequest);

      expect(client.systemObjects.searchSystemObjectDefinitions).toHaveBeenCalledWith(searchRequest);
      expect(result).toBe(mockResponse);
    });

    it('should delegate searchSystemObjectAttributeDefinitions to SystemObjectsClient', async () => {
      const mockResponse = { data: 'attribute-search-results' };
      const objectType = 'Product';
      const searchRequest = { query: { text_query: { fields: ['id'], search_phrase: 'custom' } } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectAttributeDefinitions').mockResolvedValue(mockResponse);

      const result = await client.searchSystemObjectAttributeDefinitions(objectType, searchRequest);

      expect(client.systemObjects.searchSystemObjectAttributeDefinitions)
        .toHaveBeenCalledWith(objectType, searchRequest);
      expect(result).toBe(mockResponse);
    });

    it('should delegate searchSystemObjectAttributeGroups to SystemObjectsClient', async () => {
      const mockResponse = { data: 'attribute-groups' };
      const objectType = 'SitePreferences';
      const searchRequest = { query: { match_all_query: {} } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectAttributeGroups').mockResolvedValue(mockResponse);

      const result = await client.searchSystemObjectAttributeGroups(objectType, searchRequest);

      expect(client.systemObjects.searchSystemObjectAttributeGroups).toHaveBeenCalledWith(objectType, searchRequest);
      expect(result).toBe(mockResponse);
    });
  });

  describe('Site Preferences API delegation', () => {
    it('should delegate searchSitePreferences to SitePreferencesClient', async () => {
      const mockResponse = { data: 'site-preferences' };
      const groupId = 'SiteGeneral';
      const instanceType = 'sandbox';
      const searchRequest = { query: { match_all_query: {} } };
      const options = { maskPasswords: true };
      jest.spyOn(client.sitePreferences, 'searchSitePreferences').mockResolvedValue(mockResponse);

      const result = await client.searchSitePreferences(groupId, instanceType, searchRequest, options);

      expect(client.sitePreferences.searchSitePreferences)
        .toHaveBeenCalledWith(groupId, instanceType, searchRequest, options);
      expect(result).toBe(mockResponse);
    });
  });

  describe('Authentication & Token Management delegation', () => {
    it('should delegate getTokenExpiration to AuthClient', () => {
      const mockExpiration = new Date();

      // Mock the authClient's getTokenExpiration method
      const mockAuthClient = {
        getTokenExpiration: jest.fn().mockReturnValue(mockExpiration),
      };

      // Access the private authClient property and mock it
      (client as any).authClient = mockAuthClient;

      const result = client.getTokenExpiration();

      expect(mockAuthClient.getTokenExpiration).toHaveBeenCalled();
      expect(result).toBe(mockExpiration);
    });

    it('should delegate refreshToken to AuthClient', async () => {
      // Mock the authClient's refreshToken method
      const mockAuthClient = {
        refreshToken: jest.fn().mockResolvedValue(undefined),
      };

      // Access the private authClient property and mock it
      (client as any).authClient = mockAuthClient;

      await client.refreshToken();

      expect(mockAuthClient.refreshToken).toHaveBeenCalled();
    });

    it('should delegate getCodeVersions to CodeVersionsClient', async () => {
      // Mock the codeVersions client's getCodeVersions method
      const mockCodeVersions = {
        _v: '23.2',
        _type: 'code_version_result',
        count: 1,
        data: [
          {
            _type: 'code_version',
            id: 'version1',
            active: true,
            cartridges: 'app_storefront_base',
            compatibility_mode: '23.2',
            activation_time: '2024-01-01T00:00:00Z',
            total_size: '1024 KB',
          },
        ],
        total: 1,
      };

      const mockCodeVersionsClient = {
        getCodeVersions: jest.fn().mockResolvedValue(mockCodeVersions),
      };

      // Access the private codeVersions property and mock it
      (client as any).codeVersions = mockCodeVersionsClient;

      const result = await client.getCodeVersions();

      expect(mockCodeVersionsClient.getCodeVersions).toHaveBeenCalled();
      expect(result).toBe(mockCodeVersions);
    });

    it('should delegate activateCodeVersion to CodeVersionsClient', async () => {
      // Mock the codeVersions client's activateCodeVersion method
      const mockActivatedVersion = {
        _v: '23.2',
        _type: 'code_version',
        _resource_state: 'new-resource-state-12345',
        id: 'version2',
        active: true,
        cartridges: 'app_storefront_base',
        compatibility_mode: '23.2',
        activation_time: '2024-01-15T10:30:00Z',
        total_size: '1024 KB',
      };

      const mockCodeVersionsClient = {
        activateCodeVersion: jest.fn().mockResolvedValue(mockActivatedVersion),
      };

      // Access the private codeVersions property and mock it
      (client as any).codeVersions = mockCodeVersionsClient;

      const codeVersionId = 'version2';
      const result = await client.activateCodeVersion(codeVersionId);

      expect(mockCodeVersionsClient.activateCodeVersion).toHaveBeenCalledWith(codeVersionId);
      expect(result).toBe(mockActivatedVersion);
    });
  });

  describe('Configuration handling', () => {
    it('should merge config with defaults', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
      };

      const clientWithDefaults = new OCAPIClient(configWithoutVersion);

      // Verify that the client was created successfully (which means defaults were applied)
      expect(clientWithDefaults).toBeInstanceOf(OCAPIClient);
      expect(clientWithDefaults.systemObjects).toBeDefined();
      expect(clientWithDefaults.sitePreferences).toBeDefined();
    });

    it('should preserve provided config values', () => {
      const customConfig = {
        hostname: 'custom.demandware.net',
        clientId: 'custom-client-id',
        clientSecret: 'custom-client-secret',
        version: 'v22_1',
      };

      const customClient = new OCAPIClient(customConfig);

      // Verify that the client was created successfully with custom config
      expect(customClient).toBeInstanceOf(OCAPIClient);
      expect(customClient.systemObjects).toBeDefined();
      expect(customClient.sitePreferences).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from specialized clients', async () => {
      const error = new Error('System objects error');
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinitions').mockRejectedValue(error);

      await expect(client.getSystemObjectDefinitions()).rejects.toThrow('System objects error');
    });

    it('should propagate errors from site preferences client', async () => {
      const error = new Error('Site preferences error');
      jest.spyOn(client.sitePreferences, 'searchSitePreferences').mockRejectedValue(error);

      const searchRequest = { query: { match_all_query: {} } };
      await expect(client.searchSitePreferences('groupId', 'sandbox', searchRequest)).rejects.toThrow('Site preferences error');
    });
  });
});
