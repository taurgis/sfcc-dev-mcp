#!/usr/bin/env node

/**
 * SFCC MCP Server - Entry Point
 *
 * This module serves as the main entry point for the SFCC (Salesforce B2C Commerce Cloud)
 * MCP server. It provides comprehensive development assistance features including log analysis,
 * debugging tools, and more. This file re-exports the main application entry point for
 * backwards compatibility and provides a clean interface for the package.
 */

/**
 * Main exports for the SFCC Development MCP Server
 */

export { SFCCDevServer } from "./server.js";
export { SFCCLogClient } from "./log-client.js";
export { SFCCDocumentationClient } from "./docs-client.js";
export type { SFCCConfig, LogLevel, LogFileInfo, LogSummary } from "./types.js";

// For direct execution, delegate to main.ts
import "./main.js";
