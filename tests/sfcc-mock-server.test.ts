import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { SFCCMockServerManager, withSFCCMockServer } from './servers/sfcc-mock-server-manager';

/**
 * Integration tests for the Unified SFCC Mock Server
 *
 * These tests demonstrate how to use the unified SFCC mock server
 * for testing both WebDAV log functionality and OCAPI simulation.
 * The server combines both protocols into a single endpoint.
 */

describe('Unified SFCC Mock Server Integration', () => {
  let serverManager: SFCCMockServerManager;

  beforeAll(async () => {
    serverManager = new SFCCMockServerManager({
      port: 3002, // Use different port for tests
      dev: false,
      autoSetup: true,
    });

    // Check if server is available before running tests
    const isAvailable = await serverManager.isServerAvailable();
    if (!isAvailable) {
      console.warn('⚠️  SFCC mock server not available, skipping tests');
      return;
    }

    await serverManager.start();
  }, 20000); // 20 second timeout for server startup (includes log setup)

  afterAll(async () => {
    if (serverManager?.isRunning()) {
      await serverManager.stop();
    }
  }, 10000); // 10 second timeout for server shutdown

  describe('Server Startup and Basic Functionality', () => {
    test('should start server and be accessible', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      expect(serverManager.isRunning()).toBe(true);
      expect(serverManager.getServerUrl()).toBe('http://localhost:3002');
      expect(serverManager.getWebDAVLogsUrl()).toBe('http://localhost:3002/on/demandware.servlet/webdav/Sites/Logs/');
      expect(serverManager.getDirectLogsUrl()).toBe('http://localhost:3002/Logs/');
      expect(serverManager.getOCAPIUrl()).toBe('http://localhost:3002/s/-/dw/data/v23_2');
      expect(serverManager.getOAuthUrl()).toBe('http://localhost:3002/dw/oauth2/access_token');
    });

    test('should respond to health check', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const response = await fetch(`${serverManager.getServerUrl()}/health`);
      expect(response.status).toBe(200);

      const healthData = await response.json();
      expect(healthData).toHaveProperty('status', 'ok');
      expect(healthData).toHaveProperty('message');
    });
  });

  describe('WebDAV Functionality', () => {
    test('should serve WebDAV directory listing', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      // Test SFCC WebDAV path
      const response = await fetch(serverManager.getWebDAVLogsUrl(), {
        method: 'PROPFIND',
        headers: {
          'Depth': '1',
          'Content-Type': 'application/xml',
        },
      });

      expect(response.status).toBe(207); // Multi-Status (WebDAV response)

      const responseText = await response.text();
      expect(responseText).toContain('error-blade-');
      expect(responseText).toContain('warn-blade-');
      expect(responseText).toContain('info-blade-');
      expect(responseText).toContain('debug-blade-');
      expect(responseText).toContain('jobs');

      // Also test direct path for backward compatibility
      const directResponse = await fetch(serverManager.getDirectLogsUrl(), {
        method: 'PROPFIND',
        headers: {
          'Depth': '1',
          'Content-Type': 'application/xml',
        },
      });

      expect(directResponse.status).toBe(207);
    });

    test('should serve log file content', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      // First get the directory listing to find an actual log file
      const listResponse = await fetch(serverManager.getWebDAVLogsUrl(), {
        method: 'PROPFIND',
        headers: {
          'Depth': '1',
          'Content-Type': 'application/xml',
        },
      });

      const listingXml = await listResponse.text();

      // Extract error log filename from the XML response
      const errorLogMatch = listingXml.match(/error-blade-[^<]+\.log/);
      if (!errorLogMatch) {
        throw new Error('No error log file found in directory listing');
      }

      const errorLogFile = errorLogMatch[0];
      const logFileUrl = `${serverManager.getWebDAVLogsUrl()}${errorLogFile}`;

      // Get the log file content
      const logResponse = await fetch(logFileUrl);
      expect(logResponse.status).toBe(200);

      const logContent = await logResponse.text();
      expect(logContent).toContain('ERROR');
      expect(logContent).toContain('SystemJobThread');
      expect(logContent).toContain('PipelineCallServlet');
    });

    test('should serve job logs directory', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const jobsUrl = `${serverManager.getWebDAVLogsUrl()}jobs/`;
      const response = await fetch(jobsUrl, {
        method: 'PROPFIND',
        headers: {
          'Depth': '1',
          'Content-Type': 'application/xml',
        },
      });

      expect(response.status).toBe(207); // Multi-Status (WebDAV response)

      const responseText = await response.text();
      expect(responseText).toContain('ProcessOrders');
      expect(responseText).toContain('ImportCatalog');
    });

    test('should serve job log file content', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const jobLogUrl = `${serverManager.getWebDAVLogsUrl()}jobs/ProcessOrders/Job-ProcessOrders-1234567890.log`;
      const response = await fetch(jobLogUrl);

      expect(response.status).toBe(200);

      const logContent = await response.text();
      expect(logContent).toContain('Executing job [ProcessOrders][1234567890]...');
      expect(logContent).toContain('INFO');
      expect(logContent).toContain('SystemJobThread');
      expect(logContent).toContain('ValidateOrdersStep');
    });

    test('should support range requests for log files', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      // Get a log file with range request (last 100 bytes)
      const listResponse = await fetch(serverManager.getWebDAVLogsUrl(), {
        method: 'PROPFIND',
        headers: { 'Depth': '1' },
      });

      const listingXml = await listResponse.text();
      const errorLogMatch = listingXml.match(/error-blade-[^<]+\.log/);

      if (!errorLogMatch) {
        console.warn('⚠️  No error log file found, skipping range request test');
        return;
      }

      const errorLogFile = errorLogMatch[0];
      const logFileUrl = `${serverManager.getWebDAVLogsUrl()}${errorLogFile}`;

      const rangeResponse = await fetch(logFileUrl, {
        headers: {
          'Range': 'bytes=-100', // Last 100 bytes
        },
      });

      expect([200, 206, 416])
        .toContain(rangeResponse.status); // 200 OK, 206 Partial Content, or 416 Range Not Satisfiable
    });
  });

  describe('OCAPI Functionality', () => {
    test('should handle OAuth token request', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const response = await fetch(serverManager.getOAuthUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0', // test-client-id:test-client-secret
        },
        body: 'grant_type=client_credentials',
      });

      expect(response.status).toBe(200);

      const tokenData = await response.json();
      expect(tokenData).toHaveProperty('access_token');
      expect(tokenData).toHaveProperty('token_type', 'Bearer');
      expect(tokenData).toHaveProperty('expires_in');
    });

    test('should serve system object types', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      // First get OAuth token
      const tokenResponse = await fetch(serverManager.getOAuthUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
        },
        body: 'grant_type=client_credentials',
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Test system object types endpoint
      const response = await fetch(`${serverManager.getOCAPIUrl()}/system_object_definitions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);

      // Check for some common system objects
      const objectIds = data.data.map((obj: any) => obj.object_type);
      expect(objectIds).toContain('Basket');
      expect(objectIds).toContain('CustomObject');
    });

    test('should serve site preferences', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      // First get OAuth token
      const tokenResponse = await fetch(serverManager.getOAuthUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
        },
        body: 'grant_type=client_credentials',
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Test site preferences search endpoint
      const searchBody = {
        query: {
          match_all_query: {},
        },
        select: '(**)',
        count: 200,
      };

      const response = await fetch(`${serverManager.getOCAPIUrl()}/site_preferences/preference_groups/CCV/sandbox/preference_search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('hits');
      expect(Array.isArray(data.hits)).toBe(true);
    });

    test('should handle invalid OAuth requests', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const response = await fetch(serverManager.getOAuthUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic invalid_credentials',
        },
        body: 'grant_type=client_credentials',
      });

      expect(response.status).toBe(401);
    });

    test('should handle unauthorized OCAPI requests', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const response = await fetch(`${serverManager.getOCAPIUrl()}/system_object_definitions`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);
    });
  });

  describe('CORS and Cross-Origin Support', () => {
    test('should include CORS headers', async () => {
      if (!await serverManager.isServerAvailable()) {
        console.warn('⚠️  Skipping test - SFCC mock server not available');
        return;
      }

      const response = await fetch(serverManager.getServerUrl(), {
        method: 'OPTIONS',
      });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('PROPFIND');
    });
  });
});

/**
 * Example of how to use withSFCCMockServer utility
 */
describe('SFCC Mock Server Utility Function', () => {
  test('should work with utility function', async () => {
    const manager = new SFCCMockServerManager();
    const isAvailable = await manager.isServerAvailable();
    if (!isAvailable) {
      console.warn('⚠️  Skipping test - SFCC mock server not available');
      return;
    }

    const result = await withSFCCMockServer(
      async (serverUrl, webdavLogsUrl, directLogsUrl, ocapiUrl, oauthUrl) => {
        expect(serverUrl).toContain('http://localhost:');
        expect(webdavLogsUrl).toContain('/on/demandware.servlet/webdav/Sites/Logs/');
        expect(directLogsUrl).toContain('/Logs/');
        expect(ocapiUrl).toContain('/s/-/dw/data');
        expect(oauthUrl).toContain('/dw/oauth2/access_token');

        // Test both WebDAV and OCAPI functionality
        const webdavResponse = await fetch(webdavLogsUrl, {
          method: 'PROPFIND',
          headers: { 'Depth': '1' },
        });

        const oauthResponse = await fetch(oauthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic dGVzdC1jbGllbnQtaWQ6dGVzdC1jbGllbnQtc2VjcmV0',
          },
          body: 'grant_type=client_credentials',
        });

        return {
          webdavStatus: webdavResponse.status,
          oauthStatus: oauthResponse.status,
        };
      },
      { port: 3005 },
    );

    expect(result.webdavStatus).toBe(207); // WebDAV Multi-Status
    expect(result.oauthStatus).toBe(200); // OAuth success
  }, 25000); // 25 second timeout for utility test
});
