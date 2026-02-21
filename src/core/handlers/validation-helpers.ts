/**
 * Validation helpers for handler arguments
 */

import { HandlerError, ToolArguments } from './base-handler.js';
import { isValidLogLevel, LogLevelValues } from '../../utils/log-tool-constants.js';
import { resolve, relative, isAbsolute } from 'path';
import { ToolExecutionContext } from './base-handler.js';

type ValidatorFn<T> = {
  bivarianceHack: (value: T) => boolean;
}['bivarianceHack'];

export interface ValidationRule<T = unknown> {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  validator?: ValidatorFn<T>;
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

  private static validateType(value: unknown, type: ValidationRule['type']): boolean {
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
    validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
    errorMessage: customMessage ?? `${field} must be a non-empty string`,
  }],

  /** Create a required field validation with custom validator */
  requiredField: (
    field: string,
    type: ValidationRule['type'],
    validator: ValidatorFn<unknown>,
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
    validator: ValidatorFn<unknown>,
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
    throw new HandlerError(
      `Invalid log level '${level}' for ${toolName}. Valid levels: ${validLevels}`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'level', value: level, validLevels: Object.values(LogLevelValues) },
    );
  }
}

/** Validate limit parameter */
export function validateLimit(limit: number | undefined, toolName: string): void {
  if (limit === undefined) { return; }
  if (typeof limit !== 'number' || isNaN(limit)) {
    throw new HandlerError(
      `Invalid limit '${limit}' for ${toolName}. Must be a valid number`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'limit', value: limit },
    );
  }
  if (limit <= 0 || limit > 1000) {
    throw new HandlerError(
      `Invalid limit '${limit}' for ${toolName}. Must be between 1 and 1000`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'limit', value: limit, min: 1, max: 1000 },
    );
  }
}

/** Validate maxBytes parameter */
export function validateMaxBytes(maxBytes: number | undefined, toolName: string): void {
  if (maxBytes === undefined) { return; }
  if (typeof maxBytes !== 'number' || isNaN(maxBytes)) {
    throw new HandlerError(
      `Invalid maxBytes '${maxBytes}' for ${toolName}. Must be a valid number`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'maxBytes', value: maxBytes },
    );
  }
  if (maxBytes <= 0 || maxBytes > 10_000_000) {
    throw new HandlerError(
      `Invalid maxBytes '${maxBytes}' for ${toolName}. Must be between 1 and 10,000,000`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'maxBytes', value: maxBytes, min: 1, max: 10_000_000 },
    );
  }
}

/** Validate filename parameter */
export function validateFilename(filename: string, toolName: string): void {
  if (!filename || filename.trim().length === 0) {
    throw new HandlerError(
      `Filename is required for ${toolName}`,
      toolName,
      'MISSING_ARGUMENT',
      { field: 'filename' },
    );
  }
  // Check for path traversal attempts
  if (filename.includes('..') || filename.includes('\\')) {
    throw new HandlerError(
      `Invalid filename '${filename}' for ${toolName}. Path traversal not allowed`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'filename', value: filename, reason: 'path_traversal' },
    );
  }
  // Check for null byte injection
  if (filename.includes('\0') || filename.includes('\x00')) {
    throw new HandlerError(
      `Invalid filename for ${toolName}. Contains invalid characters`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'filename', value: filename, reason: 'invalid_characters' },
    );
  }
  // Check for absolute path attempts
  if (filename.startsWith('/') && !filename.startsWith('/Logs/') && !filename.startsWith('/jobs/')) {
    throw new HandlerError(
      `Invalid filename '${filename}' for ${toolName}. Absolute paths outside /Logs/ are not allowed`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'filename', value: filename, reason: 'absolute_path_not_allowed' },
    );
  }
  // Check filename length to prevent DoS
  if (filename.length > 1024) {
    throw new HandlerError(
      `Invalid filename for ${toolName}. Filename too long`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'filename', length: filename.length, maxLength: 1024 },
    );
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

function isPathWithinRoot(rootPath: string, candidatePath: string): boolean {
  const rel = relative(rootPath, candidatePath);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/**
 * Validate targetPath writes stay inside workspace roots (if discovered) or current working directory.
 */
export function validateTargetPathWithinWorkspace(
  targetPath: unknown,
  context: ToolExecutionContext,
  toolName: string,
): string | undefined {
  const hasExplicitTargetPath = typeof targetPath === 'string' && targetPath.trim().length > 0;

  if (targetPath !== undefined && targetPath !== null && typeof targetPath !== 'string') {
    throw new HandlerError(
      `Invalid targetPath for ${toolName}. targetPath must be a string when provided`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'targetPath', actualType: typeof targetPath },
    );
  }

  if (typeof targetPath === 'string' && (targetPath.includes('\0') || targetPath.includes('\x00'))) {
    throw new HandlerError(
      `Invalid targetPath for ${toolName}. Contains invalid characters`,
      toolName,
      'INVALID_ARGUMENT',
      { field: 'targetPath', reason: 'invalid_characters' },
    );
  }

  const resolvedTargetPath = hasExplicitTargetPath
    ? resolve(targetPath as string)
    : resolve(process.cwd());

  const workspaceRoots = context.handlerContext.workspaceRootsService
    ?.getRoots()
    .map(root => resolve(root.path)) ?? [];

  const allowedRoots = workspaceRoots.length > 0
    ? workspaceRoots
    : [resolve(process.cwd())];

  const isAllowed = allowedRoots.some(root => isPathWithinRoot(root, resolvedTargetPath));
  if (!isAllowed) {
    throw new HandlerError(
      `Invalid targetPath for ${toolName}. Path must be within workspace roots or current working directory`,
      toolName,
      'TARGET_PATH_OUTSIDE_WORKSPACE',
      {
        field: 'targetPath',
        targetPath: resolvedTargetPath,
        allowedRoots,
      },
    );
  }

  return hasExplicitTargetPath ? resolvedTargetPath : undefined;
}
