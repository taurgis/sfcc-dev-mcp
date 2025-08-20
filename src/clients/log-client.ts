/**
 * SFCC log client - now uses modular structure
 *
 * This file provides backward compatibility by re-exporting the main log client
 * from the new modular structure in the logs/ directory.
 */

export { SFCCLogClient } from './logs/index.js';
export type { LogLevel, LogFileInfo, LogSummary, WebDAVClientConfig } from './logs/index.js';

// Re-export SFCCConfig for backward compatibility
export interface SFCCConfig {
  hostname?: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  siteId?: string;
}
