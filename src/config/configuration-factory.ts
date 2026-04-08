/**
 * Configuration factory for SFCC MCP Server
 *
 * Centralized configuration management with validation and defaults.
 * This factory creates SFCCConfig objects from various sources while
 * leveraging secure file loading from the config module.
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { SFCCConfig, DwJsonConfig } from '../types/types.js';
import { loadSecureDwJson } from './dw-json-loader.js';
import {
  assertCredentialConsistency,
  assertValidHostnameFormat,
} from './credential-validation.js';

export class ConfigurationFactory {
  /**
   * Create configuration from various sources with proper validation
   */
  static create(options: {
    dwJsonPath?: string;
    hostname?: string;
    username?: string;
    password?: string;
    storefrontUsername?: string;
    storefrontPassword?: string;
    clientId?: string;
    clientSecret?: string;
    siteId?: string;
  }): SFCCConfig {
    let config: SFCCConfig;

    // Load from dw.json if path provided
    if (options.dwJsonPath) {
      const dwConfig = this.loadFromDwJson(options.dwJsonPath);
      config = this.mapDwJsonToConfig(dwConfig);
    } else {
      // Create from provided options
      config = {
        hostname: options.hostname ?? '',
        username: options.username,
        password: options.password,
        storefrontUsername: options.storefrontUsername,
        storefrontPassword: options.storefrontPassword,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        siteId: options.siteId,
      };
    }

    // Override with any provided options (command-line args take precedence)
    if (options.hostname) {config.hostname = options.hostname;}
    if (options.username) {config.username = options.username;}
    if (options.password) {config.password = options.password;}
    if (options.storefrontUsername) {config.storefrontUsername = options.storefrontUsername;}
    if (options.storefrontPassword) {config.storefrontPassword = options.storefrontPassword;}
    if (options.clientId) {config.clientId = options.clientId;}
    if (options.clientSecret) {config.clientSecret = options.clientSecret;}
    if (options.siteId) {config.siteId = options.siteId;}

    this.validate(config);
    return config;
  }

  /**
   * Load configuration from dw.json file using secure file loading
   *
   * @param dwJsonPath - Path to the dw.json file
   * @returns Parsed dw.json configuration
   * @throws Error if file cannot be loaded or is invalid
   */
  private static loadFromDwJson(dwJsonPath: string): DwJsonConfig {
    const resolvedPath = resolve(dwJsonPath);

    if (!existsSync(resolvedPath)) {
      throw new Error(`dw.json file not found at: ${resolvedPath}`);
    }

    // Use the secure loading function from dw-json-loader.ts
    // This ensures all security validations are applied consistently
    return loadSecureDwJson(dwJsonPath);
  }

  /**
   * Map dw.json structure to SFCCConfig
   *
   * Transforms the dw.json format (with kebab-case properties) to the
   * internal SFCCConfig format (with camelCase properties).
   *
   * @param dwConfig - The parsed dw.json configuration
   * @returns Mapped SFCCConfig object
   */
  static mapDwJsonToConfig(dwConfig: DwJsonConfig): SFCCConfig {
    const config: SFCCConfig = {
      hostname: dwConfig.hostname,
      username: dwConfig.username,
      password: dwConfig.password,
      storefrontUsername: dwConfig.storefrontUsername,
      storefrontPassword: dwConfig.storefrontPassword,
    };

    // Map OAuth credentials if present
    if (dwConfig['client-id'] && dwConfig['client-secret']) {
      config.clientId = dwConfig['client-id'];
      config.clientSecret = dwConfig['client-secret'];
    }

    // Map site ID if present
    if (dwConfig['site-id']) {
      config.siteId = dwConfig['site-id'];
    }

    // Map code version if present
    if (dwConfig['code-version']) {
      config.codeVersion = dwConfig['code-version'];
    }

    return config;
  }

  /**
   * Validate configuration for different operating modes
   *
   * This validation supports both documentation-only mode (no credentials required)
   * and full mode (credentials required for API access).
   *
   * @param config - The configuration to validate
   * @throws Error if configuration is invalid for any supported mode
   */
  private static validate(config: SFCCConfig): void {
    const { hasBasicAuth, hasOAuth } = assertCredentialConsistency({
      username: config.username,
      password: config.password,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });

    assertCredentialConsistency(
      {
        username: config.storefrontUsername,
        password: config.storefrontPassword,
      },
      {
        basicPairMessage: 'Storefront credentials must include both storefrontUsername and storefrontPassword',
      },
    );

    const hasHostname = config.hostname && config.hostname.trim() !== '';

    // Allow local mode if no credentials or hostname are provided
    if (!hasBasicAuth && !hasOAuth && !hasHostname) {
      // Local mode - only class documentation available
      return;
    }

    // Credentials without hostname is an invalid partial configuration.
    if (!hasHostname && (hasBasicAuth || hasOAuth)) {
      throw new Error(
        'When credentials are provided, hostname must also be provided',
      );
    }

    // If hostname is provided, require credentials
    if (hasHostname && !hasBasicAuth && !hasOAuth) {
      throw new Error(
        'When hostname is provided, either username/password or OAuth credentials (clientId/clientSecret) must be provided',
      );
    }

    // Additional hostname validation if provided
    if (hasHostname) {
      assertValidHostnameFormat(config.hostname!, 'Invalid hostname format in configuration');
    }
  }

  /**
   * Check if configuration supports specific features
   *
   * This method analyzes the provided configuration to determine what
   * capabilities are available based on the credentials and hostname provided.
   *
   * @param config - The configuration to analyze
   * @returns Object describing available capabilities
   */
  static getCapabilities(config: SFCCConfig): {
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
    canAccessWebDAV: boolean;
    canGenerateCartridges: boolean;
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
      canGenerateCartridges: true, // Always available since it's a local file operation
      isLocalMode,
    };
  }

  /**
   * Create a configuration for local development mode
   *
   * This creates a minimal configuration that only provides access to
  * documentation without requiring any SFCC credentials.
   *
   * @returns Configuration for local/documentation-only mode
   */
  static createLocalMode(): SFCCConfig {
    return {
      hostname: '',
      username: undefined,
      password: undefined,
      storefrontUsername: undefined,
      storefrontPassword: undefined,
      clientId: undefined,
      clientSecret: undefined,
      siteId: undefined,
    };
  }
}
