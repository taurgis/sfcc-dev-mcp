import { Logger } from '../../utils/logger.js';
import { SFCCConfig } from '../../types/types.js';

export interface HandlerContext {
  logger: Logger;
  config: SFCCConfig;
  capabilities: {
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
  };
}

export interface ToolExecutionResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export interface ToolArguments {
  [key: string]: any;
}

/**
 * Generic tool specification interface
 * Defines the contract for declarative tool configuration
 */
export interface GenericToolSpec<TArgs = ToolArguments, TResult = any> {
  /** Optional validation function for tool arguments */
  validate?: (args: TArgs, toolName: string) => void;
  /** Optional function to apply default values to arguments */
  defaults?: (args: TArgs) => Partial<TArgs>;
  /** Main execution function for the tool */
  exec: (args: TArgs, context: ToolExecutionContext) => Promise<TResult>;
  /** Function to generate log message for the tool execution */
  logMessage: (args: TArgs) => string;
}

/**
 * Context provided to tool execution functions
 * Allows tools to access clients and other resources
 */
export interface ToolExecutionContext {
  /** Handler context with configuration and capabilities */
  handlerContext: HandlerContext;
  /** Logger instance for the handler */
  logger: any;
  /** Additional context data that can be provided by concrete handlers */
  [key: string]: any;
}

export class HandlerError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly code: string = 'HANDLER_ERROR',
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'HandlerError';
  }
}

export abstract class BaseToolHandler<TToolName extends string = string> {
  protected context: HandlerContext;
  protected logger: Logger;
  private _isInitialized = false;

  constructor(context: HandlerContext, subLoggerName: string) {
    this.context = context;
    this.logger = Logger.getChildLogger(`Handler:${subLoggerName}`);
  }

  /**
   * Abstract method to get tool configuration
   * Each concrete handler implements this with their specific config
   */
  protected abstract getToolConfig(): Record<TToolName, GenericToolSpec>;

  /**
   * Abstract method to get tool name set for O(1) lookup
   * Each concrete handler implements this with their specific tool set
   */
  protected abstract getToolNameSet(): Set<string>;

  /**
   * Abstract method to create execution context
   * Each concrete handler can provide specialized context
   */
  protected abstract createExecutionContext(): Promise<ToolExecutionContext>;

  /**
   * Check if this handler can handle the given tool
   */
  canHandle(toolName: string): boolean {
    return this.getToolNameSet().has(toolName);
  }

  /**
   * Config-driven tool execution
   * Handles validation, defaults, execution, and logging uniformly
   */
  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported tool: ${toolName}`);
    }

    const toolConfig = this.getToolConfig();
    const spec = toolConfig[toolName as TToolName];

    if (!spec) {
      throw new Error(`No configuration found for tool: ${toolName}`);
    }

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.dispatchTool(spec, args),
      spec.logMessage(this.applyDefaults(spec, args)),
    );
  }

  /**
   * Generic tool dispatch using configuration
   * Handles validation, defaults, and execution
   */
  private async dispatchTool(spec: GenericToolSpec, args: ToolArguments): Promise<any> {
    const context = await this.createExecutionContext();
    const processedArgs = this.createValidatedArgs(spec, args, 'tool');

    return spec.exec(processedArgs, context);
  }

  /**
   * Apply default values to arguments
   */
  private applyDefaults(spec: GenericToolSpec, args: ToolArguments): ToolArguments {
    if (!spec.defaults) {
      return args;
    }

    const defaults = spec.defaults(args);
    return { ...args, ...defaults };
  }

  /**
   * Create validated arguments with defaults applied
   */
  private createValidatedArgs(spec: GenericToolSpec, args: ToolArguments, toolName: string): ToolArguments {
    // Apply defaults first
    const processedArgs = this.applyDefaults(spec, args);

    // Validate if validator exists
    if (spec.validate) {
      spec.validate(processedArgs, toolName);
    }

    return processedArgs;
  }

  /**
   * Initialize the handler (lazy initialization)
   */
  protected async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }
    await this.onInitialize();
    this._isInitialized = true;
  }

  /**
   * Override this method for custom initialization logic
   */
  protected async onInitialize(): Promise<void> {
    // Default: no-op
  }

  /**
   * Clean up resources when handler is destroyed
   */
  async dispose(): Promise<void> {
    await this.onDispose();
    this._isInitialized = false;
  }

  /**
   * Override this method for custom cleanup logic
   */
  protected async onDispose(): Promise<void> {
    // Default: no-op
  }

  /**
   * Validate required arguments
   */
  protected validateArgs(args: ToolArguments, required: string[], toolName: string): void {
    for (const field of required) {
      if (!args?.[field]) {
        throw new HandlerError(
          `${field} is required`,
          toolName,
          'MISSING_ARGUMENT',
          { required, provided: Object.keys(args || {}) },
        );
      }
    }
  }

  /**
   * Create a standardized response
   */
  protected createResponse(data: any, stringify: boolean = true): ToolExecutionResult {
    return {
      content: [
        { type: 'text', text: stringify ? JSON.stringify(data, null, 2) : data },
      ],
      isError: false,
    };
  }

  /**
   * Create an error response
   */
  protected createErrorResponse(error: Error, toolName: string): ToolExecutionResult {
    this.logger.error(`Error in ${toolName}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: error instanceof HandlerError
            ? `Error: ${error.message}`
            : `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }

  /**
   * Execute a tool operation with standardized logging and error handling
   */
  protected async executeWithLogging(
    toolName: string,
    startTime: number,
    operation: () => Promise<any>,
    logMessage?: string,
  ): Promise<ToolExecutionResult> {
    try {
      await this.initialize();

      if (logMessage) {
        this.logger.debug(logMessage);
      }

      const result = await operation();
      this.logger.timing(toolName, startTime);

      // Log result metadata for debugging
      this.logger.debug(`${toolName} completed successfully`, {
        resultType: typeof result,
        resultLength: Array.isArray(result) ? result.length : undefined,
        hasData: result != null,
      });

      return this.createResponse(result);
    } catch (error) {
      this.logger.timing(`${toolName}_error`, startTime);
      return this.createErrorResponse(error as Error, toolName);
    }
  }

  /**
   * @deprecated Use executeWithLogging instead
   */
  protected async wrap(
    toolName: string,
    startTime: number,
    fn: () => Promise<any>,
    logMessage?: string,
  ): Promise<ToolExecutionResult> {
    return this.executeWithLogging(toolName, startTime, fn, logMessage);
  }
}
