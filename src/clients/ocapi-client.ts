/**
 * OCAPI Client for Salesforce Commerce Cloud
 *
 * Provides access to SFCC's Open Commerce API through specialized client modules.
 * Access clients directly via public properties (systemObjects, sitePreferences, codeVersions).
 */

import { OCAPIConfig } from '../types/types.js';
import { OCAPISystemObjectsClient } from './ocapi/system-objects-client.js';
import { OCAPISitePreferencesClient } from './ocapi/site-preferences-client.js';
import { OCAPICodeVersionsClient } from './ocapi/code-versions-client.js';
import { OCAPIAuthClient } from './base/ocapi-auth-client.js';
import { Logger } from '../utils/logger.js';

/**
 * OCAPI Client - Facade for SFCC OCAPI operations
 *
 * Access specialized clients directly:
 * - systemObjects: System object definitions and attributes
 * - sitePreferences: Site preference operations
 * - codeVersions: Code version operations
 */
export class OCAPIClient {
  public readonly systemObjects: OCAPISystemObjectsClient;
  public readonly sitePreferences: OCAPISitePreferencesClient;
  public readonly codeVersions: OCAPICodeVersionsClient;
  private readonly authClient: OCAPIAuthClient;
  private logger: Logger;

  constructor(config: OCAPIConfig) {
    this.logger = Logger.getChildLogger('OCAPIClient');
    this.logger.debug(`Initializing OCAPI client for hostname: ${config.hostname}`);

    const finalConfig = { version: 'v21_3', ...config };

    this.systemObjects = new OCAPISystemObjectsClient(finalConfig);
    this.sitePreferences = new OCAPISitePreferencesClient(finalConfig);
    this.codeVersions = new OCAPICodeVersionsClient(finalConfig);
    this.authClient = new OCAPIAuthClient(finalConfig);

    this.logger.debug('OCAPI client initialized');
  }

  /** Get current token expiration for debugging */
  getTokenExpiration(): Date | null {
    return this.authClient.getTokenExpiration();
  }

  /** Force refresh the token (useful for testing) */
  async refreshToken(): Promise<void> {
    return this.authClient.refreshToken();
  }
}
