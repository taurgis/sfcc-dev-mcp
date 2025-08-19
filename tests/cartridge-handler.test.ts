import { CartridgeToolHandler } from '../src/core/handlers/cartridge-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock cartridge client
const mockCartridgeClient = {
  generateCartridgeStructure: jest.fn(),
};

// Mock the ClientFactory to return our mock client
jest.mock('../src/core/handlers/client-factory.js', () => ({
  ClientFactory: jest.fn().mockImplementation(() => ({
    createCartridgeClient: jest.fn(() => mockCartridgeClient),
  })),
}));

describe('CartridgeToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockClient: typeof mockCartridgeClient;
  let context: HandlerContext;
  let handler: CartridgeToolHandler;

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
    mockClient = mockCartridgeClient;
    mockClient.generateCartridgeStructure.mockReset();

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: null as any,
      capabilities: { canAccessLogs: false, canAccessOCAPI: false },
    };

    handler = new CartridgeToolHandler(context, 'Cartridge');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle cartridge tools', () => {
      expect(handler.canHandle('generate_cartridge_structure')).toBe(true);
    });

    it('should not handle non-cartridge tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('initialization', () => {
    it('should initialize cartridge generation client', async () => {
      await initializeHandler();

      const MockedClientFactory = jest.requireMock('../src/core/handlers/client-factory.js').ClientFactory;
      const mockFactoryInstance = MockedClientFactory.mock.results[0].value;
      expect(mockFactoryInstance.createCartridgeClient).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith('Cartridge generation client initialized');
    });
  });

  describe('disposal', () => {
    it('should dispose cartridge generation client properly', async () => {
      await initializeHandler();
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('Cartridge generation client disposed');
    });
  });

  describe('generate_cartridge_structure tool', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle generate_cartridge_structure with cartridgeName', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'plugin_example',
        targetPath: '/path/to/project',
        filesCreated: [
          'cartridges/plugin_example/cartridge/controllers/Product.js',
          'cartridges/plugin_example/cartridge/scripts/helpers/ProductHelper.js',
          'package.json',
        ],
      });

      const args = { cartridgeName: 'plugin_example' };
      const result = await handler.handle('generate_cartridge_structure', args, Date.now());

      expect(mockClient.generateCartridgeStructure).toHaveBeenCalledWith({
        cartridgeName: 'plugin_example',
        targetPath: undefined,
        fullProjectSetup: true,
      });
      expect(result.content[0].text).toContain('plugin_example');
    });

    it('should handle generate_cartridge_structure with all options', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'custom_cartridge',
        targetPath: '/custom/path',
        filesCreated: [
          'cartridges/custom_cartridge/cartridge/controllers/Product.js',
        ],
      });

      const args = {
        cartridgeName: 'custom_cartridge',
        targetPath: '/custom/path',
        fullProjectSetup: false,
      };
      const result = await handler.handle('generate_cartridge_structure', args, Date.now());

      expect(mockClient.generateCartridgeStructure).toHaveBeenCalledWith({
        cartridgeName: 'custom_cartridge',
        targetPath: '/custom/path',
        fullProjectSetup: false,
      });
      expect(result.content[0].text).toContain('custom_cartridge');
    });

    it('should use default fullProjectSetup when not provided', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'test_cartridge',
        filesCreated: [],
      });

      const args = {
        cartridgeName: 'test_cartridge',
        targetPath: '/test/path',
      };
      await handler.handle('generate_cartridge_structure', args, Date.now());

      expect(mockClient.generateCartridgeStructure).toHaveBeenCalledWith({
        cartridgeName: 'test_cartridge',
        targetPath: '/test/path',
        fullProjectSetup: true,
      });
    });

    it('should throw error when cartridgeName is missing', async () => {
      const result = await handler.handle('generate_cartridge_structure', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('cartridgeName must be a valid identifier');
    });

    it('should throw error when cartridgeName is empty', async () => {
      const result = await handler.handle('generate_cartridge_structure', { cartridgeName: '' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('cartridgeName must be a valid identifier');
    });

    it('should throw error when cartridgeName is not a string', async () => {
      const result = await handler.handle('generate_cartridge_structure', { cartridgeName: 123 }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('cartridgeName must be a valid identifier');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockClient.generateCartridgeStructure.mockRejectedValue(new Error('Directory already exists'));

      const result = await handler.handle('generate_cartridge_structure', { cartridgeName: 'existing_cartridge' }, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Directory already exists');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported cartridge tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'test_cartridge',
        filesCreated: [],
      });
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('generate_cartridge_structure', { cartridgeName: 'test_cartridge' }, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('generate_cartridge_structure', startTime);
    });

    it('should log execution details', async () => {
      await handler.handle('generate_cartridge_structure', { cartridgeName: 'test_cartridge' }, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'generate_cartridge_structure completed successfully',
        expect.any(Object),
      );
    });

    it('should create appropriate log message', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'my_cartridge',
        filesCreated: [],
      });

      await handler.handle('generate_cartridge_structure', { cartridgeName: 'my_cartridge' }, Date.now());

      // Check that the debug log contains the execution details
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'generate_cartridge_structure completed successfully',
        expect.any(Object),
      );
    });
  });

  describe('client integration', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should pass correct parameters to client for minimal request', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'minimal_cartridge',
        filesCreated: ['cartridges/minimal_cartridge/cartridge/controllers/Default.js'],
      });

      const args = { cartridgeName: 'minimal_cartridge' };

      await handler.handle('generate_cartridge_structure', args, Date.now());

      expect(mockClient.generateCartridgeStructure).toHaveBeenCalledWith({
        cartridgeName: 'minimal_cartridge',
        targetPath: undefined,
        fullProjectSetup: true,
      });
    });

    it('should pass correct parameters to client for full request', async () => {
      mockClient.generateCartridgeStructure.mockResolvedValue({
        success: true,
        cartridgeName: 'full_cartridge',
        filesCreated: ['cartridges/full_cartridge/cartridge/controllers/Default.js'],
      });

      const args = {
        cartridgeName: 'full_cartridge',
        targetPath: '/workspace/my-project',
        fullProjectSetup: false,
      };

      await handler.handle('generate_cartridge_structure', args, Date.now());

      expect(mockClient.generateCartridgeStructure).toHaveBeenCalledWith({
        cartridgeName: 'full_cartridge',
        targetPath: '/workspace/my-project',
        fullProjectSetup: false,
      });
    });
  });
});
