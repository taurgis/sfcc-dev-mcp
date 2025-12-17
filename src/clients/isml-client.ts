/**
 * SFCC ISML Documentation Client
 *
 * Provides access to ISML (Internet Store Markup Language) element documentation including
 * control flow elements, output formatting, includes, scripting, caching, and special elements.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';
import { Logger } from '../utils/logger.js';
import {
  extractDescriptionFromContent,
  extractSections as extractMarkdownSections,
  calculateSearchRelevance,
  generateSearchPreview,
} from '../utils/markdown-utils.js';
import { buildCategoryList } from '../utils/category-utils.js';

export interface ISMLElement {
  name: string;
  title: string;
  description: string;
  sections: string[];
  content: string;
  category: 'control-flow' | 'output' | 'includes' | 'scripting' | 'cache' | 'decorators' | 'special' | 'payment' | 'analytics';
  attributes?: string[];
  requiredAttributes?: string[];
  optionalAttributes?: string[];
  filename: string;
  lastModified?: Date;
}

export interface ISMLElementSummary {
  name: string;
  title: string;
  description: string;
  category: string;
  filename: string;
}

export interface ISMLSearchResult {
  element: ISMLElementSummary;
  relevance: number;
  matchedSections: string[];
  preview: string;
}

export interface ISMLCategory {
  name: string;
  displayName: string;
  description: string;
  elementCount: number;
}

// Element categorization rules
const CATEGORY_MAPPINGS: Record<string, string> = {
  // Control flow elements
  'isif': 'control-flow',
  'isloop': 'control-flow',
  'isbreak': 'control-flow',
  'iscontinue': 'control-flow',
  'isnext': 'control-flow',
  'isselect': 'control-flow',

  // Output elements
  'isprint': 'output',

  // Include/Component elements
  'isinclude': 'includes',
  'iscomponent': 'includes',
  'iscontent': 'includes',
  'isslot': 'includes',
  'ismodule': 'includes',

  // Scripting elements
  'isscript': 'scripting',
  'isobject': 'scripting',
  'isset': 'scripting',

  // Cache elements
  'iscache': 'cache',

  // Decorator elements
  'isdecorate': 'decorators',

  // Special elements
  'isredirect': 'special',
  'isstatus': 'special',
  'iscookie': 'special',
  'iscomment': 'special',
  'isremove': 'special',
  'isreplace': 'special',

  // Payment elements
  'ispayment': 'payment',
  'ispaymentmessages': 'payment',
  'isapplepay': 'payment',
  'isbuynow': 'payment',

  // Analytics elements
  'isactivedatacontext': 'analytics',
  'isactivedatahead': 'analytics',
  'isanalyticsoff': 'analytics',
};

const CATEGORY_DESCRIPTIONS: Record<string, { displayName: string; description: string }> = {
  'control-flow': {
    displayName: 'Control Flow',
    description: 'Conditional logic, loops, and flow control elements (isif, isloop, isbreak, etc.)',
  },
  'output': {
    displayName: 'Output',
    description: 'Elements for formatting and displaying data (isprint)',
  },
  'includes': {
    displayName: 'Includes & Components',
    description: 'Template inclusion and component rendering (isinclude, iscomponent, isslot, etc.)',
  },
  'scripting': {
    displayName: 'Scripting',
    description: 'Server-side scripting and variable management (isscript, isset, isobject)',
  },
  'cache': {
    displayName: 'Cache',
    description: 'Page and template caching control (iscache)',
  },
  'decorators': {
    displayName: 'Decorators',
    description: 'Template decoration and layout wrapping (isdecorate)',
  },
  'special': {
    displayName: 'Special Elements',
    description: 'Specialized functionality (isredirect, isstatus, iscookie, iscomment, etc.)',
  },
  'payment': {
    displayName: 'Payment',
    description: 'Payment-related elements (ispayment, isapplepay, isbuynow)',
  },
  'analytics': {
    displayName: 'Analytics',
    description: 'Analytics and tracking elements (isactivedatacontext, isactivedatahead)',
  },
};

/**
 * Client for accessing ISML element documentation
 */
export class ISMLClient {
  private readonly logger: Logger;
  private readonly cache: CacheManager;
  private readonly docsDir: string;
  private elementsCache: ISMLElement[] | null = null;

  constructor() {
    this.logger = Logger.getChildLogger('ISMLClient');
    this.cache = new CacheManager();
    this.docsDir = path.join(PathResolver.getDocsPath(), 'isml');
  }

  /**
   * Get list of all available ISML elements with summaries
   */
  async getAvailableElements(): Promise<ISMLElementSummary[]> {
    this.logger.debug('Getting available ISML elements');

    const cacheKey = 'isml:elements:list';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached element list');
      return cached;
    }

    const elements = await this.loadAllElements();
    const summaries = elements.map((el) => this.toSummary(el));

    this.cache.setSearchResults(cacheKey, summaries);
    return summaries;
  }

  /**
   * Get detailed information about a specific ISML element
   */
  async getISMLElement(
    elementName: string,
    options?: {
      includeContent?: boolean;
      includeSections?: boolean;
      includeAttributes?: boolean;
    },
  ): Promise<ISMLElement | null> {
    const normalizedName = this.normalizeElementName(elementName);
    this.logger.debug(`Getting ISML element: ${normalizedName}`);

    const cacheKey = `isml:element:${normalizedName}:${JSON.stringify(options)}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached element');
      return cached;
    }

    const elements = await this.loadAllElements();
    const element = elements.find((el) => el.name.toLowerCase() === normalizedName.toLowerCase());

    if (!element) {
      this.logger.warn(`ISML element not found: ${normalizedName}`);
      return null;
    }

    // Apply options to filter returned data
    const filteredElement = this.applyElementOptions(element, options);

    this.cache.setSearchResults(cacheKey, filteredElement);
    return filteredElement;
  }

  /**
   * Search ISML documentation with relevance scoring
   */
  async searchISMLElements(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<ISMLSearchResult[]> {
    this.logger.debug(`Searching ISML elements for: ${query}`);

    const elements = await this.loadAllElements();
    const searchQuery = query.toLowerCase();
    const results: ISMLSearchResult[] = [];

    for (const element of elements) {
      // Skip if category filter doesn't match
      if (options?.category && element.category !== options.category) {
        continue;
      }

      const relevance = this.calculateRelevance(element, searchQuery);
      if (relevance > 0) {
        const matchedSections = this.findMatchedSections(element, searchQuery);
        const preview = this.generatePreview(element, searchQuery);

        results.push({
          element: this.toSummary(element),
          relevance,
          matchedSections,
          preview,
        });
      }
    }

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);

    // Apply limit if specified
    const limitedResults = options?.limit ? results.slice(0, options.limit) : results;

    this.logger.debug(`Found ${limitedResults.length} results for query: ${query}`);
    return limitedResults;
  }

  /**
   * Get ISML elements filtered by category
   */
  async getElementsByCategory(category: string): Promise<ISMLElementSummary[]> {
    this.logger.debug(`Getting ISML elements by category: ${category}`);

    const elements = await this.loadAllElements();
    const filtered = elements.filter((el) => el.category === category);

    return filtered.map((el) => this.toSummary(el));
  }

  /**
   * Get available ISML element categories with counts
   */
  async getAvailableCategories(): Promise<ISMLCategory[]> {
    this.logger.debug('Getting available ISML categories');

    const cacheKey = 'isml:categories';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached categories');
      return cached;
    }

    const elements = await this.loadAllElements();

    // Use shared utility for building category list
    const categoryList = buildCategoryList(elements, CATEGORY_DESCRIPTIONS);

    // Map to ISMLCategory format
    const categories: ISMLCategory[] = categoryList.map(cat => ({
      name: cat.name,
      displayName: cat.displayName,
      description: cat.description,
      elementCount: cat.count ?? 0,
    }));

    this.cache.setSearchResults(cacheKey, categories);
    return categories;
  }

  /**
   * Load all ISML element documentation files
   */
  private async loadAllElements(): Promise<ISMLElement[]> {
    if (this.elementsCache) {
      return this.elementsCache;
    }

    this.logger.debug(`Scanning ISML documentation directory: ${this.docsDir}`);

    try {
      const files = await fs.readdir(this.docsDir);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      this.logger.debug(`Found ${mdFiles.length} ISML documentation files`);

      const elements: ISMLElement[] = [];
      for (const file of mdFiles) {
        const filePath = path.join(this.docsDir, file);
        const element = await this.parseElementFile(filePath, file);
        if (element) {
          elements.push(element);
        }
      }

      this.elementsCache = elements;
      return elements;
    } catch (error) {
      this.logger.error(`Error loading ISML elements: ${error}`);
      throw new Error(`Failed to load ISML documentation: ${error}`);
    }
  }

  /**
   * Parse a single ISML element documentation file
   */
  private async parseElementFile(filePath: string, filename: string): Promise<ISMLElement | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      // Extract element name from filename (e.g., isif.md -> isif)
      const elementName = filename.replace('.md', '');

      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : elementName;

      // Extract description from overview section
      const description = this.extractDescription(content);

      // Extract sections
      const sections = this.extractSections(content);

      // Extract attributes
      const attributes = this.extractAttributes(content);

      // Determine category
      const category = (CATEGORY_MAPPINGS[elementName.toLowerCase()] ||
        'special') as ISMLElement['category'];

      return {
        name: elementName,
        title,
        description,
        sections,
        content,
        category,
        attributes: attributes.all,
        requiredAttributes: attributes.required,
        optionalAttributes: attributes.optional,
        filename,
        lastModified: stats.mtime,
      };
    } catch (error) {
      this.logger.error(`Error parsing ISML file ${filename}: ${error}`);
      return null;
    }
  }

  /**
   * Extract description from overview section (delegates to shared utility)
   */
  private extractDescription(content: string): string {
    return extractDescriptionFromContent(content);
  }

  /**
   * Extract section headings from content (delegates to shared utility)
   */
  private extractSections(content: string): string[] {
    return extractMarkdownSections(content, 2);
  }

  /**
   * Extract attributes from content
   */
  private extractAttributes(content: string): {
    all: string[];
    required: string[];
    optional: string[];
  } {
    const all: string[] = [];
    const required: string[] = [];
    const optional: string[] = [];

    // Look for attribute sections
    const attrRegex = /###\s+(.+?)\n/g;
    let match;

    while ((match = attrRegex.exec(content)) !== null) {
      const attrName = match[1].trim();

      // Skip common headings that aren't attributes
      if (
        attrName.toLowerCase().includes('overview') ||
        attrName.toLowerCase().includes('syntax') ||
        attrName.toLowerCase().includes('example') ||
        attrName.toLowerCase().includes('use case')
      ) {
        continue;
      }

      all.push(attrName);

      // Check if attribute is marked as required
      const sectionStart = match.index;
      const sectionContent = content.slice(sectionStart, sectionStart + 500);

      if (sectionContent.toLowerCase().includes('required: yes')) {
        required.push(attrName);
      } else if (sectionContent.toLowerCase().includes('optional: yes')) {
        optional.push(attrName);
      }
    }

    return { all, required, optional };
  }

  /**
   * Calculate relevance score for search (delegates to shared utility)
   */
  private calculateRelevance(element: ISMLElement, query: string): number {
    return calculateSearchRelevance(query, {
      name: element.name,
      title: element.title,
      description: element.description,
      sections: element.sections,
      content: element.content,
      attributes: element.attributes,
    });
  }

  /**
   * Find sections that match the search query
   */
  private findMatchedSections(element: ISMLElement, query: string): string[] {
    const matched: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const section of element.sections) {
      if (section.toLowerCase().includes(lowerQuery)) {
        matched.push(section);
      }
    }

    return matched;
  }

  /**
   * Generate a preview snippet for search results (delegates to shared utility)
   */
  private generatePreview(element: ISMLElement, query: string): string {
    // If no match in content, return description
    if (!element.content.toLowerCase().includes(query.toLowerCase())) {
      return element.description.slice(0, 200);
    }
    return generateSearchPreview(element.content, query, 100);
  }

  /**
   * Normalize element name (remove 'is' prefix variations)
   */
  private normalizeElementName(name: string): string {
    const lower = name.toLowerCase();
    // Ensure it starts with 'is' for ISML elements
    if (!lower.startsWith('is')) {
      return `is${lower}`;
    }
    return lower;
  }

  /**
   * Convert full element to summary
   */
  private toSummary(element: ISMLElement): ISMLElementSummary {
    return {
      name: element.name,
      title: element.title,
      description: element.description,
      category: element.category,
      filename: element.filename,
    };
  }

  /**
   * Apply filtering options to element data
   */
  private applyElementOptions(
    element: ISMLElement,
    options?: {
      includeContent?: boolean;
      includeSections?: boolean;
      includeAttributes?: boolean;
    },
  ): ISMLElement {
    const filtered = { ...element };

    if (options?.includeContent === false) {
      filtered.content = '';
    }

    if (options?.includeSections === false) {
      filtered.sections = [];
    }

    if (options?.includeAttributes === false) {
      filtered.attributes = [];
      filtered.requiredAttributes = [];
      filtered.optionalAttributes = [];
    }

    return filtered;
  }
}
