/**
 * OCAPI Site Preferences Client
 *
 * This module handles all SFCC site preference related operations including
 * searching preferences across different instance types and preference groups.
 */

import { OCAPIConfig } from '../../types/types.js';
import { OCAPIAuthClient } from '../base/ocapi-auth-client.js';
import { QueryBuilder } from '../../utils/query-builder.js';
import { Validator } from '../../utils/validator.js';
import { buildOCAPIBaseUrl } from '../../utils/ocapi-url-builder.js';

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
 * Site preferences search options
 */
interface SitePreferencesOptions {
  maskPasswords?: boolean;
  expand?: string;
}

/**
 * OCAPI Site Preferences Client
 * Specialized client for site preference operations
 */
export class OCAPISitePreferencesClient extends OCAPIAuthClient {
  constructor(config: OCAPIConfig) {
    super(config);
    // Override the baseUrl for this specialized client
    this.baseUrl = buildOCAPIBaseUrl(config);
  }

  /**
   * Search site preferences across sites in the specified preference group and instance
   *
   * Allows searching for preferences by id, display_name, description, and value_type
   * Supports text queries, term queries, filtered queries, and boolean queries
   *
   * Searchable fields:
   * - id - String
   * - display_name - Localized String
   * - description - Localized String
   * - value_type - one of {
   *    string, int, double, text, html, date, image, boolean, money, quantity,
   *    datetime, email, password, set_of_string, set_of_int, set_of_double, enum_of_string, enum_of_int
   *  }
   *
   * Note: value_type can only be joined with other attributes using a conjunction (AND)
   * Only searchable attributes can be used in sorting
   */
  async searchSitePreferences(
    groupId: string,
    instanceType: string,
    searchRequest: SearchRequest,
    options?: SitePreferencesOptions,
  ): Promise<any> {
    Validator.validateRequired({ groupId, instanceType }, ['groupId', 'instanceType']);
    const validatedInstanceType = Validator.validateInstanceType(instanceType);
    Validator.validateSearchRequest(searchRequest);

    let endpoint = `/site_preferences/preference_groups/${encodeURIComponent(groupId)}/${validatedInstanceType}/preference_search`;

    if (options) {
      const queryString = QueryBuilder.fromObject(options);
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.post(endpoint, searchRequest);
  }
}
