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
 * Configuration discovery priority (highest to lowest):
 * 1. Explicit --dw-json command line argument
 * 2. Environment variables (SFCC_HOSTNAME, etc.)
 * 3. MCP workspace roots discovery (after client connection)
 * 4. Current working directory fallback (disabled by default, unreliable)
 *
 * Note: CWD-based discovery is disabled because MCP servers often run
 * with cwd set to the user's home directory, not the project directory.
 * The MCP workspace roots mechanism provides the correct project context.
 */

import { SFCCDevServer } from './core/server.js';
import { ConfigurationFactory } from './config/configuration-factory.js';
import { Logger } from './utils/logger.js';

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
 * Check if environment variables provide SFCC credentials
 */
function hasEnvironmentCredentials(): boolean {
  const hasBasicAuth = !!(process.env.SFCC_USERNAME && process.env.SFCC_PASSWORD);
  const hasOAuth = !!(process.env.SFCC_CLIENT_ID && process.env.SFCC_CLIENT_SECRET);
  return !!(process.env.SFCC_HOSTNAME && (hasBasicAuth || hasOAuth));
}

/**
 * Main application entry point
 *
 * Configuration discovery priority:
 * 1. CLI --dw-json parameter (explicit, highest priority)
 * 2. Environment variables (SFCC_HOSTNAME, etc.)
 * 3. MCP workspace roots (discovered after client connection - most reliable for project context)
 *
 * Note: CWD-based auto-discovery is intentionally NOT used because MCP servers
 * often start with cwd=/Users/xxx (home directory), not the project directory.
 */
async function main(): Promise<void> {
  try {
    const options = parseCommandLineArgs();
    const debug = options.debug ?? false;

    // Initialize the global logger with debug setting
    Logger.initialize('SFCC-MCP-Server', true, debug);
    const logger = Logger.getInstance();

    logger.log('Starting SFCC Development MCP Server...');
    logger.log(`[main] Current working directory: ${process.cwd()}`);
    logger.log(`[main] Command line args: ${JSON.stringify(process.argv.slice(2))}`);
    if (debug) {
      logger.log('[main] Debug mode enabled');
    }

    // Priority 1: Explicit CLI parameter
    if (options.dwJsonPath) {
      logger.log(`[main] Using explicit dw.json path from CLI: ${options.dwJsonPath}`);
    }

    // Priority 2: Environment variables
    const hasEnvCredentials = hasEnvironmentCredentials();
    if (hasEnvCredentials) {
      logger.log('[main] Environment variables provide SFCC credentials');
    }

    // Determine initial configuration source
    // - If CLI path provided: use it
    // - If env vars set: use them
    // - Otherwise: start in local mode, MCP workspace discovery will upgrade later
    const dwJsonPath = options.dwJsonPath; // Only use explicit CLI path, not auto-discovery

    // Create configuration using the factory
    const config = ConfigurationFactory.create({
      dwJsonPath,
      // Environment variables as fallback (Priority 2)
      hostname: process.env.SFCC_HOSTNAME,
      username: process.env.SFCC_USERNAME,
      password: process.env.SFCC_PASSWORD,
      clientId: process.env.SFCC_CLIENT_ID,
      clientSecret: process.env.SFCC_CLIENT_SECRET,
    });

    logger.log(`[main] Config created - hostname: "${config.hostname}"`);

    // Log configuration summary (without sensitive data)
    const capabilities = ConfigurationFactory.getCapabilities(config);
    logger.log(`[main] Capabilities: ${JSON.stringify(capabilities)}`);

    if (capabilities.isLocalMode) {
      logger.log('[main] Starting in Local Mode - documentation only');
      logger.log('[main] MCP workspace roots discovery will attempt to find dw.json after client connects');
      logger.log('[main] To skip discovery, use --dw-json or set SFCC_* environment variables');
    } else {
      const source = options.dwJsonPath ? 'CLI parameter' : 'environment variables';
      logger.log(`[main] Configuration loaded from ${source}`);
      logger.log(`[main] Hostname: ${config.hostname}`);
      logger.log(`[main] Available features: Logs=${capabilities.canAccessLogs}, OCAPI=${capabilities.canAccessOCAPI}, WebDAV=${capabilities.canAccessWebDAV}`);
    }

    // Create and start the server
    logger.log('[main] Creating SFCCDevServer...');
    const server = new SFCCDevServer(config);
    logger.log('[main] Starting server.run()...');
    await server.run();
  } catch (error) {
    const logger = Logger.getInstance();
    logger.error('Failed to start SFCC Development MCP Server:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        logger.log('\nConfiguration Help:');
        logger.log('1. Open a VS Code workspace with a dw.json file (recommended - auto-discovered)');
        logger.log('2. Use --dw-json /path/to/dw.json (explicit path)');
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
