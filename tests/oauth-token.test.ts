import { TokenManager } from '../src/oauth-token';
import { OAuthTokenResponse } from '../src/types';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  const testHostname = 'test-instance.demandware.net';
  const testClientId = 'test-client-id';
  const testClientId2 = 'test-client-id-2';
  const testHostname2 = 'test-instance-2.demandware.net';

  beforeEach(() => {
    // Get a fresh instance and clear all tokens
    tokenManager = TokenManager.getInstance();
    tokenManager.clearAllTokens();
  });

  afterEach(() => {
    // Clean up after each test
    tokenManager.clearAllTokens();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = TokenManager.getInstance();
      const instance2 = TokenManager.getInstance();
      const instance3 = TokenManager.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(tokenManager);
    });

    it('should maintain state across getInstance calls', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'test-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      const instance1 = TokenManager.getInstance();
      instance1.storeToken(testHostname, testClientId, tokenResponse);

      const instance2 = TokenManager.getInstance();
      expect(instance2.getValidToken(testHostname, testClientId)).toBe('test-token');
    });
  });

  describe('storeToken()', () => {
    it('should store a token correctly', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'stored-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);

      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('stored-token');
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
    });

    it('should calculate expiration time correctly', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'expiration-test-token',
        token_type: 'bearer',
        expires_in: 3600 // 1 hour
      };

      const beforeStore = Date.now();
      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      const afterStore = Date.now();

      const expiration = tokenManager.getTokenExpiration(testHostname, testClientId);
      expect(expiration).toBeInstanceOf(Date);

      if (expiration) {
        const expirationTime = expiration.getTime();
        const expectedMinExpiration = beforeStore + (3600 * 1000);
        const expectedMaxExpiration = afterStore + (3600 * 1000);

        expect(expirationTime).toBeGreaterThanOrEqual(expectedMinExpiration);
        expect(expirationTime).toBeLessThanOrEqual(expectedMaxExpiration);
      }
    });

    it('should overwrite existing tokens for the same hostname/clientId', () => {
      const firstToken: OAuthTokenResponse = {
        access_token: 'first-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      const secondToken: OAuthTokenResponse = {
        access_token: 'second-token',
        token_type: 'bearer',
        expires_in: 7200
      };

      tokenManager.storeToken(testHostname, testClientId, firstToken);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('first-token');

      tokenManager.storeToken(testHostname, testClientId, secondToken);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('second-token');
    });

    it('should store different tokens for different hostname/clientId combinations', () => {
      const token1: OAuthTokenResponse = {
        access_token: 'token-1',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token2: OAuthTokenResponse = {
        access_token: 'token-2',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token3: OAuthTokenResponse = {
        access_token: 'token-3',
        token_type: 'bearer',
        expires_in: 3600
      };

      // Same hostname, different clientId
      tokenManager.storeToken(testHostname, testClientId, token1);
      tokenManager.storeToken(testHostname, testClientId2, token2);

      // Different hostname, same clientId
      tokenManager.storeToken(testHostname2, testClientId, token3);

      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('token-1');
      expect(tokenManager.getValidToken(testHostname, testClientId2)).toBe('token-2');
      expect(tokenManager.getValidToken(testHostname2, testClientId)).toBe('token-3');
    });
  });

  describe('getValidToken()', () => {
    it('should return null for non-existent tokens', () => {
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
      expect(tokenManager.getValidToken('nonexistent.host', 'nonexistent-client')).toBeNull();
    });

    it('should return valid tokens', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'valid-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('valid-token');
    });

    it('should return null for expired tokens', async () => {
      const shortLivedToken: OAuthTokenResponse = {
        access_token: 'short-lived-token',
        token_type: 'bearer',
        expires_in: 0.001 // Very short expiration (1ms)
      };

      tokenManager.storeToken(testHostname, testClientId, shortLivedToken);

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
    });

    it('should return null for tokens that expire within 60-second buffer', () => {
      // Create a token that expires in 30 seconds (within the 60-second buffer)
      const soonToExpireToken: OAuthTokenResponse = {
        access_token: 'soon-to-expire-token',
        token_type: 'bearer',
        expires_in: 30 // 30 seconds
      };

      tokenManager.storeToken(testHostname, testClientId, soonToExpireToken);

      // Should return null because it's within the 60-second buffer
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
    });

    it('should return tokens that expire beyond the 60-second buffer', () => {
      // Create a token that expires in 120 seconds (beyond the 60-second buffer)
      const validToken: OAuthTokenResponse = {
        access_token: 'valid-token-beyond-buffer',
        token_type: 'bearer',
        expires_in: 120 // 2 minutes
      };

      tokenManager.storeToken(testHostname, testClientId, validToken);

      // Should return the token because it expires beyond the 60-second buffer
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('valid-token-beyond-buffer');
    });
  });

  describe('isTokenValid()', () => {
    it('should return false for non-existent tokens', () => {
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
      expect(tokenManager.isTokenValid('nonexistent.host', 'nonexistent-client')).toBe(false);
    });

    it('should return true for valid tokens', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'valid-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
    });

    it('should return false for expired tokens', async () => {
      const shortLivedToken: OAuthTokenResponse = {
        access_token: 'expired-token',
        token_type: 'bearer',
        expires_in: 0.001 // Very short expiration
      };

      tokenManager.storeToken(testHostname, testClientId, shortLivedToken);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
    });

    it('should return false for tokens within 60-second expiration buffer', () => {
      const soonToExpireToken: OAuthTokenResponse = {
        access_token: 'buffer-test-token',
        token_type: 'bearer',
        expires_in: 30 // 30 seconds - within buffer
      };

      tokenManager.storeToken(testHostname, testClientId, soonToExpireToken);
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
    });

    it('should return true for tokens beyond 60-second expiration buffer', () => {
      const validToken: OAuthTokenResponse = {
        access_token: 'buffer-safe-token',
        token_type: 'bearer',
        expires_in: 120 // 2 minutes - beyond buffer
      };

      tokenManager.storeToken(testHostname, testClientId, validToken);
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
    });

    it('should handle edge case of exactly 60-second expiration', () => {
      const exactBufferToken: OAuthTokenResponse = {
        access_token: 'exact-buffer-token',
        token_type: 'bearer',
        expires_in: 60 // Exactly 60 seconds
      };

      tokenManager.storeToken(testHostname, testClientId, exactBufferToken);
      // Should be false because 60 seconds is not > 60 seconds (buffer)
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
    });

    it('should handle edge case just beyond 60-second buffer', () => {
      const justBeyondBufferToken: OAuthTokenResponse = {
        access_token: 'just-beyond-buffer-token',
        token_type: 'bearer',
        expires_in: 61 // 61 seconds - just beyond buffer
      };

      tokenManager.storeToken(testHostname, testClientId, justBeyondBufferToken);
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
    });
  });

  describe('clearToken()', () => {
    it('should remove specific tokens', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'to-be-cleared',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('to-be-cleared');

      tokenManager.clearToken(testHostname, testClientId);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
    });

    it('should not affect other tokens when clearing specific token', () => {
      const token1: OAuthTokenResponse = {
        access_token: 'token-1',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token2: OAuthTokenResponse = {
        access_token: 'token-2',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, token1);
      tokenManager.storeToken(testHostname, testClientId2, token2);

      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('token-1');
      expect(tokenManager.getValidToken(testHostname, testClientId2)).toBe('token-2');

      tokenManager.clearToken(testHostname, testClientId);

      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
      expect(tokenManager.getValidToken(testHostname, testClientId2)).toBe('token-2');
    });

    it('should handle clearing non-existent tokens gracefully', () => {
      // Should not throw when clearing non-existent token
      expect(() => {
        tokenManager.clearToken(testHostname, testClientId);
      }).not.toThrow();

      expect(() => {
        tokenManager.clearToken('nonexistent.host', 'nonexistent-client');
      }).not.toThrow();
    });
  });

  describe('clearAllTokens()', () => {
    it('should remove all stored tokens', () => {
      const token1: OAuthTokenResponse = {
        access_token: 'token-1',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token2: OAuthTokenResponse = {
        access_token: 'token-2',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token3: OAuthTokenResponse = {
        access_token: 'token-3',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, token1);
      tokenManager.storeToken(testHostname, testClientId2, token2);
      tokenManager.storeToken(testHostname2, testClientId, token3);

      // Verify all tokens are stored
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('token-1');
      expect(tokenManager.getValidToken(testHostname, testClientId2)).toBe('token-2');
      expect(tokenManager.getValidToken(testHostname2, testClientId)).toBe('token-3');

      tokenManager.clearAllTokens();

      // Verify all tokens are cleared
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
      expect(tokenManager.getValidToken(testHostname, testClientId2)).toBeNull();
      expect(tokenManager.getValidToken(testHostname2, testClientId)).toBeNull();
    });

    it('should handle clearing when no tokens exist', () => {
      expect(() => {
        tokenManager.clearAllTokens();
      }).not.toThrow();

      // Should still work normally after clearing empty storage
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'after-clear-all',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('after-clear-all');
    });
  });

  describe('getTokenExpiration()', () => {
    it('should return null for non-existent tokens', () => {
      expect(tokenManager.getTokenExpiration(testHostname, testClientId)).toBeNull();
      expect(tokenManager.getTokenExpiration('nonexistent.host', 'nonexistent-client')).toBeNull();
    });

    it('should return correct expiration date for existing tokens', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'expiration-date-token',
        token_type: 'bearer',
        expires_in: 3600 // 1 hour
      };

      const beforeStore = Date.now();
      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      const afterStore = Date.now();

      const expiration = tokenManager.getTokenExpiration(testHostname, testClientId);

      expect(expiration).toBeInstanceOf(Date);
      if (expiration) {
        const expirationTime = expiration.getTime();
        const expectedMinExpiration = beforeStore + (3600 * 1000);
        const expectedMaxExpiration = afterStore + (3600 * 1000);

        expect(expirationTime).toBeGreaterThanOrEqual(expectedMinExpiration);
        expect(expirationTime).toBeLessThanOrEqual(expectedMaxExpiration);
      }
    });

    it('should return different expiration times for different tokens', () => {
      const shortToken: OAuthTokenResponse = {
        access_token: 'short-token',
        token_type: 'bearer',
        expires_in: 1800 // 30 minutes
      };

      const longToken: OAuthTokenResponse = {
        access_token: 'long-token',
        token_type: 'bearer',
        expires_in: 7200 // 2 hours
      };

      tokenManager.storeToken(testHostname, testClientId, shortToken);
      tokenManager.storeToken(testHostname, testClientId2, longToken);

      const shortExpiration = tokenManager.getTokenExpiration(testHostname, testClientId);
      const longExpiration = tokenManager.getTokenExpiration(testHostname, testClientId2);

      expect(shortExpiration).toBeInstanceOf(Date);
      expect(longExpiration).toBeInstanceOf(Date);

      if (shortExpiration && longExpiration) {
        expect(longExpiration.getTime()).toBeGreaterThan(shortExpiration.getTime());
      }
    });

    it('should return null after token is cleared', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'cleared-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      tokenManager.storeToken(testHostname, testClientId, tokenResponse);
      expect(tokenManager.getTokenExpiration(testHostname, testClientId)).toBeInstanceOf(Date);

      tokenManager.clearToken(testHostname, testClientId);
      expect(tokenManager.getTokenExpiration(testHostname, testClientId)).toBeNull();
    });
  });

  describe('Token key generation', () => {
    it('should create unique keys for different hostname/clientId combinations', () => {
      // We can't directly test the private getTokenKey method, but we can test its behavior
      const token1: OAuthTokenResponse = {
        access_token: 'unique-test-1',
        token_type: 'bearer',
        expires_in: 3600
      };

      const token2: OAuthTokenResponse = {
        access_token: 'unique-test-2',
        token_type: 'bearer',
        expires_in: 3600
      };

      // Store tokens with similar but different keys
      tokenManager.storeToken('host1.com', 'client1', token1);
      tokenManager.storeToken('host1.com', 'client2', token2);

      expect(tokenManager.getValidToken('host1.com', 'client1')).toBe('unique-test-1');
      expect(tokenManager.getValidToken('host1.com', 'client2')).toBe('unique-test-2');

      // Different hostname, same client
      tokenManager.storeToken('host2.com', 'client1', token1);
      expect(tokenManager.getValidToken('host2.com', 'client1')).toBe('unique-test-1');
      expect(tokenManager.getValidToken('host1.com', 'client1')).toBe('unique-test-1'); // Should still exist
    });

    it('should handle special characters in hostname and clientId', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'special-chars-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      const specialHostname = 'test-instance_with.special-chars.demandware.net';
      const specialClientId = 'client-id_with.special:chars';

      tokenManager.storeToken(specialHostname, specialClientId, tokenResponse);
      expect(tokenManager.getValidToken(specialHostname, specialClientId)).toBe('special-chars-token');
      expect(tokenManager.isTokenValid(specialHostname, specialClientId)).toBe(true);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero expiration time', () => {
      const zeroExpirationToken: OAuthTokenResponse = {
        access_token: 'zero-expiration-token',
        token_type: 'bearer',
        expires_in: 0
      };

      tokenManager.storeToken(testHostname, testClientId, zeroExpirationToken);

      // Should be invalid immediately due to buffer
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
    });

    it('should handle negative expiration time', () => {
      const negativeExpirationToken: OAuthTokenResponse = {
        access_token: 'negative-expiration-token',
        token_type: 'bearer',
        expires_in: -100
      };

      tokenManager.storeToken(testHostname, testClientId, negativeExpirationToken);

      // Should be invalid immediately
      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBeNull();
    });

    it('should handle very large expiration times', () => {
      const largeExpirationToken: OAuthTokenResponse = {
        access_token: 'large-expiration-token',
        token_type: 'bearer',
        expires_in: 86400 * 365 // 1 year in seconds
      };

      tokenManager.storeToken(testHostname, testClientId, largeExpirationToken);

      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('large-expiration-token');

      const expiration = tokenManager.getTokenExpiration(testHostname, testClientId);
      expect(expiration).toBeInstanceOf(Date);
    });

    it('should handle empty strings for hostname and clientId', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'empty-string-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      // Should not throw errors with empty strings
      expect(() => {
        tokenManager.storeToken('', '', tokenResponse);
      }).not.toThrow();

      expect(() => {
        tokenManager.getValidToken('', '');
      }).not.toThrow();

      expect(() => {
        tokenManager.isTokenValid('', '');
      }).not.toThrow();

      expect(() => {
        tokenManager.clearToken('', '');
      }).not.toThrow();

      expect(() => {
        tokenManager.getTokenExpiration('', '');
      }).not.toThrow();
    });

    it('should handle fractional expiration times', () => {
      const fractionalExpirationToken: OAuthTokenResponse = {
        access_token: 'fractional-expiration-token',
        token_type: 'bearer',
        expires_in: 3600.5 // 1 hour and 30 minutes
      };

      tokenManager.storeToken(testHostname, testClientId, fractionalExpirationToken);

      expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
      expect(tokenManager.getValidToken(testHostname, testClientId)).toBe('fractional-expiration-token');
    });
  });

  describe('Concurrency and state consistency', () => {
    it('should maintain consistent state with rapid operations', () => {
      const tokenResponse: OAuthTokenResponse = {
        access_token: 'rapid-ops-token',
        token_type: 'bearer',
        expires_in: 3600
      };

      // Rapid store/clear/check operations
      for (let i = 0; i < 100; i++) {
        tokenManager.storeToken(testHostname, testClientId, tokenResponse);
        expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(true);
        tokenManager.clearToken(testHostname, testClientId);
        expect(tokenManager.isTokenValid(testHostname, testClientId)).toBe(false);
      }
    });

    it('should handle multiple token storage operations correctly', () => {
      const baseToken: OAuthTokenResponse = {
        access_token: '',
        token_type: 'bearer',
        expires_in: 3600
      };

      // Store multiple tokens rapidly
      for (let i = 0; i < 50; i++) {
        const token = { ...baseToken, access_token: `token-${i}` };
        tokenManager.storeToken(testHostname, `client-${i}`, token);
      }

      // Verify all tokens are stored correctly
      for (let i = 0; i < 50; i++) {
        expect(tokenManager.getValidToken(testHostname, `client-${i}`)).toBe(`token-${i}`);
      }

      // Clear all and verify
      tokenManager.clearAllTokens();
      for (let i = 0; i < 50; i++) {
        expect(tokenManager.getValidToken(testHostname, `client-${i}`)).toBeNull();
      }
    });
  });
});
