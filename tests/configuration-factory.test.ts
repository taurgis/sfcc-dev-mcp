import { ConfigurationFactory } from '../src/config/configuration-factory';
import { SFCCConfig } from '../src/types/types';
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        'client-secret': 'test-client-secret',
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
        siteId: 'test-site',
      });

      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
      expect(config.siteId).toBe('test-site');
    });

    it('should allow configuration without credentials for local mode', () => {
      const config = ConfigurationFactory.create({});
      expect(config.hostname).toBe('');
      expect(config.username).toBeUndefined();
      expect(config.password).toBeUndefined();
      expect(config.clientId).toBeUndefined();
      expect(config.clientSecret).toBeUndefined();
    });

    it('should validate configuration and throw error for hostname without credentials', () => {
      expect(() => {
        ConfigurationFactory.create({ hostname: 'test-instance.demandware.net' });
      }).toThrow('When hostname is provided, either username/password or OAuth credentials (clientId/clientSecret) must be provided');
    });

    it('should validate configuration and allow hostname with basic auth', () => {
      const config = ConfigurationFactory.create({
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
      });
      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should validate configuration and allow hostname with OAuth', () => {
      const config = ConfigurationFactory.create({
        hostname: 'test-instance.demandware.net',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      });
      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
    });
  });

  describe('getCapabilities', () => {
    it('should return correct capabilities for basic auth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(false);
      expect(capabilities.canAccessWebDAV).toBe(true);
      expect(capabilities.isLocalMode).toBe(false);
    });

    it('should return correct capabilities for OAuth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(true);
      expect(capabilities.canAccessWebDAV).toBe(true);
      expect(capabilities.isLocalMode).toBe(false);
    });

    it('should return correct capabilities for both basic auth and OAuth', () => {
      const config: SFCCConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(true);
      expect(capabilities.canAccessOCAPI).toBe(true);
      expect(capabilities.canAccessWebDAV).toBe(true);
      expect(capabilities.isLocalMode).toBe(false);
    });

    it('should return local mode capabilities for empty config', () => {
      const config: SFCCConfig = {};

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(false);
      expect(capabilities.canAccessOCAPI).toBe(false);
      expect(capabilities.canAccessWebDAV).toBe(false);
      expect(capabilities.isLocalMode).toBe(true);
    });

    it('should return local mode capabilities for config without hostname', () => {
      const config: SFCCConfig = {
        hostname: '',
        username: undefined,
        password: undefined,
      };

      const capabilities = ConfigurationFactory.getCapabilities(config);

      expect(capabilities.canAccessLogs).toBe(false);
      expect(capabilities.canAccessOCAPI).toBe(false);
      expect(capabilities.canAccessWebDAV).toBe(false);
      expect(capabilities.isLocalMode).toBe(true);
    });
  });
});
