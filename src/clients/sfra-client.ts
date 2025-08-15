/**
 * SFCC SFRA Documentation Client
 *
 * Provides access to SFRA (Storefront Reference Architecture) documentation including
 * core classes like Server, Request, Response, QueryString, and the render module.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';

export interface SFRADocument {
  title: string;
  description: string;
  sections: string[];
  content: string;
  type: 'class' | 'module';
  properties?: string[];
  methods?: string[];
}

/**
 * Client for accessing SFRA documentation
 */
export class SFRAClient {
  private cache: CacheManager;
  private docsPath: string;

  constructor() {
    this.cache = new CacheManager();
    this.docsPath = PathResolver.getSFRADocsPath();
  }

  /**
   * Get all available SFRA documentation
   */
  async getAvailableDocuments(): Promise<Array<{name: string; title: string; description: string; type: string}>> {
    const cacheKey = 'sfra:available-documents';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    const documents = [
      {
        name: 'server',
        title: 'Class Server',
        description: 'The SFRA Server class is the core routing solution for Salesforce Commerce Cloud\'s Storefront Reference Architecture (SFRA). This class provides a comprehensive middleware-based routing system that handles HTTP requests, manages route registration, and coordinates the request-response lifecycle.',
        type: 'class',
      },
      {
        name: 'request',
        title: 'Class Request',
        description: 'The SFRA Request object is a local wrapper around the global request object that provides enhanced functionality for SFRA applications. This class translates the global request, customer, and session objects into a more convenient local interface.',
        type: 'class',
      },
      {
        name: 'response',
        title: 'Class Response',
        description: 'The SFRA Response object is a local wrapper around the global response object that provides enhanced functionality for SFRA applications. This class serves as a centralized interface for managing response data, rendering templates, handling redirects, and controlling HTTP response behavior.',
        type: 'class',
      },
      {
        name: 'querystring',
        title: 'Class QueryString',
        description: 'The SFRA QueryString class is a specialized utility for parsing and managing URL query string parameters in SFCC applications. This class provides enhanced functionality beyond basic query string parsing by handling SFCC-specific parameter formats.',
        type: 'class',
      },
      {
        name: 'render',
        title: 'Module render',
        description: 'The SFRA render module is the core rendering engine that processes and outputs different types of response content in Salesforce Commerce Cloud\'s Storefront Reference Architecture (SFRA). This module handles the execution of rendering operations that have been queued in the Response object\'s renderings array.',
        type: 'module',
      },
    ];

    this.cache.setSearchResults(cacheKey, documents);
    return documents;
  }

  /**
   * Get a specific SFRA document
   */
  async getSFRADocument(documentName: string): Promise<SFRADocument | null> {
    const cacheKey = `sfra:document:${documentName}`;
    const cached = this.cache.getFileContent(cacheKey);
    if (cached) {return JSON.parse(cached);}

    try {
      // Enhanced security validation - validate documentName before path construction
      if (!documentName || typeof documentName !== 'string') {
        throw new Error('Invalid document name: must be a non-empty string');
      }

      // Prevent null bytes and dangerous characters in the document name itself
      if (documentName.includes('\0') || documentName.includes('\x00')) {
        throw new Error('Invalid document name: contains null bytes');
      }

      // Prevent path traversal sequences in the document name
      if (documentName.includes('..') || documentName.includes('/') || documentName.includes('\\')) {
        throw new Error('Invalid document name: contains path traversal sequences');
      }

      // Only allow alphanumeric characters, underscores, and hyphens
      if (!/^[a-zA-Z0-9_-]+$/.test(documentName)) {
        throw new Error('Invalid document name: contains invalid characters');
      }

      const filePath = path.join(this.docsPath, `${documentName}.md`);

      // Additional security validation - ensure the resolved path is within the docs directory
      const resolvedPath = path.resolve(filePath);
      const resolvedDocsPath = path.resolve(this.docsPath);

      if (!resolvedPath.startsWith(resolvedDocsPath)) {
        throw new Error('Invalid document name: path outside allowed directory');
      }

      // Ensure the file still ends with .md after path resolution
      if (!resolvedPath.toLowerCase().endsWith('.md')) {
        throw new Error('Invalid document name: must reference a markdown file');
      }

      const content = await fs.readFile(resolvedPath, 'utf-8');

      // Basic content validation
      if (!content.trim()) {
        throw new Error(`Empty SFRA document: ${documentName}`);
      }

      // Check for binary content
      if (content.includes('\0')) {
        throw new Error(`Invalid content in SFRA document: ${documentName}`);
      }

      const lines = content.split('\n');
      const title = lines.find(line => line.startsWith('#'))?.replace('#', '').trim() ?? documentName;

      // Determine document type
      const type = title.toLowerCase().includes('class') ? 'class' : 'module';

      // Extract sections (## headers)
      const sections = lines
        .filter(line => line.startsWith('##'))
        .map(line => line.replace('##', '').trim());

      // Extract description (first paragraph after title)
      const descriptionStart = lines.findIndex(line => line.startsWith('#')) + 1;
      const descriptionEnd = lines.findIndex((line, index) =>
        index > descriptionStart && (line.startsWith('#') || line.trim() === ''));
      const description = lines
        .slice(descriptionStart, descriptionEnd > -1 ? descriptionEnd : descriptionStart + 3)
        .join(' ')
        .trim();

      // Extract properties and methods for classes
      let properties: string[] = [];
      const methods: string[] = [];

      if (type === 'class') {
        // Find property sections
        const propertySection = sections.find(s => s.toLowerCase().includes('properties'));
        if (propertySection) {
          properties = lines
            .filter(line => line.startsWith('### ') && !line.includes('Constructor') && !line.includes('Method'))
            .map(line => line.replace('### ', '').trim());
        }

        // Find method sections
        const methodSection = sections.find(s => s.toLowerCase().includes('method'));
        if (methodSection) {
          let inMethodSection = false;
          for (const line of lines) {
            if (line.includes('Method Summary') || line.includes('Method Detail')) {
              inMethodSection = true;
              continue;
            }
            if (inMethodSection && line.startsWith('#') && !line.includes('Method')) {
              break;
            }
            if (inMethodSection && line.startsWith('### ')) {
              const methodName = line.replace('### ', '').trim();
              if (!methods.includes(methodName)) {
                methods.push(methodName);
              }
            }
          }
        }
      }

      const document: SFRADocument = {
        title,
        description,
        sections,
        content,
        type: type as 'class' | 'module',
        ...(type === 'class' && { properties, methods }),
      };

      this.cache.setFileContent(cacheKey, JSON.stringify(document));
      return document;
    } catch (error) {
      console.error(`Error reading SFRA document ${documentName}:`, error);
      return null;
    }
  }

  /**
   * Search across all SFRA documentation for specific terms
   */
  async searchSFRADocumentation(query: string): Promise<Array<{
    document: string;
    title: string;
    matches: Array<{section: string; content: string}>;
  }>> {
    const cacheKey = `sfra:search:${query.toLowerCase()}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    const documents = await this.getAvailableDocuments();
    const results = [];

    for (const doc of documents) {
      const documentContent = await this.getSFRADocument(doc.name);
      if (!documentContent) {continue;}

      const matches = [];
      const lines = documentContent.content.split('\n');
      let currentSection = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('##')) {
          currentSection = line.replace('##', '').trim();
        }

        if (line.toLowerCase().includes(query.toLowerCase())) {
          // Get context around the match
          const start = Math.max(0, i - 2);
          const end = Math.min(lines.length, i + 3);
          const context = lines.slice(start, end).join('\n');

          matches.push({
            section: currentSection || 'Introduction',
            content: context,
          });
        }
      }

      if (matches.length > 0) {
        results.push({
          document: doc.name,
          title: doc.title,
          matches,
        });
      }
    }

    this.cache.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clearAll();
  }
}
