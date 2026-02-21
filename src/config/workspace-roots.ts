/**
 * Workspace Roots Management for SFCC MCP Server
 *
 * This module handles secure discovery and validation of workspace roots
 * provided by MCP clients, enabling automatic dw.json discovery from the
 * VS Code workspace without requiring absolute paths.
 *
 * Configuration Discovery Priority:
 * 1. CLI parameter (--dw-json) - handled in main.ts
 * 2. Environment variables (SFCC_*) - handled in main.ts
 * 3. MCP workspace roots (this module) - called after client connects
 *
 * This discovery mechanism is preferred over CWD-based search because
 * MCP servers often start with cwd set to the user's home directory,
 * not the project directory. The MCP workspace roots capability provides
 * the correct project context from VS Code/Copilot/Cursor.
 *
 * Security considerations:
 * - Only file:// URIs are accepted (per MCP spec)
 * - Path traversal attacks are prevented
 * - System directories are blocked
 * - Symlink resolution is handled securely
 */

import { existsSync, realpathSync, statSync } from 'fs';
import { resolve, normalize, join, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils/logger.js';
import { DwJsonConfig } from '../types/types.js';
import { loadSecureDwJson } from './dw-json-loader.js';

/**
 * MCP client root from roots/list response
 */
export interface MCPClientRoot {
  uri: string;
  name?: string;
}

/**
 * Represents a validated workspace root
 */
export interface ValidatedWorkspaceRoot {
  /** Original URI from the client */
  uri: string;
  /** Resolved absolute path */
  path: string;
  /** Optional name for the root */
  name?: string;
}

/**
 * Result of workspace roots discovery
 */
export interface WorkspaceDiscoveryResult {
  /** Whether discovery was successful */
  success: boolean;
  /** Discovered dw.json configuration if found */
  config?: DwJsonConfig;
  /** Path to the discovered dw.json file */
  dwJsonPath?: string;
  /** Reason for failure or skip */
  reason?: string;
  /** Number of workspace roots received from client */
  rootsReceived?: number;
  /** Number of valid roots after security validation */
  validRoots?: number;
}

/**
 * Security validation result
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
  resolvedPath?: string;
}

/**
 * Dangerous system paths that should never be accessed
 * These are blocked to prevent accidental or malicious access to sensitive areas
 */
const BLOCKED_SYSTEM_PATHS: readonly string[] = [
  '/etc',
  '/proc',
  '/sys',
  '/dev',
  '/root',
  '/var/log',
  '/var/run',
  '/boot',
  '/sbin',
  '/bin',
  // Windows system paths
  'C:\\Windows',
  'C:\\Program Files',
  'C:\\ProgramData',
] as const;

/**
 * Sensitive directory segments that must be blocked even under otherwise
 * allowed roots (for example /Users/<user>/.ssh).
 */
const BLOCKED_SENSITIVE_SEGMENT_PATTERNS: readonly RegExp[] = [
  /(^|[\\/])\.ssh([\\/]|$)/i,
  /(^|[\\/])\.gnupg([\\/]|$)/i,
  /(^|[\\/])\.aws([\\/]|$)/i,
  /(^|[\\/])\.config[\\/]gcloud([\\/]|$)/i,
] as const;

/**
 * Allowed path prefixes for workspace roots
 * These are the typical locations where development projects reside
 */
const ALLOWED_PATH_PATTERNS: readonly RegExp[] = [
  // User home directories
  /^\/Users\/[^/]+\//i, // macOS
  /^\/home\/[^/]+\//i, // Linux (allow all users, not just runner)
  /^C:\\Users\\[^\\]+\\/i, // Windows
  // Common project directories
  /^\/opt\//i,
  /^\/var\/www\//i,
  /^\/srv\//i,
  // Temp directories (for testing)
  /^\/tmp\//i,
  /^\/private\/tmp\//i, // macOS real temp path
  /^\/var\/folders\//i, // macOS temp
  /^\/private\/var\/folders\//i, // macOS real temp path (symlink resolved)
  /^C:\\Temp\\/i, // Windows temp
  // CI workspace paths
  /^\/home\/runner\/work\//i, // GitHub Actions
] as const;

/**
 * Validates that a file URI is safe and converts it to an absolute path
 *
 * @param uri - The file:// URI to validate
 * @returns Validation result with resolved path or error
 */
function validateFileUri(uri: string): ValidationResult {
  // Check for null bytes and other dangerous characters
  if (uri.includes('\0') || uri.includes('\x00')) {
    return { isValid: false, error: 'URI contains invalid characters' };
  }

  // Verify it's a file:// URI
  if (!uri.startsWith('file://')) {
    return { isValid: false, error: 'Only file:// URIs are supported for workspace roots' };
  }

  try {
    // Convert file URI to path securely
    const path = fileURLToPath(uri);
    return validatePath(path);
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid file URI: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validates that a file path is safe to use as a workspace root
 *
 * @param inputPath - The path to validate
 * @returns Validation result with resolved path or error
 */
function validatePath(inputPath: string): ValidationResult {
  // Check for null bytes
  if (inputPath.includes('\0')) {
    return { isValid: false, error: 'Path contains invalid characters' };
  }

  // Check for excessively long paths (DoS prevention)
  if (inputPath.length > 4096) {
    return { isValid: false, error: 'Path is too long' };
  }

  // Normalize and resolve the path
  let resolvedPath: string;
  try {
    resolvedPath = normalize(resolve(inputPath));
  } catch {
    return { isValid: false, error: 'Failed to resolve path' };
  }

  // Verify it's an absolute path
  if (!isAbsolute(resolvedPath)) {
    return { isValid: false, error: 'Path must be absolute' };
  }

  // Check against blocked system paths and sensitive directory segments
  if (isBlockedPath(resolvedPath)) {
    return { isValid: false, error: 'Access to system directories is not allowed' };
  }

  // Check that path matches allowed patterns
  const matchesAllowed = ALLOWED_PATH_PATTERNS.some(pattern => pattern.test(resolvedPath));
  if (!matchesAllowed) {
    return {
      isValid: false,
      error: 'Path is outside of allowed workspace directories',
    };
  }

  // Verify the path exists and is a directory
  try {
    if (!existsSync(resolvedPath)) {
      return { isValid: false, error: 'Path does not exist' };
    }

    const stats = statSync(resolvedPath);
    if (!stats.isDirectory()) {
      return { isValid: false, error: 'Path is not a directory' };
    }

    // Resolve symlinks to verify the real path is also safe
    const realPath = realpathSync(resolvedPath);
    if (realPath !== resolvedPath) {
      // Re-validate the resolved symlink path
      const symlinkValidation = validatePath(realPath);
      if (!symlinkValidation.isValid) {
        return {
          isValid: false,
          error: `Symlink target is not allowed: ${symlinkValidation.error}`,
        };
      }
      resolvedPath = realPath;
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Cannot access path: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  return { isValid: true, resolvedPath };
}

/**
 * Determine whether a resolved absolute path should be blocked.
 */
function isBlockedPath(resolvedPath: string): boolean {
  const lowerPath = resolvedPath.toLowerCase();

  for (const blocked of BLOCKED_SYSTEM_PATHS) {
    const blockedLower = blocked.toLowerCase();
    if (
      lowerPath === blockedLower ||
      lowerPath.startsWith(`${blockedLower}/`) ||
      lowerPath.startsWith(`${blockedLower}\\`)
    ) {
      return true;
    }
  }

  return BLOCKED_SENSITIVE_SEGMENT_PATTERNS.some(pattern => pattern.test(resolvedPath));
}

/**
 * Service for managing workspace roots from MCP clients
 *
 * This class provides secure handling of workspace roots, enabling
 * automatic discovery of configuration files (like dw.json) in the
 * agent's working directories.
 */
export class WorkspaceRootsService {
  private roots: ValidatedWorkspaceRoot[] = [];
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger ?? Logger.getInstance();
  }

  /**
   * Update workspace roots from MCP client response
   *
   * @param clientRoots - Array of roots from the MCP client (roots/list response)
   * @returns Array of successfully validated roots
   */
  updateRoots(clientRoots: Array<{ uri: string; name?: string }>): ValidatedWorkspaceRoot[] {
    this.roots = [];

    for (const root of clientRoots) {
      const validation = validateFileUri(root.uri);

      if (validation.isValid && validation.resolvedPath) {
        this.roots.push({
          uri: root.uri,
          path: validation.resolvedPath,
          name: root.name,
        });
        this.logger.debug(`Validated workspace root: ${root.name ?? root.uri} -> ${validation.resolvedPath}`);
      } else {
        this.logger.debug(`Rejected workspace root: ${root.uri} - ${validation.error}`);
      }
    }

    this.logger.log(`Workspace roots updated: ${this.roots.length} valid root(s)`);
    return [...this.roots];
  }

  /**
   * Get all validated workspace roots
   */
  getRoots(): ValidatedWorkspaceRoot[] {
    return [...this.roots];
  }

  /**
   * Search for a file in all workspace roots
   *
   * @param filename - The filename to search for (e.g., 'dw.json')
   * @param maxDepth - Maximum directory depth to search (default: 2)
   * @returns The first matching file path, or undefined if not found
   */
  findFile(filename: string, maxDepth: number = 2): string | undefined {
    // Validate filename to prevent path traversal
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
      this.logger.debug(`Invalid filename rejected: ${filename}`);
      return undefined;
    }

    for (const root of this.roots) {
      const found = this.searchInDirectory(root.path, filename, 0, maxDepth);
      if (found) {
        this.logger.debug(`Found ${filename} in workspace root: ${found}`);
        return found;
      }
    }

    return undefined;
  }

  /**
   * Recursively search for a file in a directory
   *
   * @param directory - Directory to search
   * @param filename - Filename to find
   * @param currentDepth - Current recursion depth
   * @param maxDepth - Maximum depth to search
   * @returns File path if found, undefined otherwise
   */
  private searchInDirectory(
    directory: string,
    filename: string,
    currentDepth: number,
    maxDepth: number,
  ): string | undefined {
    // Check immediate file
    const filePath = join(directory, filename);
    if (existsSync(filePath)) {
      try {
        const stats = statSync(filePath);
        if (stats.isFile()) {
          return filePath;
        }
      } catch {
        // Ignore access errors
      }
    }

    // Don't recurse deeper if at max depth
    if (currentDepth >= maxDepth) {
      return undefined;
    }

    // Search subdirectories (limited set to avoid excessive scanning)
    const allowedSubdirs = ['cartridges', 'config', '.vscode', 'sfcc'];
    for (const subdir of allowedSubdirs) {
      const subdirPath = join(directory, subdir);
      try {
        if (existsSync(subdirPath) && statSync(subdirPath).isDirectory()) {
          const found = this.searchInDirectory(subdirPath, filename, currentDepth + 1, maxDepth);
          if (found) {
            return found;
          }
        }
      } catch {
        // Ignore access errors
      }
    }

    return undefined;
  }

  /**
   * Check if a given path is within any of the validated workspace roots
   *
   * This is useful for validating that file operations stay within
   * the allowed workspace boundaries.
   *
   * @param filePath - The path to check
   * @returns true if the path is within a workspace root
   */
  isPathWithinRoots(filePath: string): boolean {
    try {
      // Normalize and resolve the path
      const normalizedPath = normalize(resolve(filePath));

      // For existing paths, resolve symlinks to get the real path
      // For non-existing paths (like potential new files), use the normalized path
      let checkPath = normalizedPath;
      if (existsSync(normalizedPath)) {
        checkPath = realpathSync(normalizedPath);
      } else {
        // For non-existing paths, try to resolve symlinks in the parent directory chain
        // This handles cases like /var/folders on macOS which is a symlink to /private/var/folders
        let parentPath = normalizedPath;
        while (parentPath !== '/') {
          const parent = resolve(parentPath, '..');
          if (parent === parentPath) {break;}
          parentPath = parent;
          if (existsSync(parentPath)) {
            // Found an existing parent, resolve its realpath and reconstruct
            const realParent = realpathSync(parentPath);
            const relativePart = normalizedPath.substring(parentPath.length);
            checkPath = realParent + relativePart;
            break;
          }
        }
      }

      return this.roots.some(root => {
        return checkPath.startsWith(`${root.path  }/`) || checkPath.startsWith(`${root.path  }\\`) || checkPath === root.path;
      });
    } catch {
      return false;
    }
  }

  /**
   * Clear all workspace roots
   */
  clear(): void {
    this.roots = [];
    this.logger.debug('Workspace roots cleared');
  }

  /**
   * Discover dw.json from MCP client workspace roots
   *
   * This is the main entry point for workspace-based config discovery.
   * It takes raw roots from the MCP client, validates them, searches for
   * dw.json, and loads the configuration.
   *
   * @param clientRoots - Raw roots array from server.listRoots() response
   * @returns Discovery result with config if found
   */
  discoverDwJson(clientRoots: MCPClientRoot[] | undefined): WorkspaceDiscoveryResult {
    this.logger.log('[WorkspaceRoots] Starting dw.json discovery from client roots');

    // Log what we received from the client
    if (!clientRoots) {
      this.logger.log('[WorkspaceRoots] No roots array received from client (undefined)');
      return { success: false, reason: 'No roots array received from client' };
    }

    this.logger.log(`[WorkspaceRoots] Received ${clientRoots.length} root(s) from client`);

    if (clientRoots.length === 0) {
      this.logger.log('[WorkspaceRoots] Client returned empty roots array');
      return { success: false, reason: 'Client returned empty roots array', rootsReceived: 0 };
    }

    // Log each root we received
    clientRoots.forEach((root, index) => {
      this.logger.log(`[WorkspaceRoots] Root ${index + 1}: uri="${root.uri}", name="${root.name ?? '(none)'}"`);
    });

    // Validate and store the workspace roots
    const validRoots = this.updateRoots(clientRoots);
    this.logger.log(`[WorkspaceRoots] After validation: ${validRoots.length} valid root(s)`);

    if (validRoots.length === 0) {
      this.logger.log('[WorkspaceRoots] No valid roots after security validation');
      return {
        success: false,
        reason: 'No valid workspace roots after security validation',
        rootsReceived: clientRoots.length,
        validRoots: 0,
      };
    }

    // Log validated roots
    validRoots.forEach((root, index) => {
      this.logger.log(`[WorkspaceRoots] Valid root ${index + 1}: path="${root.path}"`);
    });

    // Search for dw.json in workspace roots
    this.logger.log('[WorkspaceRoots] Searching for dw.json in workspace roots...');
    const dwJsonPath = this.findFile('dw.json');

    if (!dwJsonPath) {
      this.logger.log('[WorkspaceRoots] No dw.json found in any workspace root');
      return {
        success: false,
        reason: 'No dw.json found in workspace roots',
        rootsReceived: clientRoots.length,
        validRoots: validRoots.length,
      };
    }

    this.logger.log(`[WorkspaceRoots] Found dw.json at: ${dwJsonPath}`);

    // Load and validate the dw.json
    try {
      const config = loadSecureDwJson(dwJsonPath);
      this.logger.log('[WorkspaceRoots] Successfully loaded dw.json');
      this.logger.log(`[WorkspaceRoots]   hostname: ${config.hostname}`);
      this.logger.log(`[WorkspaceRoots]   username: ${config.username ? '(set)' : '(not set)'}`);
      this.logger.log(`[WorkspaceRoots]   password: ${config.password ? '(set)' : '(not set)'}`);
      this.logger.log(`[WorkspaceRoots]   client-id: ${config['client-id'] ? '(set)' : '(not set)'}`);
      this.logger.log(`[WorkspaceRoots]   client-secret: ${config['client-secret'] ? '(set)' : '(not set)'}`);

      return {
        success: true,
        config,
        dwJsonPath,
        rootsReceived: clientRoots.length,
        validRoots: validRoots.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`[WorkspaceRoots] Failed to load dw.json: ${errorMessage}`);
      return {
        success: false,
        reason: `Failed to load dw.json: ${errorMessage}`,
        dwJsonPath,
        rootsReceived: clientRoots.length,
        validRoots: validRoots.length,
      };
    }
  }
}

/**
 * Validate a path for dw.json access
 *
 * This is a standalone function that can be used by the dw-json-loader
 * to validate paths before attempting to read them.
 *
 * @param filePath - The path to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateDwJsonPath(filePath: string): { isValid: boolean; error?: string } {
  // First validate the directory containing the file
  const directory = resolve(filePath, '..');
  const validation = validatePath(directory);

  if (!validation.isValid) {
    return validation;
  }

  // Additional validation: ensure it's a .json file
  if (!filePath.toLowerCase().endsWith('.json')) {
    return { isValid: false, error: 'Only .json files are allowed' };
  }

  return { isValid: true };
}
