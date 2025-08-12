/**
 * Configuration loader for SFCC MCP Server
 *
 * This module handles loading and validating configuration from dw.json files
 * and command-line options for connecting to Salesforce B2C Commerce Cloud.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { SFCCConfig, DwJsonConfig } from './types.js';

/**
 * Validates that a file path is safe to access and prevents path traversal attacks
 *
 * @param filePath - The file path to validate
 * @returns The validated and resolved path
 * @throws Error if the path is unsafe
 */
function validateSecurePath(filePath: string): string {
  // Prevent null bytes and other dangerous characters
  if (filePath.includes('\0') || filePath.includes('\x00')) {
    throw new Error('Invalid characters in file path');
  }

  // Check if file extension is allowed (only .json files)
  const ext = extname(filePath).toLowerCase();
  if (ext !== '.json') {
    throw new Error('Only .json files are allowed');
  }

  // Normalize the path to prevent path traversal
  const resolvedPath = resolve(filePath);

  // Additional check: ensure the resolved path still ends with .json
  // This prevents attacks like "file.json/../../../etc/passwd"
  if (!resolvedPath.toLowerCase().endsWith('.json')) {
    throw new Error('Invalid file path');
  }

  return resolvedPath;
}

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
  let resolvedPath: string;

  try {
    // Validate and secure the path
    resolvedPath = validateSecurePath(dwJsonPath);
  } catch (error) {
    throw new Error(
      `Invalid file path: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

  if (!existsSync(resolvedPath)) {
    // Don't expose the full path in error messages for security
    throw new Error(`Configuration file not found: ${basename(dwJsonPath)}`);
  }

  try {
    const dwJsonContent = readFileSync(resolvedPath, 'utf-8');
    const dwConfig: DwJsonConfig = JSON.parse(dwJsonContent);

    // Validate required fields
    if (!dwConfig.hostname || !dwConfig.username || !dwConfig.password) {
      throw new Error('Configuration file must contain hostname, username, and password fields');
    }

    // Additional validation for hostname format (trim whitespace first)
    const trimmedHostname = dwConfig.hostname.trim();
    if (
      typeof dwConfig.hostname !== 'string' ||
      !trimmedHostname?.match(/^[a-zA-Z0-9.-]+$/)
    ) {
      throw new Error('Invalid hostname format in configuration');
    }

    // Map dw.json config to SFCCConfig (use original hostname to preserve user input)
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
      throw new Error(`Invalid JSON in configuration file: ${error.message}`);
    }
    throw error;
  }
}
