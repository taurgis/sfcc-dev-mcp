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

/**
 * Interface for common query parameters
 */
interface BaseQueryParams {
  start?: number;
  count?: number;
  select?: string;
}

/**
 * Interface for search request structure
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
 * OCAPI System Objects Client
 * Specialized client for system object operations
 */
export class OCAPISystemObjectsClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    const version = config.version ?? 'v21_3';
    const baseUrl = `https://${config.hostname}/s/-/dw/data/${version}`;

    super(config);
    // Override the baseUrl for this specialized client
    this.baseUrl = baseUrl;
  }

  /**
   * Get all system object definitions
   */
  async getSystemObjectDefinitions(params?: BaseQueryParams): Promise<any> {
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
  async getSystemObjectDefinition(objectType: string): Promise<any> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateObjectType(objectType);

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}`;
    return this.get(endpoint);
  }

  /**
   * Search for system object definitions using complex queries
   */
  async searchSystemObjectDefinitions(searchRequest: SearchRequest): Promise<any> {
    Validator.validateSearchRequest(searchRequest);

    const endpoint = '/system_object_definition_search';
    return this.post(endpoint, searchRequest);
  }

  /**
   * Search attribute definitions for a specific system object type
   */
  async searchSystemObjectAttributeDefinitions(
    objectType: string,
    searchRequest: SearchRequest,
  ): Promise<any> {
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
    searchRequest: SearchRequest,
  ): Promise<any> {
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
    searchRequest: SearchRequest,
  ): Promise<any> {
    Validator.validateRequired({ objectType }, ['objectType']);
    Validator.validateSearchRequest(searchRequest);

    const endpoint = `/custom_object_definitions/${encodeURIComponent(objectType)}/attribute_definition_search`;
    return this.post(endpoint, searchRequest);
  }
}
