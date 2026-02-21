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
  timeoutMs?: number;
}

/**
 * Base HTTP client for SFCC API communication
 */
export abstract class BaseHttpClient {
  private static readonly DEFAULT_REQUEST_TIMEOUT_MS = 15_000;
  protected baseUrl: string;
  protected logger: Logger;

  constructor(baseUrl: string, loggerContext: string) {
    this.baseUrl = baseUrl;
    this.logger = Logger.getChildLogger(loggerContext);
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
    const timeoutMs = options.timeoutMs ?? BaseHttpClient.DEFAULT_REQUEST_TIMEOUT_MS;
    const deadline = timeoutMs > 0 ? Date.now() + timeoutMs : undefined;

    this.logger.debug(`Making ${method} request to: ${endpoint}`);

    const customHeaders = options.headers ?? {};
    const baseRequestOptions = this.getBaseRequestOptions(options);

    // Get authentication headers
    const authHeaders = await this.getAuthHeaders();

    try {
      let requestOptions = this.buildRequestOptions(
        baseRequestOptions,
        authHeaders,
        customHeaders,
        timeoutMs,
        deadline,
        endpoint,
      );
      const response = await this.fetchWithTimeout(url, requestOptions, endpoint, timeoutMs);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.logger.debug('Received 401, attempting to handle auth error');
          await this.handleAuthError();

          // Retry with fresh authentication
          const newAuthHeaders = await this.getAuthHeaders();
          requestOptions = this.buildRequestOptions(
            baseRequestOptions,
            newAuthHeaders,
            customHeaders,
            timeoutMs,
            deadline,
            endpoint,
          );

          const retryResponse = await this.fetchWithTimeout(url, requestOptions, endpoint, timeoutMs);
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(
              `Request failed after retry: ${retryResponse.status} ${retryResponse.statusText} - ${errorText}`,
            );
          }

          this.logger.debug('Retry request successful');
          return this.parseResponse<T>(retryResponse);
        }

        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      this.logger.debug(`Request to ${endpoint} completed successfully`);
      return this.parseResponse<T>(response);
    } catch (error) {
      this.logger.error(`Network error during request to ${endpoint}: ${error}`);
      throw error;
    }
  }

  private buildRequestOptions(
    baseRequestOptions: Omit<HttpRequestOptions, 'timeoutMs' | 'headers'>,
    authHeaders: Record<string, string>,
    customHeaders: Record<string, string>,
    timeoutMs: number,
    deadline: number | undefined,
    endpoint: string,
  ): RequestInit {
    const requestSignal = this.createRequestSignal(
      baseRequestOptions.signal,
      timeoutMs,
      deadline,
      endpoint,
    );

    return {
      ...baseRequestOptions,
      signal: requestSignal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...customHeaders,
      },
    };
  }

  private getBaseRequestOptions(
    options: HttpRequestOptions,
  ): Omit<HttpRequestOptions, 'timeoutMs' | 'headers'> {
    const requestOptions: RequestInit = { ...options };
    delete (requestOptions as HttpRequestOptions).timeoutMs;
    delete (requestOptions as HttpRequestOptions).headers;

    return requestOptions as Omit<HttpRequestOptions, 'timeoutMs' | 'headers'>;
  }

  private createRequestSignal(
    externalSignal: AbortSignal | null | undefined,
    timeoutMs: number,
    deadline: number | undefined,
    endpoint: string,
  ): AbortSignal | undefined {
    const remainingMs = this.getRemainingTimeoutMs(timeoutMs, deadline, endpoint);
    if (remainingMs === undefined || remainingMs <= 0) {
      return externalSignal ?? undefined;
    }

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(`Request timed out after ${timeoutMs}ms`), remainingMs);

    timeoutController.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });

    if (!externalSignal) {
      return timeoutController.signal;
    }

    if (externalSignal.aborted) {
      timeoutController.abort(externalSignal.reason ?? 'Request aborted');
      return timeoutController.signal;
    }

    const forwardAbort = () => timeoutController.abort(externalSignal.reason ?? 'Request aborted');
    externalSignal.addEventListener('abort', forwardAbort, { once: true });
    timeoutController.signal.addEventListener(
      'abort',
      () => externalSignal.removeEventListener('abort', forwardAbort),
      { once: true },
    );

    return timeoutController.signal;
  }

  private getRemainingTimeoutMs(
    timeoutMs: number,
    deadline: number | undefined,
    endpoint: string,
  ): number | undefined {
    if (timeoutMs <= 0 || deadline === undefined) {
      return undefined;
    }

    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${endpoint}`);
    }

    return remainingMs;
  }

  private async fetchWithTimeout(
    url: string,
    requestOptions: RequestInit,
    endpoint: string,
    timeoutMs: number,
  ): Promise<Response> {
    try {
      return await fetch(url, requestOptions);
    } catch (error) {
      if (this.isAbortError(error)) {
        const signalReason = requestOptions.signal?.reason;
        const reason = typeof signalReason === 'string' ? signalReason : '';

        if (reason.includes('timed out')) {
          throw new Error(`Request timed out after ${timeoutMs}ms: ${endpoint}`);
        }

        throw new Error(`Request aborted: ${endpoint}`);
      }
      throw error;
    }
  }

  private isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError';
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const contentType = response.headers?.get?.('content-type')?.toLowerCase() ?? '';
    if (contentType.includes('application/json')) {
      return await response.json() as T;
    }

    if (typeof response.json === 'function' && contentType.length === 0) {
      try {
        return await response.json() as T;
      } catch {
        // Fall through to text parsing.
      }
    }

    const text = typeof response.text === 'function' ? await response.text() : '';
    if (text.length === 0) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
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
  protected async post<T, TBody = unknown>(endpoint: string, data?: TBody): Promise<T> {
    const options: HttpRequestOptions = { method: 'POST' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PUT request
   */
  protected async put<T, TBody = unknown>(endpoint: string, data?: TBody): Promise<T> {
    const options: HttpRequestOptions = { method: 'PUT' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.makeRequest<T>(endpoint, options);
  }

  /**
   * PATCH request
   */
  protected async patch<T, TBody = unknown>(endpoint: string, data?: TBody): Promise<T> {
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
