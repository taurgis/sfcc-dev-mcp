/**
 * Configuration loader for SFCC MCP Server
 *
 * This module handles loading and validating configuration from dw.json files
 * and command-line options for connecting to Salesforce B2C Commerce Cloud.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { SFCCConfig, DwJsonConfig } from './types.js';

/**
 * Load configuration from a dw.json file
 *
 * The dw.json file is the standard configuration format used by Salesforce Commerce Cloud
 * development tools. This function reads and validates the configuration.
 *
 * @param dwJsonPath - Path to the dw.json file
 * @returns Parsed and validated SFCC configuration
 * @throws Error if file doesn't exist, is invalid JSON, or missing required fields
 */
export function loadDwJsonConfig(dwJsonPath: string): SFCCConfig {
  const resolvedPath = resolve(dwJsonPath);

  if (!existsSync(resolvedPath)) {
    throw new Error(`dw.json file not found at: ${resolvedPath}`);
  }

  try {
    const dwJsonContent = readFileSync(resolvedPath, 'utf-8');
    const dwConfig: DwJsonConfig = JSON.parse(dwJsonContent);

    // Validate required fields
    if (!dwConfig.hostname || !dwConfig.username || !dwConfig.password) {
      throw new Error('dw.json must contain hostname, username, and password fields');
    }

    // Map dw.json config to SFCCConfig
    const config: SFCCConfig = {
      hostname: dwConfig.hostname,
      username: dwConfig.username,
      password: dwConfig.password,
    };

    // If client-id and client-secret are present, use them as OAuth credentials
    if (dwConfig['client-id'] && dwConfig['client-secret']) {
      config.clientId = dwConfig['client-id'];
      config.clientSecret = dwConfig['client-secret'];
    }

    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in dw.json file: ${error.message}`);
    }
    throw error;
  }
}
