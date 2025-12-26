#!/usr/bin/env node

/**
 * Main entry point for the SFCC Development MCP Server
 *
 * This module handles:
 * - Command-line argument parsing
 * - Configuration discovery (dw.json) from multiple sources
 * - Secure path validation for configuration files
 * - Server initialization and lifecycle management
 *
 * Configuration discovery priority:
 * 1. Explicit --dw-json command line argument
 * 2. Current working directory (./dw.json)
 * 3. Parent directories (../dw.json, ../../dw.json)
 * 4. User home directory (~/.dw.json or ~/dw.json)
 * 5. Environment variables (SFCC_HOSTNAME, etc.)
 */

import { SFCCDevServer } from './core/server.js';
import { ConfigurationFactory } from './config/configuration-factory.js';
import { Logger } from './utils/logger.js';
import { existsSync, realpathSync, statSync } from 'fs';
import { resolve, normalize, join, isAbsolute } from 'path';

/**
 * Maximum depth to search for dw.json in parent directories
 */
const MAX_PARENT_SEARCH_DEPTH = 3;

/**
 * Maximum file size for dw.json (1MB) - DoS prevention
 */
const MAX_CONFIG_FILE_SIZE = 1024 * 1024;

/**
 * Parse command line arguments to extract configuration options
 */
function parseCommandLineArgs(): { dwJsonPath?: string; debug?: boolean } {
  const args = process.argv.slice(2);
  const options: { dwJsonPath?: string; debug?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dw-json' && i + 1 < args.length) {
      options.dwJsonPath = args[i + 1];
      i++; // Skip the next argument since we consumed it
    } else if (arg === '--debug' && i + 1 < args.length) {
      const debugValue = args[i + 1].toLowerCase();
      options.debug = debugValue === 'true' || debugValue === '1' || debugValue === 'yes';
      i++; // Skip the next argument since we consumed it
    } else if (arg === '--debug') {
      // Allow --debug without a value to default to true
      options.debug = true;
    }
  }

  return options;
}

/**
 * Validates that a path is safe to use for configuration file access
 *
 * @param filePath - The path to validate
 * @returns Object with validation result and optional error message
 */
function validateConfigPath(filePath: string): { isValid: boolean; error?: string } {
  // Check for null bytes
  if (filePath.includes('\0')) {
    return { isValid: false, error: 'Path contains invalid characters' };
  }

  // Check for excessive length
  if (filePath.length > 4096) {
    return { isValid: false, error: 'Path is too long' };
  }

  try {
    const normalizedPath = normalize(resolve(filePath));

    // Must be absolute after resolution
    if (!isAbsolute(normalizedPath)) {
      return { isValid: false, error: 'Path must be absolute' };
    }

    // Must end with .json
    if (!normalizedPath.toLowerCase().endsWith('.json')) {
      return { isValid: false, error: 'Configuration file must be a .json file' };
    }

    // Check if file exists and is accessible
    if (!existsSync(normalizedPath)) {
      return { isValid: false, error: 'File does not exist' };
    }

    // Check file size
    const stats = statSync(normalizedPath);
    if (stats.size > MAX_CONFIG_FILE_SIZE) {
      return { isValid: false, error: 'Configuration file is too large' };
    }

    if (!stats.isFile()) {
      return { isValid: false, error: 'Path is not a file' };
    }

    // Resolve symlinks and verify the real path
    const realPath = realpathSync(normalizedPath);

    // Block access to sensitive system directories
    const blockedPaths = ['/etc', '/proc', '/sys', '/dev', '/root', '/var/log'];
    const lowerRealPath = realPath.toLowerCase();

    for (const blocked of blockedPaths) {
      if (lowerRealPath.startsWith(`${blocked  }/`) || lowerRealPath === blocked) {
        return { isValid: false, error: 'Access to system directories is not allowed' };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Path validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Find dw.json file in common locations with secure path validation
 *
 * This function searches for dw.json in a secure manner, validating
 * each potential path before returning it.
 *
 * @returns The path to dw.json if found and valid, undefined otherwise
 */
function findDwJsonFile(): string | undefined {
  const logger = Logger.getInstance();
  const candidatePaths: string[] = [];

  // Get current working directory (agent's working directory)
  const cwd = process.cwd();

  // Add current directory
  candidatePaths.push(join(cwd, 'dw.json'));

  // Add parent directories up to MAX_PARENT_SEARCH_DEPTH
  let parentDir = cwd;
  for (let i = 0; i < MAX_PARENT_SEARCH_DEPTH; i++) {
    const parent = resolve(parentDir, '..');
    if (parent === parentDir) {
      // Reached root, stop
      break;
    }
    parentDir = parent;
    candidatePaths.push(join(parentDir, 'dw.json'));
  }

  // Add common project subdirectories in current directory
  const commonSubdirs = ['config', '.vscode', 'cartridges'];
  for (const subdir of commonSubdirs) {
    candidatePaths.push(join(cwd, subdir, 'dw.json'));
  }

  // Add user home directory paths
  const homeDir = process.env.HOME ?? process.env.USERPROFILE;
  if (homeDir) {
    candidatePaths.push(join(homeDir, 'dw.json'));
    candidatePaths.push(join(homeDir, '.dw.json')); // Hidden config file
  }

  // Search through candidates with validation
  for (const candidatePath of candidatePaths) {
    try {
      const normalizedPath = normalize(resolve(candidatePath));

      // Quick existence check first
      if (!existsSync(normalizedPath)) {
        continue;
      }

      // Validate the path is safe to use
      const validation = validateConfigPath(normalizedPath);
      if (!validation.isValid) {
        logger.debug(`Skipping ${candidatePath}: ${validation.error}`);
        continue;
      }

      logger.debug(`Found dw.json at: ${normalizedPath}`);
      return normalizedPath;
    } catch (error) {
      // Skip paths that cause errors during validation
      logger.debug(`Error checking ${candidatePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return undefined;
}

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  try {
    const options = parseCommandLineArgs();
    const debug = options.debug ?? false;

    // Initialize the global logger with debug setting
    Logger.initialize('SFCC-MCP-Server', true, debug);
    const logger = Logger.getInstance();

    logger.log('Starting SFCC Development MCP Server...');
    if (debug) {
      logger.log('Debug mode enabled');
    }

    // Try to find dw.json if not explicitly provided
    const dwJsonPath = options.dwJsonPath ?? findDwJsonFile();

    // Create configuration using the factory
    const config = ConfigurationFactory.create({
      dwJsonPath,
      // Add support for environment variables as fallback
      hostname: process.env.SFCC_HOSTNAME,
      username: process.env.SFCC_USERNAME,
      password: process.env.SFCC_PASSWORD,
      clientId: process.env.SFCC_CLIENT_ID,
      clientSecret: process.env.SFCC_CLIENT_SECRET,
    });

    // Log configuration summary (without sensitive data)
    const capabilities = ConfigurationFactory.getCapabilities(config);

    if (capabilities.isLocalMode) {
      logger.log('Running in Local Mode - SFCC class documentation only');
      logger.log('To access SFCC logs and OCAPI, provide hostname and credentials');
    } else {
      logger.log(`Configuration loaded - Hostname: ${config.hostname}`);
      logger.log(`Available features: Logs=${capabilities.canAccessLogs}, OCAPI=${capabilities.canAccessOCAPI}, WebDAV=${capabilities.canAccessWebDAV}`);
    }

    // Create and start the server
    const server = new SFCCDevServer(config);
    await server.run();
  } catch (error) {
    const logger = Logger.getInstance();
    logger.error('Failed to start SFCC Development MCP Server:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        logger.log('\nConfiguration Help:');
        logger.log('1. Create a dw.json file with your SFCC credentials');
        logger.log('2. Use --dw-json /path/to/dw.json');
        logger.log('3. Set environment variables: SFCC_HOSTNAME, SFCC_USERNAME, SFCC_PASSWORD');
      }
    }

    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  const logger = Logger.getInstance();
  logger.error('Unhandled error:', error);
  process.exit(1);
});
