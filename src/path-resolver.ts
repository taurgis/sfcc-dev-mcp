/**
 * Path Resolver Helper
 *
 * Provides utilities for resolving file and directory paths in ES modules.
 * This abstraction allows for easier mocking in tests by centralizing
 * the import.meta.url usage.
 */

import { fileURLToPath } from 'url';
import path from 'path';

export class PathResolver {
  /**
   * Get the current file path from import.meta.url
   */
  static getCurrentFilePath(importMetaUrl: string): string {
    return fileURLToPath(importMetaUrl);
  }

  /**
   * Get the current directory path from import.meta.url
   */
  static getCurrentDirPath(importMetaUrl: string): string {
    return path.dirname(fileURLToPath(importMetaUrl));
  }

  /**
   * Get a path relative to the current directory
   */
  static getRelativePath(importMetaUrl: string, ...pathSegments: string[]): string {
    const currentDir = this.getCurrentDirPath(importMetaUrl);
    return path.join(currentDir, ...pathSegments);
  }

  /**
   * Get the docs directory path relative to the current file
   */
  static getDocsPath(importMetaUrl: string = import.meta.url): string {
    return this.getRelativePath(importMetaUrl, '..', 'docs');
  }

  /**
   * Get the best practices docs directory path relative to the current file
   */
  static getBestPracticesPath(importMetaUrl: string = import.meta.url): string {
    return this.getRelativePath(importMetaUrl, '..', 'docs', 'best-practices');
  }
}
