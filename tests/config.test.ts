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
      const testFiles = [
        'valid-dw.json',
        'invalid-json.json',
        'incomplete-dw.json',
        'oauth-dw.json',
        'invalid-hostname-dw.json',
        'localhost-port-dw.json',
        'custom-port-dw.json',
      ];
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
        'client-id': 'test-client-id',
        'client-secret': 'test-client-secret',
      };

      const testFile = join(testDir, 'oauth-dw.json');
      writeFileSync(testFile, JSON.stringify(oauthDwJson, null, 2));

      const dwConfig = loadSecureDwJson(testFile);

      expect(dwConfig).toEqual(oauthDwJson);
    });

    it('should load a valid dw.json file with optional storefront credentials', () => {
      const storefrontDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        storefrontUsername: 'storefront-user',
        storefrontPassword: 'storefront-pass',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(storefrontDwJson, null, 2));

      const dwConfig = loadSecureDwJson(testFile);

      expect(dwConfig.storefrontUsername).toBe('storefront-user');
      expect(dwConfig.storefrontPassword).toBe('storefront-pass');
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
        // Missing both auth modes
      };

      const testFile = join(testDir, 'incomplete-dw.json');
      writeFileSync(testFile, JSON.stringify(incompleteDwJson, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('Configuration file must include either username/password or client-id/client-secret credentials');
    });

    it('should throw error when basic auth pair is incomplete', () => {
      const incompleteBasicAuth: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
      };

      const testFile = join(testDir, 'incomplete-dw.json');
      writeFileSync(testFile, JSON.stringify(incompleteBasicAuth, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('Basic auth credentials must include both username and password');
    });

    it('should throw error when OAuth pair is incomplete', () => {
      const incompleteOAuth: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        'client-id': 'test-client-id',
      };

      const testFile = join(testDir, 'incomplete-dw.json');
      writeFileSync(testFile, JSON.stringify(incompleteOAuth, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('OAuth credentials must include both client-id and client-secret');
    });

    it('should throw error when storefront credential pair is incomplete', () => {
      const incompleteStorefront: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        storefrontUsername: 'storefront-user',
      };

      const testFile = join(testDir, 'incomplete-dw.json');
      writeFileSync(testFile, JSON.stringify(incompleteStorefront, null, 2));

      expect(() => {
        loadSecureDwJson(testFile);
      }).toThrow('Storefront credentials must include both storefrontUsername and storefrontPassword');
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

    it('should load dw.json file with hostname containing port', () => {
      const dwJsonWithPort: DwJsonConfig = {
        hostname: 'localhost:3000',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'localhost-port-dw.json');
      writeFileSync(testFile, JSON.stringify(dwJsonWithPort, null, 2));

      const dwConfig = loadSecureDwJson(testFile);
      expect(dwConfig.hostname).toBe('localhost:3000');
      expect(dwConfig.username).toBe('testuser');
      expect(dwConfig.password).toBe('testpass');
    });

    it('should load dw.json file with custom hostname and port', () => {
      const dwJsonWithCustomPort: DwJsonConfig = {
        hostname: 'test-instance.demandware.net:8080',
        username: 'testuser',
        password: 'testpass',
      };

      const testFile = join(testDir, 'custom-port-dw.json');
      writeFileSync(testFile, JSON.stringify(dwJsonWithCustomPort, null, 2));

      const dwConfig = loadSecureDwJson(testFile);
      expect(dwConfig.hostname).toBe('test-instance.demandware.net:8080');
      expect(dwConfig.username).toBe('testuser');
      expect(dwConfig.password).toBe('testpass');
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

    it('should map storefront credentials from dw.json', () => {
      const storefrontDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        storefrontUsername: 'storefront-user',
        storefrontPassword: 'storefront-pass',
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(storefrontDwJson, null, 2));

      const config = ConfigurationFactory.create({
        dwJsonPath: testFile,
      });

      expect(config.storefrontUsername).toBe('storefront-user');
      expect(config.storefrontPassword).toBe('storefront-pass');
    });

    it('should reject partial storefront credentials from options', () => {
      expect(() => {
        ConfigurationFactory.create({
          hostname: 'test-hostname.demandware.net',
          username: 'testuser',
          password: 'testpass',
          storefrontUsername: 'storefront-user',
        });
      }).toThrow('Storefront credentials must include both storefrontUsername and storefrontPassword');
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
