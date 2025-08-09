#!/usr/bin/env node

/**
 * Main entry point for the SFCC Development MCP Server
 *
 * This script initializes and starts the MCP server with SFCC development capabilities
 * including log analysis and comprehensive documentation querying.
 *
 * Usage:
 *   node build/main.js
 *   npm start
 *   npm run start -- --dw-json /path/to/dw.json
 *   npm run start -- --dw-json ./dw.json
 *   npm run start -- --debug true
 *   npm run start -- --debug false
 *   npm run start -- --debug
 *   npm run start -- --dw-json ./dw.json --debug false
 */

import { SFCCDevServer } from "./server.js";
import { SFCCConfig } from "./types.js";
import { Logger } from "./logger.js";
import { loadDwJsonConfig } from "./config.js";
import { existsSync } from "fs";
import { resolve } from "path";

// Create a logger instance for this module
const logger = new Logger('SFCC-MCP-Server');

/**
 * Parse command line arguments to extract configuration options
 */
function parseCommandLineArgs(): { dwJsonPath?: string; debug?: boolean } {
  const args = process.argv.slice(2);
  const options: { dwJsonPath?: string; debug?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--dw-json" && i + 1 < args.length) {
      options.dwJsonPath = args[i + 1];
      i++; // Skip the next argument since we consumed it
    } else if (arg === "--debug" && i + 1 < args.length) {
      const debugValue = args[i + 1].toLowerCase();
      options.debug = debugValue === "true" || debugValue === "1" || debugValue === "yes";
      i++; // Skip the next argument since we consumed it
    } else if (arg === "--debug") {
      // Allow --debug without a value to default to true
      options.debug = true;
    }
  }

  return options;
}

/**
 * Load configuration from various sources in order of preference:
 * 1. Command line --dw-json argument
 * 2. ./dw.json in current directory
 * 3. Environment variables
 * 4. Default values
 */
function loadConfiguration(): SFCCConfig {
  const { dwJsonPath } = parseCommandLineArgs();

  // 1. Try command line argument first
  if (dwJsonPath) {
    const resolvedPath = resolve(dwJsonPath);

    if (!existsSync(resolvedPath)) {
      logger.error(`Error: dw.json file not found at: ${resolvedPath}`);
      process.exit(1);
    }

    logger.log(`Loading configuration from: ${resolvedPath}`);
    return loadDwJsonConfig(resolvedPath);
  }

  // 2. Try ./dw.json in current directory
  const defaultDwJsonPath = "./dw.json";
  if (existsSync(defaultDwJsonPath)) {
    logger.log(`Loading configuration from: ${resolve(defaultDwJsonPath)}`);
    return loadDwJsonConfig(defaultDwJsonPath);
  }

  // 3. Fall back to environment variables
  logger.log("Loading configuration from environment variables");
  const config: SFCCConfig = {
    hostname: process.env.SFCC_HOSTNAME || "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
    clientId: process.env.SFCC_CLIENT_ID || "",
    clientSecret: process.env.SFCC_CLIENT_SECRET || "",
    username: process.env.SFCC_USERNAME || "",
    password: process.env.SFCC_PASSWORD || "",
    siteId: process.env.SFCC_SITE_ID || "RefArch",
  };

  return config;
}

async function main() {
  try {
    // Parse command line arguments to get debug flag
    const { debug } = parseCommandLineArgs();

    // Create a new logger with debug setting from command line
    const mainLogger = new Logger('SFCC-MCP-Server', true, debug || false);

    // Load configuration from dw.json or environment variables
    const config = loadConfiguration();

    mainLogger.log("Configuration loaded:", config);
    if (debug !== undefined) {
      mainLogger.log(`Debug logging: ${debug ? 'enabled' : 'disabled'}`);
    }

    // Validate that we have the minimum required configuration
    if (!config.hostname) {
      mainLogger.error("Error: SFCC hostname is required. Please provide it via:");
      mainLogger.error("  1. dw.json file: npm run start -- --dw-json /path/to/dw.json");
      mainLogger.error("  2. Environment variable: SFCC_HOSTNAME=your-instance.com npm start");
      process.exit(1);
    }

    if (!config.username && !config.clientId) {
      mainLogger.error("Error: Authentication credentials are required. Please provide either:");
      mainLogger.error("  1. Username/password in dw.json or via SFCC_USERNAME/SFCC_PASSWORD");
      mainLogger.error("  2. Client ID/secret via SFCC_CLIENT_ID/SFCC_CLIENT_SECRET");
      process.exit(1);
    }

    const server = new SFCCDevServer(config, debug ?? false);

    mainLogger.log("Starting SFCC Development MCP Server...");
    mainLogger.log(`Connected to: ${config.hostname}`);
    mainLogger.log(`Authentication: ${config.username ? "Username/Password" : "Client ID/Secret"}`);

    await server.run();
  } catch (error) {
    // Use a basic logger for error cases
    const errorLogger = new Logger('SFCC-MCP-Server');
    errorLogger.error("Failed to start SFCC Development MCP server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.log("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.log("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

main();
