/**
 * Configuration factory for SFCC MCP Server
 *
 * Centralized configuration management with validation and defaults
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { SFCCConfig, DwJsonConfig } from '../types/types.js';

export class ConfigurationFactory {
  /**
   * Create configuration from various sources with proper validation
   */
  static create(options: {
    dwJsonPath?: string;
    hostname?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    siteId?: string;
  }): SFCCConfig {
    let config: SFCCConfig;

    // Load from dw.json if path provided
    if (options.dwJsonPath) {
      config = this.loadFromDwJson(options.dwJsonPath);
    } else {
      // Create from provided options
      config = {
        hostname: options.hostname ?? '',
        username: options.username,
        password: options.password,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        siteId: options.siteId,
      };
    }

    // Override with any provided options
    if (options.hostname) {config.hostname = options.hostname;}
    if (options.username) {config.username = options.username;}
    if (options.password) {config.password = options.password;}
    if (options.clientId) {config.clientId = options.clientId;}
    if (options.clientSecret) {config.clientSecret = options.clientSecret;}
    if (options.siteId) {config.siteId = options.siteId;}

    this.validate(config);
    return config;
  }

  /**
   * Load configuration from dw.json file
   */
  private static loadFromDwJson(dwJsonPath: string): SFCCConfig {
    const resolvedPath = resolve(dwJsonPath);

    if (!existsSync(resolvedPath)) {
      throw new Error(`dw.json file not found at: ${resolvedPath}`);
    }

    try {
      const dwJsonContent = readFileSync(resolvedPath, 'utf-8');
      const dwConfig: DwJsonConfig = JSON.parse(dwJsonContent);

      return this.mapDwJsonToConfig(dwConfig);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in dw.json file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Map dw.json structure to SFCCConfig
   */
  private static mapDwJsonToConfig(dwConfig: DwJsonConfig): SFCCConfig {
    const config: SFCCConfig = {
      hostname: dwConfig.hostname,
      username: dwConfig.username,
      password: dwConfig.password,
    };

    // Map OAuth credentials if present
    if (dwConfig['client-id'] && dwConfig['client-secret']) {
      config.clientId = dwConfig['client-id'];
      config.clientSecret = dwConfig['client-secret'];
    }

    return config;
  }

  /**
   * Validate configuration
   */
  private static validate(config: SFCCConfig): void {
    const hasBasicAuth = config.username && config.password;
    const hasOAuth = (config.clientId && config.clientSecret);
    const hasHostname = config.hostname && config.hostname.trim() !== '';

    // Allow local mode if no credentials or hostname are provided
    if (!hasBasicAuth && !hasOAuth && !hasHostname) {
      // Local mode - only class documentation available
      return;
    }

    // If hostname is provided, require credentials
    if (hasHostname && !hasBasicAuth && !hasOAuth) {
      throw new Error('When hostname is provided, either username/password or OAuth credentials (clientId/clientSecret) must be provided');
    }
  }

  /**
   * Check if configuration supports specific features
   */
  static getCapabilities(config: SFCCConfig): {
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
    canAccessWebDAV: boolean;
    isLocalMode: boolean;
  } {
    // WebDAV/Logs can work with either basic auth OR OAuth credentials
    const hasWebDAVCredentials = !!(config.username && config.password) ||
                                 !!(config.clientId && config.clientSecret);

    // OCAPI specifically requires OAuth credentials
    const hasOAuthCredentials = !!(config.clientId && config.clientSecret);

    // Local mode when no hostname or credentials are provided
    const hasHostname = !!(config.hostname && config.hostname.trim() !== '');
    const isLocalMode = !hasHostname && !hasWebDAVCredentials;

    return {
      canAccessLogs: hasWebDAVCredentials && hasHostname,
      canAccessOCAPI: hasOAuthCredentials && hasHostname,
      canAccessWebDAV: hasWebDAVCredentials && hasHostname,
      isLocalMode,
    };
  }
}
