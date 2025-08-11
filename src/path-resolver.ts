/**
 * Path Resolver Helper
 *
 * Provides utilities for resolving file and directory paths based on the current working directory.
 * This abstraction allows for easier path management and testing.
 */

import path from 'path';

export class PathResolver {
  /**
   * Get the current working directory
   */
  static getCurrentWorkingDir(): string {
    return process.cwd();
  }

  /**
   * Get a path relative to the current working directory
   */
  static getRelativePath(...pathSegments: string[]): string {
    const currentDir = this.getCurrentWorkingDir();
    return path.join(currentDir, ...pathSegments);
  }

  /**
   * Get the docs directory path relative to the current working directory
   */
  static getDocsPath(): string {
    return this.getRelativePath('docs');
  }

  /**
   * Get the best practices docs directory path relative to the current working directory
   */
  static getBestPracticesPath(): string {
    return this.getRelativePath('docs', 'best-practices');
  }
}
