import { DocsToolHandler } from '../src/core/handlers/docs-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock the SFCCDocumentationClient
const mockSFCCDocumentationClient = {
  getClassDetailsExpanded: jest.fn(),
  getAvailableClasses: jest.fn(),
  searchClasses: jest.fn(),
  searchMethods: jest.fn(),
  getClassDocumentation: jest.fn(),
};

jest.mock('../src/clients/docs-client.js', () => ({
  SFCCDocumentationClient: jest.fn(() => mockSFCCDocumentationClient),
}));

describe('DocsToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockDocsClient: typeof mockSFCCDocumentationClient;
  let context: HandlerContext;
  let handler: DocsToolHandler;

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

    // Use the mock client directly
    mockDocsClient = mockSFCCDocumentationClient;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: null as any,
      capabilities: { canAccessLogs: false, canAccessOCAPI: false },
    };

    handler = new DocsToolHandler(context, 'Docs');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle docs-related tools', () => {
      expect(handler.canHandle('get_sfcc_class_info')).toBe(true);
      expect(handler.canHandle('list_sfcc_classes')).toBe(true);
      expect(handler.canHandle('search_sfcc_classes')).toBe(true);
      expect(handler.canHandle('search_sfcc_methods')).toBe(true);
      expect(handler.canHandle('get_sfcc_class_documentation')).toBe(true);
    });

    it('should not handle non-docs tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('initialization', () => {
    it('should initialize docs client', async () => {
      await initializeHandler();

      const MockedConstructor = jest.requireMock('../src/clients/docs-client.js').SFCCDocumentationClient;
      expect(MockedConstructor).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith('Documentation client initialized');
    });
  });

  describe('disposal', () => {
    it('should dispose docs client properly', async () => {
      await initializeHandler();
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('Documentation client disposed');
    });
  });

  describe('get_sfcc_class_info tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.getClassDetailsExpanded.mockResolvedValue({
        className: 'Product',
        packageName: 'dw.catalog',
        description: 'Product class description',
        constants: [],
        properties: [
          { name: 'ID', type: 'String', description: 'Product ID' },
          { name: 'name', type: 'String', description: 'Product name' },
        ],
        methods: [
          { name: 'getID', signature: 'getID() : String', description: 'Get product ID' },
          { name: 'getName', signature: 'getName() : String', description: 'Get product name' },
        ],
      });
    });

    it('should handle get_sfcc_class_info with className', async () => {
      const args = { className: 'Product', expand: true };
      const result = await handler.handle('get_sfcc_class_info', args, Date.now());

      expect(mockDocsClient.getClassDetailsExpanded).toHaveBeenCalledWith('Product', true);
      expect(result.content[0].text).toContain('Product');
      expect(result.content[0].text).toContain('Product class description');
    });

    it('should handle get_sfcc_class_info with default expand', async () => {
      const args = { className: 'Customer' };
      await handler.handle('get_sfcc_class_info', args, Date.now());

      expect(mockDocsClient.getClassDetailsExpanded).toHaveBeenCalledWith('Customer', false);
    });

    it('should throw error when className is missing', async () => {
      const result = await handler.handle('get_sfcc_class_info', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('className must be a non-empty string');
    });
  });

  describe('list_sfcc_classes tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.getAvailableClasses.mockResolvedValue([
        'Product', 'Customer', 'Order', 'Catalog',
      ]);
    });

    it('should handle list_sfcc_classes', async () => {
      const result = await handler.handle('list_sfcc_classes', {}, Date.now());

      expect(mockDocsClient.getAvailableClasses).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Product');
      expect(result.content[0].text).toContain('Customer');
    });
  });

  describe('search_sfcc_classes tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.searchClasses.mockResolvedValue([
        'Product', 'ProductSearchModel',
      ]);
    });

    it('should handle search_sfcc_classes with query', async () => {
      const args = { query: 'product' };
      const result = await handler.handle('search_sfcc_classes', args, Date.now());

      expect(mockDocsClient.searchClasses).toHaveBeenCalledWith('product');
      expect(result.content[0].text).toContain('Product');
      expect(result.content[0].text).toContain('ProductSearchModel');
    });

    it('should throw error when query is missing', async () => {
      const result = await handler.handle('search_sfcc_classes', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('query must be a non-empty string');
    });

    it('should throw error when query is empty', async () => {
      const result = await handler.handle('search_sfcc_classes', { query: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('query must be a non-empty string');
    });
  });

  describe('search_sfcc_methods tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.searchMethods.mockResolvedValue([
        {
          className: 'Product',
          method: {
            name: 'getID',
            signature: 'getID() : String',
            description: 'Get product ID',
          },
        },
        {
          className: 'Customer',
          method: {
            name: 'getID',
            signature: 'getID() : String',
            description: 'Get customer ID',
          },
        },
      ]);
    });

    it('should handle search_sfcc_methods with methodName', async () => {
      const args = { methodName: 'getID' };
      const result = await handler.handle('search_sfcc_methods', args, Date.now());

      expect(mockDocsClient.searchMethods).toHaveBeenCalledWith('getID');
      expect(result.content[0].text).toContain('getID');
      expect(result.content[0].text).toContain('Product');
    });

    it('should throw error when methodName is missing', async () => {
      const result = await handler.handle('search_sfcc_methods', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('methodName must be a non-empty string');
    });
  });

  describe('get_sfcc_class_documentation tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.getClassDocumentation.mockResolvedValue(
        'Detailed documentation for Product class with examples and usage patterns.',
      );
    });

    it('should handle get_sfcc_class_documentation with className', async () => {
      const args = { className: 'Product' };
      const result = await handler.handle('get_sfcc_class_documentation', args, Date.now());

      expect(mockDocsClient.getClassDocumentation).toHaveBeenCalledWith('Product');
      expect(result.content[0].text).toContain('Detailed documentation');
    });

    it('should throw error when className is missing', async () => {
      const result = await handler.handle('get_sfcc_class_documentation', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('className must be a non-empty string');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockDocsClient.getClassDetailsExpanded.mockRejectedValue(new Error('Documentation not found'));

      const result = await handler.handle('get_sfcc_class_info', { className: 'UnknownClass' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Documentation not found');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockDocsClient.getAvailableClasses.mockResolvedValue(['Product', 'Customer']);
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('list_sfcc_classes', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('list_sfcc_classes', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('list_sfcc_classes', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'list_sfcc_classes completed successfully',
        expect.any(Object),
      );
    });
  });
});
