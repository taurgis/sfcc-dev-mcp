/**
 * Configuration loader for SFCC MCP Server
 *
 * This module handles secure loading and validation of dw.json files
 * with comprehensive security checks for file access.
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { DwJsonConfig } from '../types/types.js';

/**
 * Validates that a file path is safe to access and prevents path traversal attacks
 *
 * @param filePath - The file path to validate
 * @returns The validated and resolved path
 * @throws Error if the path is unsafe
 */
function validateSecurePath(filePath: string): string {
  // Prevent null bytes and other dangerous characters
  if (filePath.includes('\0') || filePath.includes('\x00')) {
    throw new Error('Invalid characters in file path');
  }

  // Prevent excessively long paths that could cause DoS
  if (filePath.length > 1000) {
    throw new Error('File path too long');
  }

  // Check if file extension is allowed (only .json files)
  const ext = extname(filePath).toLowerCase();
  if (ext !== '.json') {
    throw new Error('Only .json files are allowed');
  }

  // Normalize the path to prevent path traversal
  const resolvedPath = resolve(filePath);

  // Additional check: ensure the resolved path still ends with .json
  // This prevents attacks like "file.json/../../../etc/passwd"
  if (!resolvedPath.toLowerCase().endsWith('.json')) {
    throw new Error('Invalid file path');
  }

  // Prevent access to system directories (additional security layer)
  // Allow CI workspace paths like /home/runner/work/ but block sensitive system paths
  const dangerousPaths = ['/etc/', '/proc/', '/sys/', '/dev/', '/root/'];
  const lowerPath = resolvedPath.toLowerCase();

  // Check for dangerous system paths
  if (dangerousPaths.some(dangerous => lowerPath.includes(dangerous))) {
    throw new Error('Access to system directories not allowed');
  }

  // Block /home/ but allow CI workspace paths (/home/runner/work/)
  if (lowerPath.includes('/home/') && !lowerPath.includes('/home/runner/work/')) {
    throw new Error('Access to system directories not allowed');
  }

  return resolvedPath;
}

/**
 * Validates file size to prevent reading excessively large files
 *
 * @param filePath - The file path to check
 * @throws Error if file is too large
 */
function validateFileSize(filePath: string): void {
  try {
    const stats = statSync(filePath);
    const maxSize = 1024 * 1024; // 1MB limit for config files

    if (stats.size > maxSize) {
      throw new Error('Configuration file too large');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Configuration file too large') {
      throw error;
    }
    // Don't expose detailed file system errors
    throw new Error('Unable to access configuration file');
  }
}

/**
 * Validates the content of a dw.json configuration
 *
 * @param dwConfig - The parsed dw.json configuration
 * @throws Error if required fields are missing or invalid
 */
function validateDwJsonContent(dwConfig: DwJsonConfig): void {
  // Validate required fields
  if (!dwConfig.hostname || !dwConfig.username || !dwConfig.password) {
    throw new Error('Configuration file must contain hostname, username, and password fields');
  }

  // Additional validation for hostname format (trim whitespace first)
  const trimmedHostname = dwConfig.hostname.trim();
  if (!trimmedHostname?.match(/^[a-zA-Z0-9.-]+(?::[0-9]+)?$/)) {
    throw new Error('Invalid hostname format in configuration');
  }
}

/**
 * Securely loads and parses a dw.json file with comprehensive validation
 *
 * This function handles all security aspects of file loading including path validation,
 * file size checks, and content validation. It returns the raw parsed JSON without
 * any transformation to SFCCConfig format.
 *
 * @param dwJsonPath - Path to the dw.json file
 * @returns Parsed and validated dw.json configuration
 * @throws Error if file doesn't exist, is invalid, or fails security checks
 */
export function loadSecureDwJson(dwJsonPath: string): DwJsonConfig {
  let resolvedPath: string;

  try {
    // Validate and secure the path
    resolvedPath = validateSecurePath(dwJsonPath);
  } catch (error) {
    throw new Error(
      `Invalid file path: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

  if (!existsSync(resolvedPath)) {
    // Don't expose the full path in error messages for security
    throw new Error(`Configuration file not found: ${basename(dwJsonPath)}`);
  }

  // Validate file size before reading
  try {
    validateFileSize(resolvedPath);
  } catch (error) {
    throw new Error(
      `File validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

  try {
    const dwJsonContent = readFileSync(resolvedPath, 'utf-8');

    // Additional validation: ensure the content is not empty and doesn't contain suspicious patterns
    if (!dwJsonContent.trim()) {
      throw new Error('Configuration file is empty');
    }

    // Basic check for potential binary content (null bytes)
    if (dwJsonContent.includes('\0')) {
      throw new Error('Configuration file contains invalid content');
    }

    const dwConfig: DwJsonConfig = JSON.parse(dwJsonContent);

    // Validate the parsed configuration
    validateDwJsonContent(dwConfig);

    return dwConfig;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in configuration file: ${error.message}`);
    }
    throw error;
  }
}
