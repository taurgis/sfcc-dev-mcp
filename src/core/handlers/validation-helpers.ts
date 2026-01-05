/**
 * Validation helpers for handler arguments
 */

import { HandlerError, ToolArguments } from './base-handler.js';
import { isValidLogLevel, LogLevelValues } from '../../utils/log-tool-constants.js';

export interface ValidationRule<T = any> {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  validator?: (value: T) => boolean;
  errorMessage?: string;
}

export class ValidationHelpers {
  /**
   * Validate arguments against a set of rules
   */
  static validateArguments(
    args: ToolArguments,
    rules: ValidationRule[],
    toolName: string,
  ): void {
    for (const rule of rules) {
      const value = args?.[rule.field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} is required`,
          toolName,
          'MISSING_ARGUMENT',
          { field: rule.field, rules },
        );
      }

      // Skip type and custom validation if value is not present and not required
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Check type (including for required fields that have values)
      if (rule.type && value !== undefined && value !== null && !this.validateType(value, rule.type)) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} must be of type ${rule.type}`,
          toolName,
          'INVALID_TYPE',
          { field: rule.field, expectedType: rule.type, actualType: typeof value },
        );
      }

      // Custom validation
      if (rule.validator && !rule.validator(value)) {
        throw new HandlerError(
          rule.errorMessage ?? `${rule.field} validation failed`,
          toolName,
          'VALIDATION_FAILED',
          { field: rule.field, value },
        );
      }
    }
  }

  private static validateType(value: any, type: ValidationRule['type']): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }
}

/**
 * Common validation rules factory
 */
export const CommonValidations = {
  /** Create a required string field validation */
  requiredString: (field: string, customMessage?: string): ValidationRule[] => [{
    field,
    required: true,
    type: 'string',
    validator: (value: string) => value.trim().length > 0,
    errorMessage: customMessage ?? `${field} must be a non-empty string`,
  }],

  /** Create a required field validation with custom validator */
  requiredField: (
    field: string,
    type: ValidationRule['type'],
    validator: (value: any) => boolean,
    errorMessage: string,
  ): ValidationRule[] => [{
    field,
    required: true,
    type,
    validator,
    errorMessage,
  }],

  /** Create an optional field validation */
  optionalField: (
    field: string,
    type: ValidationRule['type'],
    validator: (value: any) => boolean,
    errorMessage: string,
  ): ValidationRule[] => [{
    field,
    required: false,
    type,
    validator,
    errorMessage,
  }],
};

// =============================================================================
// Log-specific validators (consolidated from log-validation.ts)
// =============================================================================

/** Validate log level parameter */
export function validateLogLevel(level: string, toolName: string): void {
  if (!isValidLogLevel(level)) {
    const validLevels = Object.values(LogLevelValues).join(', ');
    throw new Error(`Invalid log level '${level}' for ${toolName}. Valid levels: ${validLevels}`);
  }
}

/** Validate limit parameter */
export function validateLimit(limit: number | undefined, toolName: string): void {
  if (limit === undefined) { return; }
  if (typeof limit !== 'number' || isNaN(limit)) {
    throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be a valid number`);
  }
  if (limit <= 0 || limit > 1000) {
    throw new Error(`Invalid limit '${limit}' for ${toolName}. Must be between 1 and 1000`);
  }
}

/** Validate maxBytes parameter */
export function validateMaxBytes(maxBytes: number | undefined, toolName: string): void {
  if (maxBytes === undefined) { return; }
  if (typeof maxBytes !== 'number' || isNaN(maxBytes)) {
    throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be a valid number`);
  }
  if (maxBytes <= 0 || maxBytes > 10_000_000) {
    throw new Error(`Invalid maxBytes '${maxBytes}' for ${toolName}. Must be between 1 and 10,000,000`);
  }
}

/** Validate filename parameter */
export function validateFilename(filename: string, toolName: string): void {
  if (!filename || filename.trim().length === 0) {
    throw new Error(`Filename is required for ${toolName}`);
  }
  // Check for path traversal attempts
  if (filename.includes('..') || filename.includes('\\')) {
    throw new Error(`Invalid filename '${filename}' for ${toolName}. Path traversal not allowed`);
  }
  // Check for null byte injection
  if (filename.includes('\0') || filename.includes('\x00')) {
    throw new Error(`Invalid filename for ${toolName}. Contains invalid characters`);
  }
  // Check for absolute path attempts
  if (filename.startsWith('/') && !filename.startsWith('/Logs/') && !filename.startsWith('/jobs/')) {
    throw new Error(`Invalid filename '${filename}' for ${toolName}. Absolute paths outside /Logs/ are not allowed`);
  }
  // Check filename length to prevent DoS
  if (filename.length > 1024) {
    throw new Error(`Invalid filename for ${toolName}. Filename too long`);
  }
}

/** Format log operation message */
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
  if (params.jobName) { parts.push(`jobName=${params.jobName}`); }
  if (params.level) { parts.push(`level=${params.level}`); }
  if (params.limit !== undefined) { parts.push(`limit=${params.limit}`); }
  if (params.date) { parts.push(`date=${params.date}`); }
  if (params.pattern) { parts.push(`pattern="${params.pattern}"`); }
  if (params.filename) { parts.push(`filename=${params.filename}`); }
  if (params.maxBytes !== undefined) { parts.push(`maxBytes=${params.maxBytes}`); }
  if (params.tailOnly !== undefined) { parts.push(`tailOnly=${params.tailOnly}`); }
  return parts.join(' ');
}
