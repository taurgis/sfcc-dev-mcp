#!/usr/bin/env node

/**
 * Main entry point for the SFCC Development MCP Server
 */

import { SFCCDevServer } from './server.js';
import { ConfigurationFactory } from './configuration-factory.js';
import { Logger } from './logger.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

const logger = new Logger('SFCC-MCP-Server');

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
 * Find dw.json file in common locations
 */
function findDwJsonFile(): string | undefined {
  const commonPaths = [
    './dw.json',
    '../dw.json',
    '../../dw.json',
    process.env.HOME ? resolve(process.env.HOME, 'dw.json') : null,
  ].filter(Boolean) as string[];

  for (const path of commonPaths) {
    if (existsSync(path)) {
      logger.debug(`Found dw.json at: ${path}`);
      return path;
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
    const server = new SFCCDevServer(config, debug);
    await server.run();
  } catch (error) {
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
  logger.error('Unhandled error:', error);
  process.exit(1);
});
