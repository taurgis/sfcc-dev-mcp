/**
 * Tests for OCAPIAuthClient
 * Tests OAuth authentication functionality for OCAPI
 */

import { OCAPIAuthClient } from '../src/clients/base/ocapi-auth-client.js';
import { TokenManager } from '../src/clients/base/oauth-token.js';
import { OCAPIConfig, OAuthTokenResponse } from '../src/types/types.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock TokenManager
jest.mock('../src/clients/base/oauth-token.js');

// Mock Logger
jest.mock('../src/utils/logger.js', () => ({
  Logger: {
    initialize: jest.fn(),
    getInstance: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
    getChildLogger: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
  },
}));

// Mock BaseHttpClient
jest.mock('../src/clients/base/http-client.js');

describe('OCAPIAuthClient', () => {
  let client: OCAPIAuthClient;
  let mockTokenManager: jest.Mocked<TokenManager>;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const mockConfig: OCAPIConfig = {
    hostname: 'test-instance.demandware.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    version: 'v21_3',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetch = fetch as jest.MockedFunction<typeof fetch>;

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

    client = new OCAPIAuthClient(mockConfig);

    // Manually set up the logger mock since BaseHttpClient mock isn't working as expected
    (client as any).logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(client).toBeInstanceOf(OCAPIAuthClient);
      expect(TokenManager.getInstance).toHaveBeenCalled();
    });
  });

  describe('getAuthHeaders', () => {
    it('should return Bearer token in auth headers', async () => {
      const mockToken = 'mock-access-token';
      mockTokenManager.getValidToken.mockReturnValue(mockToken);

      const headers = await (client as any).getAuthHeaders();

      expect(headers).toEqual({
        'Authorization': 'Bearer mock-access-token',
      });
      expect(mockTokenManager.getValidToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
      );
    });

    it('should request new token when no valid token exists', async () => {
      const newToken = 'new-access-token';
      const tokenResponse: OAuthTokenResponse = {
        access_token: newToken,
        token_type: 'bearer',
        expires_in: 3600,
      };

      mockTokenManager.getValidToken.mockReturnValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => tokenResponse,
      } as Response);

      const headers = await (client as any).getAuthHeaders();

      expect(headers).toEqual({
        'Authorization': 'Bearer new-access-token',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://account.demandware.com/dwsso/oauth2/access_token',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${mockConfig.clientId}:${mockConfig.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        },
      );
      expect(mockTokenManager.storeToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
        tokenResponse,
      );
    });

    it('should handle OAuth request failure', async () => {
      mockTokenManager.getValidToken.mockReturnValue(null);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid credentials',
      } as Response);

      await expect((client as any).getAuthHeaders()).rejects.toThrow(
        'Failed to get access token: Error: OAuth authentication failed: 401 Unauthorized - Invalid credentials',
      );
    });

    it('should handle network errors during token request', async () => {
      mockTokenManager.getValidToken.mockReturnValue(null);
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect((client as any).getAuthHeaders()).rejects.toThrow(
        'Failed to get access token: Error: Network error',
      );
    });
  });

  describe('handleAuthError', () => {
    it('should clear token when handling auth error', async () => {
      await (client as any).handleAuthError();

      expect(mockTokenManager.clearToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
      );
    });
  });

  describe('getTokenExpiration', () => {
    it('should return token expiration from TokenManager', () => {
      const mockExpiration = new Date('2025-12-31T23:59:59Z');
      mockTokenManager.getTokenExpiration.mockReturnValue(mockExpiration);

      const result = client.getTokenExpiration();

      expect(result).toBe(mockExpiration);
      expect(mockTokenManager.getTokenExpiration).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
      );
    });

    it('should return null when no token exists', () => {
      mockTokenManager.getTokenExpiration.mockReturnValue(null);

      const result = client.getTokenExpiration();

      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should clear token and request new one', async () => {
      const newToken = 'refreshed-token';
      const tokenResponse: OAuthTokenResponse = {
        access_token: newToken,
        token_type: 'bearer',
        expires_in: 3600,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => tokenResponse,
      } as Response);

      await client.refreshToken();

      expect(mockTokenManager.clearToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
      );
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle refresh token failure', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid refresh',
      } as Response);

      await expect(client.refreshToken()).rejects.toThrow(
        'Failed to get access token',
      );
    });
  });

  describe('token management flow', () => {
    it('should use existing token when valid', async () => {
      const existingToken = 'existing-valid-token';
      mockTokenManager.getValidToken.mockReturnValue(existingToken);

      const headers = await (client as any).getAuthHeaders();

      expect(headers).toEqual({
        'Authorization': 'Bearer existing-valid-token',
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should store new token after successful request', async () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'new-token',
        token_type: 'bearer',
        expires_in: 7200,
      };

      mockTokenManager.getValidToken.mockReturnValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => tokenResponse,
      } as Response);

      await (client as any).getAuthHeaders();

      expect(mockTokenManager.storeToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
        tokenResponse,
      );
    });
  });
});
