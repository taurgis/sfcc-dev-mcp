/**
 * Tests for BaseHttpClient
 * Tests the foundation HTTP client functionality
 */

import { BaseHttpClient } from '../src/clients/base/http-client.js';
import { Logger } from '../src/utils/logger.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Logger
jest.mock('../src/utils/logger.js', () => ({
  Logger: {
    initialize: jest.fn(),
    getInstance: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
    getChildLogger: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
  },
}));

// Concrete implementation for testing abstract class
class TestHttpClient extends BaseHttpClient {
  private authHeaders: Record<string, string> = {};
  private shouldFailAuth = false;

  constructor(baseUrl: string = 'https://test-api.example.com') {
    super(baseUrl, 'TestHttpClient');
  }

  // Implementation of abstract method
  protected async getAuthHeaders(): Promise<Record<string, string>> {
    if (this.shouldFailAuth) {
      throw new Error('Auth failed');
    }
    return this.authHeaders;
  }

  // Test helpers
  setAuthHeaders(headers: Record<string, string>) {
    this.authHeaders = headers;
  }

  setAuthFailure(shouldFail: boolean) {
    this.shouldFailAuth = shouldFail;
  }

  // Expose protected methods for testing
  public async testMakeRequest<T>(endpoint: string, options?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, options);
  }

  public async testGet<T>(endpoint: string): Promise<T> {
    return this.get<T>(endpoint);
  }

  public async testPost<T>(endpoint: string, data?: any): Promise<T> {
    return this.post<T>(endpoint, data);
  }

  public async testPut<T>(endpoint: string, data?: any): Promise<T> {
    return this.put<T>(endpoint, data);
  }

  public async testPatch<T>(endpoint: string, data?: any): Promise<T> {
    return this.patch<T>(endpoint, data);
  }

  public async testDelete<T>(endpoint: string): Promise<T> {
    return this.delete<T>(endpoint);
  }
}

describe('BaseHttpClient', () => {
  let client: TestHttpClient;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    client = new TestHttpClient();
  });

  describe('constructor', () => {
    it('should initialize with base URL and logger context', () => {
      const customClient = new TestHttpClient('https://custom.api.com');
      expect(customClient).toBeInstanceOf(BaseHttpClient);
      expect(Logger.getChildLogger).toHaveBeenCalledWith('TestHttpClient');
    });
  });

  describe('makeRequest', () => {
    it('should make successful GET request with auth headers', async () => {
      const mockResponse = { data: 'test-data' };
      client.setAuthHeaders({ 'Authorization': 'Bearer token123' });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.testMakeRequest('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test-endpoint',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 errors with retry logic', async () => {
      const mockResponse = { data: 'success-after-retry' };
      client.setAuthHeaders({ 'Authorization': 'Bearer old-token' });

      // First call returns 401
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

      const result = await client.testMakeRequest('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for non-401 HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error details',
      } as Response);

      await expect(client.testMakeRequest('/test-endpoint')).rejects.toThrow(
        'Request failed: 500 Internal Server Error - Server error details',
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(client.testMakeRequest('/test-endpoint')).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle auth header failures', async () => {
      client.setAuthFailure(true);

      await expect(client.testMakeRequest('/test-endpoint')).rejects.toThrow(
        'Auth failed',
      );
    });

    it('should merge custom headers with auth headers', async () => {
      const mockResponse = { data: 'test' };
      client.setAuthHeaders({ 'Authorization': 'Bearer token' });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await client.testMakeRequest('/test', {
        headers: { 'Custom-Header': 'custom-value' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token',
            'Custom-Header': 'custom-value',
          },
        },
      );
    });
  });

  describe('HTTP method wrappers', () => {
    beforeEach(() => {
      client.setAuthHeaders({ 'Authorization': 'Bearer token' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);
    });

    it('should make GET request', async () => {
      await client.testGet('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test',
        expect.objectContaining({ method: 'GET' }), // GET method is explicitly set
      );
    });

    it('should make POST request with data', async () => {
      const postData = { name: 'test' };
      await client.testPost('/test', postData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        }),
      );
    });

    it('should make POST request without data', async () => {
      await client.testPost('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(mockFetch.mock.calls[0][1]).not.toHaveProperty('body');
    });

    it('should make PUT request with data', async () => {
      const putData = { id: 1, name: 'updated' };
      await client.testPut('/test/1', putData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        }),
      );
    });

    it('should make PATCH request with data', async () => {
      const patchData = { name: 'patched' };
      await client.testPatch('/test/1', patchData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData),
        }),
      );
    });

    it('should make DELETE request', async () => {
      await client.testDelete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.example.com/test/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('error handling during retry', () => {
    it('should throw error if retry also fails', async () => {
      client.setAuthHeaders({ 'Authorization': 'Bearer token' });

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Retry failed',
        } as Response);

      await expect(client.testMakeRequest('/test')).rejects.toThrow(
        'Request failed after retry: 500 Internal Server Error - Retry failed',
      );
    });
  });
});
