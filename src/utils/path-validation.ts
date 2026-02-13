/**
 * Path Validation Utilities
 *
 * Provides secure path validation for file operations.
 * Prevents path traversal attacks and validates file names.
 */

import * as path from 'path';

export interface PathValidationOptions {
  /** Allowed file extensions (e.g., ['.md', '.json']) */
  allowedExtensions?: string[];
  /** Whether to normalize the name to lowercase */
  normalizeToLowerCase?: boolean;
}

export class PathValidationError extends Error {
  constructor(message: string, public readonly code: string = 'PATH_VALIDATION_ERROR') {
    super(message);
    this.name = 'PathValidationError';
  }
}

/**
 * Validate a file/document name for security issues
 * @param name - The name to validate
 * @param fieldName - Human-readable field name for error messages
 * @throws PathValidationError if validation fails
 */
export function validateFileName(name: string, fieldName: string = 'name'): void {
  if (!name || typeof name !== 'string') {
    throw new PathValidationError(`Invalid ${fieldName}: must be a non-empty string`, 'INVALID_TYPE');
  }

  // Prevent null bytes
  if (name.includes('\0') || name.includes('\x00')) {
    throw new PathValidationError(`Invalid ${fieldName}: contains null bytes`, 'NULL_BYTES');
  }

  // Prevent path traversal sequences
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw new PathValidationError(`Invalid ${fieldName}: contains path traversal sequences`, 'PATH_TRAVERSAL');
  }

  // Only allow safe characters
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new PathValidationError(`Invalid ${fieldName}: contains invalid characters`, 'INVALID_CHARACTERS');
  }
}

/**
 * Construct and validate a file path within a base directory
 * @param basePath - The base directory path
 * @param fileName - The file name (without extension)
 * @param options - Validation options
 * @returns The validated, resolved file path
 * @throws PathValidationError if validation fails
 */
export function constructValidatedPath(
  basePath: string,
  fileName: string,
  options: PathValidationOptions = {},
): string {
  const { allowedExtensions = ['.md'], normalizeToLowerCase = true } = options;

  // Validate the file name first
  validateFileName(fileName, 'file name');

  // Normalize if requested
  const normalizedName = normalizeToLowerCase ? fileName.toLowerCase() : fileName;

  // Determine extension (use first allowed extension by default)
  const extension = allowedExtensions[0] ?? '.md';

  // Construct the path
  const filePath = path.join(basePath, `${normalizedName}${extension}`);
  const resolvedPath = path.resolve(filePath);
  const resolvedBasePath = path.resolve(basePath);

  // Ensure the path is within the base directory
  if (!resolvedPath.startsWith(resolvedBasePath)) {
    throw new PathValidationError('Invalid file name: path outside allowed directory', 'OUTSIDE_BASE_DIR');
  }

  // Ensure the file has the correct extension
  const hasValidExtension = allowedExtensions.some(ext =>
    resolvedPath.toLowerCase().endsWith(ext.toLowerCase()),
  );
  if (!hasValidExtension) {
    throw new PathValidationError(
      `Invalid file name: must reference a ${allowedExtensions.join(' or ')} file`,
      'INVALID_EXTENSION',
    );
  }

  return resolvedPath;
}

/**
 * Validate binary content
 * @param content - The content to validate
 * @param fieldName - Human-readable field name for error messages
 * @throws PathValidationError if content appears to be binary
 */
export function validateTextContent(content: string, fieldName: string = 'content'): void {
  if (!content.trim()) {
    throw new PathValidationError(`Empty ${fieldName}`, 'EMPTY_CONTENT');
  }

  if (content.includes('\0')) {
    throw new PathValidationError(`Invalid ${fieldName}: contains binary data`, 'BINARY_CONTENT');
  }
}
