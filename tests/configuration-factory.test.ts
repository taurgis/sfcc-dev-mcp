import { ConfigurationFactory } from '../src/configuration-factory';
import { SFCCConfig } from '../src/types';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('ConfigurationFactory', () => {
  const testDir = join(tmpdir(), 'sfcc-config-factory-tests');

  beforeAll(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    try {
      const testFiles = ['valid-dw.json', 'invalid-dw.json', 'missing-dw.json'];
      testFiles.forEach(file => {
        const filePath = join(testDir, file);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('create', () => {
    it('should create configuration from dw.json file', () => {
      const dwJsonContent = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': 'test-client-id',
        'client-secret': 'test-client-secret'
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(dwJsonContent, null, 2));

      const config = ConfigurationFactory.create({ dwJsonPath: testFile });

      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
    });

    it('should throw an error if dw.json file is invalid', () => {
      const testFile = join(testDir, 'invalid-dw.json');
      writeFileSync(testFile, '{ invalid json }');

      expect(() => {
        ConfigurationFactory.create({ dwJsonPath: testFile });
      }).toThrow(/Invalid JSON in dw\.json file:/);
    });

    it('should throw an error if dw.json file is missing', () => {
      const testFile = join(testDir, 'missing-dw.json');

      expect(() => {
        ConfigurationFactory.create({ dwJsonPath: testFile });
      }).toThrow(/dw\.json file not found at:/);
    });

    it('should create configuration from provided options', () => {
      const config = ConfigurationFactory.create({
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        siteId: 'test-site'
      });

      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
      expect(config.siteId).toBe('test-site');
    });

    it('should validate configuration and throw error for missing hostname', () => {
      expect(() => {
        ConfigurationFactory.create({ username: 'testuser', password: 'testpass' });
      }).toThrow('Hostname is required');
    });

    it('should validate configuration and throw error for missing credentials', () => {
      expect(() => {
        ConfigurationFactory.create({ hostname: 'test-instance.demandware.net' });
      }).toThrow('Either username/password or OAuth credentials (clientId/clientSecret) must be provided');
    });
  });

  describe('getCapabilities', () => {
    it('should return correct capabilities for basic auth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass'
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(false);
      expect(capabilities.canAccessWebDAV).toBe(true);
    });

    it('should return correct capabilities for OAuth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(true);
      expect(capabilities.canAccessWebDAV).toBe(true);
    });

    it('should return correct capabilities for both basic auth and OAuth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(true);
      expect(capabilities.canAccessWebDAV).toBe(true);
    });

    it('should return false capabilities for empty config', () => {
        const config: SFCCConfig = {};

        const capabilities = ConfigurationFactory.getCapabilities(config);

        expect(capabilities.canAccessLogs).toBe(false);
        expect(capabilities.canAccessOCAPI).toBe(false);
        expect(capabilities.canAccessWebDAV).toBe(false);
    });
  });
});
