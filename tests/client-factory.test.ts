import { ClientFactory } from '../src/core/handlers/client-factory.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';
import { SFCCConfig } from '../src/types/types.js';

// Mock the clients
jest.mock('../src/clients/log-client.js');
jest.mock('../src/clients/ocapi-client.js');
jest.mock('../src/clients/ocapi/code-versions-client.js');
jest.mock('../src/clients/cartridge-generation-client.js');

describe('ClientFactory', () => {
  let mockLogger: jest.Mocked<Logger>;
  let factory: ClientFactory;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
    } as any;
  });

  describe('createLogClient', () => {
    it('should create log client when capabilities and config are available', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: { hostname: 'test.com' } as SFCCConfig,
        capabilities: {
          canAccessLogs: true,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createLogClient();

      expect(client).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating SFCC Log Client');
    });

    it('should return null when log access capability is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: { hostname: 'test.com' } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createLogClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('Log client not created: missing log access capability or config');
    });

    it('should return null when config is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: undefined as any,
        capabilities: {
          canAccessLogs: true,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createLogClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('Log client not created: missing log access capability or config');
    });
  });

  describe('createOCAPIClient', () => {
    it('should create OCAPI client when all credentials are available', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
          clientId: 'client123',
          clientSecret: 'secret123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createOCAPIClient();

      expect(client).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating OCAPI Client');
    });

    it('should return null when OCAPI capability is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
          clientId: 'client123',
          clientSecret: 'secret123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createOCAPIClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI client not created: missing OCAPI credentials or capability');
    });

    it('should return null when hostname is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          clientId: 'client123',
          clientSecret: 'secret123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createOCAPIClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI client not created: missing OCAPI credentials or capability');
    });

    it('should return null when clientId is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
          clientSecret: 'secret123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createOCAPIClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI client not created: missing OCAPI credentials or capability');
    });

    it('should return null when clientSecret is missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
          clientId: 'client123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createOCAPIClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI client not created: missing OCAPI credentials or capability');
    });
  });

  describe('createCodeVersionsClient', () => {
    it('should create code versions client when all credentials are available', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
          clientId: 'client123',
          clientSecret: 'secret123',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createCodeVersionsClient();

      expect(client).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating OCAPI Code Versions Client');
    });

    it('should return null when credentials are missing', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {
          hostname: 'test.com',
        } as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: true,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createCodeVersionsClient();

      expect(client).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('Code versions client not created: missing OCAPI credentials or capability');
    });
  });

  describe('createCartridgeClient', () => {
    it('should create cartridge client with default services', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {} as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const client = factory.createCartridgeClient();

      expect(client).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating Cartridge Generation Client');
    });

    it('should create cartridge client with custom services', () => {
      const context: HandlerContext = {
        logger: mockLogger,
        config: {} as SFCCConfig,
        capabilities: {
          canAccessLogs: false,
          canAccessOCAPI: false,
        },
      };
      factory = new ClientFactory(context, mockLogger);

      const mockFileSystem = { writeFile: jest.fn() } as any;
      const mockPath = { join: jest.fn() } as any;

      const client = factory.createCartridgeClient(mockFileSystem, mockPath);

      expect(client).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating Cartridge Generation Client');
    });
  });

  describe('getClientRequiredError', () => {
    it('should return OCAPI error message', () => {
      const error = ClientFactory.getClientRequiredError('OCAPI');
      expect(error).toBe('OCAPI client not configured - ensure credentials are provided in full mode.');
    });

    it('should return Log error message', () => {
      const error = ClientFactory.getClientRequiredError('Log');
      expect(error).toBe('Log client not configured - ensure log access is enabled.');
    });

    it('should return default error message for unknown client type', () => {
      const error = ClientFactory.getClientRequiredError('Unknown' as any);
      expect(error).toBe('Required client not configured.');
    });
  });
});
