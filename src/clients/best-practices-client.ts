/**
 * SFCC Best Practices Client
 *
 * Provides access to SFCC development best practices documentation including
 * cartridge creation, ISML templates, job framework, LocalServiceRegistry,
 * OCAPI hooks, SCAPI hooks, SCAPI custom endpoints, SFRA controllers, and SFRA models.
 */

import * as fs from 'fs/promises';
import { PathResolver } from '../utils/path-resolver.js';
import { CacheManager } from '../utils/cache.js';
import { Logger } from '../utils/logger.js';
import { constructValidatedPath, validateTextContent } from '../utils/path-validation.js';
import { extractSections } from '../utils/markdown-utils.js';
import { BEST_PRACTICE_GUIDES } from '../constants/best-practices-guides.js';

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
  private logger: Logger;

  constructor() {
    this.cache = new CacheManager();
    this.docsPath = PathResolver.getBestPracticesPath();
    this.logger = Logger.getChildLogger('BestPracticesClient');
  }

  /**
   * Get all available best practice guides
   */
  async getAvailableGuides(): Promise<Array<{name: string; title: string; description: string}>> {
    const cacheKey = 'best-practices:available-guides';
    const cached = this.cache.getSearchResults(cacheKey);
    if (cached) {return cached;}

    // Use centralized guide definitions from constants
    const guides = BEST_PRACTICE_GUIDES.map(guide => ({
      name: guide.name,
      title: guide.title,
      description: guide.description,
    }));

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
      // Use shared path validation utility
      const resolvedPath = constructValidatedPath(this.docsPath, guideName, {
        allowedExtensions: ['.md'],
        normalizeToLowerCase: false,
      });

      const content = await fs.readFile(resolvedPath, 'utf-8');

      // Use shared content validation
      validateTextContent(content, `best practice guide: ${guideName}`);

      const lines = content.split('\n');
      const title = lines.find(line => line.startsWith('#'))?.replace('#', '').trim() ?? guideName;

      // Use shared utility for section extraction
      const sections = extractSections(content);

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
      this.logger.error(`Error reading best practice guide ${guideName}:`, error);
      return null;
    }
  }

  /**
   * Search across all best practices for specific terms
   * Uses parallel guide loading for improved performance
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

    // Load all guides in parallel for faster search
    const guideContents = await Promise.all(
      guides.map(async guide => ({
        guide,
        content: await this.getBestPracticeGuide(guide.name),
      })),
    );

    const results = [];
    const queryLower = query.toLowerCase();

    for (const { guide, content: guideContent } of guideContents) {
      if (!guideContent) {continue;}

      const matches = [];
      const lines = guideContent.content.split('\n');
      let currentSection = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('##')) {
          currentSection = line.replace('##', '').trim();
        }

        if (line.toLowerCase().includes(queryLower)) {
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
