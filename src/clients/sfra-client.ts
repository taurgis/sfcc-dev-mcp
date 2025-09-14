/**
 * SFCC SFRA Documentation Client
 *
 * Provides access to SFRA (Storefront Reference Architecture) documentation including
 * core classes like Server, Request, Response, QueryString, render module, and comprehensive
 * model documentation for account, cart, products, pricing, billing, shipping, and more.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';
import { Logger } from '../utils/logger.js';

export interface SFRADocument {
  title: string;
  description: string;
  sections: string[];
  content: string;
  type: 'class' | 'module' | 'model';
  category: 'core' | 'product' | 'order' | 'customer' | 'pricing' | 'store' | 'other';
  properties?: string[];
  methods?: string[];
  filename: string;
  lastModified?: Date;
}

export interface SFRADocumentSummary {
  name: string;
  title: string;
  description: string;
  type: string;
  category: string;
  filename: string;
}

// Document categorization rules
const CATEGORY_MAPPINGS: Record<string, string> = {
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

/**
 * Enhanced client for accessing SFRA documentation with dynamic discovery
 */
export class SFRAClient {
  private cache: CacheManager;
  private docsPath: string;
  private documentsCache: Map<string, SFRADocument> = new Map();
  private lastScanTime: number = 0;
  private static readonly SCAN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private logger: Logger;

  constructor() {
    this.cache = new CacheManager();
    this.docsPath = PathResolver.getSFRADocsPath();
    this.logger = Logger.getChildLogger('SFRAClient');
  }

  /**
   * Dynamically discover all available SFRA documentation files
   */
  async getAvailableDocuments(): Promise<SFRADocumentSummary[]> {
    const cacheKey = 'sfra:available-documents-v2';
    const cached = this.cache.getSearchResults(cacheKey);

    // Check if we need to rescan the filesystem
    const now = Date.now();
    if (cached && (now - this.lastScanTime) < SFRAClient.SCAN_CACHE_TTL) {
      return cached;
    }

    try {
      const files = await fs.readdir(this.docsPath);
      const mdFiles = files.filter(file =>
        file.endsWith('.md') &&
        file !== 'README.md' &&
        !file.startsWith('.'),
      );

      const documents: SFRADocumentSummary[] = [];

      for (const filename of mdFiles) {
        try {
          const documentName = path.basename(filename, '.md');
          const document = await this.getSFRADocumentMetadata(documentName);

          if (document) {
            documents.push({
              name: documentName,
              title: document.title,
              description: document.description,
              type: document.type,
              category: document.category,
              filename: document.filename,
            });
          }
        } catch (error) {
          this.logger.error(`Error processing SFRA document ${filename}:`, error);
          // Continue processing other files
        }
      }

      // Sort documents by category and then by name
      documents.sort((a, b) => {
        if (a.category !== b.category) {
          // Prioritize core documents
          if (a.category === 'core') {return -1;}
          if (b.category === 'core') {return 1;}
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      this.cache.setSearchResults(cacheKey, documents);
      this.lastScanTime = now;

      return documents;
    } catch (error) {
      this.logger.error('Error scanning SFRA documents directory:', error);
      return [];
    }
  }

  /**
   * Get lightweight metadata for a document without loading full content
   */
  private async getSFRADocumentMetadata(documentName: string): Promise<SFRADocument | null> {
    // Normalize document name for consistent caching and lookup
    const normalizedDocumentName = documentName.toLowerCase();

    // Check if we already have this document cached
    if (this.documentsCache.has(normalizedDocumentName)) {
      return this.documentsCache.get(normalizedDocumentName)!;
    }

    try {
      const filePath = await this.validateAndConstructPath(documentName);
      const stats = await fs.stat(filePath);

      // Check if we have a cached version that's still valid
      const cacheKey = `sfra:metadata:${normalizedDocumentName}`;
      const cached = this.cache.getFileContent(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (cachedData.lastModified && new Date(cachedData.lastModified) >= stats.mtime) {
          return cachedData;
        }
      }

      // Read only the first part of the file to extract metadata
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      // Extract title
      const titleLine = lines.find(line => line.startsWith('#'));
      const title = titleLine?.replace(/^#+\s*/, '').trim() ?? this.formatDocumentName(normalizedDocumentName);

      // Determine type based on title and content
      const type = this.determineDocumentType(title, content);

      // Determine category - use normalized name for consistent mapping
      const category = (CATEGORY_MAPPINGS[normalizedDocumentName] || 'other') as SFRADocument['category'];

      // Extract description (first substantial paragraph after title)
      const description = this.extractDescription(lines, title);

      // Extract sections (## headers)
      const sections = lines
        .filter(line => line.startsWith('##'))
        .map(line => line.replace(/^##\s*/, '').trim())
        .filter(section => section.length > 0);

      const document: SFRADocument = {
        title,
        description,
        sections,
        content, // Keep full content for now, optimize later if needed
        type,
        category,
        filename: `${normalizedDocumentName}.md`,
        lastModified: stats.mtime,
        ...(type === 'class' || type === 'model' ? {
          properties: this.extractProperties(lines),
          methods: this.extractMethods(lines),
        } : {}),
      };

      // Cache the metadata using normalized name
      this.cache.setFileContent(cacheKey, JSON.stringify(document));
      this.documentsCache.set(normalizedDocumentName, document);

      return document;
    } catch (error) {
      this.logger.error(`Error loading SFRA document metadata ${normalizedDocumentName}:`, error);
      return null;
    }
  }

  /**
   * Get a specific SFRA document with full content
   */
  async getSFRADocument(documentName: string): Promise<SFRADocument | null> {
    // Normalize document name for consistent lookup
    const normalizedDocumentName = documentName.toLowerCase();

    // First try to get from metadata cache
    const metadata = await this.getSFRADocumentMetadata(documentName);
    if (!metadata) {
      return null;
    }

    // If the content is already loaded, return it
    if (metadata.content?.trim()) {
      return metadata;
    }

    // Otherwise, load the full content
    try {
      const filePath = await this.validateAndConstructPath(documentName);
      const content = await fs.readFile(filePath, 'utf-8');

      const fullDocument: SFRADocument = {
        ...metadata,
        content,
      };

      // Update cache using normalized name
      this.documentsCache.set(normalizedDocumentName, fullDocument);
      return fullDocument;
    } catch (error) {
      this.logger.error(`Error loading full SFRA document ${normalizedDocumentName}:`, error);
      return metadata; // Return metadata even if content loading failed
    }
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
    if (cached) {return cached;}

    const documents = await this.getAvailableDocuments();
    const results = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1);

    for (const doc of documents) {
      const documentContent = await this.getSFRADocument(doc.name);
      if (!documentContent) {continue;}

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

        // Check for query matches
        let matchFound = false;
        let lineRelevance = 0;

        if (lineLower.includes(queryLower)) {
          matchFound = true;
          lineRelevance += 3;
        } else {
          // Check for partial matches with query words
          const wordMatches = queryWords.filter(word => lineLower.includes(word));
          if (wordMatches.length > 0) {
            matchFound = true;
            lineRelevance += wordMatches.length;
          }
        }

        if (matchFound) {
          // Get context around the match
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

    // Sort by relevance score (highest first)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    this.cache.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: string): Promise<SFRADocumentSummary[]> {
    const allDocuments = await this.getAvailableDocuments();
    return allDocuments.filter(doc => doc.category === category);
  }

  /**
   * Get all available categories
   */
  async getAvailableCategories(): Promise<Array<{category: string; count: number; description: string}>> {
    const documents = await this.getAvailableDocuments();
    const categoryMap = new Map<string, number>();

    documents.forEach(doc => {
      categoryMap.set(doc.category, (categoryMap.get(doc.category) ?? 0) + 1);
    });

    const categoryDescriptions = {
      'core': 'Core SFRA classes and modules (Server, Request, Response, QueryString, render)',
      'product': 'Product-related models and functionality',
      'order': 'Order, cart, billing, shipping, and payment models',
      'customer': 'Customer account and address models',
      'pricing': 'Pricing and discount models',
      'store': 'Store and location models',
      'other': 'Other models and utilities',
    };

    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      description: categoryDescriptions[category as keyof typeof categoryDescriptions] || 'Other documentation',
    }));
  }

  /**
   * Enhanced path validation and construction
   */
  private async validateAndConstructPath(documentName: string): Promise<string> {
    if (!documentName || typeof documentName !== 'string') {
      throw new Error('Invalid document name: must be a non-empty string');
    }

    if (documentName.includes('\0') || documentName.includes('\x00')) {
      throw new Error('Invalid document name: contains null bytes');
    }

    if (documentName.includes('..') || documentName.includes('/') || documentName.includes('\\')) {
      throw new Error('Invalid document name: contains path traversal sequences');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(documentName)) {
      throw new Error('Invalid document name: contains invalid characters');
    }

    // Normalize document name to lowercase for case-insensitive lookup
    const normalizedDocumentName = documentName.toLowerCase();
    const filePath = path.join(this.docsPath, `${normalizedDocumentName}.md`);
    const resolvedPath = path.resolve(filePath);
    const resolvedDocsPath = path.resolve(this.docsPath);

    if (!resolvedPath.startsWith(resolvedDocsPath)) {
      throw new Error('Invalid document name: path outside allowed directory');
    }

    if (!resolvedPath.toLowerCase().endsWith('.md')) {
      throw new Error('Invalid document name: must reference a markdown file');
    }

    return resolvedPath;
  }

  /**
   * Determine document type from title and content
   */
  private determineDocumentType(title: string, content: string): 'class' | 'module' | 'model' {
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

    return 'model'; // Default for most SFRA docs
  }

  /**
   * Extract description from document lines
   */
  private extractDescription(lines: string[], title: string): string {
    const titleIndex = lines.findIndex(line => line.trim() === `# ${title}` || line.startsWith('#'));
    if (titleIndex === -1) {
      return 'No description available';
    }

    // Look for overview section first
    const overviewIndex = lines.findIndex((line, index) =>
      index > titleIndex && line.toLowerCase().includes('## overview'),
    );

    if (overviewIndex !== -1) {
      // Get content under Overview section
      let descriptionEnd = lines.findIndex((line, index) =>
        index > overviewIndex + 1 && line.startsWith('##'),
      );

      if (descriptionEnd === -1) {
        descriptionEnd = Math.min(lines.length, overviewIndex + 10);
      }

      const overviewContent = lines.slice(overviewIndex + 1, descriptionEnd)
        .filter(line => line.trim() && !line.startsWith('#'))
        .join(' ')
        .trim();

      if (overviewContent) {
        return overviewContent.substring(0, 300) + (overviewContent.length > 300 ? '...' : '');
      }
    }

    // Fallback to first paragraph after title
    let descriptionStart = titleIndex + 1;
    while (descriptionStart < lines.length && !lines[descriptionStart].trim()) {
      descriptionStart++;
    }

    const descriptionEnd = lines.findIndex((line, index) =>
      index > descriptionStart && (line.startsWith('#') || line.trim() === ''));

    const description = lines
      .slice(descriptionStart, descriptionEnd > -1 ? descriptionEnd : descriptionStart + 3)
      .filter(line => line.trim() && !line.startsWith('#'))
      .join(' ')
      .trim();

    return description || 'No description available';
  }

  /**
   * Extract properties from document content
   */
  private extractProperties(lines: string[]): string[] {
    const properties: string[] = [];
    let inPropertiesSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('## properties') ||
          line.toLowerCase().includes('## property')) {
        inPropertiesSection = true;
        continue;
      }

      if (inPropertiesSection && line.startsWith('#') && !line.includes('properties')) {
        break;
      }

      if (inPropertiesSection && line.startsWith('### ')) {
        const property = line.replace('### ', '').trim();
        if (!properties.includes(property)) {
          properties.push(property);
        }
      }
    }

    return properties;
  }

  /**
   * Extract methods from document content
   */
  private extractMethods(lines: string[]): string[] {
    const methods: string[] = [];
    let inMethodSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('## method') ||
          line.toLowerCase().includes('## function')) {
        inMethodSection = true;
        continue;
      }

      if (inMethodSection && line.startsWith('#') &&
          !line.toLowerCase().includes('method') &&
          !line.toLowerCase().includes('function')) {
        break;
      }

      if (inMethodSection && line.startsWith('### ')) {
        const method = line.replace('### ', '').trim();
        if (!methods.includes(method)) {
          methods.push(method);
        }
      }
    }

    return methods;
  }

  /**
   * Format document name for display
   */
  private formatDocumentName(documentName: string): string {
    return documentName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clearAll();
    this.documentsCache.clear();
    this.lastScanTime = 0;
  }
}
