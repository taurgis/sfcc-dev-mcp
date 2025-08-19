/**
 * Tests for OCAPICodeVersionsClient
 * Tests code version management functionality
 */

import { OCAPICodeVersionsClient } from '../src/clients/ocapi/code-versions-client.js';
import { TokenManager } from '../src/clients/base/oauth-token.js';
import { OCAPIConfig } from '../src/types/types.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock TokenManager
jest.mock('../src/clients/base/oauth-token.js');

// Mock Logger
jest.mock('../src/utils/logger.js');

// Mock BaseHttpClient
jest.mock('../src/clients/base/http-client.js');

// Mock Validator
jest.mock('../src/utils/validator.js');

describe('OCAPICodeVersionsClient', () => {
  let client: OCAPICodeVersionsClient;
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

    client = new OCAPICodeVersionsClient(mockConfig);
  });

  describe('getCodeVersions', () => {
    it('should make GET request to /code_versions endpoint', async () => {
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

      // Mock the get method from BaseHttpClient
      const mockGet = jest.fn().mockResolvedValue(mockCodeVersions);
      (client as any).get = mockGet;

      const result = await client.getCodeVersions();

      expect(mockGet).toHaveBeenCalledWith('/code_versions');
      expect(result).toBe(mockCodeVersions);
    });
  });

  describe('activateCodeVersion', () => {
    it('should make PATCH request to activate code version', async () => {
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

      // Mock the patch method from BaseHttpClient
      const mockPatch = jest.fn().mockResolvedValue(mockActivatedVersion);
      (client as any).patch = mockPatch;

      const codeVersionId = 'version2';
      const resourceState = 'resource-state-12345';
      const result = await client.activateCodeVersion(codeVersionId, resourceState);

      expect(mockPatch).toHaveBeenCalledWith('/code_versions/version2', {
        _resource_state: resourceState,
        active: true,
      });
      expect(result).toBe(mockActivatedVersion);
    });

    it('should validate required parameters', async () => {
      // Import the actual validator to test parameter validation
      const { Validator } = await import('../src/utils/validator.js');
      const mockValidateRequired = jest.fn();
      (Validator as any).validateRequired = mockValidateRequired;

      const codeVersionId = 'version2';
      const resourceState = 'resource-state-12345';

      // Mock the patch method
      const mockPatch = jest.fn().mockResolvedValue({});
      (client as any).patch = mockPatch;

      await client.activateCodeVersion(codeVersionId, resourceState);

      expect(mockValidateRequired).toHaveBeenCalledWith(
        { codeVersionId, resourceState },
        ['codeVersionId', 'resourceState'],
      );
    });
  });
});
