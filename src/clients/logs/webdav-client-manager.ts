/**
 * WebDAV client setup and authentication management
 */

import { createClient } from 'webdav';
import type { WebDAVClient } from 'webdav';
import { Logger } from '../../utils/logger.js';
import type { WebDAVClientConfig } from './log-types.js';

export class WebDAVClientManager {
  private logger: Logger;
  private client: WebDAVClient | null = null;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Setup and configure WebDAV client with authentication
   */
  setupClient(config: WebDAVClientConfig): WebDAVClient {
    const webdavUrl = `https://${config.hostname}/on/demandware.servlet/webdav/Sites/Logs/`;
    this.logger.debug('Setting up WebDAV client:', { hostname: config.hostname, url: webdavUrl });

    const authConfig = this.buildAuthConfig(config);
    this.client = createClient(webdavUrl, authConfig);

    return this.client;
  }

  /**
   * Get the current WebDAV client instance
   */
  getClient(): WebDAVClient {
    if (!this.client) {
      throw new Error('WebDAV client not initialized. Call setupClient() first.');
    }
    return this.client;
  }

  /**
   * Build authentication configuration for WebDAV client
   */
  private buildAuthConfig(config: WebDAVClientConfig): any {
    if (config.username && config.password) {
      this.logger.debug('Using basic authentication');
      return {
        username: config.username,
        password: config.password,
      };
    }

    if (config.clientId && config.clientSecret) {
      this.logger.debug('Using OAuth authentication (client credentials as basic auth for WebDAV)');
      return {
        username: config.clientId,
        password: config.clientSecret,
      };
    }

    throw new Error('Either username/password or clientId/clientSecret must be provided');
  }

  /**
   * Test WebDAV connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.getDirectoryContents('/');
      this.logger.debug('WebDAV connection test successful');
      return true;
    } catch (error) {
      this.logger.error('WebDAV connection test failed:', error);
      return false;
    }
  }
}
