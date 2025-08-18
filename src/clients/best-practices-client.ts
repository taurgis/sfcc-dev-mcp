/**
 * SFCC Best Practices Client
 *
 * Provides access to SFCC development best practices documentation including
 * cartridge creation, ISML templates, job framework, LocalServiceRegistry,
 * OCAPI hooks, SCAPI hooks, SCAPI custom endpoints, SFRA controllers, and SFRA models.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';

export interface BestPracticeGuide {
  title: string;
  description: string;
  sections: string[];
  content: string;
}

/**
 * Client for accessing SFCC best practices documentation
 */
export class SFCCBestPracticesClient {
  private cache: CacheManager;
  private docsPath: string;

  constructor() {
    this.cache = new CacheManager();
    this.docsPath = PathResolver.getBestPracticesPath();
  }

  /**
   * Get all available best practice guides
   */
  async getAvailableGuides(): Promise<Array<{name: string; title: string; description: string}>> {
    const cacheKey = 'best-practices:available-guides';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    const guides = [
      {
        name: 'cartridge_creation',
        title: 'Cartridge Creation Best Practices',
        description: 'Instructions and best practices for creating, configuring, and deploying custom SFRA cartridges',
      },
      {
        name: 'isml_templates',
        title: 'ISML Templates Best Practices',
        description: 'Comprehensive best practices for developing ISML templates within the SFRA framework, including security, performance, and maintainability guidelines',
      },
      {
        name: 'job_framework',
        title: 'Job Framework Best Practices',
        description: 'Comprehensive guide for developing custom jobs in the SFCC Job Framework, covering both task-oriented and chunk-oriented approaches with performance optimization and debugging strategies',
      },
      {
        name: 'localserviceregistry',
        title: 'LocalServiceRegistry Best Practices',
        description: 'Comprehensive guide for creating server-to-server integrations in SFCC using dw.svc.LocalServiceRegistry, including configuration patterns, callback implementation, OAuth flows, and reusable service module patterns',
      },
      {
        name: 'ocapi_hooks',
        title: 'OCAPI Hooks Best Practices',
        description: 'Best practices for implementing OCAPI hooks in Salesforce B2C Commerce Cloud',
      },
      {
        name: 'scapi_hooks',
        title: 'SCAPI Hooks Best Practices',
        description: 'Essential best practices for implementing SCAPI hooks with AI development assistance',
      },
      {
        name: 'scapi_custom_endpoint',
        title: 'Custom SCAPI Endpoint Best Practices',
        description: 'Best practices for creating custom SCAPI endpoints in B2C Commerce Cloud',
      },
      {
        name: 'sfra_controllers',
        title: 'SFRA Controllers Best Practices',
        description: 'Best practices and code patterns for developing SFRA controllers',
      },
      {
        name: 'sfra_models',
        title: 'SFRA Models Best Practices',
        description: 'Best practices for developing SFRA models in Salesforce B2C Commerce Cloud',
      },
      {
        name: 'performance',
        title: 'Performance and Stability Best Practices',
        description: 'Comprehensive performance optimization strategies, coding standards, and stability guidelines for SFCC development including caching, index-friendly APIs, and job development',
      },
      {
        name: 'security',
        title: 'Security Best Practices',
        description: 'Comprehensive security best practices for SFCC development covering SFRA Controllers, OCAPI/SCAPI Hooks, and Custom SCAPI Endpoints with OWASP compliance guidelines',
      },
    ];

    this.cache.setSearchResults(cacheKey, guides);
    return guides;
  }

  /**
   * Get a specific best practice guide
   */
  async getBestPracticeGuide(guideName: string): Promise<BestPracticeGuide | null> {
    const cacheKey = `best-practices:guide:${guideName}`;
    const cached = this.cache.getFileContent(cacheKey);
    if (cached) {return JSON.parse(cached);}

    try {
      // Enhanced security validation - validate guideName before path construction
      if (!guideName || typeof guideName !== 'string') {
        throw new Error('Invalid guide name: must be a non-empty string');
      }

      // Prevent null bytes and dangerous characters in the guide name itself
      if (guideName.includes('\0') || guideName.includes('\x00')) {
        throw new Error('Invalid guide name: contains null bytes');
      }

      // Prevent path traversal sequences in the guide name
      if (guideName.includes('..') || guideName.includes('/') || guideName.includes('\\')) {
        throw new Error('Invalid guide name: contains path traversal sequences');
      }

      // Only allow alphanumeric characters, underscores, and hyphens
      if (!/^[a-zA-Z0-9_-]+$/.test(guideName)) {
        throw new Error('Invalid guide name: contains invalid characters');
      }

      const filePath = path.join(this.docsPath, `${guideName}.md`);

      // Additional security validation - ensure the resolved path is within the docs directory
      const resolvedPath = path.resolve(filePath);
      const resolvedDocsPath = path.resolve(this.docsPath);

      if (!resolvedPath.startsWith(resolvedDocsPath)) {
        throw new Error('Invalid guide name: path outside allowed directory');
      }

      // Ensure the file still ends with .md after path resolution
      if (!resolvedPath.toLowerCase().endsWith('.md')) {
        throw new Error('Invalid guide name: must reference a markdown file');
      }

      const content = await fs.readFile(resolvedPath, 'utf-8');

      // Basic content validation
      if (!content.trim()) {
        throw new Error(`Empty best practice guide: ${guideName}`);
      }

      // Check for binary content
      if (content.includes('\0')) {
        throw new Error(`Invalid content in best practice guide: ${guideName}`);
      }

      const lines = content.split('\n');
      const title = lines.find(line => line.startsWith('#'))?.replace('#', '').trim() ?? guideName;

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

      const guide: BestPracticeGuide = {
        title,
        description,
        sections,
        content,
      };

      this.cache.setFileContent(cacheKey, JSON.stringify(guide));
      return guide;
    } catch (error) {
      console.error(`Error reading best practice guide ${guideName}:`, error);
      return null;
    }
  }

  /**
   * Search across all best practices for specific terms
   */
  async searchBestPractices(query: string): Promise<Array<{
    guide: string;
    title: string;
    matches: Array<{section: string; content: string}>;
  }>> {
    const cacheKey = `best-practices:search:${query.toLowerCase()}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    const guides = await this.getAvailableGuides();
    const results = [];

    for (const guide of guides) {
      const guideContent = await this.getBestPracticeGuide(guide.name);
      if (!guideContent) {continue;}

      const matches = [];
      const lines = guideContent.content.split('\n');
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
          guide: guide.name,
          title: guide.title,
          matches,
        });
      }
    }

    this.cache.setSearchResults(cacheKey, results);
    return results;
  }

  /**
   * Get hook reference tables for OCAPI/SCAPI hooks
   */
  async getHookReference(guideName: string): Promise<Array<{
    category: string;
    hooks: Array<{endpoint: string; hookPoints: string[]; signature?: string}>;
  }>> {
    if (!guideName.includes('hooks')) {return [];}

    const cacheKey = `best-practices:hook-reference:${guideName}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    const guide = await this.getBestPracticeGuide(guideName);
    if (!guide) {return [];}

    const reference = [];
    const lines = guide.content.split('\n');
    let currentCategory = '';
    let inTable = false;
    let hooks: Array<{endpoint: string; hookPoints: string[]; signature?: string}> = [];

    for (const line of lines) {
      // Look for hook reference sections
      if (line.match(/^###?\s+(Shop API Hooks|Data API Hooks|Shopper.*Hooks|.*API Hooks)/i)) {
        if (currentCategory && hooks.length > 0) {
          reference.push({ category: currentCategory, hooks: [...hooks] });
        }
        currentCategory = line.replace(/^#+\s*/, '');
        hooks = [];
        inTable = false;
      }

      // Detect table headers
      if (line.includes('API Endpoint') && line.includes('Hook')) {
        inTable = true;
        continue;
      }

      // Skip separator line
      if (line.match(/^\|[\s\-|]+\|$/)) {
        continue;
      }

      // Parse table rows
      if (inTable && line.startsWith('|') && !line.includes('**')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 2) {
          const endpoint = parts[0].replace(/`/g, '');
          const hookPoints = parts[1].split(',').map(h => h.replace(/`/g, '').trim());
          const signature = parts[2] ? parts[2].replace(/`/g, '') : undefined;

          if (endpoint && hookPoints.length > 0) {
            hooks.push({ endpoint, hookPoints, signature });
          }
        }
      }

      // End table when we hit a new section
      if (inTable && line.startsWith('#')) {
        inTable = false;
      }
    }

    // Add last category
    if (currentCategory && hooks.length > 0) {
      reference.push({ category: currentCategory, hooks });
    }

    this.cache.setSearchResults(cacheKey, reference);
    return reference;
  }
}
