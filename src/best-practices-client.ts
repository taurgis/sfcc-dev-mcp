/**
 * SFCC Best Practices Client
 *
 * Provides access to SFCC development best practices documentation including
 * OCAPI hooks, SCAPI hooks, SCAPI custom endpoints, and SFRA controllers.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CacheManager } from './cache.js';

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

    // ES module compatible way to get __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.docsPath = path.join(__dirname, '..', 'docs', 'best-practices');
  }

  /**
   * Get all available best practice guides
   */
  async getAvailableGuides(): Promise<Array<{name: string; title: string; description: string}>> {
    const cacheKey = 'best-practices:available-guides';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) return cached;

    const guides = [
      {
        name: 'ocapi_hooks',
        title: 'OCAPI Hooks Best Practices',
        description: 'Best practices for implementing OCAPI hooks in Salesforce B2C Commerce Cloud'
      },
      {
        name: 'scapi_hooks',
        title: 'SCAPI Hooks Best Practices',
        description: 'Essential best practices for implementing SCAPI hooks with AI development assistance'
      },
      {
        name: 'scapi_custom_endpoint',
        title: 'Custom SCAPI Endpoint Best Practices',
        description: 'Best practices for creating custom SCAPI endpoints in B2C Commerce Cloud'
      },
      {
        name: 'sfra_controllers',
        title: 'SFRA Controllers Best Practices',
        description: 'Best practices and code patterns for developing SFRA controllers'
      }
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
    if (cached) return JSON.parse(cached);

    try {
      const filePath = path.join(this.docsPath, `${guideName}.md`);
      const content = await fs.readFile(filePath, 'utf-8');

      const lines = content.split('\n');
      const title = lines.find(line => line.startsWith('#'))?.replace('#', '').trim() || guideName;

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
        content
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
    if (cached) return cached;

    const guides = await this.getAvailableGuides();
    const results = [];

    for (const guide of guides) {
      const guideContent = await this.getBestPracticeGuide(guide.name);
      if (!guideContent) continue;

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
            content: context
          });
        }
      }

      if (matches.length > 0) {
        results.push({
          guide: guide.name,
          title: guide.title,
          matches
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
    if (!guideName.includes('hooks')) return [];

    const cacheKey = `best-practices:hook-reference:${guideName}`;
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) return cached;

    const guide = await this.getBestPracticeGuide(guideName);
    if (!guide) return [];

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
      if (line.match(/^\|[\s\-\|]+\|$/)) {
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
