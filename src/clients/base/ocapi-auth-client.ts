/**
 * OCAPI Authentication Client
 *
 * This module handles OAuth 2.0 authentication specifically for SFCC OCAPI requests.
 * It extends the base HTTP client with OCAPI-specific authentication logic.
 */

import { OCAPIConfig, OAuthTokenResponse } from '../../types/types.js';
import { TokenManager } from '../../auth/oauth-token.js';
import { BaseHttpClient } from './http-client.js';

// OCAPI authentication constants
const OCAPI_AUTH_CONSTANTS = {
  AUTH_URL: 'https://account.demandware.com/dwsso/oauth2/access_token',
  GRANT_TYPE: 'client_credentials',
  FORM_CONTENT_TYPE: 'application/x-www-form-urlencoded',
} as const;

/**
 * OCAPI Authentication Client
 * Handles OAuth 2.0 Client Credentials flow for OCAPI access
 */
export class OCAPIAuthClient extends BaseHttpClient {
  private config: OCAPIConfig;
  private tokenManager: TokenManager;

  constructor(config: OCAPIConfig) {
    super('', 'OCAPIAuthClient'); // Initialize BaseHttpClient with logger
    this.config = config;
    this.tokenManager = TokenManager.getInstance();
  }

  /**
   * Get authentication headers for OCAPI requests
   */
  protected async getAuthHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  /**
   * Handle authentication errors by clearing the stored token
   */
  protected async handleAuthError(): Promise<void> {
    this.logger.debug('Clearing token due to authentication error');
    this.tokenManager.clearToken(this.config.hostname, this.config.clientId);
  }

  /**
   * Get a valid OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    this.logger.debug('Attempting to get access token');

    // Check if we have a valid token first
    const existingToken = this.tokenManager.getValidToken(this.config.hostname, this.config.clientId);
    if (existingToken) {
      this.logger.debug('Using existing valid token');
      return existingToken;
    }

    this.logger.debug('No valid token found, requesting new token');
    return this.requestNewToken();
  }

  /**
   * Request a new OAuth token from SFCC
   */
  private async requestNewToken(): Promise<string> {
    // Create Basic Auth header using client credentials
    const credentials = `${this.config.clientId}:${this.config.clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    try {
      const response = await fetch(OCAPI_AUTH_CONSTANTS.AUTH_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': OCAPI_AUTH_CONSTANTS.FORM_CONTENT_TYPE,
        },
        body: `grant_type=${OCAPI_AUTH_CONSTANTS.GRANT_TYPE}`,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokenResponse: OAuthTokenResponse = await response.json();
      this.logger.debug('Successfully obtained new access token');

      // Store the token for future use
      this.tokenManager.storeToken(this.config.hostname, this.config.clientId, tokenResponse);

      return tokenResponse.access_token;
    } catch (error) {
      this.logger.error(`Failed to get access token: ${error}`);
      throw new Error(`Failed to get access token: ${error}`);
    }
  }

  /**
   * Get current token expiration for debugging
   */
  getTokenExpiration(): Date | null {
    return this.tokenManager.getTokenExpiration(this.config.hostname, this.config.clientId);
  }

  /**
   * Force refresh the token
   */
  async refreshToken(): Promise<void> {
    this.logger.debug('Forcing token refresh');
    this.tokenManager.clearToken(this.config.hostname, this.config.clientId);
    await this.getAccessToken();
    this.logger.debug('Token refresh completed');
  }
}
