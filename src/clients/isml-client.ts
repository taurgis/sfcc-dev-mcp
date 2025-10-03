/**
 * SFCC ISML Documentation Client
 *
 * Provides access to ISML (Internet Store Markup Language) element documentation including
 * control flow elements, output formatting, includes, scripting, caching, and special elements.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import { InMemoryCache } from '../utils/cache.js';
import { Logger } from '../utils/logger.js';

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
  private readonly cache: InMemoryCache<string>;
  private readonly docsDir: string;
  private elementsCache: ISMLElement[] | null = null;

  constructor() {
    this.logger = new Logger('ISMLClient');
    this.cache = new InMemoryCache<string>({
      maxSize: 200,
      ttlMs: 3600000, // 1 hour
      cleanupIntervalMs: 10 * 60 * 1000, // 10 minutes
    });
    this.docsDir = path.join(PathResolver.getDocsPath(), 'isml');
  }

  /**
   * Get list of all available ISML elements with summaries
   */
  async getAvailableElements(): Promise<ISMLElementSummary[]> {
    this.logger.debug('Getting available ISML elements');

    const cacheKey = 'isml:elements:list';
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached element list');
      return JSON.parse(cached);
    }

    const elements = await this.loadAllElements();
    const summaries = elements.map((el) => this.toSummary(el));

    this.cache.set(cacheKey, JSON.stringify(summaries));
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
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached element');
      return JSON.parse(cached);
    }

    const elements = await this.loadAllElements();
    const element = elements.find((el) => el.name.toLowerCase() === normalizedName.toLowerCase());

    if (!element) {
      this.logger.warn(`ISML element not found: ${normalizedName}`);
      return null;
    }

    // Apply options to filter returned data
    const filteredElement = this.applyElementOptions(element, options);

    this.cache.set(cacheKey, JSON.stringify(filteredElement));
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
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached categories');
      return JSON.parse(cached);
    }

    const elements = await this.loadAllElements();
    const categoryCounts = new Map<string, number>();

    // Count elements per category
    for (const element of elements) {
      const count = categoryCounts.get(element.category) ?? 0;
      categoryCounts.set(element.category, count + 1);
    }

    // Build category info
    const categories: ISMLCategory[] = [];
    for (const [categoryKey, count] of categoryCounts.entries()) {
      const categoryInfo = CATEGORY_DESCRIPTIONS[categoryKey];
      if (categoryInfo) {
        categories.push({
          name: categoryKey,
          displayName: categoryInfo.displayName,
          description: categoryInfo.description,
          elementCount: count,
        });
      }
    }

    // Sort by display name
    categories.sort((a, b) => a.displayName.localeCompare(b.displayName));

    this.cache.set(cacheKey, JSON.stringify(categories));
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
   * Extract description from overview section
   */
  private extractDescription(content: string): string {
    // Look for Overview section
    const overviewMatch = content.match(/##\s+Overview\s+(.+?)(?=\n##|\n\*\*|$)/s);
    if (overviewMatch) {
      // Take first paragraph
      const firstPara = overviewMatch[1].trim().split('\n\n')[0];
      return firstPara.replace(/\n/g, ' ').trim();
    }

    // Fallback to first paragraph after title
    const firstParaMatch = content.match(/^#.+?\n\n(.+?)(?=\n\n|$)/s);
    if (firstParaMatch) {
      return firstParaMatch[1].replace(/\n/g, ' ').trim();
    }

    return '';
  }

  /**
   * Extract section headings from content
   */
  private extractSections(content: string): string[] {
    const sections: string[] = [];
    const headingRegex = /^##\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      sections.push(match[1].trim());
    }

    return sections;
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
   * Calculate relevance score for search
   */
  private calculateRelevance(element: ISMLElement, query: string): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Element name match (highest priority)
    if (element.name.toLowerCase().includes(lowerQuery)) {
      score += 100;
      if (element.name.toLowerCase() === lowerQuery) {
        score += 50; // Exact match bonus
      }
    }

    // Title match
    if (element.title.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    // Description match
    if (element.description.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }

    // Section name match
    for (const section of element.sections) {
      if (section.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }
    }

    // Content match (lower priority)
    const contentMatches = (element.content.toLowerCase().match(new RegExp(lowerQuery, 'g')) ?? []).length;
    score += Math.min(contentMatches * 2, 20); // Cap content matches contribution

    // Attribute match
    if (element.attributes) {
      for (const attr of element.attributes) {
        if (attr.toLowerCase().includes(lowerQuery)) {
          score += 15;
        }
      }
    }

    return score;
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
   * Generate a preview snippet for search results
   */
  private generatePreview(element: ISMLElement, query: string): string {
    const lowerQuery = query.toLowerCase();
    const lowerContent = element.content.toLowerCase();

    // Find first occurrence of query in content
    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) {
      // Return description if no match in content
      return element.description.slice(0, 200);
    }

    // Extract context around the match
    const start = Math.max(0, index - 100);
    const end = Math.min(element.content.length, index + 100);
    let preview = element.content.slice(start, end);

    // Clean up preview
    preview = preview.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Add ellipsis if truncated
    if (start > 0) {
      preview = `...${preview}`;
    }
    if (end < element.content.length) {
      preview = `${preview}...`;
    }

    return preview;
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
