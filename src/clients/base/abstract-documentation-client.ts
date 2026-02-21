/**
 * Abstract Documentation Client
 *
 * Base class for documentation clients (SFRA, ISML) that share common patterns:
 * - Category-based organization
 * - Caching with TTL
 * - Search with relevance scoring
 * - File-based document loading
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { CacheManager } from '../../utils/cache.js';
import { Logger } from '../../utils/logger.js';
import {
  extractDescriptionFromContent,
  extractSections,
  calculateSearchRelevance,
  generateSearchPreview,
} from '../../utils/markdown-utils.js';
import { buildCategoryList, CategoryInfo } from '../../utils/category-utils.js';

/**
 * Base document interface - extend for specific document types
 */
export interface BaseDocument {
  name: string;
  title: string;
  description: string;
  sections: string[];
  content: string;
  category: string;
  filename: string;
  lastModified?: Date;
}

/**
 * Summary format for document lists
 */
export interface DocumentSummary {
  name: string;
  title: string;
  description: string;
  category: string;
  filename: string;
}

/**
 * Search result with relevance scoring
 */
export interface SearchResult<T extends DocumentSummary> {
  document: T;
  relevance: number;
  matchedSections: string[];
  preview: string;
}

/**
 * Category information with count
 */
export interface CategoryWithCount {
  name: string;
  displayName: string;
  description: string;
  count: number;
}

/**
 * Configuration for the documentation client
 */
export interface DocumentationClientConfig<TCategory extends string> {
  /** Name for logging */
  clientName: string;
  /** Path to documentation files */
  docsPath: string;
  /** Category mappings (document name -> category) */
  categoryMappings: Record<string, TCategory>;
  /** Category descriptions */
  categoryDescriptions: Record<TCategory, CategoryInfo>;
  /** Default category for unmapped documents */
  defaultCategory: TCategory;
  /** Cache key prefix */
  cachePrefix: string;
}

/**
 * Abstract base class for documentation clients
 * Provides common functionality for loading, caching, and searching documents
 */
export abstract class AbstractDocumentationClient<
  TDocument extends BaseDocument,
  TSummary extends DocumentSummary,
  TCategory extends string,
> {
  protected readonly logger: Logger;
  protected readonly cache: CacheManager;
  protected readonly docsPath: string;
  protected readonly config: DocumentationClientConfig<TCategory>;
  protected documentsCache: TDocument[] | null = null;
  protected lastScanTime: number = 0;
  protected static readonly SCAN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: DocumentationClientConfig<TCategory>) {
    this.config = config;
    this.logger = Logger.getChildLogger(config.clientName);
    this.cache = new CacheManager();
    this.docsPath = config.docsPath;
  }

  /**
   * Get list of all available documents with summaries
   */
  async getAvailableDocuments(): Promise<TSummary[]> {
    this.logger.debug('Getting available documents');

    const cacheKey = `${this.config.cachePrefix}:documents:list`;
    const now = Date.now();

    // Check cache validity
    if (this.documentsCache && (now - this.lastScanTime) < AbstractDocumentationClient.SCAN_CACHE_TTL) {
      const cached = this.cache.getSearchResults<TSummary[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const documents = await this.loadAllDocuments();
    const summaries = documents.map(doc => this.toSummary(doc));

    // Sort by category and name
    summaries.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    this.cache.setSearchResults(cacheKey, summaries);
    this.lastScanTime = now;

    return summaries;
  }

  /**
   * Get a specific document by name
   */
  async getDocument(documentName: string): Promise<TDocument | null> {
    const normalizedName = this.normalizeDocumentName(documentName);
    this.logger.debug(`Getting document: ${normalizedName}`);

    const cacheKey = `${this.config.cachePrefix}:document:${normalizedName}`;
    const cached = this.cache.getSearchResults<TDocument>(cacheKey);
    if (cached) {
      return cached;
    }

    const documents = await this.loadAllDocuments();
    const document = documents.find(doc =>
      doc.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (!document) {
      this.logger.warn(`Document not found: ${normalizedName}`);
      return null;
    }

    this.cache.setSearchResults(cacheKey, document);
    return document;
  }

  /**
   * Search documents with relevance scoring
   */
  async searchDocuments(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<SearchResult<TSummary>[]> {
    this.logger.debug(`Searching documents for: ${query}`);

    const documents = await this.loadAllDocuments();
    const searchQuery = query.toLowerCase();
    const results: SearchResult<TSummary>[] = [];

    for (const document of documents) {
      // Skip if category filter doesn't match
      if (options?.category && document.category !== options.category) {
        continue;
      }

      const relevance = this.calculateDocumentRelevance(document, searchQuery);
      if (relevance > 0) {
        const matchedSections = this.findMatchedSections(document, searchQuery);
        const preview = this.generateDocumentPreview(document, searchQuery);

        results.push({
          document: this.toSummary(document),
          relevance,
          matchedSections,
          preview,
        });
      }
    }

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);

    // Apply limit if specified
    return options?.limit ? results.slice(0, options.limit) : results;
  }

  /**
   * Get documents filtered by category
   */
  async getDocumentsByCategory(category: string): Promise<TSummary[]> {
    this.logger.debug(`Getting documents by category: ${category}`);

    const documents = await this.loadAllDocuments();
    return documents
      .filter(doc => doc.category === category)
      .map(doc => this.toSummary(doc));
  }

  /**
   * Get available categories with counts
   */
  async getAvailableCategories(): Promise<CategoryWithCount[]> {
    this.logger.debug('Getting available categories');

    const cacheKey = `${this.config.cachePrefix}:categories`;
    const cached = this.cache.getSearchResults<CategoryWithCount[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const documents = await this.loadAllDocuments();
    // Cast documents to the expected type - we know category will be TCategory since
    // documents are created with that constraint via createDocument.
    const categoryList = buildCategoryList(
      documents as unknown as Array<{ category: TCategory }>,
      this.config.categoryDescriptions,
    );

    const categories: CategoryWithCount[] = categoryList.map(cat => ({
      name: cat.name,
      displayName: cat.displayName,
      description: cat.description,
      count: cat.count ?? 0,
    }));

    this.cache.setSearchResults(cacheKey, categories);
    return categories;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clearAll();
    this.documentsCache = null;
    this.lastScanTime = 0;
  }

  // ==================== Protected methods for subclass customization ====================

  // Batch size for parallel file reads (avoid file descriptor exhaustion)
  protected static readonly PARALLEL_BATCH_SIZE = 30;

  /**
   * Load all documents from the docs directory
   * Uses parallel batch processing for improved performance
   */
  protected async loadAllDocuments(): Promise<TDocument[]> {
    if (this.documentsCache) {
      return this.documentsCache;
    }

    this.logger.debug(`Scanning documentation directory: ${this.docsPath}`);

    try {
      const files = await fs.readdir(this.docsPath);
      const mdFiles = files.filter(f =>
        f.endsWith('.md') &&
        !f.startsWith('.') &&
        f !== 'README.md',
      );

      this.logger.debug(`Found ${mdFiles.length} documentation files`);

      // Process files in parallel batches for faster loading
      const documents: TDocument[] = [];
      for (let i = 0; i < mdFiles.length; i += AbstractDocumentationClient.PARALLEL_BATCH_SIZE) {
        const batch = mdFiles.slice(i, i + AbstractDocumentationClient.PARALLEL_BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async file => {
            const filePath = path.join(this.docsPath, file);
            return this.parseDocumentFile(filePath, file);
          }),
        );
        // Filter out null results and add to documents
        for (const result of results) {
          if (result) {
            documents.push(result);
          }
        }
      }

      this.documentsCache = documents;
      return documents;
    } catch (error) {
      this.logger.error(`Error loading documents: ${error}`);
      throw new Error(`Failed to load documentation: ${error}`);
    }
  }

  /**
   * Parse a single document file - override for custom parsing
   */
  protected async parseDocumentFile(filePath: string, filename: string): Promise<TDocument | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      const documentName = filename.replace('.md', '');
      const normalizedName = this.normalizeDocumentName(documentName);

      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : documentName;

      // Get category
      const category = this.config.categoryMappings[normalizedName] ?? this.config.defaultCategory;

      // Use base document creation
      return this.createDocument({
        name: documentName,
        title,
        description: extractDescriptionFromContent(content),
        sections: extractSections(content, 2),
        content,
        category,
        filename,
        lastModified: stats.mtime,
      });
    } catch (error) {
      this.logger.error(`Error parsing document file ${filename}: ${error}`);
      return null;
    }
  }

  /**
   * Create a document instance - override for custom document types
   */
  protected abstract createDocument(baseData: BaseDocument): TDocument;

  /**
   * Convert document to summary - override for custom summary types
   */
  protected abstract toSummary(document: TDocument): TSummary;

  /**
   * Normalize document name for consistent lookup
   */
  protected normalizeDocumentName(name: string): string {
    return name.toLowerCase();
  }

  /**
   * Calculate relevance score for a document
   */
  protected calculateDocumentRelevance(document: TDocument, query: string): number {
    return calculateSearchRelevance(query, {
      name: document.name,
      title: document.title,
      description: document.description,
      sections: document.sections,
      content: document.content,
    });
  }

  /**
   * Find sections that match the search query
   */
  protected findMatchedSections(document: TDocument, query: string): string[] {
    const matched: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const section of document.sections) {
      if (section.toLowerCase().includes(lowerQuery)) {
        matched.push(section);
      }
    }

    return matched;
  }

  /**
   * Generate a preview snippet for search results
   */
  protected generateDocumentPreview(document: TDocument, query: string): string {
    if (!document.content.toLowerCase().includes(query.toLowerCase())) {
      return document.description.slice(0, 200);
    }
    return generateSearchPreview(document.content, query, 100);
  }
}
