import { loadSecureDwJson } from '../src/config/dw-json-loader.js';
import { ConfigurationFactory } from '../src/config/configuration-factory.js';
import { DwJsonConfig } from '../src/types/types.js';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('dw-json-loader.ts and configuration-factory.ts', () => {
  // Create a temporary directory for test files
  const testDir = join(tmpdir(), 'sfcc-config-tests');

  beforeAll(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test files
    try {
      const testFiles = ['valid-dw.json', 'invalid-json.json', 'incomplete-dw.json', 'oauth-dw.json'];
      testFiles.forEach(file => {
        const filePath = join(testDir, file);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      });
    } catch {
      // Ignore cleanup errors
    }
  });

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  describe('loadSecureDwJson', () => {
    it('should load a valid dw.json file with basic auth', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': '',
        'client-secret': '',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      const dwConfig = loadSecureDwJson(testFile);

      expect(dwConfig).toEqual(validDwJson);
    });

    it('should load a valid dw.json file with OAuth credentials', () => {
      const oauthDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': 'test-client-id',
        'client-secret': 'test-client-secret',
      };

      const testFile = join(testDir, 'oauth-dw.json');
      writeFileSync(testFile, JSON.stringify(oauthDwJson, null, 2));

      const dwConfig = loadSecureDwJson(testFile);

      expect(dwConfig).toEqual(oauthDwJson);
    });

    it('should handle relative paths correctly', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      // Test with the actual test file path (not relative)
      const dwConfig = loadSecureDwJson(testFile);
      expect(dwConfig.hostname).toBe('test-instance.demandware.net');
    });

    it('should throw error for non-existent file', () => {
      const nonExistentFile = join(testDir, 'non-existent.json');
      expect(() => {
        loadSecureDwJson(nonExistentFile);
      }).toThrow('Configuration file not found');
    });

    it('should throw error for invalid JSON', () => {
      const invalidJsonFile = join(testDir, 'invalid-json.json');
      writeFileSync(invalidJsonFile, '{ invalid json }');

      expect(() => {
        loadSecureDwJson(invalidJsonFile);
      }).toThrow('Invalid JSON in configuration file');
    });

    it('should throw error for incomplete configuration', () => {
      const incompleteDwJson = {
        hostname: 'test-instance.demandware.net',
        // Missing username and password
      };

      const testFile = join(testDir, 'incomplete-dw.json');
      writeFileSync(testFile, JSON.stringify(incompleteDwJson, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('Configuration file must contain hostname, username, and password fields');
    });

    it('should throw error for invalid hostname format', () => {
      const invalidHostnameDwJson: DwJsonConfig = {
        hostname: 'invalid_hostname_with_underscores',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'invalid-hostname-dw.json');
      writeFileSync(testFile, JSON.stringify(invalidHostnameDwJson, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('Invalid hostname format in configuration');
    });
  });

  describe('ConfigurationFactory', () => {
    it('should create config from dw.json file', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      const config = ConfigurationFactory.create({
        dwJsonPath: testFile,
      });

      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should map OAuth credentials from dw.json', () => {
      const oauthDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': 'test-client-id',
        'client-secret': 'test-client-secret',
      };

      const testFile = join(testDir, 'oauth-dw.json');
      writeFileSync(testFile, JSON.stringify(oauthDwJson, null, 2));

      const config = ConfigurationFactory.create({
        dwJsonPath: testFile,
      });

      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
    });

    it('should override dw.json with command-line options', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      const config = ConfigurationFactory.create({
        dwJsonPath: testFile,
        hostname: 'override-hostname.demandware.net',
        username: 'override-user',
      });

      expect(config.hostname).toBe('override-hostname.demandware.net');
      expect(config.username).toBe('override-user');
      expect(config.password).toBe('testpass'); // Should keep from dw.json
    });

    it('should create config from options only', () => {
      const config = ConfigurationFactory.create({
        hostname: 'test-hostname.demandware.net',
        username: 'testuser',
        password: 'testpass',
      });

      expect(config.hostname).toBe('test-hostname.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should create local mode config', () => {
      const config = ConfigurationFactory.createLocalMode();

      expect(config.hostname).toBe('');
      expect(config.username).toBeUndefined();
      expect(config.password).toBeUndefined();
      expect(config.clientId).toBeUndefined();
      expect(config.clientSecret).toBeUndefined();
    });

    it('should validate configuration capabilities', () => {
      const config = ConfigurationFactory.create({
        hostname: 'test-hostname.demandware.net',
        username: 'testuser',
        password: 'testpass',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      });

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(true);
      expect(capabilities.canAccessWebDAV).toBe(true);
      expect(capabilities.isLocalMode).toBe(false);
    });

    it('should detect local mode', () => {
      const config = ConfigurationFactory.createLocalMode();
      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(false);
      expect(capabilities.canAccessOCAPI).toBe(false);
      expect(capabilities.canAccessWebDAV).toBe(false);
      expect(capabilities.isLocalMode).toBe(true);
    });

  });
});
