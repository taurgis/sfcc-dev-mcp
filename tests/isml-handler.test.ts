import { ISMLToolHandler } from '../src/core/handlers/isml-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock the ISMLClient
const mockISMLClient = {
  getAvailableElements: jest.fn(),
  getISMLElement: jest.fn(),
  searchISMLElements: jest.fn(),
  getElementsByCategory: jest.fn(),
  getAvailableCategories: jest.fn(),
};

jest.mock('../src/clients/isml-client.js', () => ({
  ISMLClient: jest.fn(() => mockISMLClient),
}));

describe('ISMLToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockClient: typeof mockISMLClient;
  let context: HandlerContext;
  let handler: ISMLToolHandler;

  const getResultText = (result: { content: Array<{ text: string }>; structuredContent?: unknown }): string => {
    const text = result.content[0]?.text;
    if (typeof text === 'string') {
      return text;
    }

    return JSON.stringify(result.structuredContent ?? {});
  };

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
    mockClient = mockISMLClient;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: null as any,
      capabilities: { canAccessLogs: false, canAccessOCAPI: false },
    };

    handler = new ISMLToolHandler(context);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle ISML documentation tools', () => {
      expect(handler.canHandle('list_isml_elements')).toBe(true);
      expect(handler.canHandle('get_isml_element')).toBe(true);
      expect(handler.canHandle('search_isml_elements')).toBe(true);
      expect(handler.canHandle('get_isml_elements_by_category')).toBe(true);
      expect(handler.canHandle('get_isml_categories')).toBe(true);
    });

    it('should not handle non-ISML tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(false);
      expect(handler.canHandle('sync_agent_instructions')).toBe(false);
      expect(handler.canHandle('disable_agent_sync')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('initialization', () => {
    it('should initialize ISML client', async () => {
      await initializeHandler();

      const MockedConstructor = jest.requireMock('../src/clients/isml-client.js').ISMLClient;
      expect(MockedConstructor).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith('ISML client initialized');
    });
  });

  describe('disposal', () => {
    it('should dispose ISML client properly', async () => {
      await initializeHandler();
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('ISML client disposed');
    });
  });

  describe('list_isml_elements tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getAvailableElements.mockResolvedValue([
        { name: 'isif', title: 'isif', description: 'Conditional element', category: 'control-flow', filename: 'isif.md' },
        { name: 'isloop', title: 'isloop', description: 'Loop element', category: 'control-flow', filename: 'isloop.md' },
        { name: 'isprint', title: 'isprint', description: 'Output element', category: 'output', filename: 'isprint.md' },
      ]);
    });

    it('should handle list_isml_elements', async () => {
      const result = await handler.handle('list_isml_elements', {}, Date.now());

      expect(mockClient.getAvailableElements).toHaveBeenCalled();
      expect(getResultText(result)).toContain('isif');
      expect(getResultText(result)).toContain('isloop');
      expect(getResultText(result)).toContain('isprint');
    });

    it('should return properly formatted JSON', async () => {
      const result = await handler.handle('list_isml_elements', {}, Date.now());

      expect(result.isError).toBe(false);
      const data = JSON.parse(getResultText(result));
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('category');
    });
  });

  describe('get_isml_element tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getISMLElement.mockResolvedValue({
        name: 'isif',
        title: 'isif - Conditional Element',
        description: 'The isif element provides conditional logic in ISML templates',
        sections: ['Overview', 'Syntax', 'Attributes', 'Examples'],
        content: '# isif - Conditional Element\n\n## Overview\n\nThe isif element...',
        category: 'control-flow',
        attributes: ['condition'],
        requiredAttributes: ['condition'],
        optionalAttributes: [],
        filename: 'isif.md',
      });
    });

    it('should handle get_isml_element with elementName', async () => {
      const args = { elementName: 'isif' };
      const result = await handler.handle('get_isml_element', args, Date.now());

      expect(mockClient.getISMLElement).toHaveBeenCalledWith('isif', {
        includeContent: true,
        includeSections: true,
        includeAttributes: true,
      });
      expect(getResultText(result)).toContain('isif');
      expect(getResultText(result)).toContain('condition');
    });

    it('should handle get_isml_element with options', async () => {
      const args = {
        elementName: 'isif',
        includeContent: false,
        includeSections: true,
        includeAttributes: false,
      };
      const result = await handler.handle('get_isml_element', args, Date.now());

      expect(mockClient.getISMLElement).toHaveBeenCalledWith('isif', {
        includeContent: false,
        includeSections: true,
        includeAttributes: false,
      });
      expect(result.isError).toBe(false);
    });

    it('should apply default options when not specified', async () => {
      const args = { elementName: 'isif' };
      await handler.handle('get_isml_element', args, Date.now());

      expect(mockClient.getISMLElement).toHaveBeenCalledWith('isif', {
        includeContent: true,
        includeSections: true,
        includeAttributes: true,
      });
    });

    it('should throw error when elementName is missing', async () => {
      const result = await handler.handle('get_isml_element', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('elementName must be a non-empty string');
    });

    it('should throw error when elementName is empty', async () => {
      const result = await handler.handle('get_isml_element', { elementName: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('elementName must be a non-empty string');
    });

    it('should throw error when element is not found', async () => {
      mockClient.getISMLElement.mockResolvedValue(null);
      const result = await handler.handle('get_isml_element', { elementName: 'unknown' }, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('not found');
    });
  });

  describe('search_isml_elements tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.searchISMLElements.mockResolvedValue([
        {
          element: { name: 'isif', title: 'isif', description: 'Conditional element', category: 'control-flow', filename: 'isif.md' },
          relevance: 150,
          matchedSections: ['Overview', 'Syntax'],
          preview: 'The isif element provides conditional logic...',
        },
        {
          element: { name: 'isloop', title: 'isloop', description: 'Loop element', category: 'control-flow', filename: 'isloop.md' },
          relevance: 100,
          matchedSections: ['Examples'],
          preview: 'Use isloop to iterate over collections...',
        },
      ]);
    });

    it('should handle search_isml_elements with query', async () => {
      const args = { query: 'conditional' };
      const result = await handler.handle('search_isml_elements', args, Date.now());

      expect(mockClient.searchISMLElements).toHaveBeenCalledWith('conditional', {
        category: undefined,
        limit: undefined,
      });
      expect(getResultText(result)).toContain('isif');
      expect(getResultText(result)).toContain('relevance');
    });

    it('should handle search_isml_elements with category filter', async () => {
      const args = { query: 'element', category: 'control-flow' };
      const result = await handler.handle('search_isml_elements', args, Date.now());

      expect(mockClient.searchISMLElements).toHaveBeenCalledWith('element', {
        category: 'control-flow',
        limit: undefined,
      });
      expect(result.isError).toBe(false);
    });

    it('should handle search_isml_elements with limit', async () => {
      const args = { query: 'element', limit: 5 };
      const result = await handler.handle('search_isml_elements', args, Date.now());

      expect(mockClient.searchISMLElements).toHaveBeenCalledWith('element', {
        category: undefined,
        limit: 5,
      });
      expect(result.isError).toBe(false);
    });

    it('should throw error when query is missing', async () => {
      const result = await handler.handle('search_isml_elements', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('query must be a non-empty string');
    });

    it('should throw error when query is empty', async () => {
      const result = await handler.handle('search_isml_elements', { query: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('query must be a non-empty string');
    });
  });

  describe('get_isml_elements_by_category tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getElementsByCategory.mockResolvedValue([
        { name: 'isif', title: 'isif', description: 'Conditional element', category: 'control-flow', filename: 'isif.md' },
        { name: 'isloop', title: 'isloop', description: 'Loop element', category: 'control-flow', filename: 'isloop.md' },
      ]);
    });

    it('should handle get_isml_elements_by_category with category', async () => {
      const args = { category: 'control-flow' };
      const result = await handler.handle('get_isml_elements_by_category', args, Date.now());

      expect(mockClient.getElementsByCategory).toHaveBeenCalledWith('control-flow');
      expect(getResultText(result)).toContain('isif');
      expect(getResultText(result)).toContain('isloop');
    });

    it('should throw error when category is missing', async () => {
      const result = await handler.handle('get_isml_elements_by_category', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('category must be a non-empty string');
    });

    it('should throw error when category is empty', async () => {
      const result = await handler.handle('get_isml_elements_by_category', { category: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('category must be a non-empty string');
    });
  });

  describe('get_isml_categories tool', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getAvailableCategories.mockResolvedValue([
        { name: 'control-flow', displayName: 'Control Flow', description: 'Conditional logic and loops', elementCount: 6 },
        { name: 'output', displayName: 'Output', description: 'Data formatting and display', elementCount: 1 },
        { name: 'includes', displayName: 'Includes & Components', description: 'Template inclusion', elementCount: 5 },
      ]);
    });

    it('should handle get_isml_categories', async () => {
      const result = await handler.handle('get_isml_categories', {}, Date.now());

      expect(mockClient.getAvailableCategories).toHaveBeenCalled();
      expect(getResultText(result)).toContain('control-flow');
      expect(getResultText(result)).toContain('Control Flow');
      expect(getResultText(result)).toContain('elementCount');
    });

    it('should return properly formatted JSON', async () => {
      const result = await handler.handle('get_isml_categories', {}, Date.now());

      expect(result.isError).toBe(false);
      const data = JSON.parse(getResultText(result));
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('displayName');
      expect(data[0]).toHaveProperty('elementCount');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockClient.getISMLElement.mockRejectedValue(new Error('Element file not found'));

      const result = await handler.handle('get_isml_element', { elementName: 'unknown' }, Date.now());
      expect(result.isError).toBe(true);
      expect(getResultText(result)).toContain('Element file not found');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.getAvailableElements.mockResolvedValue([]);
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('list_isml_elements', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('list_isml_elements', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('list_isml_elements', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'list_isml_elements completed',
        expect.any(Object),
      );
    });
  });
});
