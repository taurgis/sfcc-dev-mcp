import { ISMLClient } from '../src/clients/isml-client.js';
import * as fs from 'fs/promises';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../src/utils/logger.js', () => ({
  Logger: {
    getChildLogger: jest.fn(() => ({
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    })),
  },
}));

// Mock PathResolver before it's imported
jest.mock('../src/utils/path-resolver.js', () => ({
  PathResolver: {
    getDocsPath: jest.fn(() => '/mock/docs'),
  },
}));

describe('ISMLClient', () => {
  let client: ISMLClient;

  const mockIsifContent = `# isif - Conditional Element

## Overview

The isif element provides conditional logic in ISML templates. Use it to conditionally render content based on expressions.

## Syntax

\`\`\`isml
<isif condition="\${expression}">
  <!-- content -->
</isif>
\`\`\`

### condition

- Type: Expression
- Required: yes
- Description: The condition to evaluate

## Examples

Example usage of isif element...
`;

  const mockIsloopContent = `# isloop - Loop Element

## Overview

The isloop element enables iteration over collections in ISML templates.

## Syntax

\`\`\`isml
<isloop items="\${collection}" var="item">
  <!-- content -->
</isloop>
\`\`\`

### items

- Type: Collection
- Required: yes
- Description: The collection to iterate over

### var

- Type: String
- Required: yes
- Description: Variable name for current item

## Examples

Example usage of isloop element...
`;

  const mockIsprintContent = `# isprint - Output Element

## Overview

The isprint element outputs formatted data to the template.

### value

- Type: Any
- Required: yes
- Description: The value to output

### style

- Type: String
- Optional: yes
- Description: Formatting style
`;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock file system
    (fs.readdir as jest.Mock).mockResolvedValue(['isif.md', 'isloop.md', 'isprint.md', 'README.md']);

    (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('isif.md')) {
        return Promise.resolve(mockIsifContent);
      } else if (filePath.includes('isloop.md')) {
        return Promise.resolve(mockIsloopContent);
      } else if (filePath.includes('isprint.md')) {
        return Promise.resolve(mockIsprintContent);
      }
      return Promise.reject(new Error('File not found'));
    });

    (fs.stat as jest.Mock).mockResolvedValue({
      mtime: new Date('2024-01-01'),
    });

    client = new ISMLClient();
  });

  afterEach(() => {
    client.destroy();
  });

  describe('getAvailableElements', () => {
    it('should return list of ISML elements', async () => {
      const elements = await client.getAvailableElements();

      expect(elements).toHaveLength(3);
      expect(elements[0]).toHaveProperty('name');
      expect(elements[0]).toHaveProperty('title');
      expect(elements[0]).toHaveProperty('description');
      expect(elements[0]).toHaveProperty('category');
      expect(elements[0]).toHaveProperty('filename');
    });

    it('should include correct element names', async () => {
      const elements = await client.getAvailableElements();

      const names = elements.map((el) => el.name);
      expect(names).toContain('isif');
      expect(names).toContain('isloop');
      expect(names).toContain('isprint');
    });

    it('should categorize elements correctly', async () => {
      const elements = await client.getAvailableElements();

      const isif = elements.find((el) => el.name === 'isif');
      const isloop = elements.find((el) => el.name === 'isloop');
      const isprint = elements.find((el) => el.name === 'isprint');

      expect(isif?.category).toBe('control-flow');
      expect(isloop?.category).toBe('control-flow');
      expect(isprint?.category).toBe('output');
    });

    it('should cache results', async () => {
      await client.getAvailableElements();
      await client.getAvailableElements();

      // Should only read directory once
      expect(fs.readdir).toHaveBeenCalledTimes(1);
    });

    it('should filter out non-markdown files', async () => {
      const elements = await client.getAvailableElements();

      const readmeElement = elements.find((el) => el.filename === 'README.md');
      expect(readmeElement).toBeUndefined();
    });
  });

  describe('getISMLElement', () => {
    it('should return detailed element information', async () => {
      const element = await client.getISMLElement('isif');

      expect(element).not.toBeNull();
      expect(element?.name).toBe('isif');
      expect(element?.title).toContain('isif');
      expect(element?.description).toBeTruthy();
      expect(element?.sections).toBeInstanceOf(Array);
      expect(element?.content).toBeTruthy();
      expect(element?.category).toBe('control-flow');
    });

    it('should normalize element name with is prefix', async () => {
      const element = await client.getISMLElement('if');

      expect(element).not.toBeNull();
      expect(element?.name).toBe('isif');
    });

    it('should handle element name without normalization', async () => {
      const element = await client.getISMLElement('isif');

      expect(element).not.toBeNull();
      expect(element?.name).toBe('isif');
    });

    it('should return null for non-existent element', async () => {
      const element = await client.getISMLElement('nonexistent');

      expect(element).toBeNull();
    });

    it('should cache element results', async () => {
      await client.getISMLElement('isif');
      await client.getISMLElement('isif');

      // Should read directory once, but cache the element lookup
      expect(fs.readdir).toHaveBeenCalledTimes(1);
    });

    it('should extract sections correctly', async () => {
      const element = await client.getISMLElement('isif');

      expect(element?.sections).toContain('Overview');
      expect(element?.sections).toContain('Syntax');
      expect(element?.sections).toContain('Examples');
    });

    it('should extract attributes correctly', async () => {
      const element = await client.getISMLElement('isif');

      expect(element?.attributes).toContain('condition');
      expect(element?.requiredAttributes).toContain('condition');
    });

    it('should apply includeContent option', async () => {
      const elementWithContent = await client.getISMLElement('isif', { includeContent: true });
      const elementWithoutContent = await client.getISMLElement('isif', { includeContent: false });

      expect(elementWithContent?.content).toBeTruthy();
      expect(elementWithoutContent?.content).toBe('');
    });

    it('should apply includeSections option', async () => {
      const elementWithSections = await client.getISMLElement('isif', { includeSections: true });
      const elementWithoutSections = await client.getISMLElement('isif', { includeSections: false });

      expect(elementWithSections?.sections.length).toBeGreaterThan(0);
      expect(elementWithoutSections?.sections).toEqual([]);
    });

    it('should apply includeAttributes option', async () => {
      const elementWithAttrs = await client.getISMLElement('isif', { includeAttributes: true });
      const elementWithoutAttrs = await client.getISMLElement('isif', { includeAttributes: false });

      expect(elementWithAttrs?.attributes?.length).toBeGreaterThan(0);
      expect(elementWithoutAttrs?.attributes).toEqual([]);
    });
  });

  describe('searchISMLElements', () => {
    it('should find elements by query', async () => {
      const results = await client.searchISMLElements('conditional');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('document');
      expect(results[0]).toHaveProperty('relevance');
      expect(results[0]).toHaveProperty('matchedSections');
      expect(results[0]).toHaveProperty('preview');
    });

    it('should prioritize exact name matches', async () => {
      const results = await client.searchISMLElements('isif');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].document.name).toBe('isif');
      expect(results[0].relevance).toBeGreaterThan(100); // High relevance for exact match
    });

    it('should find elements by description', async () => {
      const results = await client.searchISMLElements('iteration');

      const isloopResult = results.find((r) => r.document.name === 'isloop');
      expect(isloopResult).toBeDefined();
    });

    it('should sort results by relevance', async () => {
      const results = await client.searchISMLElements('element');

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].relevance).toBeGreaterThanOrEqual(results[i + 1].relevance);
      }
    });

    it('should filter by category', async () => {
      const results = await client.searchISMLElements('element', { category: 'control-flow' });

      expect(results.every((r) => r.document.category === 'control-flow')).toBe(true);
    });

    it('should limit results', async () => {
      const results = await client.searchISMLElements('element', { limit: 1 });

      expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should provide preview snippets', async () => {
      const results = await client.searchISMLElements('conditional');

      const isifResult = results.find((r) => r.document.name === 'isif');
      expect(isifResult?.preview).toBeTruthy();
      expect(isifResult?.preview.length).toBeLessThanOrEqual(300);
    });

    it('should return empty array for no matches', async () => {
      const results = await client.searchISMLElements('zzznomatch');

      expect(results).toEqual([]);
    });

    it('should be case insensitive', async () => {
      const lowerResults = await client.searchISMLElements('conditional');
      const upperResults = await client.searchISMLElements('CONDITIONAL');

      expect(lowerResults.length).toBe(upperResults.length);
    });
  });

  describe('getElementsByCategory', () => {
    it('should return elements in specified category', async () => {
      const elements = await client.getElementsByCategory('control-flow');

      expect(elements.length).toBeGreaterThan(0);
      expect(elements.every((el) => el.category === 'control-flow')).toBe(true);
    });

    it('should return empty array for non-existent category', async () => {
      const elements = await client.getElementsByCategory('non-existent');

      expect(elements).toEqual([]);
    });

    it('should include all control-flow elements', async () => {
      const elements = await client.getElementsByCategory('control-flow');

      const names = elements.map((el) => el.name);
      expect(names).toContain('isif');
      expect(names).toContain('isloop');
    });

    it('should return output category elements', async () => {
      const elements = await client.getElementsByCategory('output');

      expect(elements.length).toBeGreaterThan(0);
      const names = elements.map((el) => el.name);
      expect(names).toContain('isprint');
    });
  });

  describe('getAvailableCategories', () => {
    it('should return list of categories', async () => {
      const categories = await client.getAvailableCategories();

      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('displayName');
      expect(categories[0]).toHaveProperty('description');
      expect(categories[0]).toHaveProperty('count');
    });

    it('should include control-flow category', async () => {
      const categories = await client.getAvailableCategories();

      const controlFlow = categories.find((c) => c.name === 'control-flow');
      expect(controlFlow).toBeDefined();
      expect(controlFlow?.displayName).toBe('Control Flow');
      expect(controlFlow?.count).toBeGreaterThan(0);
    });

    it('should include output category', async () => {
      const categories = await client.getAvailableCategories();

      const output = categories.find((c) => c.name === 'output');
      expect(output).toBeDefined();
      expect(output?.displayName).toBe('Output');
    });

    it('should have correct element counts', async () => {
      const categories = await client.getAvailableCategories();

      const controlFlow = categories.find((c) => c.name === 'control-flow');
      const output = categories.find((c) => c.name === 'output');

      expect(controlFlow?.count).toBe(2); // isif, isloop
      expect(output?.count).toBe(1); // isprint
    });

    it('should sort categories alphabetically by display name', async () => {
      const categories = await client.getAvailableCategories();

      for (let i = 0; i < categories.length - 1; i++) {
        expect(categories[i].displayName.localeCompare(categories[i + 1].displayName)).toBeLessThanOrEqual(0);
      }
    });

    it('should cache category results', async () => {
      await client.getAvailableCategories();
      await client.getAvailableCategories();

      // Should only read directory once
      expect(fs.readdir).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle file read errors', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      await expect(client.getAvailableElements()).rejects.toThrow('Failed to load documentation');
    });

    it('should handle malformed markdown files gracefully', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('Invalid content without proper structure');

      const elements = await client.getAvailableElements();

      // Should still return elements, just with limited information
      expect(elements).toBeDefined();
    });

    it('should skip files that fail to parse', async () => {
      (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath.includes('isif.md')) {
          return Promise.reject(new Error('Read error'));
        }
        return Promise.resolve(mockIsloopContent);
      });

      const elements = await client.getAvailableElements();

      // Should still return other elements
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('caching behavior', () => {
    it('should cache different option combinations separately', async () => {
      await client.getISMLElement('isif', { includeContent: true });
      await client.getISMLElement('isif', { includeContent: false });

      // Both should be cached separately
      const cachedWithContent = await client.getISMLElement('isif', { includeContent: true });
      const cachedWithoutContent = await client.getISMLElement('isif', { includeContent: false });

      expect(cachedWithContent?.content).toBeTruthy();
      expect(cachedWithoutContent?.content).toBe('');
    });

    it('should use in-memory element cache for repeated calls', async () => {
      await client.getAvailableElements();
      (fs.readdir as jest.Mock).mockClear();

      // Second call should use cache
      await client.getAvailableElements();
      expect(fs.readdir).not.toHaveBeenCalled();
    });

    it('should destroy cache resources and reset document state', async () => {
      await client.getAvailableElements();
      const cacheDestroySpy = jest.spyOn((client as any).cache, 'destroy');

      client.destroy();

      expect(cacheDestroySpy).toHaveBeenCalledTimes(1);
      expect((client as any).documentsCache).toBeNull();
      expect((client as any).lastScanTime).toBe(0);
    });
  });
});
