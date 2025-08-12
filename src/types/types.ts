/**
 * Type definitions for SFCC MCP Server
 *
 * This module contains all TypeScript interfaces and types used throughout
 * the SFCC (Salesforce B2C Commerce Cloud) MCP server application.
 */

/**
 * Configuration interface for SFCC connection
 * Supports both basic authentication (username/password) and OAuth (clientId/clientSecret)
 */
export interface SFCCConfig {
  /** SFCC hostname (e.g., zziu-006.dx.commercecloud.salesforce.com) */
  hostname?: string;
  /** Username for basic authentication (optional if using OAuth) */
  username?: string;
  /** Password for basic authentication (optional if using OAuth) */
  password?: string;
  /** Client ID for OAuth authentication (optional if using basic auth) */
  clientId?: string;
  /** Client secret for OAuth authentication (optional if using basic auth) */
  clientSecret?: string;
  /** Site ID for SFCC instance */
  siteId?: string;
}

/**
 * Configuration structure from dw.json file
 * This matches the standard Salesforce Commerce Cloud dw.json configuration format
 */
export interface DwJsonConfig {
  /** SFCC hostname */
  hostname: string;
  /** Username for WebDAV access */
  username: string;
  /** Password for WebDAV access */
  password: string;
  /** Optional code version */
  'code-version'?: string;
  /** Optional client ID for OAuth */
  'client-id'?: string;
  /** Optional client secret for OAuth */
  'client-secret'?: string;
  /** Optional site ID for SFCC instance */
  'site-id'?: string;
}

/**
 * Log levels supported by the SFCC logging system
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Structure for log file metadata
 */
export interface LogFileInfo {
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** Last modification timestamp */
  lastModified: string;
}

/**
 * Summary statistics for log analysis
 */
export interface LogSummary {
  /** Date of the logs being summarized */
  date: string;
  /** Number of error entries found */
  errorCount: number;
  /** Number of warning entries found */
  warningCount: number;
  /** Number of info entries found */
  infoCount: number;
  /** Number of debug entries found */
  debugCount: number;
  /** List of unique error patterns identified */
  keyIssues: string[];
  /** List of log files analyzed */
  files: string[];
}

/**
 * OAuth 2.0 token response from SFCC authorization server
 */
export interface OAuthTokenResponse {
  /** Token expiration time in seconds */
  expires_in: number;
  /** Token type (always "Bearer" for SFCC) */
  token_type: string;
  /** The actual access token */
  access_token: string;
}

/**
 * OAuth token with expiration tracking
 */
export interface OAuthToken {
  /** The access token */
  accessToken: string;
  /** Token type */
  tokenType: string;
  /** When the token expires (timestamp) */
  expiresAt: number;
}

/**
 * OCAPI client configuration
 */
export interface OCAPIConfig {
  /** SFCC hostname */
  hostname: string;
  /** OAuth client ID */
  clientId: string;
  /** OAuth client secret */
  clientSecret: string;
  /** Site ID (optional, for shop API) */
  siteId?: string;
  /** API version (default: v21_3) */
  version?: string;
}
