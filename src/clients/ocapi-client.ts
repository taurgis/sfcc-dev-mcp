/**
 * OCAPI Client for Salesforce Commerce Cloud
 *
 * This module provides a unified interface for making authenticated requests to SFCC's Open Commerce API (OCAPI).
 * It orchestrates specialized client modules for different domain areas while maintaining backward compatibility.
 */

import { OCAPIConfig } from '../types/types.js';
import { OCAPISystemObjectsClient } from './ocapi/system-objects-client.js';
import { OCAPISitePreferencesClient } from './ocapi/site-preferences-client.js';
import { OCAPICodeVersionsClient } from './ocapi/code-versions-client.js';
import { OCAPIAuthClient } from './base/ocapi-auth-client.js';
import { Logger } from '../utils/logger.js';

// Create a logger instance for this module
const logger = new Logger('OCAPIClient');

/**
 * Interface for common query parameters used across multiple endpoints
 */
interface BaseQueryParams {
  start?: number;
  count?: number;
  select?: string;
}

/**
 * Interface for search request structure used in multiple search endpoints
 */
interface SearchRequest {
  query?: {
    text_query?: {
      fields: string[];
      search_phrase: string;
    };
    term_query?: {
      fields: string[];
      operator: string;
      values: any[];
    };
    filtered_query?: {
      filter: any;
      query: any;
    };
    bool_query?: {
      must?: any[];
      must_not?: any[];
      should?: any[];
    };
    match_all_query?: {};
  };
  sorts?: Array<{
    field: string;
    sort_order?: 'asc' | 'desc';
  }>;
  start?: number;
  count?: number;
  select?: string;
}

/**
 * OCAPI Client - Unified interface for SFCC OCAPI operations
 *
 * This class serves as a facade that orchestrates specialized client modules:
 * - SystemObjectsClient: Handles system object definitions and attributes
 * - SitePreferencesClient: Manages site preference operations
 * - CodeVersionsClient: Manages code version operations
 * - AuthClient: Manages OAuth authentication and token lifecycle
 */
export class OCAPIClient {
  // Specialized client modules
  public readonly systemObjects: OCAPISystemObjectsClient;
  public readonly sitePreferences: OCAPISitePreferencesClient;
  public readonly codeVersions: OCAPICodeVersionsClient;
  private readonly authClient: OCAPIAuthClient;

  constructor(config: OCAPIConfig) {
    logger.debug(`Initializing OCAPI client for hostname: ${config.hostname}`);

    const finalConfig = {
      version: 'v21_3',
      ...config,
    };

    // Initialize specialized clients
    this.systemObjects = new OCAPISystemObjectsClient(finalConfig);
    this.sitePreferences = new OCAPISitePreferencesClient(finalConfig);
    this.codeVersions = new OCAPICodeVersionsClient(finalConfig);
    this.authClient = new OCAPIAuthClient(finalConfig);

    logger.debug('OCAPI client initialized with specialized modules');
  }

  // =============================================================================
  // System Objects API - Delegated to SystemObjectsClient
  // =============================================================================

  /**
   * Get all system object definitions
   */
  async getSystemObjectDefinitions(params?: BaseQueryParams): Promise<any> {
    return this.systemObjects.getSystemObjectDefinitions(params);
  }

  /**
   * Get a specific system object definition by object type
   */
  async getSystemObjectDefinition(objectType: string): Promise<any> {
    return this.systemObjects.getSystemObjectDefinition(objectType);
  }

  /**
   * Search for system object definitions using complex queries
   */
  async searchSystemObjectDefinitions(searchRequest: SearchRequest): Promise<any> {
    return this.systemObjects.searchSystemObjectDefinitions(searchRequest);
  }

  /**
   * Search attribute definitions for a specific system object type using complex queries
   */
  async searchSystemObjectAttributeDefinitions(
    objectType: string,
    searchRequest: SearchRequest,
  ): Promise<any> {
    return this.systemObjects.searchSystemObjectAttributeDefinitions(objectType, searchRequest);
  }

  /**
   * Search attribute groups for a specific system object type
   */
  async searchSystemObjectAttributeGroups(
    objectType: string,
    searchRequest: SearchRequest,
  ): Promise<any> {
    return this.systemObjects.searchSystemObjectAttributeGroups(objectType, searchRequest);
  }

  /**
   * Search attribute definitions for a specific custom object type using complex queries
   */
  async searchCustomObjectAttributeDefinitions(
    objectType: string,
    searchRequest: SearchRequest,
  ): Promise<any> {
    return this.systemObjects.searchCustomObjectAttributeDefinitions(objectType, searchRequest);
  }

  // =============================================================================
  // Site Preferences API - Delegated to SitePreferencesClient
  // =============================================================================

  /**
   * Search site preferences across sites in the specified preference group and instance
   */
  async searchSitePreferences(
    groupId: string,
    instanceType: string,
    searchRequest: SearchRequest,
    options?: {
      maskPasswords?: boolean;
      expand?: string;
    },
  ): Promise<any> {
    return this.sitePreferences.searchSitePreferences(groupId, instanceType, searchRequest, options);
  }

  // =============================================================================
  // Code Versions API - Delegated to CodeVersionsClient
  // =============================================================================

  /**
   * Get all code versions from the SFCC instance
   *
   * @returns {Promise<any>} Code version result with data array containing version information
   */
  async getCodeVersions(): Promise<any> {
    return this.codeVersions.getCodeVersions();
  }

  /**
   * Activate a specific code version on the SFCC instance
   *
   * @param {string} codeVersionId - The ID of the code version to activate
   * @param {string} codeVersionId - The ID of the code version to activate
   * @returns {Promise<any>} Updated code version object
   */
  async activateCodeVersion(codeVersionId: string): Promise<any> {
    return this.codeVersions.activateCodeVersion(codeVersionId);
  }

  // =============================================================================
  // Authentication & Token Management - Delegated to AuthClient
  // =============================================================================

  /**
   * Get current token expiration for debugging
   */
  getTokenExpiration(): Date | null {
    return this.authClient.getTokenExpiration();
  }

  /**
   * Force refresh the token (useful for testing)
   */
  async refreshToken(): Promise<void> {
    return this.authClient.refreshToken();
  }
}
