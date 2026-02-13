import { CodeVersionToolHandler } from '../src/core/handlers/code-version-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock the OCAPICodeVersionsClient
const mockCodeVersionsClient = {
  getCodeVersions: jest.fn(),
  activateCodeVersion: jest.fn(),
};

jest.mock('../src/clients/ocapi/code-versions-client.js', () => ({
  OCAPICodeVersionsClient: jest.fn(() => mockCodeVersionsClient),
}));

describe('CodeVersionToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockClient: typeof mockCodeVersionsClient;
  let context: HandlerContext;
  let handler: CodeVersionToolHandler;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
    } as any;

    // Reset mocks
    jest.clearAllMocks();

    // Use the mock client directly and reset it
    mockClient = mockCodeVersionsClient;
    mockClient.getCodeVersions.mockReset();
    mockClient.activateCodeVersion.mockReset();

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: {
        hostname: 'test.commercecloud.salesforce.com',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        siteId: 'test-site',
      },
      capabilities: { canAccessLogs: false, canAccessOCAPI: true },
    };

    handler = new CodeVersionToolHandler(context, 'CodeVersion');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle code version tools', () => {
      expect(handler.canHandle('get_code_versions')).toBe(true);
      expect(handler.canHandle('activate_code_version')).toBe(true);
    });

    it('should not handle non-code-version tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('initialization', () => {
    it('should initialize code versions client when OCAPI access is available', async () => {
      await initializeHandler();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).toHaveBeenCalledWith({
        hostname: 'test.commercecloud.salesforce.com',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        version: 'v23_2',
      });
      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI (Code Versions) client initialized');
    });

    it('should not initialize client when OCAPI access is not available', async () => {
      context.capabilities = { canAccessLogs: false, canAccessOCAPI: false };
      const handlerWithoutOCAPI = new CodeVersionToolHandler(context, 'CodeVersion');

      await (handlerWithoutOCAPI as any).initialize();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).not.toHaveBeenCalled();
    });

    it('should not initialize client when config is missing', async () => {
      context.config = null as any;
      const handlerWithoutConfig = new CodeVersionToolHandler(context, 'CodeVersion');

      await (handlerWithoutConfig as any).initialize();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).not.toHaveBeenCalled();
    });
  });

  describe('disposal', () => {
    it('should dispose code versions client properly', async () => {
      await initializeHandler();
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('OCAPI (Code Versions) client disposed');
    });
  });

  describe('get_code_versions tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getCodeVersions.mockResolvedValue([
        { id: 'version_1', active: true, lastModified: '2024-01-01T00:00:00Z' },
        { id: 'version_2', active: false, lastModified: '2024-01-02T00:00:00Z' },
      ]);
    });

    it('should handle get_code_versions', async () => {
      const result = await handler.handle('get_code_versions', {}, Date.now());

      expect(mockClient.getCodeVersions).toHaveBeenCalled();
      expect(result.content[0].text).toContain('version_1');
      expect(result.content[0].text).toContain('version_2');
    });
  });

  describe('activate_code_version tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.activateCodeVersion.mockResolvedValue({
        success: true,
        message: 'Code version activated successfully',
        codeVersionId: 'version_2',
      });
    });

    it('should handle activate_code_version with codeVersionId', async () => {
      const args = { codeVersionId: 'version_2' };
      const result = await handler.handle('activate_code_version', args, Date.now());

      expect(mockClient.activateCodeVersion).toHaveBeenCalledWith('version_2');
      expect(result.content[0].text).toContain('activated successfully');
    });

    it('should throw error when codeVersionId is missing', async () => {
      const result = await handler.handle('activate_code_version', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('codeVersionId must be a non-empty string');
    });

    it('should throw error when codeVersionId is empty', async () => {
      const result = await handler.handle('activate_code_version', { codeVersionId: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('codeVersionId must be a non-empty string');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockClient.getCodeVersions.mockRejectedValue(new Error('OCAPI connection failed'));

      const result = await handler.handle('get_code_versions', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('OCAPI connection failed');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });

    it('should handle OCAPI client not configured error', async () => {
      // Create handler without proper configuration
      const contextWithoutOCAPI = {
        ...context,
        capabilities: { canAccessLogs: false, canAccessOCAPI: false },
      };
      const handlerWithoutOCAPI = new CodeVersionToolHandler(contextWithoutOCAPI, 'CodeVersion');

      const result = await handlerWithoutOCAPI.handle('get_code_versions', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('OCAPI client not configured');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getCodeVersions.mockResolvedValue([]);
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('get_code_versions', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('get_code_versions', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('get_code_versions', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'get_code_versions completed',
        expect.any(Object),
      );
    });
  });

  describe('client integration', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should call getCodeVersions correctly', async () => {
      mockClient.getCodeVersions.mockResolvedValue([
        { id: 'test_version', active: false },
      ]);

      await handler.handle('get_code_versions', {}, Date.now());

      expect(mockClient.getCodeVersions).toHaveBeenCalledWith();
    });

    it('should call activateCodeVersion correctly', async () => {
      mockClient.activateCodeVersion.mockResolvedValue({
        success: true,
        codeVersionId: 'test_version',
      });

      await handler.handle('activate_code_version', { codeVersionId: 'test_version' }, Date.now());

      expect(mockClient.activateCodeVersion).toHaveBeenCalledWith('test_version');
    });
  });

  describe('configuration variations', () => {
    it('should not initialize without hostname', async () => {
      const contextWithoutHostname = {
        ...context,
        config: { ...context.config, hostname: undefined },
      };
      const handlerWithoutHostname = new CodeVersionToolHandler(contextWithoutHostname, 'CodeVersion');

      await (handlerWithoutHostname as any).initialize();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).not.toHaveBeenCalled();
    });

    it('should not initialize without clientId', async () => {
      const contextWithoutClientId = {
        ...context,
        config: { ...context.config, clientId: undefined },
      };
      const handlerWithoutClientId = new CodeVersionToolHandler(contextWithoutClientId, 'CodeVersion');

      await (handlerWithoutClientId as any).initialize();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).not.toHaveBeenCalled();
    });

    it('should not initialize without clientSecret', async () => {
      const contextWithoutClientSecret = {
        ...context,
        config: { ...context.config, clientSecret: undefined },
      };
      const handlerWithoutClientSecret = new CodeVersionToolHandler(contextWithoutClientSecret, 'CodeVersion');

      await (handlerWithoutClientSecret as any).initialize();

      const MockedConstructor = jest.requireMock('../src/clients/ocapi/code-versions-client.js').OCAPICodeVersionsClient;
      expect(MockedConstructor).not.toHaveBeenCalled();
    });
  });
});
