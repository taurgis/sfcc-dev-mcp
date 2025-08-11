import { PathResolver } from '../src/path-resolver';
import path from 'path';
import { tmpdir } from 'os';
import { mkdirSync, existsSync, rmSync, realpathSync } from 'fs';

describe('PathResolver', () => {
  const originalCwd = process.cwd();
  let testDir: string;

  beforeAll(() => {
    // Create a temporary directory for testing and then resolve it
    const tempPath = path.resolve(tmpdir(), 'path-resolver-tests');
    if (!existsSync(tempPath)) {
      mkdirSync(tempPath, { recursive: true });
    }
    testDir = realpathSync(tempPath); // Now resolve symlinks after directory exists
  });

  afterAll(() => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Restore original working directory after each test
    process.chdir(originalCwd);
  });

  describe('getCurrentWorkingDir', () => {
    it('should return the current working directory', () => {
      const cwd = PathResolver.getCurrentWorkingDir();
      expect(cwd).toBe(process.cwd());
      expect(typeof cwd).toBe('string');
      expect(cwd.length).toBeGreaterThan(0);
    });

    it('should return updated working directory after changing it', () => {
      const initialCwd = PathResolver.getCurrentWorkingDir();

      process.chdir(testDir);
      const newCwd = PathResolver.getCurrentWorkingDir();

      // Use a more flexible comparison that handles symlinks
      expect(realpathSync(newCwd)).toBe(testDir);
      expect(newCwd).not.toBe(initialCwd);
    });

    it('should reflect changes when process.cwd() changes', () => {
      const homeDir = require('os').homedir();

      process.chdir(homeDir);
      expect(realpathSync(PathResolver.getCurrentWorkingDir())).toBe(realpathSync(homeDir));

      process.chdir(testDir);
      expect(realpathSync(PathResolver.getCurrentWorkingDir())).toBe(testDir);
    });
  });

  describe('getRelativePath', () => {
    it('should join single path segment with current working directory', () => {
      const relativePath = PathResolver.getRelativePath('docs');
      const expected = path.join(process.cwd(), 'docs');

      expect(relativePath).toBe(expected);
    });

    it('should join multiple path segments with current working directory', () => {
      const relativePath = PathResolver.getRelativePath('docs', 'best-practices', 'cartridge.md');
      const expected = path.join(process.cwd(), 'docs', 'best-practices', 'cartridge.md');

      expect(relativePath).toBe(expected);
    });

    it('should handle empty path segments array', () => {
      const relativePath = PathResolver.getRelativePath();
      const expected = process.cwd();

      expect(relativePath).toBe(expected);
    });

    it('should handle single empty string segment', () => {
      const relativePath = PathResolver.getRelativePath('');
      const expected = path.join(process.cwd(), '');

      expect(relativePath).toBe(expected);
    });

    it('should normalize path separators correctly', () => {
      const relativePath = PathResolver.getRelativePath('docs/best-practices', 'guides');
      const expected = path.join(process.cwd(), 'docs/best-practices', 'guides');

      expect(relativePath).toBe(expected);
      expect(relativePath).toContain(path.sep);
    });

    it('should work with different working directories', () => {
      // Test in original directory
      const path1 = PathResolver.getRelativePath('test');
      const expected1 = path.join(originalCwd, 'test');
      expect(path1).toBe(expected1);

      // Change to test directory and test again
      process.chdir(testDir);
      const path2 = PathResolver.getRelativePath('test');
      const expected2 = path.join(testDir, 'test');

      // Use a more flexible comparison for cross-platform compatibility
      expect(path.normalize(path2)).toBe(path.normalize(expected2));
      expect(path1).not.toBe(path2);
    });

    it('should handle special characters in path segments', () => {
      const specialChars = ['spaces in name', 'special-chars_123', 'dots.and.more.dots'];
      const relativePath = PathResolver.getRelativePath(...specialChars);
      const expected = path.join(process.cwd(), ...specialChars);

      expect(relativePath).toBe(expected);
    });

    it('should handle nested relative path segments', () => {
      const relativePath = PathResolver.getRelativePath('..', 'sibling-folder', 'file.txt');
      const expected = path.join(process.cwd(), '..', 'sibling-folder', 'file.txt');

      expect(relativePath).toBe(expected);
    });
  });

  describe('getDocsPath', () => {
    it('should return docs directory relative to current working directory', () => {
      const docsPath = PathResolver.getDocsPath();
      const expected = path.join(process.cwd(), 'docs');

      expect(docsPath).toBe(expected);
    });

    it('should update when working directory changes', () => {
      const initialDocsPath = PathResolver.getDocsPath();

      process.chdir(testDir);
      const newDocsPath = PathResolver.getDocsPath();

      // More flexible comparison that handles symlinks
      expect(path.normalize(newDocsPath)).toBe(path.normalize(path.join(testDir, 'docs')));
      expect(newDocsPath).not.toBe(initialDocsPath);
    });

    it('should use platform-appropriate path separators', () => {
      const docsPath = PathResolver.getDocsPath();

      if (process.platform === 'win32') {
        expect(docsPath).toContain('\\');
      } else {
        expect(docsPath).toContain('/');
      }
    });
  });

  describe('getBestPracticesPath', () => {
    it('should return best-practices directory relative to current working directory', () => {
      const bestPracticesPath = PathResolver.getBestPracticesPath();
      const expected = path.join(process.cwd(), 'docs', 'best-practices');

      expect(bestPracticesPath).toBe(expected);
    });

    it('should update when working directory changes', () => {
      const initialPath = PathResolver.getBestPracticesPath();

      process.chdir(testDir);
      const newPath = PathResolver.getBestPracticesPath();

      // More flexible comparison
      expect(path.normalize(newPath)).toBe(path.normalize(path.join(testDir, 'docs', 'best-practices')));
      expect(newPath).not.toBe(initialPath);
    });

    it('should contain docs as parent directory', () => {
      const bestPracticesPath = PathResolver.getBestPracticesPath();
      const docsPath = PathResolver.getDocsPath();

      expect(bestPracticesPath).toContain('docs');
      expect(path.dirname(bestPracticesPath)).toBe(docsPath);
    });

    it('should use platform-appropriate path separators', () => {
      const bestPracticesPath = PathResolver.getBestPracticesPath();

      if (process.platform === 'win32') {
        expect(bestPracticesPath).toContain('\\');
      } else {
        expect(bestPracticesPath).toContain('/');
      }
    });
  });

  describe('Cross-platform compatibility', () => {
    it('should work consistently across different platforms', () => {
      const docsPath = PathResolver.getDocsPath();
      const bestPracticesPath = PathResolver.getBestPracticesPath();
      const customPath = PathResolver.getRelativePath('custom', 'folder');

      // All paths should be absolute
      expect(path.isAbsolute(docsPath)).toBe(true);
      expect(path.isAbsolute(bestPracticesPath)).toBe(true);
      expect(path.isAbsolute(customPath)).toBe(true);

      // All paths should start with current working directory
      const cwd = PathResolver.getCurrentWorkingDir();
      expect(docsPath.startsWith(cwd)).toBe(true);
      expect(bestPracticesPath.startsWith(cwd)).toBe(true);
      expect(customPath.startsWith(cwd)).toBe(true);
    });

    it('should handle path normalization correctly', () => {
      const pathWithDoubleSlashes = PathResolver.getRelativePath('docs//best-practices');
      const normalPath = PathResolver.getRelativePath('docs', 'best-practices');

      // Both should resolve to the same normalized path
      expect(path.normalize(pathWithDoubleSlashes)).toBe(path.normalize(normalPath));
    });
  });

  describe('Integration with path module', () => {
    it('should be compatible with Node.js path utilities', () => {
      const docsPath = PathResolver.getDocsPath();

      // Should work with path.basename
      expect(path.basename(docsPath)).toBe('docs');

      // Should work with path.dirname
      expect(path.dirname(docsPath)).toBe(PathResolver.getCurrentWorkingDir());

      // Should work with path.extname (no extension for directories)
      expect(path.extname(docsPath)).toBe('');
    });

    it('should work with path.relative', () => {
      const docsPath = PathResolver.getDocsPath();
      const bestPracticesPath = PathResolver.getBestPracticesPath();

      const relativePath = path.relative(docsPath, bestPracticesPath);
      expect(relativePath).toBe('best-practices');
    });

    it('should work with path.resolve', () => {
      const customPath = PathResolver.getRelativePath('test', 'file.txt');
      const resolvedPath = path.resolve(customPath);

      // Should already be absolute, so resolve shouldn't change it
      expect(resolvedPath).toBe(customPath);
    });
  });

  describe('Static method behavior', () => {
    it('should not require class instantiation', () => {
      // All methods should be static and work without creating an instance
      expect(() => {
        PathResolver.getCurrentWorkingDir();
        PathResolver.getRelativePath('test');
        PathResolver.getDocsPath();
        PathResolver.getBestPracticesPath();
      }).not.toThrow();
    });

    it('should be consistent across multiple calls', () => {
      const cwd1 = PathResolver.getCurrentWorkingDir();
      const cwd2 = PathResolver.getCurrentWorkingDir();
      expect(cwd1).toBe(cwd2);

      const docs1 = PathResolver.getDocsPath();
      const docs2 = PathResolver.getDocsPath();
      expect(docs1).toBe(docs2);

      const bp1 = PathResolver.getBestPracticesPath();
      const bp2 = PathResolver.getBestPracticesPath();
      expect(bp1).toBe(bp2);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should throw error for null parameters in getRelativePath', () => {
      // path.join() throws when given null/undefined, which is correct behavior
      expect(() => {
        // @ts-ignore - Testing runtime behavior
        PathResolver.getRelativePath(null);
      }).toThrow('The "path" argument must be of type string');

      expect(() => {
        // @ts-ignore - Testing runtime behavior
        PathResolver.getRelativePath(undefined);
      }).toThrow();
    });

    it('should handle very long path segments', () => {
      const longSegment = 'a'.repeat(100);
      const longPath = PathResolver.getRelativePath(longSegment, longSegment);

      expect(longPath).toContain(longSegment);
      expect(typeof longPath).toBe('string');
    });

    it('should handle paths with various special characters', () => {
      const specialPaths = [
        'path with spaces',
        'path-with-dashes',
        'path_with_underscores',
        'path.with.dots',
        'path123with456numbers'
      ];

      specialPaths.forEach(specialPath => {
        expect(() => {
          PathResolver.getRelativePath(specialPath);
        }).not.toThrow();
      });
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should generate correct paths for SFCC documentation structure', () => {
      const dwCatalogPath = PathResolver.getRelativePath('docs', 'dw_catalog');
      const productMdPath = PathResolver.getRelativePath('docs', 'dw_catalog', 'Product.md');
      const hookGuidePath = PathResolver.getRelativePath('docs', 'best-practices', 'ocapi_hooks.md');

      expect(dwCatalogPath).toContain('docs');
      expect(dwCatalogPath).toContain('dw_catalog');

      expect(productMdPath).toContain('Product.md');
      expect(path.basename(productMdPath)).toBe('Product.md');

      expect(hookGuidePath).toContain('best-practices');
      expect(hookGuidePath).toContain('ocapi_hooks.md');
    });

    it('should work with different project structures', () => {
      // Simulate different project layouts
      const srcPath = PathResolver.getRelativePath('src', 'main.ts');
      const testPath = PathResolver.getRelativePath('tests', 'unit', 'test.spec.ts');
      const configPath = PathResolver.getRelativePath('config', 'development.json');

      expect(srcPath).toContain('src');
      expect(testPath).toContain('tests');
      expect(configPath).toContain('config');

      // All should be absolute paths
      expect(path.isAbsolute(srcPath)).toBe(true);
      expect(path.isAbsolute(testPath)).toBe(true);
      expect(path.isAbsolute(configPath)).toBe(true);
    });
  });
});
