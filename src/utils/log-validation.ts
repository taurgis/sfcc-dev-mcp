/**
 * Unified Log Validation and Formatting Utilities
 *
 * Consolidates LogToolValidators, JobLogValidators, LogMessageFormatter, and JobLogFormatters
 * into a single cohesive module following DRY principles.
 */

import { isValidLogLevel, LogLevelValues } from './log-tool-constants.js';

// =============================================================================
// Validators
// =============================================================================

/**
 * Validate log level parameter
 */
export function validateLogLevel(level: string, toolName: string): void {
  if (!isValidLogLevel(level)) {
    const validLevels = Object.values(LogLevelValues).join(', ');
    throw new Error(`Invalid log level '${level}' for ${toolName}. Valid levels: ${validLevels}`);
  }
}

/**
 * Validate limit parameter
 */
export function validateLimit(limit: number | undefined, toolName: string): void {
  if (limit === undefined) {return;}

  if (typeof limit !== 'number' || isNaN(limit)) {
    throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be a valid number`);
  }
  if (limit <= 0 || limit > 1000) {
    throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be between 1 and 1000`);
  }
}

/**
 * Validate maxBytes parameter
 */
export function validateMaxBytes(maxBytes: number | undefined, toolName: string): void {
  if (maxBytes === undefined) {return;}

  if (typeof maxBytes !== 'number' || isNaN(maxBytes)) {
    throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be a valid number`);
  }
  if (maxBytes <= 0 || maxBytes > 10_000_000) {
    throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be between 1 and 10,000,000`);
  }
}

/**
 * Validate filename parameter
 */
export function validateFilename(filename: string, toolName: string): void {
  if (!filename || filename.trim().length === 0) {
    throw new Error(`Filename is required for ${toolName}`);
  }
  if (filename.includes('..') || filename.includes('\\')) {
    throw new Error(`Invalid filename '${filename}' for ${toolName}. Path traversal not allowed`);
  }
}

// =============================================================================
// Message Formatters
// =============================================================================

/**
 * Format log operation message
 */
export function formatLogMessage(
  operation: string,
  params: {
    level?: string;
    limit?: number;
    date?: string;
    pattern?: string;
    jobName?: string;
    filename?: string;
    maxBytes?: number;
    tailOnly?: boolean;
  } = {},
): string {
  const parts = [operation];

  if (params.jobName) {parts.push(`jobName=${params.jobName}`);}
  if (params.level) {parts.push(`level=${params.level}`);}
  if (params.limit !== undefined) {parts.push(`limit=${params.limit}`);}
  if (params.date) {parts.push(`date=${params.date}`);}
  if (params.pattern) {parts.push(`pattern="${params.pattern}"`);}
  if (params.filename) {parts.push(`filename=${params.filename}`);}
  if (params.maxBytes !== undefined) {parts.push(`maxBytes=${params.maxBytes}`);}
  if (params.tailOnly !== undefined) {parts.push(`tailOnly=${params.tailOnly}`);}

  return parts.join(' ');
}
