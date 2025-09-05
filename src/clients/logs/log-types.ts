/**
 * TypeScript interfaces and types for log operations
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogFileInfo {
  name: string;
  size: number;
  lastModified: string;
}

export interface LogFileMetadata {
  filename: string;
  lastmod: string;
}

export interface LogSummary {
  date: string;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  keyIssues: string[];
  files: string[];
}

export interface LogEntry {
  entry: string;
  filename: string;
  order: number;
}

export interface ProcessedLogEntry {
  content: string;
  timestamp?: string;
  level?: string;
  source?: string;
}

export interface LogSearchOptions {
  pattern: string;
  logLevel?: LogLevel;
  limit: number;
  date?: string;
}

export interface LogFileFilter {
  level?: LogLevel;
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
