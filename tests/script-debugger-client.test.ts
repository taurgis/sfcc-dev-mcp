/**
 * Unit tests for ScriptDebuggerClient
 */

import { ScriptDebuggerClient } from '../src/clients/script-debugger/script-debugger-client.js';
import { SFCCConfig } from '../src/types/types.js';

// Mock webdav module
const mockExists = jest.fn();
jest.mock('webdav', () => ({
  createClient: jest.fn(() => ({
    exists: mockExists,
  })),
}));

/**
 * Helper to create a URL-based mock fetch that handles different endpoints
 */
function createMockFetch(responses: Record<string, () => any>) {
  let threadPollCount = 0;

  const mockFn = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const urlStr = url.toString();
    const method = options?.method ?? 'GET';

    const defaultResponse = (data: any) => data as unknown as Response;

    // Handle storefront trigger (not part of debugger API)
    // The client may use either the modern /s/{siteId}/ URL or the classic /on/demandware.store/ URL.
    const isStorefrontTrigger =
      (urlStr.includes('/s/') || urlStr.includes('/on/demandware.store/')) && !urlStr.includes('/dw/debugger');

    if (isStorefrontTrigger) {
      // Allow tests to override storefront behavior
      const isClassicNoLocale =
        urlStr.includes('/on/demandware.store/') && /\/Sites-[^/]+-Site\/$/.test(urlStr);

      if (isClassicNoLocale && responses['GET /storefront/no-locale']) {
        return defaultResponse(responses['GET /storefront/no-locale']());
      }

      const isClassicWithLocale = urlStr.includes('/on/demandware.store/') && !/\/Sites-[^/]+-Site\/$/.test(urlStr);
      if (isClassicWithLocale && responses['GET /storefront/with-locale']) {
        return defaultResponse(responses['GET /storefront/with-locale']());
      }

      return defaultResponse({ ok: true, status: 200, text: async () => '<html></html>' });
    }

    // Debugger API endpoints
    if (urlStr.includes('/client') && method === 'POST') {
      const resp = responses['POST /client']?.();
      return defaultResponse(resp ?? { ok: true, status: 204 });
    }
    if (urlStr.includes('/client') && method === 'DELETE') {
      const resp = responses['DELETE /client']?.();
      return defaultResponse(resp ?? { ok: true, status: 204 });
    }
    if (urlStr.includes('/breakpoints') && method === 'POST') {
      const resp = responses['POST /breakpoints']?.();
      return defaultResponse(resp ?? {
        ok: true, status: 200,
        text: async () => JSON.stringify({ breakpoints: [{ id: 1 }] }),
      });
    }
    if (urlStr.includes('/breakpoints') && method === 'DELETE') {
      const resp = responses['DELETE /breakpoints']?.();
      return defaultResponse(resp ?? { ok: true, status: 204 });
    }
    if (urlStr.includes('/threads/reset')) {
      const resp = responses['POST /threads/reset']?.();
      return defaultResponse(resp ?? { ok: true, status: 204 });
    }
    if (urlStr.includes('/threads') && urlStr.includes('/resume')) {
      const resp = responses['POST /threads/resume']?.();
      return defaultResponse(resp ?? { ok: true, status: 204 });
    }
    if (urlStr.includes('/eval')) {
      const resp = responses['GET /eval']?.();
      return defaultResponse(resp ?? {
        ok: true, status: 200,
        text: async () => JSON.stringify({ result: 'test' }),
      });
    }
    if (urlStr.includes('/threads') && method === 'GET') {
      threadPollCount++;
      // Return halted on second poll unless overridden
      if (threadPollCount > 1 && !responses['GET /threads/halted']) {
        return defaultResponse({
          ok: true, status: 200,
          text: async () => JSON.stringify({
            script_threads: [{ id: 123, status: 'halted' }],
          }),
        });
      }
      if (responses['GET /threads/halted']) {
        const resp = responses['GET /threads/halted']();
        return defaultResponse(resp);
      }
      const resp = responses['GET /threads/empty']?.();
      return defaultResponse(resp ?? {
        ok: true, status: 200,
        text: async () => JSON.stringify({ script_threads: [] }),
      });
    }

    // Default
    return defaultResponse({ ok: true, status: 200, text: async () => '{}' });
  };

  return mockFn;
}

describe('ScriptDebuggerClient', () => {
  let client: ScriptDebuggerClient;

  const testConfig: SFCCConfig = {
    hostname: 'test.sandbox.dx.commercecloud.salesforce.com',
    username: 'testuser',
    password: 'testpass',
    codeVersion: 'test_version',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExists.mockReset();

    client = new ScriptDebuggerClient(testConfig);
  });

  describe('constructor', () => {
    it('should create client with https protocol for normal hostname', () => {
      const client = new ScriptDebuggerClient(testConfig);
      expect(client).toBeDefined();
    });

    it('should create client with http protocol for localhost', () => {
      const localConfig: SFCCConfig = {
        ...testConfig,
        hostname: 'localhost:8080',
      };
      const client = new ScriptDebuggerClient(localConfig);
      expect(client).toBeDefined();
    });

    it('should work with clientId/clientSecret credentials', () => {
      const clientIdConfig: SFCCConfig = {
        hostname: 'test.sandbox.dx.commercecloud.salesforce.com',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        codeVersion: 'test_version',
      };
      const client = new ScriptDebuggerClient(clientIdConfig);
      expect(client).toBeDefined();
    });
  });

  describe('testConnection', () => {
    it('should return success when debugger API responds correctly', async () => {
      global.fetch = createMockFetch({});

      const result = await client.testConnection();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully connected to Script Debugger API');
    });

    it('should return failure with NotAuthorizedException', async () => {
      global.fetch = createMockFetch({
        'POST /client': () => ({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          json: async () => ({
            fault: {
              type: 'NotAuthorizedException',
              message: 'You are not authorized to use the Script Debugger.',
            },
          }),
        }),
      });

      const result = await client.testConnection();

      expect(result.success).toBe(false);
      expect(result.message).toContain('NotAuthorizedException');
    });
  });

  describe('evaluateScript', () => {
    it('should evaluate simple expression successfully', async () => {
      mockExists.mockResolvedValue(true);
      global.fetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: '2' }),
        }),
      });

      const result = await client.evaluateScript('1 + 1', {
        siteId: 'RefArch',
        locale: 'default',
        timeout: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2');
      expect(result.executionTimeMs).toBeDefined();
    });

    it('should accept siteId in "Sites-{id}-Site" format', async () => {
      mockExists.mockResolvedValue(true);
      global.fetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'ok' }),
        }),
      });

      const result = await client.evaluateScript('test', {
        siteId: 'Sites-RefArchGlobal-Site',
        timeout: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('ok');
    });

    it('should retry storefront trigger with locale when no-locale request returns non-OK', async () => {
      mockExists.mockResolvedValue(true);
      global.fetch = createMockFetch({
        'GET /storefront/no-locale': () => ({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: async () => '',
        }),
        'GET /storefront/with-locale': () => ({
          ok: true,
          status: 200,
          text: async () => '<html></html>',
        }),
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'fallback' }),
        }),
      });

      const result = await client.evaluateScript('test', {
        siteId: 'RefArchGlobal',
        locale: 'default',
        timeout: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('fallback');
    });

    it('should return error when no storefront cartridge found', async () => {
      mockExists.mockResolvedValue(false);

      const result = await client.evaluateScript('1 + 1', {
        siteId: 'RefArch',
        timeout: 5000,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('No compatible storefront cartridge found');
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toContain(
        'Supported cartridges: app_storefront_base (SFRA), app_storefront_controllers (SiteGenesis)',
      );
    });

    it('should fall back to SiteGenesis when SFRA not found', async () => {
      mockExists.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      global.fetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'sitegenesis' }),
        }),
      });

      const result = await client.evaluateScript('test', { timeout: 5000 });

      expect(result.success).toBe(true);
      expect(result.result).toBe('sitegenesis');
      expect(mockExists).toHaveBeenCalledTimes(2);
    });

    it('should use custom breakpoint when provided', async () => {
      global.fetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'custom' }),
        }),
      });

      const result = await client.evaluateScript('test', {
        breakpointFile: '/my_cartridge/cartridge/controllers/Test.js',
        breakpointLine: 15,
        timeout: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('custom');
      // Should NOT check for storefront cartridges when custom breakpoint is provided
      expect(mockExists).not.toHaveBeenCalled();
    });

    it('should default to strategic lines when breakpointLine not provided', async () => {
      global.fetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'custom-default-lines' }),
        }),
      });

      const result = await client.evaluateScript('test', {
        breakpointFile: '/my_cartridge/cartridge/controllers/Test.js',
        timeout: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('custom-default-lines');
      expect(mockExists).not.toHaveBeenCalled();
    });

    it('should handle debugger already enabled by taking over session', async () => {
      mockExists.mockResolvedValue(true);

      let clientCallCount = 0;
      global.fetch = createMockFetch({
        'POST /client': () => {
          clientCallCount++;
          if (clientCallCount === 1) {
            // First call fails
            return {
              ok: false,
              status: 409,
              statusText: 'Conflict',
              json: async () => ({
                fault: {
                  type: 'DebuggerAlreadyEnabled',
                  message: 'Debugger is already enabled by another client',
                },
              }),
            };
          }
          // Retry succeeds
          return { ok: true, status: 204 };
        },
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'takeover' }),
        }),
      });

      const result = await client.evaluateScript('test', { timeout: 5000 });

      expect(result.success).toBe(true);
      expect(result.result).toBe('takeover');
    });

    it('should return timeout error when no halted thread found', async () => {
      mockExists.mockResolvedValue(true);
      global.fetch = createMockFetch({
        'GET /threads/halted': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ script_threads: [] }),
        }),
        'GET /threads/empty': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ script_threads: [] }),
        }),
      });

      const result = await client.evaluateScript('test', { timeout: 100 }); // Very short timeout

      expect(result.success).toBe(false);
      expect(result.error).toContain('Timeout waiting for script to hit breakpoint');
    });

    it('should clear storefront timeout even when trigger requests fail', async () => {
      mockExists.mockResolvedValue(true);
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const defaultFetch = createMockFetch({
        'GET /eval': () => ({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ result: 'trigger-timeout-cleaned' }),
        }),
      });

      global.fetch = jest.fn(async (url: RequestInfo | URL, options?: RequestInit) => {
        const urlStr = url.toString();
        if (urlStr.includes('/on/demandware.store/') && !urlStr.includes('/dw/debugger')) {
          throw new Error('Storefront trigger failed');
        }
        return defaultFetch(url, options);
      }) as typeof fetch;

      const result = await client.evaluateScript('1 + 1', { timeout: 5000 });

      expect(result.success).toBe(true);
      expect(result.result).toBe('trigger-timeout-cleaned');
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('authentication', () => {
    it('should return cartridge not found when no credentials for WebDAV check', async () => {
      const noCredentialsConfig: SFCCConfig = {
        hostname: 'test.sandbox.dx.commercecloud.salesforce.com',
        codeVersion: 'test_version',
      };

      const badClient = new ScriptDebuggerClient(noCredentialsConfig);

      // When credentials are missing, the WebDAV check fails and reports no cartridge found
      // (The credential error is caught and treated as "cartridge not found")
      const result = await badClient.evaluateScript('test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('No compatible storefront cartridge found');
    });

    it('should throw error when no credentials available for debugger API with custom breakpoint', async () => {
      const noCredentialsConfig: SFCCConfig = {
        hostname: 'test.sandbox.dx.commercecloud.salesforce.com',
        codeVersion: 'test_version',
      };

      const badClient = new ScriptDebuggerClient(noCredentialsConfig);
      global.fetch = createMockFetch({});

      // With custom breakpoint, WebDAV check is skipped but auth still needed for debugger
      const result = await badClient.evaluateScript('test', {
        breakpointFile: '/my_cartridge/cartridge/controllers/Test.js',
        breakpointLine: 15,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('No authentication credentials available');
    });
  });
});
