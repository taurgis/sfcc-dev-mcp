#!/usr/bin/env node

/**
 * SFCC MCP Server - Entry Point
 *
 * This module serves as the main entry point for the SFCC (Salesforce B2C Commerce Cloud)
 * MCP server. It provides comprehensive development assistance features including log analysis,
 * debugging tools, and more. This file re-exports the main application entry point for
 * backwards compatibility and provides a clean interface for the package.
 */

// Re-export main types for external consumers
export { SFCCConfig, DwJsonConfig, LogLevel, LogFileInfo, LogSummary } from "./types.js";

// Re-export main classes for library usage
export { SFCCLogClient } from "./log-client.js";
export { SFCCLogsServer } from "./server.js";

// Re-export configuration utilities
export { loadDwJsonConfig, validateConfig } from "./config.js";

// For direct execution, delegate to main.ts
import "./main.js";
