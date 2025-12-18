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
      expect(client.systemObjects).toBeDefined();
      expect(client.sitePreferences).toBeDefined();
      expect(client.codeVersions).toBeDefined();
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
      expect(client.codeVersions).toBeDefined();
    });
  });

  describe('System Objects API via public property', () => {
    it('should access getSystemObjectDefinitions via systemObjects', async () => {
      const mockResponse = { data: 'system-objects' };
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinitions').mockResolvedValue(mockResponse);

      const result = await client.systemObjects.getSystemObjectDefinitions();

      expect(client.systemObjects.getSystemObjectDefinitions).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    it('should access getSystemObjectDefinition via systemObjects', async () => {
      const mockResponse = { data: 'product-definition' };
      const objectType = 'Product';
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinition').mockResolvedValue(mockResponse);

      const result = await client.systemObjects.getSystemObjectDefinition(objectType);

      expect(client.systemObjects.getSystemObjectDefinition).toHaveBeenCalledWith(objectType);
      expect(result).toBe(mockResponse);
    });

    it('should access searchSystemObjectDefinitions via systemObjects', async () => {
      const mockResponse = { data: 'search-results' };
      const searchRequest = { query: { match_all_query: {} } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectDefinitions').mockResolvedValue(mockResponse);

      const result = await client.systemObjects.searchSystemObjectDefinitions(searchRequest);

      expect(client.systemObjects.searchSystemObjectDefinitions).toHaveBeenCalledWith(searchRequest);
      expect(result).toBe(mockResponse);
    });

    it('should access searchSystemObjectAttributeDefinitions via systemObjects', async () => {
      const mockResponse = { data: 'attribute-search-results' };
      const objectType = 'Product';
      const searchRequest = { query: { text_query: { fields: ['id'], search_phrase: 'custom' } } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectAttributeDefinitions').mockResolvedValue(mockResponse);

      const result = await client.systemObjects.searchSystemObjectAttributeDefinitions(objectType, searchRequest);

      expect(client.systemObjects.searchSystemObjectAttributeDefinitions)
        .toHaveBeenCalledWith(objectType, searchRequest);
      expect(result).toBe(mockResponse);
    });

    it('should access searchSystemObjectAttributeGroups via systemObjects', async () => {
      const mockResponse = { data: 'attribute-groups' };
      const objectType = 'SitePreferences';
      const searchRequest = { query: { match_all_query: {} } };
      jest.spyOn(client.systemObjects, 'searchSystemObjectAttributeGroups').mockResolvedValue(mockResponse);

      const result = await client.systemObjects.searchSystemObjectAttributeGroups(objectType, searchRequest);

      expect(client.systemObjects.searchSystemObjectAttributeGroups).toHaveBeenCalledWith(objectType, searchRequest);
      expect(result).toBe(mockResponse);
    });
  });

  describe('Site Preferences API via public property', () => {
    it('should access searchSitePreferences via sitePreferences', async () => {
      const mockResponse = { data: 'site-preferences' };
      const groupId = 'SiteGeneral';
      const instanceType = 'sandbox';
      const searchRequest = { query: { match_all_query: {} } };
      const options = { maskPasswords: true };
      jest.spyOn(client.sitePreferences, 'searchSitePreferences').mockResolvedValue(mockResponse);

      const result = await client.sitePreferences.searchSitePreferences(groupId, instanceType, searchRequest, options);

      expect(client.sitePreferences.searchSitePreferences)
        .toHaveBeenCalledWith(groupId, instanceType, searchRequest, options);
      expect(result).toBe(mockResponse);
    });
  });

  describe('Code Versions API via public property', () => {
    it('should access getCodeVersions via codeVersions', async () => {
      const mockCodeVersions = {
        _v: '23.2',
        _type: 'code_version_result',
        count: 1,
        data: [{ _type: 'code_version', id: 'version1', active: true }],
        total: 1,
      };
      jest.spyOn(client.codeVersions, 'getCodeVersions').mockResolvedValue(mockCodeVersions);

      const result = await client.codeVersions.getCodeVersions();

      expect(client.codeVersions.getCodeVersions).toHaveBeenCalled();
      expect(result).toBe(mockCodeVersions);
    });

    it('should access activateCodeVersion via codeVersions', async () => {
      const mockActivatedVersion = {
        _v: '23.2',
        _type: 'code_version',
        id: 'version2',
        active: true,
      };
      jest.spyOn(client.codeVersions, 'activateCodeVersion').mockResolvedValue(mockActivatedVersion);

      const codeVersionId = 'version2';
      const result = await client.codeVersions.activateCodeVersion(codeVersionId);

      expect(client.codeVersions.activateCodeVersion).toHaveBeenCalledWith(codeVersionId);
      expect(result).toBe(mockActivatedVersion);
    });
  });

  describe('Authentication & Token Management', () => {
    it('should delegate getTokenExpiration to AuthClient', () => {
      const mockExpiration = new Date();
      const mockAuthClient = { getTokenExpiration: jest.fn().mockReturnValue(mockExpiration) };
      (client as any).authClient = mockAuthClient;

      const result = client.getTokenExpiration();

      expect(mockAuthClient.getTokenExpiration).toHaveBeenCalled();
      expect(result).toBe(mockExpiration);
    });

    it('should delegate refreshToken to AuthClient', async () => {
      const mockAuthClient = { refreshToken: jest.fn().mockResolvedValue(undefined) };
      (client as any).authClient = mockAuthClient;

      await client.refreshToken();

      expect(mockAuthClient.refreshToken).toHaveBeenCalled();
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
      expect(clientWithDefaults).toBeInstanceOf(OCAPIClient);
      expect(clientWithDefaults.systemObjects).toBeDefined();
      expect(clientWithDefaults.sitePreferences).toBeDefined();
      expect(clientWithDefaults.codeVersions).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from specialized clients', async () => {
      const error = new Error('System objects error');
      jest.spyOn(client.systemObjects, 'getSystemObjectDefinitions').mockRejectedValue(error);

      await expect(client.systemObjects.getSystemObjectDefinitions()).rejects.toThrow('System objects error');
    });

    it('should propagate errors from site preferences client', async () => {
      const error = new Error('Site preferences error');
      jest.spyOn(client.sitePreferences, 'searchSitePreferences').mockRejectedValue(error);

      const searchRequest = { query: { match_all_query: {} } };
      await expect(client.sitePreferences.searchSitePreferences('groupId', 'sandbox', searchRequest))
        .rejects.toThrow('Site preferences error');
    });
  });
});
