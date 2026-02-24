import { WorkspaceRootsService, validateDwJsonPath } from '../src/config/workspace-roots.js';
import { existsSync, mkdirSync, rmSync, writeFileSync, realpathSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { pathToFileURL } from 'url';

describe('WorkspaceRootsService', () => {
  // Get raw temp dir path first
  const rawTestDir = join(tmpdir(), 'sfcc-workspace-roots-tests');
  let testDir: string;

  beforeAll(() => {
    // Create test directory structure
    if (!existsSync(rawTestDir)) {
      mkdirSync(rawTestDir, { recursive: true });
    }
    // Now we can safely get the real path (resolves macOS /var -> /private/var symlink)
    testDir = realpathSync(rawTestDir);
  });

  afterAll(() => {
    // Clean up test directory
    try {
      rmSync(rawTestDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('updateRoots', () => {
    it('should validate and accept valid file URIs', () => {
      const service = new WorkspaceRootsService();
      const uri = pathToFileURL(testDir).href;

      const roots = service.updateRoots([{ uri, name: 'Test Root' }]);

      expect(roots).toHaveLength(1);
      expect(roots[0].name).toBe('Test Root');
      expect(roots[0].path).toBe(testDir);
    });

    it('should reject non-file URIs', () => {
      const service = new WorkspaceRootsService();

      const roots = service.updateRoots([
        { uri: 'https://example.com/path' },
        { uri: 'ftp://server/path' },
      ]);

      expect(roots).toHaveLength(0);
    });

    it('should reject URIs with null bytes', () => {
      const service = new WorkspaceRootsService();

      const roots = service.updateRoots([{ uri: 'file:///path/with\0null' }]);

      expect(roots).toHaveLength(0);
    });

    it('should reject system directory paths', () => {
      const service = new WorkspaceRootsService();

      const roots = service.updateRoots([
        { uri: 'file:///etc/passwd' },
        { uri: 'file:///proc/self' },
        { uri: 'file:///sys/kernel' },
      ]);

      expect(roots).toHaveLength(0);
    });

    it('should reject sensitive hidden directories under allowed roots', () => {
      const service = new WorkspaceRootsService();
      const sensitiveDir = join(testDir, '.ssh');
      mkdirSync(sensitiveDir, { recursive: true });

      const roots = service.updateRoots([
        { uri: pathToFileURL(sensitiveDir).href },
      ]);

      expect(roots).toHaveLength(0);
    });

    it('should handle multiple roots correctly', () => {
      const service = new WorkspaceRootsService();
      const subDir = join(testDir, 'subproject');
      mkdirSync(subDir, { recursive: true });

      const roots = service.updateRoots([
        { uri: pathToFileURL(testDir).href, name: 'Main' },
        { uri: pathToFileURL(subDir).href, name: 'Sub' },
      ]);

      expect(roots).toHaveLength(2);
      expect(roots.map(r => r.name)).toEqual(['Main', 'Sub']);
    });
  });

  describe('findFile', () => {
    it('should find dw.json in root directory', () => {
      const service = new WorkspaceRootsService();
      const dwJsonPath = join(testDir, 'dw.json');
      writeFileSync(dwJsonPath, JSON.stringify({ hostname: 'test.com', username: 'user', password: 'pass' }));

      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      const found = service.findFile('dw.json');
      expect(found).toBe(dwJsonPath);

      // Clean up for next test
      rmSync(dwJsonPath);
    });

    it('should find dw.json in allowed subdirectories', () => {
      const service = new WorkspaceRootsService();
      const configDir = join(testDir, 'config');
      mkdirSync(configDir, { recursive: true });
      const dwJsonPath = join(configDir, 'dw.json');
      writeFileSync(dwJsonPath, JSON.stringify({ hostname: 'test.com', username: 'user', password: 'pass' }));

      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      const found = service.findFile('dw.json', 2);
      expect(found).toBe(dwJsonPath);

      // Clean up
      rmSync(dwJsonPath);
    });

    it('should reject filenames with path traversal attempts', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      expect(service.findFile('../dw.json')).toBeUndefined();
      expect(service.findFile('path/to/dw.json')).toBeUndefined();
      expect(service.findFile('..\\dw.json')).toBeUndefined();
    });

    it('should return undefined when file not found', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      const found = service.findFile('nonexistent.json');
      expect(found).toBeUndefined();
    });
  });

  describe('isPathWithinRoots', () => {
    it('should return true for paths within workspace roots', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      // Use realpath to ensure consistent comparison (handles macOS /var symlink)
      const filePath = join(testDir, 'some', 'nested', 'file.json');
      const result = service.isPathWithinRoots(filePath);
      expect(result).toBe(true);
    });

    it('should return false for paths outside workspace roots', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      expect(service.isPathWithinRoots('/etc/passwd')).toBe(false);
    });

    it('should return true for the root path itself', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      expect(service.isPathWithinRoots(testDir)).toBe(true);
    });
  });

  describe('getRoots', () => {
    it('should return a copy of the roots array', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      const roots1 = service.getRoots();
      const roots2 = service.getRoots();

      expect(roots1).not.toBe(roots2);
      expect(roots1).toEqual(roots2);
    });
  });

  describe('clear', () => {
    it('should remove all roots', () => {
      const service = new WorkspaceRootsService();
      service.updateRoots([{ uri: pathToFileURL(testDir).href }]);

      expect(service.getRoots()).toHaveLength(1);

      service.clear();

      expect(service.getRoots()).toHaveLength(0);
    });
  });
});

describe('validateDwJsonPath', () => {
  // Get raw temp dir path first
  const rawTestDir = join(tmpdir(), 'sfcc-dw-json-validation-tests');
  let testDir: string;

  beforeAll(() => {
    if (!existsSync(rawTestDir)) {
      mkdirSync(rawTestDir, { recursive: true });
    }
    // Now we can safely get the real path (resolves macOS /var -> /private/var symlink)
    testDir = realpathSync(rawTestDir);
  });

  afterAll(() => {
    try {
      rmSync(rawTestDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should accept valid paths in allowed directories', () => {
    const result = validateDwJsonPath(join(testDir, 'dw.json'));
    expect(result.isValid).toBe(true);
  });

  it('should reject non-json files', () => {
    const result = validateDwJsonPath(join(testDir, 'config.txt'));
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject system directory paths', () => {
    const result = validateDwJsonPath('/etc/dw.json');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject dw.json paths inside sensitive hidden directories', () => {
    const sensitiveDir = join(testDir, '.aws');
    mkdirSync(sensitiveDir, { recursive: true });

    const result = validateDwJsonPath(join(sensitiveDir, 'dw.json'));
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
