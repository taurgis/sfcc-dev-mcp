/**
 * Base HTTP Client for SFCC API requests
 *
 * This module provides a foundation for making authenticated HTTP requests to SFCC APIs.
 * It handles common concerns like authentication, request/response formatting, and error handling.
 */

import { Logger } from '../../utils/logger.js';

/**
 * HTTP request options interface
 */
export interface HttpRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Base HTTP client for SFCC API communication
 */
export abstract class BaseHttpClient {
  protected baseUrl: string;
  protected logger: Logger;

  constructor(baseUrl: string, loggerContext: string) {
    this.baseUrl = baseUrl;
    this.logger = new Logger(loggerContext);
  }

  /**
   * Get authentication headers - must be implemented by subclasses
   */
  protected abstract getAuthHeaders(): Promise<Record<string, string>>;

  /**
   * Handle authentication errors - can be overridden by subclasses
   */
  protected async handleAuthError(): Promise<void> {
    // Default implementation does nothing
    // Subclasses can override to clear tokens, retry, etc.
  }

  /**
   * Make an authenticated HTTP request
   */
  protected async makeRequest<T>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method ?? 'GET';

    this.logger.debug(`Making ${method} request to: ${endpoint}`);

    // Get authentication headers
    const authHeaders = await this.getAuthHeaders();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.logger.debug('Received 401, attempting to handle auth error');
          await this.handleAuthError();

          // Retry with fresh authentication
          const newAuthHeaders = await this.getAuthHeaders();
          requestOptions.headers = {
            ...requestOptions.headers,
            ...newAuthHeaders,
          };

          const retryResponse = await fetch(url, requestOptions);
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(
              `Request failed after retry: ${retryResponse.status} ${retryResponse.statusText} - ${errorText}`,
            );
          }

          this.logger.debug('Retry request successful');
          return retryResponse.json();
        }

        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      this.logger.debug(`Request to ${endpoint} completed successfully`);
      return response.json();
    } catch (error) {
      this.logger.error(`Network error during request to ${endpoint}: ${error}`);
      throw error;
    }
  }

  /**
   * GET request
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const options: HttpRequestOptions = { method: 'POST' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PUT request
   */
  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const options: HttpRequestOptions = { method: 'PUT' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PATCH request
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    const options: HttpRequestOptions = { method: 'PATCH' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}
