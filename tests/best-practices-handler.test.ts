import { BestPracticesToolHandler } from '../src/core/handlers/best-practices-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock the SFCCBestPracticesClient
const mockBestPracticesClient = {
  getAvailableGuides: jest.fn(),
  getBestPracticeGuide: jest.fn(),
  searchBestPractices: jest.fn(),
  getHookReference: jest.fn(),
};

jest.mock('../src/clients/best-practices-client.js', () => ({
  SFCCBestPracticesClient: jest.fn(() => mockBestPracticesClient),
}));

describe('BestPracticesToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockClient: typeof mockBestPracticesClient;
  let context: HandlerContext;
  let handler: BestPracticesToolHandler;

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
    mockClient = mockBestPracticesClient;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: null as any,
      capabilities: { canAccessLogs: false, canAccessOCAPI: false },
    };

    handler = new BestPracticesToolHandler(context);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle best practices tools', () => {
      expect(handler.canHandle('get_available_best_practice_guides')).toBe(true);
      expect(handler.canHandle('get_best_practice_guide')).toBe(true);
      expect(handler.canHandle('search_best_practices')).toBe(true);
      expect(handler.canHandle('get_hook_reference')).toBe(true);
    });

    it('should not handle non-best-practices tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('initialization', () => {
    it('should initialize best practices client', async () => {
      await initializeHandler();

      const MockedConstructor = jest.requireMock('../src/clients/best-practices-client.js').SFCCBestPracticesClient;
      expect(MockedConstructor).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith('Best practices client initialized');
    });
  });

  describe('disposal', () => {
    it('should dispose best practices client properly', async () => {
      await initializeHandler();
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('Best practices client disposed');
    });
  });

  describe('get_available_best_practice_guides tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getAvailableGuides.mockResolvedValue([
        { name: 'cartridge_creation', title: 'Cartridge Creation', description: 'Best practices for cartridge creation' },
        { name: 'isml_templates', title: 'ISML Templates', description: 'Best practices for ISML templates' },
      ]);
    });

    it('should handle get_available_best_practice_guides', async () => {
      const result = await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(mockClient.getAvailableGuides).toHaveBeenCalled();
      expect(result.content[0].text).toContain('cartridge_creation');
      expect(result.content[0].text).toContain('isml_templates');
    });
  });

  describe('get_best_practice_guide tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getBestPracticeGuide.mockResolvedValue({
        title: 'Cartridge Creation Best Practices',
        description: 'Complete guide for creating custom cartridges',
        sections: ['Overview', 'Setup', 'Configuration'],
        content: 'Detailed content about cartridge creation...',
      });
    });

    it('should handle get_best_practice_guide with guideName', async () => {
      const args = { guideName: 'cartridge_creation' };
      const result = await handler.handle('get_best_practice_guide', args, Date.now());

      expect(mockClient.getBestPracticeGuide).toHaveBeenCalledWith('cartridge_creation');
      expect(result.content[0].text).toContain('Cartridge Creation Best Practices');
    });

    it('should throw error when guideName is missing', async () => {
      const result = await handler.handle('get_best_practice_guide', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('guideName must be a non-empty string');
    });
  });

  describe('search_best_practices tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.searchBestPractices.mockResolvedValue([
        { guide: 'cartridge_creation', section: 'Setup', content: 'Cartridge setup instructions...' },
        { guide: 'security', section: 'Authentication', content: 'Security best practices...' },
      ]);
    });

    it('should handle search_best_practices with query', async () => {
      const args = { query: 'validation' };
      const result = await handler.handle('search_best_practices', args, Date.now());

      expect(mockClient.searchBestPractices).toHaveBeenCalledWith('validation');
      expect(result.content[0].text).toContain('cartridge_creation');
      expect(result.content[0].text).toContain('security');
    });

    it('should throw error when query is missing', async () => {
      const result = await handler.handle('search_best_practices', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('query must be a non-empty string');
    });

    it('should throw error when query is empty', async () => {
      const result = await handler.handle('search_best_practices', { query: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('query must be a non-empty string');
    });
  });

  describe('get_hook_reference tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getHookReference.mockResolvedValue({
        type: 'OCAPI Hooks',
        hooks: [
          { endpoint: 'customers.post', description: 'Customer creation hook' },
          { endpoint: 'orders.get', description: 'Order retrieval hook' },
        ],
      });
    });

    it('should handle get_hook_reference with guideName', async () => {
      const args = { guideName: 'ocapi_hooks' };
      const result = await handler.handle('get_hook_reference', args, Date.now());

      expect(mockClient.getHookReference).toHaveBeenCalledWith('ocapi_hooks');
      expect(result.content[0].text).toContain('OCAPI Hooks');
      expect(result.content[0].text).toContain('customers.post');
    });

    it('should throw error when guideName is missing', async () => {
      const result = await handler.handle('get_hook_reference', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('guideName must be a non-empty string');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockClient.getBestPracticeGuide.mockRejectedValue(new Error('Guide not found'));

      const result = await handler.handle('get_best_practice_guide', { guideName: 'unknown_guide' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Guide not found');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getAvailableGuides.mockResolvedValue([]);
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('get_available_best_practice_guides', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('get_available_best_practice_guides', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'get_available_best_practice_guides completed successfully',
        expect.any(Object),
      );
    });
  });
});
