/**
 * File System Service Interface and Implementation
 *
 * Provides an abstraction layer over Node.js file system operations
 * to enable easier testing and better dependency injection.
 */

import * as fs from 'fs/promises';

/**
 * Interface for file system operations
 */
export interface IFileSystemService {
  /**
   * Check if a file or directory exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Create a directory recursively
   */
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * Write content to a file
   */
  writeFile(path: string, content: string): Promise<void>;

  /**
   * Read content from a file
   */
  readFile(path: string): Promise<string>;

  /**
   * Check access to a file or directory
   */
  access(path: string): Promise<void>;
}

/**
 * Production implementation of file system service
 */
export class FileSystemService implements IFileSystemService {
  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    await fs.mkdir(path, options);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  async readFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf-8');
  }

  async access(path: string): Promise<void> {
    await fs.access(path);
  }
}

/**
 * Mock implementation for testing
 */
export class MockFileSystemService implements IFileSystemService {
  private mockFiles: Map<string, string> = new Map();
  private mockDirectories: Set<string> = new Set();

  // Mock methods for testing setup
  setMockFile(path: string, content: string): void {
    this.mockFiles.set(path, content);
  }

  setMockDirectory(path: string): void {
    this.mockDirectories.add(path);
  }

  clearMocks(): void {
    this.mockFiles.clear();
    this.mockDirectories.clear();
  }

  // Service implementation
  async exists(path: string): Promise<boolean> {
    return this.mockFiles.has(path) || this.mockDirectories.has(path);
  }

  async mkdir(path: string, _options?: { recursive?: boolean }): Promise<void> {
    this.mockDirectories.add(path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.mockFiles.set(path, content);
  }

  async readFile(path: string): Promise<string> {
    const content = this.mockFiles.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  }

  async access(path: string): Promise<void> {
    if (!(await this.exists(path))) {
      throw new Error(`Path not accessible: ${path}`);
    }
  }
}
