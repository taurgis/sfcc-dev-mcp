import { loadDwJsonConfig, validateConfig } from '../src/config';
import { SFCCConfig, DwJsonConfig } from '../src/types';
import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { tmpdir } from 'os';

describe('config.ts', () => {
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
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  describe('loadDwJsonConfig', () => {
    it('should load a valid dw.json file with basic auth', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'test-instance.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': '',
        'client-secret': ''
      };

      const testFile = join(testDir, 'valid-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      const config = loadDwJsonConfig(testFile);

      expect(config.hostname).toBe('test-instance.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBeUndefined();
      expect(config.clientSecret).toBeUndefined();
    });

    it('should load a valid dw.json file with OAuth credentials', () => {
      const oauthDwJson: DwJsonConfig = {
        hostname: 'oauth-instance.demandware.net',
        username: 'oauthuser',
        password: 'oauthpass',
        'client-id': 'test-client-id',
        'client-secret': 'test-client-secret'
      };

      const testFile = join(testDir, 'oauth-dw.json');
      writeFileSync(testFile, JSON.stringify(oauthDwJson, null, 2));

      const config = loadDwJsonConfig(testFile);

      expect(config.hostname).toBe('oauth-instance.demandware.net');
      expect(config.username).toBe('oauthuser');
      expect(config.password).toBe('oauthpass');
      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
    });

    it('should resolve relative paths correctly', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'relative-test.demandware.net',
        username: 'relativeuser',
        password: 'relativepass',
        'client-id': '',
        'client-secret': ''
      };

      const testFile = join(testDir, 'relative-dw.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      // Use a relative path
      const relativePath = './relative-dw.json';
      const originalCwd = process.cwd();

      try {
        process.chdir(testDir);
        const config = loadDwJsonConfig(relativePath);
        expect(config.hostname).toBe('relative-test.demandware.net');
      } finally {
        process.chdir(originalCwd);
        unlinkSync(testFile);
      }
    });

    it('should throw error when file does not exist', () => {
      const nonExistentFile = join(testDir, 'non-existent.json');

      expect(() => {
        loadDwJsonConfig(nonExistentFile);
      }).toThrow(`dw.json file not found at: ${resolve(nonExistentFile)}`);
    });

    it('should throw error for invalid JSON', () => {
      const invalidJsonFile = join(testDir, 'invalid-json.json');
      writeFileSync(invalidJsonFile, '{ invalid json content }');

      expect(() => {
        loadDwJsonConfig(invalidJsonFile);
      }).toThrow(/Invalid JSON in dw\.json file:/);
    });

    it('should throw error when hostname is missing', () => {
      const incompleteConfig = {
        username: 'testuser',
        password: 'testpass'
        // hostname missing
      };

      const testFile = join(testDir, 'no-hostname.json');
      writeFileSync(testFile, JSON.stringify(incompleteConfig));

      expect(() => {
        loadDwJsonConfig(testFile);
      }).toThrow('dw.json must contain hostname, username, and password fields');

      unlinkSync(testFile);
    });

    it('should throw error when username is missing', () => {
      const incompleteConfig = {
        hostname: 'test.demandware.net',
        password: 'testpass'
        // username missing
      };

      const testFile = join(testDir, 'no-username.json');
      writeFileSync(testFile, JSON.stringify(incompleteConfig));

      expect(() => {
        loadDwJsonConfig(testFile);
      }).toThrow('dw.json must contain hostname, username, and password fields');

      unlinkSync(testFile);
    });

    it('should throw error when password is missing', () => {
      const incompleteConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser'
        // password missing
      };

      const testFile = join(testDir, 'no-password.json');
      writeFileSync(testFile, JSON.stringify(incompleteConfig));

      expect(() => {
        loadDwJsonConfig(testFile);
      }).toThrow('dw.json must contain hostname, username, and password fields');

      unlinkSync(testFile);
    });

    it('should handle empty client-id and client-secret gracefully', () => {
      const configWithEmptyOAuth: DwJsonConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': '',
        'client-secret': ''
      };

      const testFile = join(testDir, 'empty-oauth.json');
      writeFileSync(testFile, JSON.stringify(configWithEmptyOAuth));

      const config = loadDwJsonConfig(testFile);

      expect(config.hostname).toBe('test.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBeUndefined();
      expect(config.clientSecret).toBeUndefined();

      unlinkSync(testFile);
    });

    it('should handle partial OAuth credentials (only client-id)', () => {
      const configWithPartialOAuth: DwJsonConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser',
        password: 'testpass',
        'client-id': 'only-client-id',
        'client-secret': ''
      };

      const testFile = join(testDir, 'partial-oauth.json');
      writeFileSync(testFile, JSON.stringify(configWithPartialOAuth));

      const config = loadDwJsonConfig(testFile);

      expect(config.hostname).toBe('test.demandware.net');
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
      expect(config.clientId).toBeUndefined();
      expect(config.clientSecret).toBeUndefined();

      unlinkSync(testFile);
    });

    it('should re-throw non-SyntaxError exceptions', () => {
      // Create a real file first
      const testFile = join(testDir, 'test-for-error.json');
      writeFileSync(testFile, '{"test": "data"}');

      // Mock readFileSync to throw a different error
      jest.spyOn(require('fs'), 'readFileSync').mockImplementation(() => {
        throw new Error('File system error');
      });

      expect(() => {
        loadDwJsonConfig(testFile);
      }).toThrow('File system error');

      // Clean up
      unlinkSync(testFile);
    });
  });

  describe('validateConfig', () => {
    it('should pass validation with valid basic auth config', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser',
        password: 'testpass'
      };

      expect(() => {
        validateConfig(config);
      }).not.toThrow();
    });

    it('should pass validation with valid OAuth config', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      };

      expect(() => {
        validateConfig(config);
      }).not.toThrow();
    });

    it('should pass validation with both basic auth and OAuth', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser',
        password: 'testpass',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      };

      expect(() => {
        validateConfig(config);
      }).not.toThrow();
    });

    it('should throw error when hostname is missing', () => {
      const config: SFCCConfig = {
        username: 'testuser',
        password: 'testpass'
      } as SFCCConfig; // Type assertion to bypass TypeScript checking

      expect(() => {
        validateConfig(config);
      }).toThrow('Hostname is required');
    });

    it('should throw error when hostname is empty string', () => {
      const config: SFCCConfig = {
        hostname: '',
        username: 'testuser',
        password: 'testpass'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Hostname is required');
    });

    it('should throw error when no authentication credentials are provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should throw error when only username is provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should throw error when only password is provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        password: 'testpass'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should throw error when only clientId is provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        clientId: 'test-client-id'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should throw error when only clientSecret is provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        clientSecret: 'test-client-secret'
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should handle empty string credentials correctly', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: '',
        password: '',
        clientId: '',
        clientSecret: ''
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });

    it('should handle undefined vs empty string credentials', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: undefined,
        password: '',
        clientId: '',
        clientSecret: undefined
      };

      expect(() => {
        validateConfig(config);
      }).toThrow('Either username/password or clientId/clientSecret must be provided');
    });
  });

  describe('Integration tests', () => {
    it('should load and validate a complete workflow', () => {
      const validDwJson: DwJsonConfig = {
        hostname: 'integration-test.demandware.net',
        username: 'integrationuser',
        password: 'integrationpass',
        'client-id': 'integration-client-id',
        'client-secret': 'integration-client-secret'
      };

      const testFile = join(testDir, 'integration-test.json');
      writeFileSync(testFile, JSON.stringify(validDwJson, null, 2));

      // Load config
      const config = loadDwJsonConfig(testFile);

      // Validate config
      expect(() => {
        validateConfig(config);
      }).not.toThrow();

      // Verify all fields are properly mapped
      expect(config.hostname).toBe('integration-test.demandware.net');
      expect(config.username).toBe('integrationuser');
      expect(config.password).toBe('integrationpass');
      expect(config.clientId).toBe('integration-client-id');
      expect(config.clientSecret).toBe('integration-client-secret');

      unlinkSync(testFile);
    });

    it('should handle edge case with whitespace in JSON', () => {
      const dwJsonWithWhitespace = `
        {
          "hostname": "  whitespace-test.demandware.net  ",
          "username": "  whitespaceuser  ",
          "password": "  whitespacepass  "
        }
      `;

      const testFile = join(testDir, 'whitespace-test.json');
      writeFileSync(testFile, dwJsonWithWhitespace);

      const config = loadDwJsonConfig(testFile);

      // Values should include whitespace as JSON.parse preserves it
      expect(config.hostname).toBe('  whitespace-test.demandware.net  ');
      expect(config.username).toBe('  whitespaceuser  ');
      expect(config.password).toBe('  whitespacepass  ');

      // But validation should still pass
      expect(() => {
        validateConfig(config);
      }).not.toThrow();

      unlinkSync(testFile);
    });
  });
});
