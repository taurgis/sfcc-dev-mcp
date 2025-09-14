import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { MockWebDAVServerManager, withMockWebDAVServer } from './servers/webdav-manager';

/**
 * Integration tests for the Mock WebDAV Server
 *
 * These tests demonstrate how to use the mock WebDAV server
 * for testing log-related functionality.
 */

describe('Mock WebDAV Server Integration', () => {
  let serverManager: MockWebDAVServerManager;

  beforeAll(async () => {
    serverManager = new MockWebDAVServerManager({
      port: 3002, // Use different port for tests
      dev: false,
      autoSetup: true,
    });

    // Check if server is available before running tests
    const isAvailable = await serverManager.isServerAvailable();
    if (!isAvailable) {
      console.warn('⚠️  WebDAV server not available, skipping tests');
      return;
    }

    await serverManager.start();
  }, 15000); // 15 second timeout for server startup

  afterAll(async () => {
    if (serverManager?.isRunning()) {
      await serverManager.stop();
    }
  }, 10000); // 10 second timeout for server shutdown

  test('should start server and be accessible', async () => {
    if (!await serverManager.isServerAvailable()) {
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    expect(serverManager.isRunning()).toBe(true);
    expect(serverManager.getServerUrl()).toBe('http://localhost:3002');
    expect(serverManager.getLogsUrl()).toBe('http://localhost:3002/on/demandware.servlet/webdav/Sites/Logs/');
    expect(serverManager.getDirectLogsUrl()).toBe('http://localhost:3002/Logs/');
  });

  test('should serve WebDAV directory listing', async () => {
    if (!await serverManager.isServerAvailable()) {
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    // Test SFCC WebDAV path
    const response = await fetch(serverManager.getLogsUrl(), {
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
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    // First get the directory listing to find an actual log file
    const listResponse = await fetch(serverManager.getLogsUrl(), {
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
    const logFileUrl = `${serverManager.getLogsUrl()}${errorLogFile}`;

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
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    const jobsUrl = `${serverManager.getLogsUrl()}jobs/`;
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
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    const jobLogUrl = `${serverManager.getLogsUrl()}jobs/ProcessOrders/Job-ProcessOrders-1234567890.log`;
    const response = await fetch(jobLogUrl);

    expect(response.status).toBe(200);

    const logContent = await response.text();
    expect(logContent).toContain('Executing job [ProcessOrders][1234567890]...');
    expect(logContent).toContain('INFO');
    expect(logContent).toContain('SystemJobThread');
    expect(logContent).toContain('ValidateOrdersStep');
  });
});

/**
 * Example of how to use withMockWebDAVServer utility
 */
describe('Mock WebDAV Server Utility Function', () => {
  test('should work with utility function', async () => {
    const isAvailable = await new MockWebDAVServerManager().isServerAvailable();
    if (!isAvailable) {
      console.warn('⚠️  Skipping test - WebDAV server not available');
      return;
    }

    const result = await withMockWebDAVServer(
      async (serverUrl, logsUrl, directLogsUrl) => {
        expect(serverUrl).toContain('http://localhost:');
        expect(logsUrl).toContain('/on/demandware.servlet/webdav/Sites/Logs/');
        expect(directLogsUrl).toContain('/Logs/');

        // Test the SFCC WebDAV path
        const response = await fetch(logsUrl, {
          method: 'PROPFIND',
          headers: { 'Depth': '1' },
        });

        return response.status;
      },
      { port: 3003 },
    );

    expect(result).toBe(207); // WebDAV Multi-Status
  }, 15000); // 15 second timeout for utility test
});
