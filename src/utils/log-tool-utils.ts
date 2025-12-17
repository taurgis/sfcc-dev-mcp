import { isValidLogLevel, LogLevelValues } from './log-tool-constants.js';

/**
 * Validation utilities for log tools
 */
export class LogToolValidators {
  static validateLogLevel(level: string, toolName: string): void {
    if (!isValidLogLevel(level)) {
      throw new Error(`Invalid log level '${level}' for ${toolName}. Valid levels: ${Object.values(LogLevelValues).join(', ')}`);
    }
  }

  static validateLimit(limit: number | undefined, toolName: string): void {
    if (limit !== undefined) {
      // Validate type first
      if (typeof limit !== 'number' || isNaN(limit)) {
        throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be a valid number`);
      }
      // Then validate range
      if (limit <= 0 || limit > 1000) {
        throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be between 1 and 1000`);
      }
    }
  }

  static validateMaxBytes(maxBytes: number | undefined, toolName: string): void {
    if (maxBytes !== undefined) {
      // Validate type first
      if (typeof maxBytes !== 'number' || isNaN(maxBytes)) {
        throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be a valid number`);
      }
      // Then validate range
      if (maxBytes <= 0 || maxBytes > 10_000_000) { // 10MB limit
        throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be between 1 and 10,000,000`);
      }
    }
  }

  static validateFilename(filename: string, toolName: string): void {
    if (!filename || filename.trim().length === 0) {
      throw new Error(`Filename is required for ${toolName}`);
    }

    // Prevent path traversal
    if (filename.includes('..') || filename.includes('\\')) {
      throw new Error(`Invalid filename '${filename}' for ${toolName}. Path traversal not allowed`);
    }
  }
}

/**
 * Message formatting utilities for log tools
 */
export class LogMessageFormatter {
  static formatLatestLogs(level: string, limit: number, date?: string): string {
    return `Fetching latest ${level} logs limit=${limit} date=${date ?? 'today'}`;
  }

  static formatSummarizeLogs(date?: string): string {
    return `Summarizing logs for date ${date ?? 'today'}`;
  }

  static formatSearchLogs(pattern: string, logLevel?: string, limit?: number, _date?: string): string {
    // For backward compatibility with existing tests, don't include date in message
    return `Searching logs pattern="${pattern}" level=${logLevel ?? 'all'} limit=${limit ?? 20}`;
  }

  static formatListLogFiles(): string {
    return 'Listing log files';
  }

  static formatGetLogFileContents(filename: string, maxBytes?: number, tailOnly?: boolean): string {
    return `Reading log file contents: ${filename} (maxBytes=${maxBytes ?? 'default'}, tailOnly=${tailOnly ?? false})`;
  }
}
