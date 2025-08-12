/**
 * OAuth Token Manager for SFCC OCAPI
 *
 * This module provides a singleton Token class that manages OAuth 2.0 access tokens
 * for SFCC OCAPI requests. It handles automatic token refresh when tokens expire.
 */

import { OAuthToken, OAuthTokenResponse } from '../types/types.js';

/**
 * Singleton class for managing OAuth tokens
 * Handles token storage, expiration checking, and automatic refresh
 */
export class TokenManager {
  private static instance: TokenManager;
  private tokens: Map<string, OAuthToken> = new Map();

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
   */
  private getTokenKey(hostname: string, clientId: string): string {
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
    const expirationBuffer = 60 * 1000; // 60 seconds in milliseconds

    return token.expiresAt > (now + expirationBuffer);
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
   */
  storeToken(hostname: string, clientId: string, tokenResponse: OAuthTokenResponse): void {
    const key = this.getTokenKey(hostname, clientId);
    const now = Date.now();

    const token: OAuthToken = {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
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
   */
  getTokenExpiration(hostname: string, clientId: string): Date | null {
    const key = this.getTokenKey(hostname, clientId);
    const token = this.tokens.get(key);

    if (!token) {
      return null;
    }

    return new Date(token.expiresAt);
  }
}
