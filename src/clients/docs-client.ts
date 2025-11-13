/**
 * SFCC Documentation Client (Refactored)
 *
 * This module provides functionality to query and retrieve SFCC class documentation
 * from converted Markdown files. It orchestrates specialized modules to handle
 * different aspects of documentation processing.
 *
 * Responsibilities:
 * - Orchestrating specialized modules
 * - Managing initialization and caching
 * - Providing public API for documentation access
 * - Applying filters and search functionality
 */

import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';
import { Logger } from '../utils/logger.js';
import { DocumentationScanner } from './docs/documentation-scanner.js';
import { ClassContentParser } from './docs/class-content-parser.js';
import type { SFCCClassInfo } from './docs/documentation-scanner.js';
import type { SFCCClassDetails, SFCCMethod } from './docs/class-content-parser.js';
import { ClassNameResolver } from './docs/class-name-resolver.js';
import { ReferencedTypesExtractor } from './docs/referenced-types-extractor.js';

// Re-export types for backward compatibility
export type { SFCCClassInfo, SFCCMethod, SFCCClassDetails };
export type { SFCCProperty, SFCCConstant } from './docs/class-content-parser.js';

export interface ClassDetailsFilterOptions {
  includeDescription?: boolean;
  includeConstants?: boolean;
  includeProperties?: boolean;
  includeMethods?: boolean;
  includeInheritance?: boolean;
  search?: string;
}

export class SFCCDocumentationClient {
  private docsPath: string;
  private classCache: Map<string, SFCCClassInfo> = new Map();
  private cacheManager: CacheManager;
  private initialized = false;
  private logger: Logger;
  private documentationScanner: DocumentationScanner;
  private classContentParser: ClassContentParser;

  constructor() {
    this.docsPath = PathResolver.getDocsPath();
    this.cacheManager = new CacheManager();
    this.logger = Logger.getChildLogger('DocsClient');
    this.documentationScanner = new DocumentationScanner();
    this.classContentParser = new ClassContentParser();
  }

  /**
   * Initialize the documentation client by scanning all available classes
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.classCache = await this.documentationScanner.scanDocumentation(this.docsPath);
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize SFCC documentation: ${error}`);
    }
  }

  /**
   * Get a list of all available SFCC classes
   */
  async getAvailableClasses(): Promise<string[]> {
    await this.initialize();
    return Array.from(this.classCache.keys())
      .sort()
      .map(className => ClassNameResolver.toOfficialFormat(className));
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
      .filter(className => className.toLowerCase().includes(lowercaseQuery))
      .sort()
      .map(className => ClassNameResolver.toOfficialFormat(className));

    // Cache the results
    this.cacheManager.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Get the raw documentation content for a class
   */
  async getClassDocumentation(className: string): Promise<string | null> {
    await this.initialize();

    // Check cache first
    const normalizedClassName = ClassNameResolver.normalizeClassName(className);
    const cacheKey = `content:${normalizedClassName}`;
    const cachedContent = this.cacheManager.getFileContent(cacheKey);
    if (cachedContent !== undefined) {
      return cachedContent || null;
    }

    // Resolve class name with fallback logic
    const resolved = ClassNameResolver.resolveClassName(normalizedClassName, this.classCache);
    const content = resolved ? resolved.info.content : null;

    // Cache the result (including null results to avoid repeated lookups)
    this.cacheManager.setFileContent(cacheKey, content ?? '');

    return content;
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

    const details = this.classContentParser.parseClassContent(content);

    // Cache the parsed details
    this.cacheManager.setClassDetails(cacheKey, details);

    return details;
  }

  /**
   * Get class details with optional expansion of referenced types and filtering
   */
  async getClassDetailsExpanded(
    className: string,
    expand: boolean = false,
    filterOptions?: ClassDetailsFilterOptions,
  ): Promise<SFCCClassDetails & { referencedTypes?: SFCCClassDetails[] } | null> {
    // Set default filter options
    const filters = {
      includeDescription: filterOptions?.includeDescription ?? true,
      includeConstants: filterOptions?.includeConstants ?? true,
      includeProperties: filterOptions?.includeProperties ?? true,
      includeMethods: filterOptions?.includeMethods ?? true,
      includeInheritance: filterOptions?.includeInheritance ?? true,
      search: filterOptions?.search,
    };

    // Check cache first for expanded details with filter options
    const cacheKey = `details-expanded:${className}:${expand}:${JSON.stringify(filters)}`;
    const cachedResult = this.cacheManager.getClassDetails(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const classDetails = await this.getClassDetails(className);
    if (!classDetails) {
      this.cacheManager.setClassDetails(cacheKey, null);
      return null;
    }

    // Apply filtering and search to the class details
    const filteredDetails = this.applyFiltersAndSearch(classDetails, filters);

    if (!expand) {
      this.cacheManager.setClassDetails(cacheKey, filteredDetails);
      return filteredDetails;
    }

    // Get the raw content to extract referenced types
    const content = await this.getClassDocumentation(className);
    if (!content) {
      this.cacheManager.setClassDetails(cacheKey, filteredDetails);
      return filteredDetails;
    }

    const referencedTypeNames = ReferencedTypesExtractor.extractFilteredReferencedTypes(content, className);
    const referencedTypes: SFCCClassDetails[] = [];

    // Get details for each referenced type
    for (const typeName of referencedTypeNames) {
      try {
        const typeDetails = await this.getClassDetails(typeName);
        if (typeDetails) {
          referencedTypes.push(typeDetails);
        }
      } catch {
        // Silently skip types that can't be found
        this.logger.warn(`Could not find details for referenced type: ${typeName}`);
      }
    }

    const result = {
      ...filteredDetails,
      referencedTypes: referencedTypes.length > 0 ? referencedTypes : undefined,
    };

    // Cache the result
    this.cacheManager.setClassDetails(cacheKey, result);

    return result;
  }

  /**
   * Apply filters and search to class details
   */
  private applyFiltersAndSearch(
    classDetails: SFCCClassDetails,
    filters: {
      includeDescription: boolean;
      includeConstants: boolean;
      includeProperties: boolean;
      includeMethods: boolean;
      includeInheritance: boolean;
      search?: string;
    },
  ): SFCCClassDetails {
    const result: SFCCClassDetails = {
      className: classDetails.className,
      packageName: classDetails.packageName,
      description: filters.includeDescription ? classDetails.description : '',
      constants: [],
      properties: [],
      methods: [],
      inheritance: filters.includeInheritance ? classDetails.inheritance : undefined,
      constructorInfo: classDetails.constructorInfo,
    };

    // Apply search filter to constants
    if (filters.includeConstants) {
      result.constants = filters.search
        ? classDetails.constants.filter(constant =>
          this.matchesSearch(constant.name, constant.description, filters.search!),
        )
        : classDetails.constants;
    }

    // Apply search filter to properties
    if (filters.includeProperties) {
      result.properties = filters.search
        ? classDetails.properties.filter(property =>
          this.matchesSearch(property.name, property.description, filters.search!),
        )
        : classDetails.properties;
    }

    // Apply search filter to methods
    if (filters.includeMethods) {
      result.methods = filters.search
        ? classDetails.methods.filter(method =>
          this.matchesSearch(method.name, method.description, filters.search!) ||
          this.matchesSearch(method.signature, '', filters.search!),
        )
        : classDetails.methods;
    }

    // Apply search filter to inheritance
    if (filters.includeInheritance && filters.search && result.inheritance) {
      result.inheritance = result.inheritance.filter(inheritanceItem =>
        this.matchesSearch(inheritanceItem, '', filters.search!),
      );
    }

    return result;
  }

  /**
   * Check if a name or description matches the search term (case-insensitive)
   */
  private matchesSearch(name: string, description: string, searchTerm: string): boolean {
    const search = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    );
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
      const details = await this.getClassDetails(fullClassName);
      const methods = details?.methods ?? [];
      for (const method of methods) {
        if (method.name.toLowerCase().includes(methodName.toLowerCase())) {
          results.push({
            className: fullClassName,
            method,
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
