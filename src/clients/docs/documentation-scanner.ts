/**
 * Documentation Scanner
 *
 * Responsible for scanning the documentation directory structure and
 * discovering SFCC class documentation files with security validation.
 *
 * Single Responsibility: File system operations and documentation discovery
 */

import fs from 'fs/promises';
import path from 'path';
import { Logger } from '../../utils/logger.js';

export interface SFCCClassInfo {
  className: string;
  packageName: string;
  filePath: string;
  content: string;
}

export class DocumentationScanner {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getChildLogger('DocumentationScanner');
  }

  /**
   * Check if a directory name represents an SFCC-specific directory
   * SFCC directories include dw_ prefixed namespaces and TopLevel
    * Excludes sfra and isml directories
   */
  private isSFCCDirectory(directoryName: string): boolean {
    // Include dw_ prefixed directories (SFCC namespaces)
    if (directoryName.startsWith('dw_')) {
      return true;
    }

    // Include TopLevel directory (contains core JavaScript classes)
    if (directoryName === 'TopLevel') {
      return true;
    }

    // Exclude sfra directory (handled by SFRA tools)
    if (directoryName === 'sfra') {
      return false;
    }

    // Exclude the isml directory (ISML templates, not SFCC classes)
    if (directoryName === 'isml') {
      return false;
    }

    // Exclude any other non-SFCC directories
    return false;
  }

  /**
   * Validate file name for security concerns
   */
  private validateFileName(fileName: string): boolean {
    // Enhanced security validation - validate file name before path operations
    if (!fileName || typeof fileName !== 'string') {
      this.logger.warn(`Warning: Invalid file name type: ${fileName}`);
      return false;
    }

    // Prevent null bytes and dangerous characters in the file name itself
    if (fileName.includes('\0') || fileName.includes('\x00')) {
      this.logger.warn(`Warning: File name contains null bytes: ${fileName}`);
      return false;
    }

    // Prevent path traversal sequences in the file name
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      this.logger.warn(`Warning: File name contains path traversal sequences: ${fileName}`);
      return false;
    }

    // Only allow alphanumeric characters, underscores, hyphens, and dots for file names
    if (!/^[a-zA-Z0-9_.-]+$/.test(fileName)) {
      this.logger.warn(`Warning: File name contains invalid characters: ${fileName}`);
      return false;
    }

    return true;
  }

  /**
   * Validate file path for security concerns
   */
  private validateFilePath(filePath: string, packagePath: string, docsPath: string): boolean {
    // Additional security validation - ensure the resolved path is within the package directory
    const resolvedPath = path.resolve(filePath);
    const resolvedPackagePath = path.resolve(packagePath);
    const resolvedDocsPath = path.resolve(docsPath);

    // Ensure the file is within the package directory and docs directory
    if (!resolvedPath.startsWith(resolvedPackagePath) || !resolvedPath.startsWith(resolvedDocsPath)) {
      this.logger.warn(`Warning: File path outside allowed directory: ${filePath}`);
      return false;
    }

    // Ensure the file still ends with .md after path resolution
    if (!resolvedPath.toLowerCase().endsWith('.md')) {
      this.logger.warn(`Warning: File does not reference a markdown file: ${filePath}`);
      return false;
    }

    return true;
  }

  /**
   * Validate file content for security concerns
   */
  private validateFileContent(content: string, fileName: string): boolean {
    // Basic content validation
    if (!content.trim()) {
      this.logger.warn(`Warning: Empty documentation file: ${fileName}`);
      return false;
    }

    // Check for binary content
    if (content.includes('\0')) {
      this.logger.warn(`Warning: Binary content detected in: ${fileName}`);
      return false;
    }

    return true;
  }

  /**
   * Read and validate a single documentation file
   */
  private async readDocumentationFile(
    fileName: string,
    packagePath: string,
    packageName: string,
    docsPath: string,
  ): Promise<SFCCClassInfo | null> {
    if (!this.validateFileName(fileName)) {
      return null;
    }

    const className = fileName.replace('.md', '');
    const filePath = path.join(packagePath, fileName);

    if (!this.validateFilePath(filePath, packagePath, docsPath)) {
      return null;
    }

    try {
      const resolvedPath = path.resolve(filePath);
      const content = await fs.readFile(resolvedPath, 'utf-8');

      if (!this.validateFileContent(content, fileName)) {
        return null;
      }

      return {
        className,
        packageName,
        filePath,
        content,
      };
    } catch (fileError) {
      this.logger.warn(`Warning: Could not read file ${fileName}: ${fileError}`);
      return null;
    }
  }

  // Batch size for parallel file reads (avoid file descriptor exhaustion)
  private static readonly PARALLEL_BATCH_SIZE = 50;

  /**
   * Scan a single package directory for documentation files
   * Uses parallel batch processing for improved performance
   */
  private async scanPackageDirectory(
    packageName: string,
    packagePath: string,
    docsPath: string,
  ): Promise<SFCCClassInfo[]> {
    try {
      const files = await fs.readdir(packagePath);

      // Filter to only markdown files with valid names
      const mdFiles = files.filter(file => {
        if (!file || typeof file !== 'string') {
          this.logger.warn(`Warning: Invalid file name type: ${file}`);
          return false;
        }
        return file.endsWith('.md');
      });

      // Process files in parallel batches to avoid fd exhaustion
      const classInfos: SFCCClassInfo[] = [];
      for (let i = 0; i < mdFiles.length; i += DocumentationScanner.PARALLEL_BATCH_SIZE) {
        const batch = mdFiles.slice(i, i + DocumentationScanner.PARALLEL_BATCH_SIZE);
        const results = await Promise.all(
          batch.map(file => this.readDocumentationFile(file, packagePath, packageName, docsPath)),
        );
        // Filter out null results and add to classInfos
        for (const result of results) {
          if (result) {
            classInfos.push(result);
          }
        }
      }

      return classInfos;
    } catch (error) {
      this.logger.warn(`Warning: Could not read package ${packageName}: ${error}`);
      return [];
    }
  }

  /**
   * Scan the docs directory and index all SFCC classes
    * Only scans SFCC-specific directories, excluding sfra and isml
   * Uses parallel processing for improved cold-start performance
   */
  async scanDocumentation(docsPath: string): Promise<Map<string, SFCCClassInfo>> {
    const classCache = new Map<string, SFCCClassInfo>();
    const packages = await fs.readdir(docsPath, { withFileTypes: true });

    // Filter to only SFCC directories
    const sfccPackages = packages.filter(packageDir => {
      if (!packageDir.isDirectory()) {
        return false;
      }
      return this.isSFCCDirectory(packageDir.name);
    });

    // Scan all packages in parallel for faster initialization
    const scanPromises = sfccPackages.map(async packageDir => {
      const packageName = packageDir.name;
      const packagePath = path.join(docsPath, packageName);
      const classInfos = await this.scanPackageDirectory(packageName, packagePath, docsPath);
      return { packageName, classInfos };
    });

    const results = await Promise.all(scanPromises);

    // Add all results to cache
    for (const { packageName, classInfos } of results) {
      for (const classInfo of classInfos) {
        const cacheKey = `${packageName}.${classInfo.className}`;
        classCache.set(cacheKey, classInfo);
      }
    }

    return classCache;
  }
}
