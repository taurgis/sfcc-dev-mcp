/**
 * SFCC SFRA Documentation Client
 *
 * Provides access to SFRA (Storefront Reference Architecture) documentation including
 * core classes like Server, Request, Response, QueryString, render module, and comprehensive
 * model documentation for account, cart, products, pricing, billing, shipping, and more.
 */

import * as fs from 'fs/promises';
import { PathResolver } from '../utils/path-resolver.js';
import {
  AbstractDocumentationClient,
  BaseDocument,
  DocumentSummary,
  DocumentationClientConfig,
} from './base/abstract-documentation-client.js';
import {
  extractDescriptionFromLines,
  extractSections,
  extractProperties,
  extractMethods,
  formatDocumentName,
} from '../utils/markdown-utils.js';

// ==================== Types ====================

export type SFRACategory = 'core' | 'product' | 'order' | 'customer' | 'pricing' | 'store' | 'other';
export type SFRADocumentType = 'class' | 'module' | 'model';

export interface SFRADocument extends BaseDocument {
  type: SFRADocumentType;
  category: SFRACategory;
  properties?: string[];
  methods?: string[];
}

export interface SFRADocumentSummary extends DocumentSummary {
  type: string;
  category: string;
}

// ==================== Configuration ====================

const SFRA_CATEGORY_MAPPINGS: Record<string, SFRACategory> = {
  // Core SFRA classes and modules
  'server': 'core',
  'request': 'core',
  'response': 'core',
  'querystring': 'core',
  'render': 'core',

  // Product-related models
  'product-full': 'product',
  'product-bundle': 'product',
  'product-tile': 'product',
  'product-search': 'product',
  'product-line-items': 'product',

  // Pricing models
  'price-default': 'pricing',
  'price-range': 'pricing',
  'price-tiered': 'pricing',

  // Order and cart models
  'cart': 'order',
  'order': 'order',
  'billing': 'order',
  'shipping': 'order',
  'payment': 'order',
  'totals': 'order',

  // Customer models
  'account': 'customer',
  'address': 'customer',

  // Store models
  'store': 'store',
  'stores': 'store',

  // Other models
  'categories': 'other',
  'content': 'other',
  'locale': 'other',
};

const SFRA_CATEGORY_DESCRIPTIONS: Record<SFRACategory, { displayName: string; description: string }> = {
  'core': {
    displayName: 'Core',
    description: 'Core SFRA classes and modules (Server, Request, Response, QueryString, render)',
  },
  'product': {
    displayName: 'Product',
    description: 'Product-related models and functionality',
  },
  'order': {
    displayName: 'Order',
    description: 'Order, cart, billing, shipping, and payment models',
  },
  'customer': {
    displayName: 'Customer',
    description: 'Customer account and address models',
  },
  'pricing': {
    displayName: 'Pricing',
    description: 'Pricing and discount models',
  },
  'store': {
    displayName: 'Store',
    description: 'Store and location models',
  },
  'other': {
    displayName: 'Other',
    description: 'Other models and utilities',
  },
};

// ==================== Client Implementation ====================

/**
 * Client for accessing SFRA documentation
 * Extends AbstractDocumentationClient for shared functionality
 */
export class SFRAClient extends AbstractDocumentationClient<SFRADocument, SFRADocumentSummary, SFRACategory> {
  constructor() {
    const config: DocumentationClientConfig<SFRACategory> = {
      clientName: 'SFRAClient',
      docsPath: PathResolver.getSFRADocsPath(),
      categoryMappings: SFRA_CATEGORY_MAPPINGS,
      categoryDescriptions: SFRA_CATEGORY_DESCRIPTIONS,
      defaultCategory: 'other',
      cachePrefix: 'sfra',
    };
    super(config);
  }

  // ==================== Public API (preserves existing interface) ====================

  /**
   * Get a specific SFRA document with full content
   */
  async getSFRADocument(documentName: string): Promise<SFRADocument | null> {
    return this.getDocument(documentName);
  }

  /**
   * Enhanced search across all SFRA documentation with better categorization
   */
  async searchSFRADocumentation(query: string): Promise<Array<{
    document: string;
    title: string;
    category: string;
    type: string;
    relevanceScore: number;
    matches: Array<{section: string; content: string; lineNumber: number}>;
  }>> {
    const cacheKey = `sfra:search:${query.toLowerCase()}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) { return cached; }

    const documents = await this.getAvailableDocuments();
    const results = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1);

    for (const doc of documents) {
      const documentContent = await this.getDocument(doc.name);
      if (!documentContent) { continue; }

      const matches = [];
      const lines = documentContent.content.split('\n');
      let currentSection = '';
      let relevanceScore = 0;

      // Calculate relevance score based on title and description matches
      if (doc.title.toLowerCase().includes(queryLower)) {
        relevanceScore += 10;
      }
      if (doc.description.toLowerCase().includes(queryLower)) {
        relevanceScore += 5;
      }

      // Search through content
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineLower = line.toLowerCase();

        if (line.startsWith('##')) {
          currentSection = line.replace(/^##\s*/, '').trim();
        }

        let matchFound = false;
        let lineRelevance = 0;

        if (lineLower.includes(queryLower)) {
          matchFound = true;
          lineRelevance += 3;
        } else {
          const wordMatches = queryWords.filter(word => lineLower.includes(word));
          if (wordMatches.length > 0) {
            matchFound = true;
            lineRelevance += wordMatches.length;
          }
        }

        if (matchFound) {
          const contextStart = Math.max(0, i - 2);
          const contextEnd = Math.min(lines.length, i + 3);
          const context = lines.slice(contextStart, contextEnd)
            .map((contextLine, idx) => {
              const actualLineNumber = contextStart + idx;
              return actualLineNumber === i ? `>>> ${contextLine}` : contextLine;
            })
            .join('\n');

          matches.push({
            section: currentSection || 'Introduction',
            content: context,
            lineNumber: i + 1,
          });

          relevanceScore += lineRelevance;
        }
      }

      if (matches.length > 0) {
        results.push({
          document: doc.name,
          title: doc.title,
          category: doc.category,
          type: doc.type,
          relevanceScore,
          matches,
        });
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    this.cache.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: string): Promise<SFRADocumentSummary[]> {
    return super.getDocumentsByCategory(category);
  }

  // ==================== Protected overrides ====================

  protected createDocument(baseData: BaseDocument): SFRADocument {
    return {
      ...baseData,
      type: 'model',
      category: baseData.category as SFRACategory,
      properties: [],
      methods: [],
    };
  }

  protected toSummary(document: SFRADocument): SFRADocumentSummary {
    return {
      name: document.name,
      title: document.title,
      description: document.description,
      type: document.type,
      category: document.category,
      filename: document.filename,
    };
  }

  protected async parseDocumentFile(filePath: string, filename: string): Promise<SFRADocument | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      const documentName = filename.replace('.md', '');
      const normalizedName = this.normalizeDocumentName(documentName);
      const lines = content.split('\n');

      // Extract title
      const titleLine = lines.find(line => line.startsWith('#'));
      const title = titleLine?.replace(/^#+\s*/, '').trim() ?? formatDocumentName(normalizedName);

      // Determine type based on title and content
      const type = this.determineDocumentType(title, content);

      // Get category
      const category = SFRA_CATEGORY_MAPPINGS[normalizedName] ?? 'other';

      // Extract description
      const description = extractDescriptionFromLines(lines, title);

      return {
        name: documentName,
        title,
        description,
        sections: extractSections(content),
        content,
        type,
        category,
        filename: `${normalizedName}.md`,
        lastModified: stats.mtime,
        ...(type === 'class' || type === 'model' ? {
          properties: extractProperties(lines),
          methods: extractMethods(lines),
        } : {}),
      };
    } catch (error) {
      this.logger.error(`Error loading SFRA document ${filename}:`, error);
      return null;
    }
  }

  // ==================== Private helpers ====================

  /**
   * Determine document type from title and content
   */
  private determineDocumentType(title: string, content: string): SFRADocumentType {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();

    if (titleLower.includes('class ')) {
      return 'class';
    }

    if (titleLower.includes('module ')) {
      return 'module';
    }

    if (titleLower.includes('model') || contentLower.includes('model') ||
        contentLower.includes('constructor') || contentLower.includes('properties')) {
      return 'model';
    }

    return 'model';
  }
}
