import { BaseToolHandler, HandlerContext, ToolArguments, ToolExecutionResult, HandlerError, GenericToolSpec, ToolExecutionContext } from '../src/core/handlers/base-handler.js';
import { Logger } from '../src/utils/logger.js';

// Mock implementation for testing
class TestHandler extends BaseToolHandler {
  public initializeCalled = false;
  public disposeCalled = false;
  public initializeError: Error | null = null;
  public disposeError: Error | null = null;
  private toolConfig: Record<string, GenericToolSpec> = {
    'test_tool': {
      exec: async (args) => `test_tool executed successfully with ${JSON.stringify(args)}`,
      logMessage: () => 'Testing tool execution',
    },
    'failing_tool': {
      exec: async () => {
        throw new Error('Test operation failed');
      },
      logMessage: () => 'Testing failing tool',
    },
    'validate_tool': {
      validate: (args, toolName) => {
        this.validateArgs(args, ['required_field'], toolName);
      },
      exec: async (args) => `validate_tool executed successfully with ${JSON.stringify(args)}`,
      logMessage: () => 'Testing validation tool',
    },
    'defaults_tool': {
      defaults: (args) => ({
        ...args,
        defaultValue: args.defaultValue ?? 'default_applied',
        numericDefault: args.numericDefault ?? 42,
      }),
      exec: async (args) => ({ receivedArgs: args }),
      logMessage: (args) => `Defaults tool with ${JSON.stringify(args)}`,
    },
    'context_tool': {
      exec: async (args, context) => ({
        hasContext: !!context,
        hasHandlerContext: !!context.handlerContext,
        hasLogger: !!context.logger,
        contextKeys: Object.keys(context),
      }),
      logMessage: () => 'Testing execution context',
    },
    'complex_validation_tool': {
      validate: (args, toolName) => {
        const email = typeof args.email === 'string' ? args.email : '';
        const age = typeof args.age === 'number' ? args.age : 0;

        if (!email.includes('@')) {
          throw new HandlerError('Invalid email format', toolName, 'VALIDATION_ERROR');
        }
        if (age < 18) {
          throw new HandlerError('Age must be 18 or older', toolName, 'AGE_VALIDATION_ERROR');
        }
      },
      exec: async (args) => ({ validated: true, args }),
      logMessage: () => 'Testing complex validation',
    },
  };

  constructor(context: HandlerContext, subLoggerName: string = 'Test') {
    super(context, subLoggerName);
  }

  protected getToolConfig(): Record<string, GenericToolSpec> {
    return this.toolConfig;
  }

  protected getToolNameSet(): Set<string> {
    return new Set(['test_tool', 'failing_tool', 'validate_tool', 'defaults_tool', 'context_tool', 'complex_validation_tool']);
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    return {
      handlerContext: this.context,
      logger: this.logger,
    };
  }

  protected async onInitialize(): Promise<void> {
    this.initializeCalled = true;
    if (this.initializeError) {
      throw this.initializeError;
    }
  }

  protected async onDispose(): Promise<void> {
    this.disposeCalled = true;
    if (this.disposeError) {
      throw this.disposeError;
    }
  }

  // Expose protected methods for testing
  public testValidateArgs(args: ToolArguments, required: string[], toolName: string): void {
    this.validateArgs(args, required, toolName);
  }

  public testCreateResponse(data: unknown, stringify: boolean = true): ToolExecutionResult {
    return this.createResponse(data, stringify);
  }

  public getIsInitialized(): boolean {
    return (this as any)._isInitialized;
  }

  public getContext(): HandlerContext {
    return this.context;
  }
}

describe('BaseToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let context: HandlerContext;
  let handler: TestHandler;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
    } as any;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: { hostname: 'test.demandware.net' },
      capabilities: { canAccessLogs: true, canAccessOCAPI: true },
    };

    handler = new TestHandler(context);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with context and logger', () => {
      expect(handler.getContext()).toBe(context);
      expect(Logger.getChildLogger).toHaveBeenCalledWith('Handler:Test');
      expect(handler.getIsInitialized()).toBe(false);
    });
  });

  describe('initialization lifecycle', () => {
    it('should initialize on first use', async () => {
      expect(handler.initializeCalled).toBe(false);
      expect(handler.getIsInitialized()).toBe(false);

      const result = await handler.handle('test_tool', {}, Date.now());

      expect(handler.initializeCalled).toBe(true);
      expect(handler.getIsInitialized()).toBe(true);
      expect(result.content[0].text).toContain('test_tool executed successfully');
    });

    it('should not initialize twice', async () => {
      // First call
      await handler.handle('test_tool', {}, Date.now());
      expect(handler.initializeCalled).toBe(true);

      // Reset the flag to test it's not called again
      handler.initializeCalled = false;

      // Second call
      await handler.handle('test_tool', {}, Date.now());
      expect(handler.initializeCalled).toBe(false); // Should not be called again
      expect(handler.getIsInitialized()).toBe(true);
    });

    it('should handle initialization errors', async () => {
      handler.initializeError = new Error('Initialization failed');

      const result = await handler.handle('test_tool', {}, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Initialization failed');
      expect(handler.getIsInitialized()).toBe(false);
    });
  });

  describe('disposal lifecycle', () => {
    it('should dispose properly', async () => {
      // Initialize first
      await handler.handle('test_tool', {}, Date.now());
      expect(handler.getIsInitialized()).toBe(true);

      // Dispose
      await handler.dispose();
      expect(handler.disposeCalled).toBe(true);
      expect(handler.getIsInitialized()).toBe(false);
    });

    it('should handle disposal errors', async () => {
      handler.disposeError = new Error('Disposal failed');

      await expect(handler.dispose()).rejects.toThrow('Disposal failed');
      expect(handler.getIsInitialized()).toBe(false); // Should still reset the flag
    });

    it('should allow disposal without initialization', async () => {
      expect(handler.getIsInitialized()).toBe(false);

      await handler.dispose();
      expect(handler.disposeCalled).toBe(true);
      expect(handler.getIsInitialized()).toBe(false);
    });
  });

  describe('canHandle', () => {
    it('should correctly identify handled tools', () => {
      expect(handler.canHandle('test_tool')).toBe(true);
      expect(handler.canHandle('failing_tool')).toBe(true);
      expect(handler.canHandle('validate_tool')).toBe(true);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  describe('handle method', () => {
    it('should execute tool successfully', async () => {
      const startTime = Date.now();
      const args = { param1: 'value1' };

      const result = await handler.handle('test_tool', args, startTime);

      expect(result.content[0].text).toContain('test_tool executed successfully');
      expect(result.content[0].text).toContain('value1');
      expect(mockLogger.timing).toHaveBeenCalledWith('test_tool', startTime);
    });

    it('should handle tool execution errors', async () => {
      const result = await handler.handle('failing_tool', {}, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Test operation failed');
    });

    it('should validate arguments when required', async () => {
      const args = { required_field: 'value' };

      // Should pass with required field
      const result = await handler.handle('validate_tool', args, Date.now());
      expect(result.content[0].text).toContain('validate_tool executed successfully');

      // Should fail without required field
      const errorResult = await handler.handle('validate_tool', {}, Date.now());
      expect(errorResult.isError).toBe(true);
      expect(errorResult.content[0].text).toContain('required_field is required');
    });
  });

  describe('validateArgs', () => {
    it('should pass when all required fields are present', () => {
      const args = { field1: 'value1', field2: 'value2' };

      expect(() => {
        handler.testValidateArgs(args, ['field1', 'field2'], 'test_tool');
      }).not.toThrow();
    });

    it('should throw HandlerError when required field is missing', () => {
      const args = { field1: 'value1' };

      expect(() => {
        handler.testValidateArgs(args, ['field1', 'field2'], 'test_tool');
      }).toThrow(HandlerError);

      try {
        handler.testValidateArgs(args, ['field1', 'field2'], 'test_tool');
      } catch (error) {
        expect(error).toBeInstanceOf(HandlerError);
        expect((error as HandlerError).message).toBe('field2 is required');
        expect((error as HandlerError).toolName).toBe('test_tool');
        expect((error as HandlerError).code).toBe('MISSING_ARGUMENT');
        expect((error as HandlerError).details).toEqual({
          required: ['field1', 'field2'],
          provided: ['field1'],
        });
      }
    });

    it('should throw when required field is null or undefined', () => {
      expect(() => {
        handler.testValidateArgs({ field1: null }, ['field1'], 'test_tool');
      }).toThrow('field1 is required');

      expect(() => {
        handler.testValidateArgs({ field1: undefined }, ['field1'], 'test_tool');
      }).toThrow('field1 is required');
    });

    it('should handle empty args object', () => {
      expect(() => {
        handler.testValidateArgs({}, ['field1'], 'test_tool');
      }).toThrow('field1 is required');
    });

    it('should handle null args', () => {
      expect(() => {
        handler.testValidateArgs(null as any, ['field1'], 'test_tool');
      }).toThrow('field1 is required');
    });
  });

  describe('createResponse', () => {
    it('should create stringified response by default', () => {
      const data = { key: 'value', number: 42 };
      const response = handler.testCreateResponse(data);

      expect(response.content[0].text).toBe(JSON.stringify(data, null, 2));
      expect(response.isError).toBe(false);
    });

    it('should create non-stringified response when requested', () => {
      const data = { key: 'value', number: 42 };
      const response = handler.testCreateResponse(data, false);

      expect(response.content[0].text).toBe(JSON.stringify(data));
      expect(response.isError).toBe(false);
    });

    it('should handle null data', () => {
      const response = handler.testCreateResponse(null);

      expect(response.content[0].text).toBe('null');
      expect(response.isError).toBe(false);
    });

    it('should handle primitive values', () => {
      expect(handler.testCreateResponse('string').content[0].text).toBe('"string"');
      expect(handler.testCreateResponse(42).content[0].text).toBe('42');
      expect(handler.testCreateResponse(true).content[0].text).toBe('true');
    });
  });

  describe('HandlerError', () => {
    it('should create error with all properties', () => {
      const details = { key: 'value' };
      const error = new HandlerError('Test error', 'test_tool', 'TEST_CODE', details);

      expect(error.message).toBe('Test error');
      expect(error.toolName).toBe('test_tool');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toBe(details);
      expect(error.name).toBe('HandlerError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with optional parameters', () => {
      const error = new HandlerError('Simple error', 'test_tool');

      expect(error.message).toBe('Simple error');
      expect(error.toolName).toBe('test_tool');
      expect(error.code).toBe('HANDLER_ERROR');
      expect(error.details).toBeUndefined();
    });
  });

  describe('logging integration', () => {
    it('should log debug messages during execution', async () => {
      await handler.handle('test_tool', {}, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'test_tool completed',
        expect.any(Object),
      );
    });

    it('should log timing information', async () => {
      const startTime = Date.now();
      await handler.handle('test_tool', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('test_tool', startTime);
    });
  });

  describe('error handling', () => {
    it('should preserve original error types', async () => {
      const customError = new TypeError('Custom type error');
      handler.initializeError = customError;

      const result = await handler.handle('test_tool', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Custom type error');
    });

    it('should handle async operation errors', async () => {
      const result = await handler.handle('failing_tool', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Test operation failed');
    });
  });

  describe('config-driven functionality', () => {
    describe('unsupported tools', () => {
      it('should throw error for unsupported tools', async () => {
        await expect(handler.handle('unknown_tool', {}, Date.now()))
          .rejects.toThrow('Unsupported tool: unknown_tool');
      });

      it('should return false for canHandle on unsupported tools', () => {
        expect(handler.canHandle('unknown_tool')).toBe(false);
      });
    });

    describe('default values', () => {
      it('should apply default values when not provided', async () => {
        const result = await handler.handle('defaults_tool', {}, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.receivedArgs.defaultValue).toBe('default_applied');
        expect(parsedResult.receivedArgs.numericDefault).toBe(42);
      });

      it('should not override provided values with defaults', async () => {
        const args = { defaultValue: 'custom_value', numericDefault: 100 };
        const result = await handler.handle('defaults_tool', args, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.receivedArgs.defaultValue).toBe('custom_value');
        expect(parsedResult.receivedArgs.numericDefault).toBe(100);
      });

      it('should mix provided and default values', async () => {
        const args = { defaultValue: 'custom_value', otherParam: 'other' };
        const result = await handler.handle('defaults_tool', args, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.receivedArgs.defaultValue).toBe('custom_value');
        expect(parsedResult.receivedArgs.numericDefault).toBe(42); // default applied
        expect(parsedResult.receivedArgs.otherParam).toBe('other');
      });
    });

    describe('execution context', () => {
      it('should provide ToolExecutionContext to tool functions', async () => {
        const result = await handler.handle('context_tool', {}, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.hasContext).toBe(true);
        expect(parsedResult.hasHandlerContext).toBe(true);
        expect(parsedResult.hasLogger).toBe(true);
        expect(parsedResult.contextKeys).toContain('handlerContext');
        expect(parsedResult.contextKeys).toContain('logger');
      });
    });

    describe('complex validation', () => {
      it('should pass complex validation with valid args', async () => {
        const args = { email: 'test@example.com', age: 25 };
        const result = await handler.handle('complex_validation_tool', args, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.validated).toBe(true);
        expect(parsedResult.args).toEqual(args);
      });

      it('should fail validation with invalid email', async () => {
        const args = { email: 'invalid-email', age: 25 };
        const result = await handler.handle('complex_validation_tool', args, Date.now());

        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain('Invalid email format');
      });

      it('should fail validation with invalid age', async () => {
        const args = { email: 'test@example.com', age: 16 };
        const result = await handler.handle('complex_validation_tool', args, Date.now());

        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain('Age must be 18 or older');
      });

      it('should handle validation errors with custom error codes', async () => {
        const args = { email: 'invalid-email', age: 25 };
        const result = await handler.handle('complex_validation_tool', args, Date.now());

        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain('Invalid email format');
        // The error should be a HandlerError with VALIDATION_ERROR code
      });
    });

    describe('logging with defaults', () => {
      it('should use log message with applied defaults', async () => {
        const args = { customParam: 'test' };

        // Spy on the debug method to capture log messages
        const debugSpy = jest.spyOn(mockLogger, 'debug');

        await handler.handle('defaults_tool', args, Date.now());

        // Check that the log message includes the default values
        const debugCalls = debugSpy.mock.calls;
        const logMessageCall = debugCalls.find(call =>
          typeof call[0] === 'string' && call[0].includes('Defaults tool with'),
        );

        expect(logMessageCall).toBeDefined();
        expect(logMessageCall?.[0]).toContain('default_applied');
        expect(logMessageCall?.[0]).toContain('42');
      });
    });

    describe('tool config edge cases', () => {
      it('should handle tools with minimal config', async () => {
        // The test_tool has minimal config - no validation, no defaults
        const result = await handler.handle('test_tool', { param: 'value' }, Date.now());

        expect(result.content[0].text).toContain('test_tool executed successfully');
        expect(result.content[0].text).toContain('value');
      });

      it('should handle empty arguments with defaults', async () => {
        const result = await handler.handle('defaults_tool', {}, Date.now());
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.receivedArgs.defaultValue).toBe('default_applied');
        expect(parsedResult.receivedArgs.numericDefault).toBe(42);
      });
    });
  });
});
