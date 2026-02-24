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

  private isPathWithinRoot(rootPath: string, candidatePath: string): boolean {
    const rel = path.relative(rootPath, candidatePath);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  }

  private async resolveCanonicalPath(inputPath: string): Promise<string | null> {
    try {
      return await fs.realpath(path.resolve(inputPath));
    } catch (error) {
      this.logger.warn(`Warning: Could not resolve canonical path for ${inputPath}: ${String(error)}`);
      return null;
    }
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
  private async validateFilePath(
    filePath: string,
    canonicalPackagePath: string,
    canonicalDocsPath: string,
  ): Promise<string | null> {
    const resolvedPath = path.resolve(filePath);

    // Ensure the file still ends with .md before touching the filesystem.
    if (!resolvedPath.toLowerCase().endsWith('.md')) {
      this.logger.warn(`Warning: File does not reference a markdown file: ${filePath}`);
      return null;
    }

    const canonicalFilePath = await this.resolveCanonicalPath(filePath);
    if (!canonicalFilePath) {
      return null;
    }

    // Ensure the canonical path stays inside both package and docs roots.
    const withinPackageRoot = this.isPathWithinRoot(canonicalPackagePath, canonicalFilePath);
    const withinDocsRoot = this.isPathWithinRoot(canonicalDocsPath, canonicalFilePath);
    if (!withinPackageRoot || !withinDocsRoot) {
      this.logger.warn(`Warning: File path outside allowed directory: ${filePath}`);
      return null;
    }

    return canonicalFilePath;
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
    canonicalPackagePath: string,
    canonicalDocsPath: string,
  ): Promise<SFCCClassInfo | null> {
    if (!this.validateFileName(fileName)) {
      return null;
    }

    const className = fileName.replace('.md', '');
    const filePath = path.join(packagePath, fileName);

    const canonicalFilePath = await this.validateFilePath(
      filePath,
      canonicalPackagePath,
      canonicalDocsPath,
    );
    if (!canonicalFilePath) {
      return null;
    }

    try {
      const content = await fs.readFile(canonicalFilePath, 'utf-8');

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
      const canonicalPackagePath = await this.resolveCanonicalPath(packagePath);
      const canonicalDocsPath = await this.resolveCanonicalPath(docsPath);
      if (!canonicalPackagePath || !canonicalDocsPath) {
        this.logger.warn(`Warning: Could not resolve canonical roots for package ${packageName}`);
        return [];
      }

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
          batch.map(file => this.readDocumentationFile(
            file,
            packagePath,
            packageName,
            canonicalPackagePath,
            canonicalDocsPath,
          )),
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
