/**
 * SFCC ISML Documentation Client
 *
 * Provides access to ISML (Internet Store Markup Language) element documentation including
 * control flow elements, output formatting, includes, scripting, caching, and special elements.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import {
  AbstractDocumentationClient,
  BaseDocument,
  DocumentSummary,
  SearchResult,
  CategoryWithCount,
  DocumentationClientConfig,
} from './base/abstract-documentation-client.js';
import {
  extractDescriptionFromContent,
  extractSections,
} from '../utils/markdown-utils.js';

// ==================== Types ====================

export type ISMLCategory =
  | 'control-flow'
  | 'output'
  | 'includes'
  | 'scripting'
  | 'cache'
  | 'decorators'
  | 'special'
  | 'payment'
  | 'analytics';

export interface ISMLElement extends BaseDocument {
  category: ISMLCategory;
  attributes?: string[];
  requiredAttributes?: string[];
  optionalAttributes?: string[];
}

export interface ISMLElementSummary extends DocumentSummary {
  category: string;
}

export interface ISMLSearchResult extends SearchResult<ISMLElementSummary> {}

export interface ISMLCategoryInfo extends CategoryWithCount {}

// ==================== Configuration ====================

const ISML_CATEGORY_MAPPINGS: Record<string, ISMLCategory> = {
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

const ISML_CATEGORY_DESCRIPTIONS: Record<ISMLCategory, { displayName: string; description: string }> = {
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

// ==================== Client Implementation ====================

/**
 * Client for accessing ISML element documentation
 * Extends AbstractDocumentationClient for shared functionality
 */
export class ISMLClient extends AbstractDocumentationClient<ISMLElement, ISMLElementSummary, ISMLCategory> {
  constructor() {
    const config: DocumentationClientConfig<ISMLCategory> = {
      clientName: 'ISMLClient',
      docsPath: path.join(PathResolver.getDocsPath(), 'isml'),
      categoryMappings: ISML_CATEGORY_MAPPINGS,
      categoryDescriptions: ISML_CATEGORY_DESCRIPTIONS,
      defaultCategory: 'special',
      cachePrefix: 'isml',
    };
    super(config);
  }

  // ==================== Public API (preserves existing interface) ====================

  /**
   * Get list of all available ISML elements with summaries
   */
  async getAvailableElements(): Promise<ISMLElementSummary[]> {
    return this.getAvailableDocuments();
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
    const element = await this.getDocument(normalizedName);

    if (!element) {
      return null;
    }

    // Apply options to filter returned data
    return this.applyElementOptions(element, options);
  }

  /**
   * Search ISML documentation with relevance scoring
   */
  async searchISMLElements(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<ISMLSearchResult[]> {
    return this.searchDocuments(query, options);
  }

  /**
   * Get ISML elements filtered by category
   */
  async getElementsByCategory(category: string): Promise<ISMLElementSummary[]> {
    return this.getDocumentsByCategory(category);
  }

  /**
   * Get available ISML element categories with counts
   */
  async getAvailableCategories(): Promise<ISMLCategoryInfo[]> {
    return super.getAvailableCategories();
  }

  // ==================== Protected overrides ====================

  protected createDocument(baseData: BaseDocument): ISMLElement {
    return {
      ...baseData,
      category: baseData.category as ISMLCategory,
      attributes: [],
      requiredAttributes: [],
      optionalAttributes: [],
    };
  }

  protected toSummary(element: ISMLElement): ISMLElementSummary {
    return {
      name: element.name,
      title: element.title,
      description: element.description,
      category: element.category,
      filename: element.filename,
    };
  }

  protected async parseDocumentFile(filePath: string, filename: string): Promise<ISMLElement | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      const elementName = filename.replace('.md', '');
      const normalizedName = this.normalizeDocumentName(elementName);

      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : elementName;

      // Extract attributes
      const attributes = this.extractAttributes(content);

      // Get category
      const category = ISML_CATEGORY_MAPPINGS[normalizedName] ?? 'special';

      return {
        name: elementName,
        title,
        description: extractDescriptionFromContent(content),
        sections: extractSections(content),
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

  // ==================== Private helpers ====================

  /**
   * Normalize element name (ensure 'is' prefix)
   */
  private normalizeElementName(name: string): string {
    const lower = name.toLowerCase();
    return lower.startsWith('is') ? lower : `is${lower}`;
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

    const attrRegex = /###\s+(.+?)\n/g;
    let match;

    while ((match = attrRegex.exec(content)) !== null) {
      const attrName = match[1].trim();

      // Skip common headings that aren't attributes
      const skipPatterns = ['overview', 'syntax', 'example', 'use case'];
      if (skipPatterns.some(p => attrName.toLowerCase().includes(p))) {
        continue;
      }

      all.push(attrName);

      // Check if attribute is required/optional
      const sectionContent = content.slice(match.index, match.index + 500);
      if (sectionContent.toLowerCase().includes('required: yes')) {
        required.push(attrName);
      } else if (sectionContent.toLowerCase().includes('optional: yes')) {
        optional.push(attrName);
      }
    }

    return { all, required, optional };
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
