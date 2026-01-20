import { BestPracticesToolHandler } from '../src/core/handlers/best-practices-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock the SFCCBestPracticesClient - still needed for handler initialization
// but client methods are no longer called since tools return deprecation notices directly
jest.mock('../src/clients/best-practices-client.js', () => ({
  SFCCBestPracticesClient: jest.fn(() => ({})),
}));

/**
 * Tests for BestPracticesToolHandler
 *
 * NOTE: These tools are DEPRECATED and now return deprecation notices
 * pointing users to GitHub Copilot Agent Skills instead of actual guide content.
 */
describe('BestPracticesToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
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
    it('should initialize handler without errors', async () => {
      await initializeHandler();
      // Handler should initialize successfully
      expect(mockLogger.debug).toHaveBeenCalledWith('Best practices client initialized');
    });
  });

  describe('get_available_best_practice_guides tool (DEPRECATED)', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should return deprecation notice', async () => {
      const result = await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(result.content[0].text).toContain('DEPRECATION NOTICE');
      expect(result.content[0].text).toContain('Agent Skills');
    });

    it('should include skills repository URL', async () => {
      const result = await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(result.content[0].text).toContain('ai-instructions/skills');
    });

    it('should list available skills', async () => {
      const result = await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(result.content[0].text).toContain('sfcc-cartridge-development');
      expect(result.content[0].text).toContain('sfcc-security');
      expect(result.content[0].text).toContain('sfcc-performance');
    });
  });

  describe('get_best_practice_guide tool (DEPRECATED)', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should return deprecation notice with specific skill mapping', async () => {
      const args = { guideName: 'cartridge_creation' };
      const result = await handler.handle('get_best_practice_guide', args, Date.now());

      expect(result.content[0].text).toContain('DEPRECATION NOTICE');
      expect(result.content[0].text).toContain('sfcc-cartridge-development');
    });

    it('should map sfra_controllers to correct skill', async () => {
      const args = { guideName: 'sfra_controllers' };
      const result = await handler.handle('get_best_practice_guide', args, Date.now());

      expect(result.content[0].text).toContain('sfcc-sfra-controllers');
    });

    it('should map security to correct skill', async () => {
      const args = { guideName: 'security' };
      const result = await handler.handle('get_best_practice_guide', args, Date.now());

      expect(result.content[0].text).toContain('sfcc-security');
    });

    it('should throw error when guideName is missing', async () => {
      const result = await handler.handle('get_best_practice_guide', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('guideName must be a non-empty string');
    });
  });

  describe('search_best_practices tool (DEPRECATED)', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should return deprecation notice', async () => {
      const args = { query: 'validation' };
      const result = await handler.handle('search_best_practices', args, Date.now());

      expect(result.content[0].text).toContain('DEPRECATION NOTICE');
      expect(result.content[0].text).toContain('Agent Skills');
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

  describe('get_hook_reference tool (DEPRECATED)', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should return deprecation notice with ocapi skill mapping', async () => {
      const args = { guideName: 'ocapi_hooks' };
      const result = await handler.handle('get_hook_reference', args, Date.now());

      expect(result.content[0].text).toContain('DEPRECATION NOTICE');
      expect(result.content[0].text).toContain('sfcc-ocapi-hooks');
    });

    it('should return deprecation notice with scapi skill mapping', async () => {
      const args = { guideName: 'scapi_hooks' };
      const result = await handler.handle('get_hook_reference', args, Date.now());

      expect(result.content[0].text).toContain('DEPRECATION NOTICE');
      expect(result.content[0].text).toContain('sfcc-scapi-hooks');
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

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('get_available_best_practice_guides', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('get_available_best_practice_guides', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('get_available_best_practice_guides', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'get_available_best_practice_guides completed',
        expect.any(Object),
      );
    });
  });
});
