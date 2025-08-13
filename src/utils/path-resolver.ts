/**
 * Path Resolver Helper
 *
 * Provides utilities for resolving file and directory paths based on the current working directory.
 * This abstraction allows for easier path management and testing.
 */

import path from 'path';
import { fileURLToPath } from 'url';

export class PathResolver {
  /**
   * Get the current working directory (project root)
   */
  static getCurrentWorkingDir(): string {
    // Get the directory of the current module file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Return the parent directory (project root)
    return path.resolve(__dirname, '..');
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

  /**
   * Get the SFRA docs directory path relative to the current working directory
   */
  static getSFRADocsPath(): string {
    return this.getRelativePath('docs', 'sfra');
  }
}
