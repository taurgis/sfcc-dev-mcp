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
 * 4. Default values (empty config for docs-only mode)
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

  // 3. Try environment variables
  const envHostname = process.env.SFCC_HOSTNAME;
  const envUsername = process.env.SFCC_USERNAME;
  const envPassword = process.env.SFCC_PASSWORD;
  const envClientId = process.env.SFCC_CLIENT_ID;
  const envClientSecret = process.env.SFCC_CLIENT_SECRET;

  // Check if we have any environment configuration
  if (envHostname || envUsername || envClientId) {
    logger.log("Loading configuration from environment variables");
    const config: SFCCConfig = {
      hostname: envHostname || "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
      clientId: envClientId || "",
      clientSecret: envClientSecret || "",
      username: envUsername || "",
      password: envPassword || "",
      siteId: process.env.SFCC_SITE_ID || "RefArch",
    };
    return config;
  }

  // 4. Return empty config for docs-only mode
  logger.log("No SFCC credentials found - running in documentation-only mode");
  return {
    hostname: "",
    clientId: "",
    clientSecret: "",
    username: "",
    password: "",
    siteId: "",
  };
}

async function main() {
  try {
    // Parse command line arguments to get debug flag
    const { debug } = parseCommandLineArgs();

    // Create a new logger with debug setting from command line
    const mainLogger = new Logger('SFCC-MCP-Server', true, debug ?? false);

    // Load configuration from dw.json or environment variables
    const config = loadConfiguration();

    // Create a safe version of config for logging (mask sensitive data)
    const safeConfig = {
      hostname: config.hostname || '(not configured)',
      username: config.username ? '***masked***' : '(not configured)',
      password: config.password ? '***masked***' : '(not configured)',
      clientId: config.clientId ? '***masked***' : '(not configured)',
      clientSecret: config.clientSecret ? '***masked***' : '(not configured)',
      apiKey: config.apiKey ? '***masked***' : '(not configured)',
      apiSecret: config.apiSecret ? '***masked***' : '(not configured)',
      siteId: config.siteId || '(not configured)',
    };

    mainLogger.log("Configuration loaded successfully");
    if (debug) {
      mainLogger.debug("Configuration details:", JSON.stringify(safeConfig, null, 2));
    }

    // Determine the server mode based on available configuration
    const hasCredentials = !!(config.hostname && (config.username || config.clientId));
    const serverMode = hasCredentials ? "Full Mode" : "Documentation-Only Mode";

    const server = new SFCCDevServer(config, debug ?? false);

    mainLogger.log("Starting SFCC Development MCP Server...");
    mainLogger.log(`Server Mode: ${serverMode}`);

    if (hasCredentials) {
      mainLogger.log(`Connected to: ${config.hostname}`);
      mainLogger.log(`Authentication: ${config.username ? "Username/Password" : "Client ID/Secret"}`);
    } else {
      mainLogger.log("No SFCC credentials provided - only documentation tools will be available");
      mainLogger.log("To enable log analysis and system object tools, provide SFCC credentials via:");
      mainLogger.log("  1. dw.json file: npm run start -- --dw-json /path/to/dw.json");
      mainLogger.log("  2. Environment variables: SFCC_HOSTNAME, SFCC_USERNAME, SFCC_PASSWORD");
    }

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
