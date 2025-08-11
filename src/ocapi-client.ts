/**
 * OCAPI Client for Salesforce Commerce Cloud
 *
 * This module provides a client for making authenticated requests to SFCC's Open Commerce API (OCAPI)
 * using OAuth 2.0 Client Credentials grant flow. It handles automatic token management and refresh.
 */

import { OCAPIConfig, OAuthTokenResponse } from './types.js';
import { TokenManager } from './oauth-token.js';

/**
 * OCAPI Client with OAuth 2.0 authentication
 */
export class OCAPIClient {
  private config: OCAPIConfig;
  private tokenManager: TokenManager;
  private baseUrl: string;

  constructor(config: OCAPIConfig) {
    this.config = {
      version: 'v21_3',
      ...config,
    };
    this.tokenManager = TokenManager.getInstance();
    this.baseUrl = `https://${this.config.hostname}/s/-/dw/data/${this.config.version}`;
  }

  /**
   * Get OAuth access token using Client Credentials grant
   * Makes a request to the SFCC authorization server to obtain an access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token first
    const existingToken = this.tokenManager.getValidToken(this.config.hostname, this.config.clientId);
    if (existingToken) {
      return existingToken;
    }

    const authUrl = 'https://account.demandware.com/dwsso/oauth2/access_token';

    // Create Basic Auth header using client credentials
    const credentials = `${this.config.clientId}:${this.config.clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const tokenResponse: OAuthTokenResponse = await response.json();

    // Store the token for future use
    this.tokenManager.storeToken(this.config.hostname, this.config.clientId, tokenResponse);

    return tokenResponse.access_token;
  }

  /**
   * Make an authenticated request to OCAPI
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await this.getAccessToken();

    const url = `${this.baseUrl}${endpoint}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      // If unauthorized, clear the token and try once more
      if (response.status === 401) {
        this.tokenManager.clearToken(this.config.hostname, this.config.clientId);

        // Retry with a fresh token
        const newAccessToken = await this.getAccessToken();
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };

        const retryResponse = await fetch(url, requestOptions);
        if (!retryResponse.ok) {
          const errorText = await retryResponse.text();
          throw new Error(`OCAPI request failed: ${retryResponse.status} ${retryResponse.statusText} - ${errorText}`);
        }

        return retryResponse.json();
      }

      const errorText = await response.text();
      throw new Error(`OCAPI request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * GET request to OCAPI
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request to OCAPI
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PUT request to OCAPI
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PATCH request to OCAPI
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: 'PATCH',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * DELETE request to OCAPI
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Get products from the catalog
   * Example usage of the OCAPI client
   */
  async getProducts(params?: {
    ids?: string[];
    expand?: string[];
    inventory_ids?: string[];
    currency?: string;
    locale?: string;
  }): Promise<any> {
    let endpoint = '/products';

    if (params) {
      const searchParams = new URLSearchParams();

      if (params.ids) {
        searchParams.append('ids', params.ids.join(','));
      }
      if (params.expand) {
        searchParams.append('expand', params.expand.join(','));
      }
      if (params.inventory_ids) {
        searchParams.append('inventory_ids', params.inventory_ids.join(','));
      }
      if (params.currency) {
        searchParams.append('currency', params.currency);
      }
      if (params.locale) {
        searchParams.append('locale', params.locale);
      }

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Get categories from the catalog
   */
  async getCategories(params?: {
    ids?: string[];
    levels?: number;
    locale?: string;
  }): Promise<any> {
    let endpoint = '/categories';

    if (params) {
      const searchParams = new URLSearchParams();

      if (params.ids) {
        searchParams.append('ids', params.ids.join(','));
      }
      if (params.levels !== undefined) {
        searchParams.append('levels', params.levels.toString());
      }
      if (params.locale) {
        searchParams.append('locale', params.locale);
      }

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Search products
   */
  async searchProducts(params: {
    q?: string;
    refine?: string[];
    sort?: string;
    start?: number;
    count?: number;
    expand?: string[];
    currency?: string;
    locale?: string;
  }): Promise<any> {
    let endpoint = '/product_search';

    const searchParams = new URLSearchParams();

    if (params.q) {
      searchParams.append('q', params.q);
    }
    if (params.refine) {
      params.refine.forEach(refine => searchParams.append('refine', refine));
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }
    if (params.start !== undefined) {
      searchParams.append('start', params.start.toString());
    }
    if (params.count !== undefined) {
      searchParams.append('count', params.count.toString());
    }
    if (params.expand) {
      searchParams.append('expand', params.expand.join(','));
    }
    if (params.currency) {
      searchParams.append('currency', params.currency);
    }
    if (params.locale) {
      searchParams.append('locale', params.locale);
    }

    const queryString = searchParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.get(endpoint);
  }

  /**
   * Get all system object definitions
   * Returns a list of all system objects in SFCC with their metadata
   * Useful for discovering what system objects exist and their custom attributes
   */
  async getSystemObjectDefinitions(params?: {
    start?: number;
    count?: number;
    select?: string;
  }): Promise<any> {
    let endpoint = '/system_object_definitions';

    if (params) {
      const searchParams = new URLSearchParams();

      if (params.start !== undefined) {
        searchParams.append('start', params.start.toString());
      }
      if (params.count !== undefined) {
        searchParams.append('count', params.count.toString());
      }
      if (params.select) {
        searchParams.append('select', params.select);
      }

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.get(endpoint);
  }

  /**
   * Get a specific system object definition by object type
   * Returns detailed information about a single system object including all attributes
   * Useful for inspecting custom attributes added to standard SFCC objects like Product, Customer, etc.
   */
  async getSystemObjectDefinition(objectType: string): Promise<any> {
    if (!objectType || objectType.trim().length === 0) {
      throw new Error('Object type is required and cannot be empty');
    }

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}`;
    return this.get(endpoint);
  }

  /**
   * Search for system object definitions using complex queries
   * Allows for targeted searches instead of fetching all system objects
   * Supports text queries and sorting on object_type, display_name, description, and read_only fields
   */
  async searchSystemObjectDefinitions(searchRequest: {
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
    };
    sorts?: Array<{
      field: string;
      sort_order?: 'asc' | 'desc';
    }>;
    start?: number;
    count?: number;
    select?: string;
  }): Promise<any> {
    const endpoint = '/system_object_definition_search';
    return this.post(endpoint, searchRequest);
  }

  /**
   * Get attribute definitions for a specific system object type
   * Returns detailed information about all attributes for a system object including custom attributes
   * This provides more detailed attribute information than the basic system object definition
   */
  async getSystemObjectAttributeDefinitions(
    objectType: string,
    options?: {
      start?: number;
      count?: number;
      select?: string;
    },
  ): Promise<any> {
    if (!objectType || objectType.trim().length === 0) {
      throw new Error('Object type is required and cannot be empty');
    }

    const queryParams = new URLSearchParams();
    if (options?.start !== undefined) {
      queryParams.append('start', options.start.toString());
    }
    if (options?.count !== undefined) {
      queryParams.append('count', options.count.toString());
    }
    if (options?.select) {
      queryParams.append('select', options.select);
    }

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}/attribute_definitions`;
    const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

    return this.get(url);
  }

  /**
   * Search attribute definitions for a specific system object type using complex queries
   * Allows searching for specific attributes by id, display_name, description, type, and other properties
   * Supports text queries, term queries, filtered queries, and boolean queries
   *
   * Searchable attributes are grouped into buckets:
   * - Main: id, display_name, description, key, mandatory, searchable, system, visible
   * - Definition version: localizable, site_specific, value_type
   * - Group: group
   *
   * Only attributes in the same bucket can be joined using OR operations
   */
  async searchSystemObjectAttributeDefinitions(
    objectType: string,
    searchRequest: {
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
      };
      sorts?: Array<{
        field: string;
        sort_order?: 'asc' | 'desc';
      }>;
      start?: number;
      count?: number;
      select?: string;
    },
  ): Promise<any> {
    if (!objectType || objectType.trim().length === 0) {
      throw new Error('Object type is required and cannot be empty');
    }

    const endpoint = `/system_object_definitions/${encodeURIComponent(objectType)}/attribute_definition_search`;
    return this.post(endpoint, searchRequest);
  }

  /**
   * Get current token expiration for debugging
   */
  getTokenExpiration(): Date | null {
    return this.tokenManager.getTokenExpiration(this.config.hostname, this.config.clientId);
  }

  /**
   * Force refresh the token (useful for testing)
   */
  async refreshToken(): Promise<void> {
    this.tokenManager.clearToken(this.config.hostname, this.config.clientId);
    await this.getAccessToken();
  }
}
