/**
 * Configuration factory for SFCC MCP Server
 *
 * Centralized configuration management with validation and defaults
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { SFCCConfig, DwJsonConfig } from "./types.js";

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
    apiKey?: string;
    apiSecret?: string;
    siteId?: string;
  }): SFCCConfig {
    let config: SFCCConfig;

    // Load from dw.json if path provided
    if (options.dwJsonPath) {
      config = this.loadFromDwJson(options.dwJsonPath);
    } else {
      // Create from provided options
      config = {
        hostname: options.hostname || '',
        username: options.username,
        password: options.password,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        apiKey: options.apiKey,
        apiSecret: options.apiSecret,
        siteId: options.siteId,
      };
    }

    // Override with any provided options
    if (options.hostname) config.hostname = options.hostname;
    if (options.username) config.username = options.username;
    if (options.password) config.password = options.password;
    if (options.clientId) config.clientId = options.clientId;
    if (options.clientSecret) config.clientSecret = options.clientSecret;
    if (options.apiKey) config.apiKey = options.apiKey;
    if (options.apiSecret) config.apiSecret = options.apiSecret;
    if (options.siteId) config.siteId = options.siteId;

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
    if (dwConfig["client-id"] && dwConfig["client-secret"]) {
      config.clientId = dwConfig["client-id"];
      config.clientSecret = dwConfig["client-secret"];
    }

    return config;
  }

  /**
   * Validate configuration
   */
  private static validate(config: SFCCConfig): void {
    if (!config.hostname) {
      throw new Error("Hostname is required");
    }

    const hasBasicAuth = config.username && config.password;
    const hasOAuth = (config.clientId && config.clientSecret) || (config.apiKey && config.apiSecret);

    if (!hasBasicAuth && !hasOAuth) {
      throw new Error("Either username/password or OAuth credentials (clientId/clientSecret or apiKey/apiSecret) must be provided");
    }
  }

  /**
   * Check if configuration supports specific features
   */
  static getCapabilities(config: SFCCConfig): {
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
    canAccessWebDAV: boolean;
  } {
    // WebDAV/Logs can work with either basic auth OR OAuth credentials
    const hasWebDAVCredentials = !!(config.username && config.password) ||
                                 !!(config.apiKey && config.apiSecret);

    // OCAPI specifically requires OAuth credentials
    const hasOAuthCredentials = !!(config.clientId && config.clientSecret) ||
                               !!(config.apiKey && config.apiSecret);

    return {
      canAccessLogs: hasWebDAVCredentials,
      canAccessOCAPI: hasOAuthCredentials,
      canAccessWebDAV: hasWebDAVCredentials,
    };
  }
}
