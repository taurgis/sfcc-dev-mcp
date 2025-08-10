import { OCAPIClient } from '../src/ocapi-client';
import { TokenManager } from '../src/oauth-token';
import { OCAPIConfig, OAuthTokenResponse } from '../src/types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock TokenManager
jest.mock('../src/oauth-token');

describe('OCAPIClient', () => {
  let client: OCAPIClient;
  let mockTokenManager: jest.Mocked<TokenManager>;
  const mockConfig: OCAPIConfig = {
    hostname: 'test-instance.demandware.net',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    version: 'v21_3'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup TokenManager mock
    mockTokenManager = {
      getValidToken: jest.fn(),
      storeToken: jest.fn(),
      clearToken: jest.fn(),
      getTokenExpiration: jest.fn(),
      isTokenValid: jest.fn()
    } as any;

    (TokenManager.getInstance as jest.Mock).mockReturnValue(mockTokenManager);
    (fetch as jest.Mock).mockClear();

    client = new OCAPIClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(client).toBeInstanceOf(OCAPIClient);
      expect(TokenManager.getInstance).toHaveBeenCalled();
    });

    it('should use default version when not provided', () => {
      const configWithoutVersion = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret'
      };

      const clientWithDefaults = new OCAPIClient(configWithoutVersion);
      expect(clientWithDefaults).toBeInstanceOf(OCAPIClient);
    });

    it('should construct correct base URL', () => {
      // We can't directly test the private baseUrl, but we can verify it through API calls
      expect(client).toBeInstanceOf(OCAPIClient);
    });
  });

  describe('OAuth token management', () => {
    it('should use existing valid token when available', async () => {
      const existingToken = 'existing-valid-token';
      mockTokenManager.getValidToken.mockReturnValue(existingToken);

      // Mock successful API response
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' })
      });

      await client.get('/test-endpoint');

      expect(mockTokenManager.getValidToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${existingToken}`
          })
        })
      );
    });

    it('should obtain new token when no valid token exists', async () => {
      const newToken = 'new-access-token';
      const tokenResponse: OAuthTokenResponse = {
        access_token: newToken,
        token_type: 'bearer',
        expires_in: 3600
      };

      mockTokenManager.getValidToken.mockReturnValue(null);

      // Mock OAuth token request
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => tokenResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: 'test' })
        });

      await client.get('/test-endpoint');

      // Verify OAuth request
      expect(fetch).toHaveBeenNthCalledWith(1,
        'https://account.demandware.com/dwsso/oauth2/access_token',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${mockConfig.clientId}:${mockConfig.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'grant_type=client_credentials'
        }
      );

      // Verify token was stored
      expect(mockTokenManager.storeToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
        tokenResponse
      );

      // Verify API request used new token
      expect(fetch).toHaveBeenNthCalledWith(2,
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${newToken}`
          })
        })
      );
    });

    it('should handle OAuth authentication failure', async () => {
      mockTokenManager.getValidToken.mockReturnValue(null);

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid client credentials'
      });

      await expect(client.get('/test-endpoint')).rejects.toThrow(
        'OAuth authentication failed: 400 Bad Request - Invalid client credentials'
      );
    });

    it('should retry with new token on 401 unauthorized', async () => {
      const oldToken = 'expired-token';
      const newToken = 'fresh-token';
      const tokenResponse: OAuthTokenResponse = {
        access_token: newToken,
        token_type: 'bearer',
        expires_in: 3600
      };

      mockTokenManager.getValidToken
        .mockReturnValueOnce(oldToken)  // First call returns expired token
        .mockReturnValueOnce(null);     // Second call after clearToken returns null

      (fetch as jest.Mock)
        .mockResolvedValueOnce({         // First API call with old token fails
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        })
        .mockResolvedValueOnce({         // OAuth token refresh succeeds
          ok: true,
          json: async () => tokenResponse
        })
        .mockResolvedValueOnce({         // Retry API call succeeds
          ok: true,
          json: async () => ({ data: 'success' })
        });

      const result = await client.get('/test-endpoint');

      expect(mockTokenManager.clearToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId
      );
      expect(result).toEqual({ data: 'success' });
    });

    it('should throw error if retry also fails with 401', async () => {
      const oldToken = 'expired-token';
      const newToken = 'new-token';

      mockTokenManager.getValidToken
        .mockReturnValueOnce(oldToken)  // First call returns expired token
        .mockReturnValueOnce(null);     // Second call after clearToken returns null

      (fetch as jest.Mock)
        .mockResolvedValueOnce({         // First call fails with 401
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        })
        .mockResolvedValueOnce({         // OAuth token refresh succeeds
          ok: true,
          json: async () => ({ access_token: newToken, token_type: 'bearer', expires_in: 3600 })
        })
        .mockResolvedValueOnce({         // Retry also fails with 401
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          text: async () => 'Still unauthorized'
        });

      await expect(client.get('/test-endpoint')).rejects.toThrow(
        'OCAPI request failed: 401 Unauthorized - Still unauthorized'
      );
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      mockTokenManager.getValidToken.mockReturnValue('valid-token');
    });

    describe('get()', () => {
      it('should make GET request with correct headers', async () => {
        const mockResponse = { id: '1', name: 'test' };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.get('/products/test-id');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products/test-id',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('post()', () => {
      it('should make POST request with data', async () => {
        const postData = { name: 'New Product' };
        const mockResponse = { id: '123', ...postData };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.post('/products', postData);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should make POST request without data', async () => {
        const mockResponse = { success: true };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.post('/actions/refresh');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/actions/refresh',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('put()', () => {
      it('should make PUT request with data', async () => {
        const putData = { name: 'Updated Product' };
        const mockResponse = { id: '123', ...putData };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.put('/products/123', putData);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products/123',
          {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(putData)
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('patch()', () => {
      it('should make PATCH request with data', async () => {
        const patchData = { price: 29.99 };
        const mockResponse = { id: '123', price: 29.99 };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.patch('/products/123', patchData);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products/123',
          {
            method: 'PATCH',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(patchData)
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('delete()', () => {
      it('should make DELETE request', async () => {
        const mockResponse = { success: true };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.delete('/products/123');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products/123',
          {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    it('should handle non-401 HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Resource not found'
      });

      await expect(client.get('/products/nonexistent')).rejects.toThrow(
        'OCAPI request failed: 404 Not Found - Resource not found'
      );
    });
  });

  describe('Product API methods', () => {
    beforeEach(() => {
      mockTokenManager.getValidToken.mockReturnValue('valid-token');
    });

    describe('getProducts()', () => {
      it('should get products without parameters', async () => {
        const mockResponse = { data: [{ id: 'prod1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getProducts();

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should get products with all parameters', async () => {
        const mockResponse = { data: [{ id: 'prod1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const params = {
          ids: ['prod1', 'prod2'],
          expand: ['prices', 'images'],
          inventory_ids: ['inv1'],
          currency: 'USD',
          locale: 'en_US'
        };

        const result = await client.getProducts(params);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products?ids=prod1%2Cprod2&expand=prices%2Cimages&inventory_ids=inv1&currency=USD&locale=en_US',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should get products with partial parameters', async () => {
        const mockResponse = { data: [{ id: 'prod1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getProducts({ ids: ['prod1'], currency: 'EUR' });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/products?ids=prod1&currency=EUR',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getCategories()', () => {
      it('should get categories without parameters', async () => {
        const mockResponse = { data: [{ id: 'cat1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getCategories();

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/categories',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should get categories with parameters', async () => {
        const mockResponse = { data: [{ id: 'cat1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const params = {
          ids: ['cat1', 'cat2'],
          levels: 2,
          locale: 'en_US'
        };

        const result = await client.getCategories(params);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/categories?ids=cat1%2Ccat2&levels=2&locale=en_US',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle levels parameter as 0', async () => {
        const mockResponse = { data: [{ id: 'cat1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getCategories({ levels: 0 });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/categories?levels=0',
          expect.any(Object)
        );
      });
    });

    describe('searchProducts()', () => {
      it('should search products with query', async () => {
        const mockResponse = { hits: [{ id: 'prod1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.searchProducts({ q: 'shoes' });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/product_search?q=shoes',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should search products with all parameters', async () => {
        const mockResponse = { hits: [{ id: 'prod1' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const params = {
          q: 'shoes',
          refine: ['brand=Nike', 'color=red'],
          sort: 'price-low-to-high',
          start: 0,
          count: 20,
          expand: ['prices'],
          currency: 'USD',
          locale: 'en_US'
        };

        const result = await client.searchProducts(params);

        const expectedUrl = 'https://test-instance.demandware.net/s/-/dw/data/v21_3/product_search?q=shoes&refine=brand%3DNike&refine=color%3Dred&sort=price-low-to-high&start=0&count=20&expand=prices&currency=USD&locale=en_US';
        expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
        expect(result).toEqual(mockResponse);
      });

      it('should handle start and count as 0', async () => {
        const mockResponse = { hits: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.searchProducts({ start: 0, count: 0 });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/product_search?start=0&count=0',
          expect.any(Object)
        );
      });
    });
  });

  describe('System Object API methods', () => {
    beforeEach(() => {
      mockTokenManager.getValidToken.mockReturnValue('valid-token');
    });

    describe('getSystemObjectDefinitions()', () => {
      it('should get system object definitions without parameters', async () => {
        const mockResponse = { data: [{ object_type: 'Product' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectDefinitions();

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should get system object definitions with parameters', async () => {
        const mockResponse = { data: [{ object_type: 'Product' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const params = {
          start: 10,
          count: 50,
          select: '(**)'
        };

        const result = await client.getSystemObjectDefinitions(params);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions?start=10&count=50&select=%28**%29',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle start and count as 0', async () => {
        const mockResponse = { data: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectDefinitions({ start: 0, count: 0 });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions?start=0&count=0',
          expect.any(Object)
        );
      });
    });

    describe('getSystemObjectDefinition()', () => {
      it('should get specific system object definition', async () => {
        const mockResponse = { object_type: 'Product', attributes: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectDefinition('Product');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Product',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle URL encoding for object type', async () => {
        const mockResponse = { object_type: 'Custom Object' };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectDefinition('Custom Object');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Custom%20Object',
          expect.any(Object)
        );
      });

      it('should throw error for empty object type', async () => {
        await expect(client.getSystemObjectDefinition('')).rejects.toThrow(
          'Object type is required and cannot be empty'
        );

        await expect(client.getSystemObjectDefinition('   ')).rejects.toThrow(
          'Object type is required and cannot be empty'
        );
      });
    });

    describe('searchSystemObjectDefinitions()', () => {
      it('should search system object definitions with text query', async () => {
        const mockResponse = { hits: [{ object_type: 'Product' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const searchRequest = {
          query: {
            text_query: {
              fields: ['object_type', 'display_name'],
              search_phrase: 'product'
            }
          },
          start: 0,
          count: 10
        };

        const result = await client.searchSystemObjectDefinitions(searchRequest);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definition_search',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchRequest)
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should search with complex query and sorts', async () => {
        const mockResponse = { hits: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const searchRequest = {
          query: {
            bool_query: {
              must: [
                { term_query: { fields: ['object_type'], operator: 'is', values: ['Product'] } }
              ]
            }
          },
          sorts: [
            { field: 'object_type', sort_order: 'asc' as const }
          ],
          select: '(**)'
        };

        const result = await client.searchSystemObjectDefinitions(searchRequest);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definition_search',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(searchRequest)
          })
        );
      });
    });

    describe('getSystemObjectAttributeDefinitions()', () => {
      it('should get attribute definitions for object type', async () => {
        const mockResponse = { data: [{ attribute_id: 'name' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectAttributeDefinitions('Product');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Product/attribute_definitions',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should get attribute definitions with options', async () => {
        const mockResponse = { data: [{ attribute_id: 'name' }] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const options = {
          start: 5,
          count: 25,
          select: '(**)'
        };

        const result = await client.getSystemObjectAttributeDefinitions('Product', options);

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Product/attribute_definitions?start=5&count=25&select=%28**%29',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle URL encoding for object type with spaces', async () => {
        const mockResponse = { data: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        await client.getSystemObjectAttributeDefinitions('Custom Object Type');

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Custom%20Object%20Type/attribute_definitions',
          expect.any(Object)
        );
      });

      it('should throw error for empty object type', async () => {
        await expect(client.getSystemObjectAttributeDefinitions('')).rejects.toThrow(
          'Object type is required and cannot be empty'
        );

        await expect(client.getSystemObjectAttributeDefinitions('   ')).rejects.toThrow(
          'Object type is required and cannot be empty'
        );
      });

      it('should handle start and count as 0', async () => {
        const mockResponse = { data: [] };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        });

        const result = await client.getSystemObjectAttributeDefinitions('Product', { start: 0, count: 0 });

        expect(fetch).toHaveBeenCalledWith(
          'https://test-instance.demandware.net/s/-/dw/data/v21_3/system_object_definitions/Product/attribute_definitions?start=0&count=0',
          expect.any(Object)
        );
      });
    });
  });

  describe('Token management utility methods', () => {
    it('should get token expiration', () => {
      const mockDate = new Date('2023-12-01T12:00:00Z');
      mockTokenManager.getTokenExpiration.mockReturnValue(mockDate);

      const result = client.getTokenExpiration();

      expect(mockTokenManager.getTokenExpiration).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId
      );
      expect(result).toBe(mockDate);
    });

    it('should return null when no token expiration', () => {
      mockTokenManager.getTokenExpiration.mockReturnValue(null);

      const result = client.getTokenExpiration();

      expect(result).toBeNull();
    });

    it('should refresh token', async () => {
      const newToken = 'refreshed-token';
      const tokenResponse: OAuthTokenResponse = {
        access_token: newToken,
        token_type: 'bearer',
        expires_in: 3600
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => tokenResponse
      });

      await client.refreshToken();

      expect(mockTokenManager.clearToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId
      );
      expect(mockTokenManager.storeToken).toHaveBeenCalledWith(
        mockConfig.hostname,
        mockConfig.clientId,
        tokenResponse
      );
    });
  });

  describe('Error handling edge cases', () => {
    beforeEach(() => {
      mockTokenManager.getValidToken.mockReturnValue('valid-token');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(client.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON responses', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(client.get('/test')).rejects.toThrow('Invalid JSON');
    });

    it('should handle OAuth errors with malformed response', async () => {
      mockTokenManager.getValidToken.mockReturnValue(null);

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => {
          throw new Error('Failed to read response');
        }
      });

      await expect(client.get('/test')).rejects.toThrow('Failed to read response');
    });

    it('should handle empty response body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null
      });

      const result = await client.get('/test');
      expect(result).toBeNull();
    });
  });

  describe('Configuration edge cases', () => {
    it('should handle config with custom site ID', () => {
      const configWithSite: OCAPIConfig = {
        hostname: 'test.demandware.net',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        siteId: 'RefArch',
        version: 'v22_1'
      };

      const clientWithSite = new OCAPIClient(configWithSite);
      expect(clientWithSite).toBeInstanceOf(OCAPIClient);
    });

    it('should handle minimal config', () => {
      const minimalConfig: OCAPIConfig = {
        hostname: 'minimal.demandware.net',
        clientId: 'id',
        clientSecret: 'secret'
      };

      const minimalClient = new OCAPIClient(minimalConfig);
      expect(minimalClient).toBeInstanceOf(OCAPIClient);
    });
  });
});
