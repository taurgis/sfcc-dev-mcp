/**
 * SFCC Documentation Client
 *
 * This module provides functionality to query and retrieve SFCC class documentation
 * from the converted Markdown files. It enables AI assistants to access detailed
 * information about SFCC classes, methods, properties, and usage examples.
 */

import fs from 'fs/promises';
import path from 'path';
import { PathResolver } from './path-resolver.js';
import { CacheManager } from './cache.js';
import { Logger } from './logger.js';

// Create a logger instance for this module
const logger = new Logger('DocsClient');

export interface SFCCClassInfo {
  className: string;
  packageName: string;
  filePath: string;
  content: string;
}

export interface SFCCMethod {
  name: string;
  signature: string;
  description: string;
  parameters?: string[];
  returnType?: string;
}

export interface SFCCProperty {
  name: string;
  type: string;
  description: string;
  modifiers?: string[];
}

export interface SFCCClassDetails {
  className: string;
  packageName: string;
  description: string;
  properties: SFCCProperty[];
  methods: SFCCMethod[];
  inheritance?: string[];
  constructorInfo?: string;
}

export class SFCCDocumentationClient {
  private docsPath: string;
  private classCache: Map<string, SFCCClassInfo> = new Map();
  private cacheManager: CacheManager;
  private initialized = false;

  constructor() {
    this.docsPath = PathResolver.getDocsPath();
    this.cacheManager = new CacheManager();
  }

  /**
   * Initialize the documentation client by scanning all available classes
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.scanDocumentation();
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize SFCC documentation: ${error}`);
    }
  }

  /**
   * Scan the docs directory and index all SFCC classes
   */
  private async scanDocumentation(): Promise<void> {
    const packages = await fs.readdir(this.docsPath, { withFileTypes: true });

    for (const packageDir of packages) {
      if (!packageDir.isDirectory()) continue;

      const packageName = packageDir.name;
      const packagePath = path.join(this.docsPath, packageName);

      try {
        const files = await fs.readdir(packagePath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const className = file.replace('.md', '');
            const filePath = path.join(packagePath, file);
            const content = await fs.readFile(filePath, 'utf-8');

            this.classCache.set(
              `${packageName}.${className}`,
              {
                className,
                packageName,
                filePath,
                content
              }
            );
          }
        }
      } catch (error) {
        logger.warn(`Warning: Could not read package ${packageName}: ${error}`);
      }
    }
  }

  /**
   * Get a list of all available SFCC classes
   */
  async getAvailableClasses(): Promise<string[]> {
    await this.initialize();
    return Array.from(this.classCache.keys()).sort();
  }

  /**
   * Search for classes by name (partial matching)
   */
  async searchClasses(query: string): Promise<string[]> {
    await this.initialize();

    // Check cache first
    const cacheKey = `search:classes:${query.toLowerCase()}`;
    const cachedResult = this.cacheManager.getSearchResults(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const lowercaseQuery = query.toLowerCase();
    const results = Array.from(this.classCache.keys())
      .filter(className =>
        className.toLowerCase().includes(lowercaseQuery)
      )
      .sort()
        // Return the official . notation for class names (e.g., dw.content.ContentMgr)
      .map(className => className.replace(/_/g, '.'))
    ;

    // Cache the results
    this.cacheManager.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Get the raw documentation content for a class
   */
  async getClassDocumentation(className: string): Promise<string | null> {
    await this.initialize();

    // Normalize class name to support both formats (dw.content.ContentMgr -> dw_content.ContentMgr)
    const normalizedClassName = this.normalizeClassName(className);

    // Check cache first
    const cacheKey = `content:${normalizedClassName}`;
    const cachedContent = this.cacheManager.getFileContent(cacheKey);
    if (cachedContent !== undefined) {
      return cachedContent || null;
    }

    // Try exact match first with normalized name
    let classInfo = this.classCache.get(normalizedClassName);

    // If not found, try to find by class name only (without package)
    if (!classInfo) {
      const simpleClassName = this.extractSimpleClassName(normalizedClassName);
      const matches = Array.from(this.classCache.entries())
        .filter(([, info]) => info.className === simpleClassName);

      if (matches.length === 1) {
        classInfo = matches[0][1];
      } else if (matches.length > 1) {
        throw new Error(`Multiple classes found with name "${simpleClassName}": ${matches.map(([key]) => key).join(', ')}`);
      }
    }

    const content = classInfo ? classInfo.content : null;

    // Cache the result (including null results to avoid repeated lookups)
    this.cacheManager.setFileContent(cacheKey, content || '');

    return content;
  }

  /**
   * Normalize class name to handle both dot and underscore formats
   * Examples:
   * - dw.content.ContentMgr -> dw_content.ContentMgr
   * - dw_content.ContentMgr -> dw_content.ContentMgr (unchanged)
   * - ContentMgr -> ContentMgr (unchanged)
   */
  private normalizeClassName(className: string): string {
    // If it contains dots but not underscores in the package part, convert dots to underscores
    if (className.includes('.') && !className.includes('_')) {
      // Split by dots and convert package parts (all but last) to use underscores
      const parts = className.split('.');
      if (parts.length > 1) {
        const packageParts = parts.slice(0, -1);
        const simpleClassName = parts[parts.length - 1];
        return `${packageParts.join('_')}.${simpleClassName}`;
      }
    }
    return className;
  }

  /**
   * Extract simple class name from full class name
   * Examples:
   * - dw_content.ContentMgr -> ContentMgr
   * - ContentMgr -> ContentMgr
   */
  private extractSimpleClassName(className: string): string {
    const parts = className.split('.');
    return parts[parts.length - 1];
  }

  /**
   * Parse class documentation and extract structured information
   */
  async getClassDetails(className: string): Promise<SFCCClassDetails | null> {
    // Check cache first
    const cacheKey = `details:${className}`;
    const cachedDetails = this.cacheManager.getClassDetails(cacheKey);
    if (cachedDetails !== undefined) {
      return cachedDetails;
    }

    const content = await this.getClassDocumentation(className);
    if (!content) {
      // Cache null results to avoid repeated parsing attempts
      this.cacheManager.setClassDetails(cacheKey, null);
      return null;
    }

    const details = this.parseClassContent(content);

    // Cache the parsed details
    this.cacheManager.setClassDetails(cacheKey, details);

    return details;
  }

  /**
   * Parse markdown content and extract structured class information
   */
  private parseClassContent(content: string): SFCCClassDetails {
    const lines = content.split('\n');

    let currentSection = '';
    let className = '';
    let packageName = '';
    let description = '';
    const properties: SFCCProperty[] = [];
    const methods: SFCCMethod[] = [];
    const inheritance: string[] = [];
    let constructorInfo = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Extract package name
      if (line.startsWith('## Package:')) {
        packageName = line.replace('## Package:', '').trim();
      }

      // Extract class name
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        className = line.replace('# ', '').replace('Class ', '').trim();
      }

      // Track current section
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
      }

      // Extract description
      if (currentSection === 'Description' && line && !line.startsWith('#')) {
        description += line + ' ';
      }

      // Extract inheritance hierarchy
      if (currentSection === 'Inheritance Hierarchy' && line.includes('-')) {
        const hierarchyItem = line.replace(/^[\s-]*/, '').trim();
        if (hierarchyItem) {
          inheritance.push(hierarchyItem);
        }
      }

      // Extract properties
      if (currentSection === 'Properties' && line.startsWith('### ')) {
        const propName = line.replace('### ', '').trim();
        let propType = '';
        let propDesc = '';
        const modifiers: string[] = [];

        // Look for type and description in following lines
        for (let j = i + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('**Type:**')) {
            const typeMatch = nextLine.match(/\*\*Type:\*\*\s*(.+)/);
            if (typeMatch) {
              const typeInfo = typeMatch[1];
              propType = typeInfo.split(' ')[0];
              if (typeInfo.includes('(Read Only)')) modifiers.push('Read Only');
              if (typeInfo.includes('(Static)')) modifiers.push('Static');
            }
          } else if (nextLine && !nextLine.startsWith('**') && !nextLine.startsWith('#')) {
            propDesc += nextLine + ' ';
          }
        }

        properties.push({
          name: propName,
          type: propType,
          description: propDesc.trim(),
          modifiers: modifiers.length > 0 ? modifiers : undefined
        });
      }

      // Extract methods
      if ((currentSection === 'Method Summary' || currentSection === 'Method Details') && line.startsWith('### ')) {
        const methodName = line.replace('### ', '').trim();
        let signature = '';
        let methodDesc = '';

        // Look for signature and description in following lines
        for (let j = i + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('**Signature:**')) {
            const sigMatch = nextLine.match(/\*\*Signature:\*\*\s*`(.+)`/);
            if (sigMatch) {
              signature = sigMatch[1];
            }
          } else if (nextLine.startsWith('**Description:**')) {
            methodDesc = nextLine.replace('**Description:**', '').trim();
          } else if (nextLine && !nextLine.startsWith('**') && !nextLine.startsWith('#') && !nextLine.startsWith('---')) {
            if (!methodDesc && !nextLine.includes('Signature:')) {
              methodDesc += nextLine + ' ';
            }
          }
        }

        methods.push({
          name: methodName,
          signature: signature || methodName,
          description: methodDesc.trim()
        });
      }

      // Extract constructor info
      if (currentSection === 'Constructor Summary' && line && !line.startsWith('#')) {
        constructorInfo += line + ' ';
      }
    }

    return {
      className: className.trim(),
      packageName: packageName.trim(),
      description: description.trim(),
      properties,
      methods,
      inheritance: inheritance.length > 0 ? inheritance : undefined,
      constructorInfo: constructorInfo.trim() || undefined
    };
  }

  /**
   * Parse markdown content and extract referenced types from a class
   */
  private extractReferencedTypes(content: string): string[] {
    const referencedTypes = new Set<string>();
    const lines = content.split('\n');

    for (const line of lines) {
      // Extract types from property definitions
      const propTypeMatch = line.match(/\*\*Type:\*\*\s*([A-Za-z][A-Za-z0-9.]*)/);
      if (propTypeMatch) {
        const type = propTypeMatch[1];
        // Only include SFCC types (those that start with uppercase or contain dots)
        if (/^[A-Z]/.test(type) || type.includes('.')) {
          referencedTypes.add(type);
        }
      }

      // Extract return types from method signatures
      const methodReturnMatch = line.match(/:\s*([A-Za-z][A-Za-z0-9.]*)\s*$/);
      if (methodReturnMatch) {
        const type = methodReturnMatch[1];
        if (/^[A-Z]/.test(type) || type.includes('.')) {
          referencedTypes.add(type);
        }
      }

      // Extract parameter types from method signatures
      const paramMatches = line.match(/\(\s*([^)]+)\s*\)/);
      if (paramMatches) {
        const params = paramMatches[1];
        const typeMatches = params.match(/:\s*([A-Za-z][A-Za-z0-9.]*)/g);
        if (typeMatches) {
          typeMatches.forEach(match => {
            const type = match.replace(/:\s*/, '');
            if (/^[A-Z]/.test(type) || type.includes('.')) {
              referencedTypes.add(type);
            }
          });
        }
      }
    }

    return Array.from(referencedTypes);
  }

  /**
   * Get class details with optional expansion of referenced types
   */
  async getClassDetailsExpanded(className: string, expand: boolean = false): Promise<SFCCClassDetails & { referencedTypes?: SFCCClassDetails[] } | null> {
    // Check cache first for expanded details
    const cacheKey = `details-expanded:${className}:${expand}`;
    const cachedResult = this.cacheManager.getClassDetails(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const classDetails = await this.getClassDetails(className);
    if (!classDetails || !expand) {
      const result = classDetails;
      this.cacheManager.setClassDetails(cacheKey, result);
      return result;
    }

    // Get the raw content to extract referenced types
    const content = await this.getClassDocumentation(className);
    if (!content) {
      this.cacheManager.setClassDetails(cacheKey, classDetails);
      return classDetails;
    }

    const referencedTypeNames = this.extractReferencedTypes(content);
    const referencedTypes: SFCCClassDetails[] = [];

    // Get details for each referenced type
    for (const typeName of referencedTypeNames) {
      // Skip if it's the same class to avoid circular references
      if (typeName === className || typeName.endsWith(`.${className}`)) {
        continue;
      }

      try {
        const typeDetails = await this.getClassDetails(typeName);
        if (typeDetails) {
          referencedTypes.push(typeDetails);
        }
      } catch (error) {
        // Silently skip types that can't be found
        logger.warn(`Could not find details for referenced type: ${typeName}`);
      }
    }

    const result = {
      ...classDetails,
      referencedTypes: referencedTypes.length > 0 ? referencedTypes : undefined
    };

    // Cache the expanded result
    this.cacheManager.setClassDetails(cacheKey, result);
    return result;
  }

  /**
   * Get methods for a specific class
   */
  async getClassMethods(className: string): Promise<SFCCMethod[]> {
    const details = await this.getClassDetails(className);
    return details?.methods || [];
  }

  /**
   * Get properties for a specific class
   */
  async getClassProperties(className: string): Promise<SFCCProperty[]> {
    const details = await this.getClassDetails(className);
    return details?.properties || [];
  }

  /**
   * Search for methods across all classes
   */
  async searchMethods(methodName: string): Promise<{ className: string; method: SFCCMethod }[]> {
    await this.initialize();

    // Check cache first
    const cacheKey = `search:methods:${methodName.toLowerCase()}`;
    const cachedResult = this.cacheManager.getMethodSearch(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const results: { className: string; method: SFCCMethod }[] = [];

    for (const [fullClassName] of this.classCache) {
      const methods = await this.getClassMethods(fullClassName);
      for (const method of methods) {
        if (method.name.toLowerCase().includes(methodName.toLowerCase())) {
          results.push({
            className: fullClassName,
            method
          });
        }
      }
    }

    // Cache the search results
    this.cacheManager.setMethodSearch(cacheKey, results);
    return results;
  }

  /**
   * Get cache statistics for monitoring performance
   */
  getCacheStats(): ReturnType<CacheManager['getAllStats']> {
    return this.cacheManager.getAllStats();
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cacheManager.clearAll();
  }

  /**
   * Cleanup resources and destroy caches
   */
  destroy(): void {
    this.cacheManager.destroy();
  }
}
