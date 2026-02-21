/**
 * OCAPI System Objects Client
 *
 * This module handles all SFCC system object related operations including
 * object definitions, attribute definitions, and attribute groups.
 */

import { OCAPIConfig } from '../../types/types.js';
import { OCAPIAuthClient } from '../base/ocapi-auth-client.js';
import { QueryBuilder } from '../../utils/query-builder.js';
import { Validator } from '../../utils/validator.js';
import { buildOCAPIBaseUrl } from '../../utils/ocapi-url-builder.js';
import { OCAPISearchRequest } from '../../types/ocapi-search.js';

/**
 * Interface for common query parameters
 */
interface BaseQueryParams {
  start?: number;
  count?: number;
  select?: string;
}

/**
 * OCAPI System Objects Client
 * Specialized client for system object operations
 */
export class OCAPISystemObjectsClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    super(config);
    // Override the baseUrl for this specialized client
    this.baseUrl = buildOCAPIBaseUrl(config);
  }

  /**
   * Get all system object definitions
   */
  async getSystemObjectDefinitions(params?: BaseQueryParams): Promise<unknown> {
    let endpoint = '/system_object_definitions';

    if (params) {
      const queryString = QueryBuilder.fromObject(params);
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Get a specific system object definition by object type
   */
  async getSystemObjectDefinition(objectType: string): Promise<unknown> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateObjectType(objectType);

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}`;
    return this.get(endpoint);
  }

  /**
   * Search for system object definitions using complex queries
   */
  async searchSystemObjectDefinitions(searchRequest: OCAPISearchRequest): Promise<unknown> {
    Validator.validateSearchRequest(searchRequest);

    const endpoint = '/system_object_definition_search';
    return this.post(endpoint, searchRequest);
  }

  /**
   * Search attribute definitions for a specific system object type
   */
  async searchSystemObjectAttributeDefinitions(
    objectType: string,
    searchRequest: OCAPISearchRequest,
  ): Promise<unknown> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateObjectType(objectType);
    Validator.validateSearchRequest(searchRequest);

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}/attribute_definition_search`;
    return this.post(endpoint, searchRequest);
  }

  /**
   * Search attribute groups for a specific system object type
   */
  async searchSystemObjectAttributeGroups(
    objectType: string,
    searchRequest: OCAPISearchRequest,
  ): Promise<unknown> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateObjectType(objectType);
    Validator.validateSearchRequest(searchRequest);

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}/attribute_group_search`;
    return this.post(endpoint, searchRequest);
  }

  /**
   * Search attribute definitions for a specific custom object type
   */
  async searchCustomObjectAttributeDefinitions(
    objectType: string,
    searchRequest: OCAPISearchRequest,
  ): Promise<unknown> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateSearchRequest(searchRequest);

    const endpoint = `/custom_object_definitions/${encodeURIComponent(objectType)}/attribute_definition_search`;
    return this.post(endpoint, searchRequest);
  }
}
