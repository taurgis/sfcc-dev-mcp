/**
 * TypeScript interfaces and types for log operations
 *
 * Re-exports common types from the main types module to maintain a single source of truth.
 * Additional log-specific types are defined here.
 */

// Re-export common types from main types module
export type { LogLevel, LogFileInfo, LogSummary } from '../../types/types.js';

// Log-specific types not shared elsewhere
export interface LogFileMetadata {
  filename: string;
  lastmod: string;
}

export interface LogEntry {
  entry: string;
  filename: string;
  order: number;
  timestamp?: Date; // Extracted timestamp for chronological sorting
}

export interface ProcessedLogEntry {
  content: string;
  timestamp?: string;
  level?: string;
  source?: string;
}

export interface LogSearchOptions {
  pattern: string;
  logLevel?: import('../../types/types.js').LogLevel;
  limit: number;
  date?: string;
}

export interface LogFileFilter {
  level?: import('../../types/types.js').LogLevel;
  date?: string;
  includeCustom?: boolean;
  includeJobLogs?: boolean;
}

export interface JobLogInfo {
  jobName: string;
  jobId: string;
  logFile: string;
  lastModified: string;
  size?: number;
}

export interface JobLogFilter {
  jobName?: string;
  limit?: number;
  sortByRecent?: boolean;
}

export interface WebDAVClientConfig {
  hostname: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface FileReadOptions {
  maxBytes?: number;
}
