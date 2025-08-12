#!/usr/bin/env node

/**
 * SFCC MCP Server - Entry Point
 *
 * This module serves as the main entry point for the SFCC (Salesforce B2C Commerce Cloud)
 * MCP server. It provides comprehensive development assistance features including log analysis,
 * debugging tools, and more. This file re-exports the main application entry point for
 * backwards compatibility and provides a clean interface for the package.
 */

export { SFCCDevServer } from './core/server.js';
export { SFCCLogClient } from './clients/log-client.js';
export { SFCCDocumentationClient } from './clients/docs-client.js';
export { OCAPIClient } from './clients/ocapi-client.js';
export { TokenManager } from './auth/oauth-token.js';
export type { SFCCConfig, LogLevel, LogFileInfo, LogSummary, OCAPIConfig, OAuthToken, OAuthTokenResponse } from './types/types.js';

// For direct execution, delegate to main.ts
import './main.js';
