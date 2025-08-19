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

export abstract class BaseToolHandler {
  protected context: HandlerContext;
  protected logger: Logger;
  private _isInitialized = false;

  constructor(context: HandlerContext, subLoggerName: string) {
    this.context = context;
    this.logger = Logger.getChildLogger(`Handler:${subLoggerName}`);
  }

  abstract canHandle(toolName: string): boolean;
  abstract handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult>;

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
