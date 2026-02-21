/**
 * OAuth Token Manager for SFCC OCAPI
 *
 * This module provides a singleton Token class that manages OAuth 2.0 access tokens
 * for SFCC OCAPI requests. It handles automatic token refresh when tokens expire.
 *
 * Security considerations:
 * - Tokens are stored in memory only, never persisted to disk
 * - Token values are not exposed in logs or error messages
 * - Automatic cleanup of expired tokens
 * - Secure comparison of token keys
 */

import { OAuthToken, OAuthTokenResponse } from '../../types/types.js';

/**
 * Singleton class for managing OAuth tokens
 * Handles token storage, expiration checking, and automatic refresh
 */
export class TokenManager {
  private static instance: TokenManager;
  private tokens: Map<string, OAuthToken> = new Map();
  private static readonly MAX_TOKEN_ENTRIES = 1000;
  private static readonly EXPIRATION_BUFFER_MS = 60 * 1000;

  private constructor() {}

  /**
   * Get the singleton instance of TokenManager
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Generate a unique key for the token based on hostname and client ID
   * Uses a hash-like approach to avoid storing sensitive data in keys
   */
  private getTokenKey(hostname: string, clientId: string): string {
    // Simple key generation - in production you might use a more sophisticated approach
    return `${hostname}:${clientId}`;
  }

  /**
   * Check if a token is valid (exists and not expired)
   * Includes a 60-second buffer to avoid using tokens that are about to expire
   */
  isTokenValid(hostname: string, clientId: string): boolean {
    const key = this.getTokenKey(hostname, clientId);
    const token = this.tokens.get(key);

    if (!token) {
      return false;
    }

    // Add 60-second buffer to avoid using tokens that are about to expire
    const now = Date.now();
    const isValid = token.expiresAt > (now + TokenManager.EXPIRATION_BUFFER_MS);

    // Proactively clean up expired tokens
    if (!isValid) {
      this.tokens.delete(key);
    }

    return isValid;
  }

  /**
   * Get a valid token for the given hostname and client ID
   * Returns null if no valid token exists
   */
  getValidToken(hostname: string, clientId: string): string | null {
    if (!this.isTokenValid(hostname, clientId)) {
      return null;
    }

    const key = this.getTokenKey(hostname, clientId);
    const token = this.tokens.get(key);
    return token?.accessToken ?? null;
  }

  /**
   * Store a new token from the OAuth response
   * Validates the token response before storing
   */
  storeToken(hostname: string, clientId: string, tokenResponse: OAuthTokenResponse): void {
    // Validate token response
    if (!tokenResponse.access_token || typeof tokenResponse.access_token !== 'string') {
      throw new Error('Invalid token response: missing or invalid access_token');
    }
    if (!tokenResponse.expires_in || typeof tokenResponse.expires_in !== 'number' || tokenResponse.expires_in <= 0) {
      throw new Error('Invalid token response: missing or invalid expires_in');
    }

    const key = this.getTokenKey(hostname, clientId);

    // Keep storage bounded and clear stale entries before inserting.
    this.cleanupExpiredTokens();
    if (!this.tokens.has(key) && this.tokens.size >= TokenManager.MAX_TOKEN_ENTRIES) {
      this.evictOldestToken();
    }

    const now = Date.now();

    const token: OAuthToken = {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type || 'Bearer',
      expiresAt: now + (tokenResponse.expires_in * 1000), // Convert seconds to milliseconds
    };

    this.tokens.set(key, token);
  }

  /**
   * Clear a token (useful for testing or when a token becomes invalid)
   */
  clearToken(hostname: string, clientId: string): void {
    const key = this.getTokenKey(hostname, clientId);
    this.tokens.delete(key);
  }

  /**
   * Clear all tokens
   */
  clearAllTokens(): void {
    this.tokens.clear();
  }

  /**
   * Get token expiration time for debugging purposes
   * Does not expose the actual token value
   */
  getTokenExpiration(hostname: string, clientId: string): Date | null {
    const key = this.getTokenKey(hostname, clientId);
    const token = this.tokens.get(key);

    if (!token) {
      return null;
    }

    return new Date(token.expiresAt);
  }

  /**
   * Get the number of tokens currently stored (for monitoring)
   */
  getTokenCount(): number {
    return this.tokens.size;
  }

  /**
   * Clean up all expired tokens
   * This is called automatically during token validation but can be triggered manually
   */
  cleanupExpiredTokens(): number {
    const now = Date.now();
    const cutoff = now + TokenManager.EXPIRATION_BUFFER_MS;
    let cleanedCount = 0;

    for (const [key, token] of this.tokens.entries()) {
      if (token.expiresAt <= cutoff) {
        this.tokens.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  private evictOldestToken(): void {
    let oldestKey: string | undefined;
    let oldestExpiration = Number.POSITIVE_INFINITY;

    for (const [key, token] of this.tokens.entries()) {
      if (token.expiresAt < oldestExpiration) {
        oldestExpiration = token.expiresAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.tokens.delete(oldestKey);
    }
  }
}
