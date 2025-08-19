/**
 * Path Service Interface and Implementation
 *
 * Provides an abstraction layer over Node.js path operations
 * to enable easier testing and better dependency injection.
 */

import * as path from 'path';

/**
 * Interface for path operations
 */
export interface IPathService {
  /**
   * Join path segments
   */
  join(...paths: string[]): string;

  /**
   * Resolve path segments to an absolute path
   */
  resolve(...paths: string[]): string;

  /**
   * Get the directory name of a path
   */
  dirname(path: string): string;

  /**
   * Get the base name of a path
   */
  basename(path: string, ext?: string): string;

  /**
   * Get the extension of a path
   */
  extname(path: string): string;

  /**
   * Normalize a path
   */
  normalize(path: string): string;

  /**
   * Check if path is absolute
   */
  isAbsolute(path: string): boolean;
}

/**
 * Production implementation of path service
 */
export class PathService implements IPathService {
  join(...paths: string[]): string {
    return path.join(...paths);
  }

  resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  extname(filePath: string): string {
    return path.extname(filePath);
  }

  normalize(filePath: string): string {
    return path.normalize(filePath);
  }

  isAbsolute(filePath: string): boolean {
    return path.isAbsolute(filePath);
  }
}

/**
 * Mock implementation for testing
 */
export class MockPathService implements IPathService {
  // For testing, we can use the real path operations or provide custom behavior
  join(...paths: string[]): string {
    return paths.join('/');
  }

  resolve(...paths: string[]): string {
    const joined = this.join(...paths);
    return joined.startsWith('/') ? joined : `/mock/root/${joined}`;
  }

  dirname(filePath: string): string {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/') || '/';
  }

  basename(filePath: string, ext?: string): string {
    const parts = filePath.split('/');
    const base = parts[parts.length - 1];
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length);
    }
    return base;
  }

  extname(filePath: string): string {
    const base = this.basename(filePath);
    const dotIndex = base.lastIndexOf('.');
    return dotIndex >= 0 ? base.slice(dotIndex) : '';
  }

  normalize(filePath: string): string {
    return filePath.replace(/\/+/g, '/');
  }

  isAbsolute(filePath: string): boolean {
    return filePath.startsWith('/');
  }
}
