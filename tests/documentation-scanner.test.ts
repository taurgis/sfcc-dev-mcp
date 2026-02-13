import { DocumentationScanner } from '../src/clients/docs/documentation-scanner.js';
import { Logger } from '../src/utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

// Mock fs module
jest.mock('fs/promises');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('DocumentationScanner', () => {
  let mockLogger: jest.Mocked<Logger>;
  let scanner: DocumentationScanner;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      warn: jest.fn(),
    } as any;

    // Setup Logger mock before creating scanner
    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    // Now create the scanner instance
    scanner = new DocumentationScanner();

    // Reset all mocks
    jest.clearAllMocks();

    // Setup default path mock behavior
    mockPath.join.mockImplementation((...segments) => segments.join('/'));
    mockPath.resolve.mockImplementation((filePath) => `/resolved/${filePath}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with correct name', () => {
      // Re-mock and create a new instance to verify logger creation
      const loggerSpy = jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);
      new DocumentationScanner();

      expect(loggerSpy).toHaveBeenCalledWith('DocumentationScanner');

      loggerSpy.mockRestore();
    });
  });

  describe('scanDocumentation', () => {
    it('should scan SFCC directories and return class cache', async () => {
      const mockDirent = (name: string, isDir: boolean = true) => ({
        name,
        isDirectory: () => isDir,
        isFile: () => !isDir,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      // Mock readdir for main docs directory
      mockFs.readdir.mockResolvedValueOnce([
        mockDirent('dw_catalog'),
        mockDirent('dw_content'),
        mockDirent('TopLevel'),
        mockDirent('isml'), // Should be excluded
        mockDirent('sfra'), // Should be excluded
        mockDirent('other-dir'), // Should be excluded
        mockDirent('readme.md', false), // File, should be skipped
      ] as any);

      // Mock readdir for package directories in specific order
      mockFs.readdir
        .mockResolvedValueOnce([
          'Product.md',
          'Category.md',
          'readme.txt', // non-.md file to be skipped
        ] as any) // dw_catalog
        .mockResolvedValueOnce([
          'ContentMgr.md',
          'Content.md',
        ] as any) // dw_content
        .mockResolvedValueOnce([
          'String.md',
          'Number.md',
        ] as any); // TopLevel

      // Mock file reading in the expected order based on directory scanning
      mockFs.readFile
        .mockResolvedValueOnce('# Class Product\n\nProduct documentation content') // dw_catalog/Product.md
        .mockResolvedValueOnce('# Class Category\n\nCategory documentation content') // dw_catalog/Category.md
        .mockResolvedValueOnce('# Class ContentMgr\n\nContentMgr documentation content') // dw_content/ContentMgr.md
        .mockResolvedValueOnce('# Class Content\n\nContent documentation content') // dw_content/Content.md
        .mockResolvedValueOnce('# Class String\n\nString documentation content') // TopLevel/String.md
        .mockResolvedValueOnce('# Class Number\n\nNumber documentation content'); // TopLevel/Number.md

      // Mock path validation to ensure all paths are considered valid
      mockPath.resolve.mockImplementation((filePath) => {
        // For the main docs path
        if (filePath === '/docs') {
          return '/resolved/docs';
        }

        // For package directories
        if (filePath === '/docs/dw_catalog') {
          return '/resolved/docs/dw_catalog';
        }
        if (filePath === '/docs/dw_content') {
          return '/resolved/docs/dw_content';
        }
        if (filePath === '/docs/TopLevel') {
          return '/resolved/docs/TopLevel';
        }

        // For specific files - ensure they're within the package and docs paths
        if (filePath === '/docs/dw_catalog/Product.md') {
          return '/resolved/docs/dw_catalog/Product.md';
        }
        if (filePath === '/docs/dw_catalog/Category.md') {
          return '/resolved/docs/dw_catalog/Category.md';
        }
        if (filePath === '/docs/dw_content/ContentMgr.md') {
          return '/resolved/docs/dw_content/ContentMgr.md';
        }
        if (filePath === '/docs/dw_content/Content.md') {
          return '/resolved/docs/dw_content/Content.md';
        }
        if (filePath === '/docs/TopLevel/String.md') {
          return '/resolved/docs/TopLevel/String.md';
        }
        if (filePath === '/docs/TopLevel/Number.md') {
          return '/resolved/docs/TopLevel/Number.md';
        }

        // Default fallback
        return `/resolved${filePath}`;
      });

      const result = await scanner.scanDocumentation('/docs');

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(6); // Should have 6 .md files total

      // Check that SFCC directories were processed
      expect(result.has('dw_catalog.Product')).toBe(true);
      expect(result.has('dw_catalog.Category')).toBe(true);
      expect(result.has('dw_content.ContentMgr')).toBe(true);
      expect(result.has('dw_content.Content')).toBe(true);
      expect(result.has('TopLevel.String')).toBe(true);
      expect(result.has('TopLevel.Number')).toBe(true);

      // Verify structure of one cached item
      const productInfo = result.get('dw_catalog.Product');
      expect(productInfo).toEqual({
        className: 'Product',
        packageName: 'dw_catalog',
        filePath: '/docs/dw_catalog/Product.md',
        content: '# Class Product\n\nProduct documentation content',
      });
    });

    it('should handle empty docs directory', async () => {
      mockFs.readdir.mockResolvedValueOnce([]);

      const result = await scanner.scanDocumentation('/empty-docs');

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should skip non-SFCC directories', async () => {
      const mockDirent = (name: string, isDir: boolean = true) => ({
        name,
        isDirectory: () => isDir,
        isFile: () => !isDir,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([
        mockDirent('isml'),
        mockDirent('sfra'),
        mockDirent('random-dir'),
        mockDirent('another_dir'),
      ] as any);

      const result = await scanner.scanDocumentation('/docs');

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should handle directory read errors gracefully', async () => {
      mockFs.readdir.mockRejectedValueOnce(new Error('Permission denied'));

      await expect(scanner.scanDocumentation('/forbidden-docs')).rejects.toThrow('Permission denied');
    });
  });

  describe('directory classification (isSFCCDirectory)', () => {
    // Test the isSFCCDirectory logic through scanDocumentation behavior
    it('should include dw_ prefixed directories', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([
        mockDirent('dw_catalog'),
        mockDirent('dw_content'),
        mockDirent('dw_system'),
        mockDirent('dw_order'),
      ] as any);

      mockFs.readdir
        .mockResolvedValueOnce([]) // dw_catalog
        .mockResolvedValueOnce([]) // dw_content
        .mockResolvedValueOnce([]) // dw_system
        .mockResolvedValueOnce([]); // dw_order

      await scanner.scanDocumentation('/docs');

      // Verify that readdir was called for each dw_ directory
      expect(mockFs.readdir).toHaveBeenCalledTimes(5); // 1 for main + 4 for packages
    });

    it('should include TopLevel directory', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('TopLevel')] as any);
      mockFs.readdir.mockResolvedValueOnce([]); // TopLevel contents

      await scanner.scanDocumentation('/docs');

      expect(mockFs.readdir).toHaveBeenCalledTimes(2); // 1 for main + 1 for TopLevel
    });

    it('should exclude isml directory', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('isml')] as any);

      await scanner.scanDocumentation('/docs');

      expect(mockFs.readdir).toHaveBeenCalledTimes(1); // Only main directory
    });

    it('should exclude sfra directory', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('sfra')] as any);

      await scanner.scanDocumentation('/docs');

      expect(mockFs.readdir).toHaveBeenCalledTimes(1); // Only main directory
    });
  });

  describe('file name validation', () => {
    it('should process valid markdown files', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce([
        'Product.md',
        'Valid_File-Name.md',
        'File123.md',
      ] as any);

      mockFs.readFile
        .mockResolvedValueOnce('Valid content')
        .mockResolvedValueOnce('Valid content')
        .mockResolvedValueOnce('Valid content');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(3);
      expect(result.has('dw_catalog.Product')).toBe(true);
      expect(result.has('dw_catalog.Valid_File-Name')).toBe(true);
      expect(result.has('dw_catalog.File123')).toBe(true);
    });

    it('should reject files with path traversal sequences', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce([
        '../evil.md',
        '..\\evil.md',
        'path/traversal.md',
      ] as any);

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('path traversal'));
    });

    it('should reject files with null bytes', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce([
        'evil\0.md',
        'evil\x00.md',
      ] as any);

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('null bytes'));
    });

    it('should reject files with invalid characters', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce([
        'file@invalid.md',
        'file#invalid.md',
        'file$invalid.md',
      ] as any);

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('invalid characters'));
    });

    it('should reject invalid file name types', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['', null, undefined] as any);

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid file name type'));
    });
  });

  describe('file path validation', () => {
    it('should validate file paths are within allowed directories', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md'] as any);

      // Mock path.resolve to simulate path outside allowed directory
      mockPath.resolve.mockImplementation((filePath) => {
        if (filePath.includes('Product.md')) {
          return '/outside/docs/Product.md';
        }
        if (filePath.includes('dw_catalog')) {
          return '/resolved/docs/dw_catalog';
        }
        return '/resolved/docs';
      });

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('outside allowed directory'));
    });

    it('should validate files end with .md extension', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md'] as any);

      // Mock path.resolve to simulate file without .md extension after resolution
      mockPath.resolve.mockImplementation((filePath) => {
        if (filePath.includes('Product.md')) {
          return '/resolved/docs/dw_catalog/Product.txt';
        }
        if (filePath.includes('dw_catalog')) {
          return '/resolved/docs/dw_catalog';
        }
        return '/resolved/docs';
      });

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('does not reference a markdown file'));
    });
  });

  describe('file content validation', () => {
    it('should reject empty file content', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md'] as any);
      mockFs.readFile.mockResolvedValueOnce('   \n\t  \n  '); // Only whitespace

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Empty documentation file'));
    });

    it('should reject binary content', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md'] as any);
      mockFs.readFile.mockResolvedValueOnce('Valid content\0binary data'); // Contains null byte

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Binary content detected'));
    });

    it('should accept valid file content', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md'] as any);
      mockFs.readFile.mockResolvedValueOnce('# Class Product\n\nValid markdown content with special chars: éñ中文');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(1);
      expect(result.has('dw_catalog.Product')).toBe(true);

      const productInfo = result.get('dw_catalog.Product');
      expect(productInfo?.content).toBe('# Class Product\n\nValid markdown content with special chars: éñ中文');
    });
  });

  describe('file reading error handling', () => {
    it('should handle file read errors gracefully', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md', 'Category.md'] as any);

      // First file fails to read, second succeeds
      mockFs.readFile
        .mockRejectedValueOnce(new Error('Permission denied'))
        .mockResolvedValueOnce('# Class Category\n\nValid content');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(1);
      expect(result.has('dw_catalog.Category')).toBe(true);
      expect(result.has('dw_catalog.Product')).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Could not read file Product.md'));
    });

    it('should handle package directory read errors gracefully', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([
        mockDirent('dw_catalog'),
        mockDirent('dw_content'),
      ] as any);

      // First package directory fails to read, second succeeds
      mockFs.readdir
        .mockRejectedValueOnce(new Error('Directory not accessible'))
        .mockResolvedValueOnce(['ContentMgr.md'] as any);

      mockFs.readFile.mockResolvedValueOnce('# Class ContentMgr\n\nValid content');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(1);
      expect(result.has('dw_content.ContentMgr')).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Could not read package dw_catalog'));
    });
  });

  describe('markdown file filtering', () => {
    it('should only process .md files', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce([
        'Product.md',
        'readme.txt',
        'documentation.html',
        'Category.md',
        'config.json',
        'index.js',
      ] as any);

      mockFs.readFile
        .mockResolvedValueOnce('# Class Product\n\nProduct content')
        .mockResolvedValueOnce('# Class Category\n\nCategory content');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(2);
      expect(result.has('dw_catalog.Product')).toBe(true);
      expect(result.has('dw_catalog.Category')).toBe(true);

      // Verify only .md files were processed
      expect(mockFs.readFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('class name extraction', () => {
    it('should extract class names correctly from file names', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([mockDirent('dw_catalog')] as any);
      mockFs.readdir.mockResolvedValueOnce(['Product.md', 'Product_Manager.md', 'Product-Utils.md'] as any);

      mockFs.readFile
        .mockResolvedValueOnce('Content 1')
        .mockResolvedValueOnce('Content 2')
        .mockResolvedValueOnce('Content 3');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(3);
      expect(result.has('dw_catalog.Product')).toBe(true);
      expect(result.has('dw_catalog.Product_Manager')).toBe(true);
      expect(result.has('dw_catalog.Product-Utils')).toBe(true);

      // Verify class names are extracted correctly
      expect(result.get('dw_catalog.Product')?.className).toBe('Product');
      expect(result.get('dw_catalog.Product_Manager')?.className).toBe('Product_Manager');
      expect(result.get('dw_catalog.Product-Utils')?.className).toBe('Product-Utils');
    });
  });

  describe('cache key generation', () => {
    it('should generate correct cache keys', async () => {
      const mockDirent = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false,
      });

      mockFs.readdir.mockResolvedValueOnce([
        mockDirent('dw_catalog'),
        mockDirent('TopLevel'),
      ] as any);

      mockFs.readdir
        .mockResolvedValueOnce(['Product.md'] as any)
        .mockResolvedValueOnce(['String.md'] as any);

      mockFs.readFile
        .mockResolvedValueOnce('Product content')
        .mockResolvedValueOnce('String content');

      const result = await scanner.scanDocumentation('/docs');

      expect(result.size).toBe(2);
      expect(result.has('dw_catalog.Product')).toBe(true);
      expect(result.has('TopLevel.String')).toBe(true);

      // Verify full structure of cached items
      const productInfo = result.get('dw_catalog.Product');
      expect(productInfo).toEqual({
        className: 'Product',
        packageName: 'dw_catalog',
        filePath: '/docs/dw_catalog/Product.md',
        content: 'Product content',
      });

      const stringInfo = result.get('TopLevel.String');
      expect(stringInfo).toEqual({
        className: 'String',
        packageName: 'TopLevel',
        filePath: '/docs/TopLevel/String.md',
        content: 'String content',
      });
    });
  });
});
