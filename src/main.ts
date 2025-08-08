#!/usr/bin/env node

/**
 * SFCC MCP Server - Main Entry Point
 *
 * This is the main entry point for the SFCC (Salesforce B2C Commerce Cloud) MCP server.
 * It handles command-line argument parsing, configuration loading, and server initialization.
 * The server provides comprehensive development assistance including log analysis, debugging,
 * monitoring, and extensible tools for SFCC development workflows.
 *
 * The server can be configured either through a dw.json file (standard SFCC format)
 * or through individual command-line options.
 */

import { Command } from "commander";
import { resolve } from "path";
import { SFCCConfig } from "./types.js";
import { loadDwJsonConfig, validateConfig } from "./config.js";
import { SFCCLogsServer } from "./server.js";

/**
 * Main application entry point
 * Handles command-line parsing and server initialization
 */
async function main(): Promise<void> {
  const program = new Command();

  // Define command-line interface
  program
    .name("sfcc-logs-mcp")
    .description("MCP server for Salesforce B2C Commerce Cloud logs")
    .option("--dw-json <path>", "Path to dw.json file (alternative to individual options)")
    .option("--hostname <hostname>", "SFCC hostname (e.g., zziu-006.dx.commercecloud.salesforce.com)")
    .option("--username <username>", "Username for basic authentication")
    .option("--password <password>", "Password for basic authentication")
    .option("--api-key <apiKey>", "API key for OAuth authentication")
    .option("--api-secret <apiSecret>", "API secret for OAuth authentication");

  program.parse();
  const options = program.opts();

  let config: SFCCConfig;

  try {
    // Priority: dw.json file takes precedence over individual options
    if (options.dwJson) {
      config = loadDwJsonConfig(options.dwJson);
      console.error(`✅ Loaded configuration from: ${resolve(options.dwJson)}`);
    } else {
      // Fall back to individual command-line options
      if (!options.hostname) {
        console.error("❌ Error: Either --dw-json or --hostname is required");
        process.exit(1);
      }

      config = {
        hostname: options.hostname,
        username: options.username,
        password: options.password,
        apiKey: options.apiKey,
        apiSecret: options.apiSecret,
      };

      // Validate the manually provided configuration
      validateConfig(config);
      console.error("✅ Configuration loaded from command-line options");
    }

    // Initialize and start the MCP server
    const server = new SFCCLogsServer(config);
    await server.run();

  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Always run main() when this module is imported (since it's only imported by index.js for execution)
console.error("🚀 Starting SFCC MCP Server...");
main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
