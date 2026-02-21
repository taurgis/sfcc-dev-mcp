import { Logger } from '../../utils/logger.js';
import { SFCCConfig } from '../../types/types.js';
import { WorkspaceRootsService } from '../../config/workspace-roots.js';
import { ValidationError } from '../../utils/validator.js';
import { teardownLifecycleClient } from './lifecycle-utils.js';

export interface HandlerContext {
  logger: Logger;
  config: SFCCConfig;
  capabilities: {
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
  };
  workspaceRootsService?: WorkspaceRootsService;
}

export interface ToolExecutionResult {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

function isStructuredContentRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export interface ToolArguments {
  [key: string]: unknown;
}

/**
 * Generic tool specification interface for declarative tool configuration
 */
export interface GenericToolSpec<TArgs = ToolArguments, TResult = unknown> {
  validate?: (args: TArgs, toolName: string) => void;
  defaults?: (args: TArgs) => Partial<TArgs>;
  exec: (args: TArgs, context: ToolExecutionContext) => Promise<TResult>;
  logMessage: (args: TArgs) => string;
}

/**
 * Context provided to tool execution functions
 */
export interface ToolExecutionContext {
  handlerContext: HandlerContext;
  logger: Logger;
  [key: string]: unknown;
}

const INCLUDE_STRUCTURED_ERRORS = process.env.SFCC_MCP_STRUCTURED_ERRORS !== 'false';

export class HandlerError extends ValidationError {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly code: string = 'HANDLER_ERROR',
    public readonly details?: unknown,
  ) {
    super(message, code, details);
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

  protected abstract getToolConfig(): Record<TToolName, GenericToolSpec>;
  protected abstract getToolNameSet(): Set<string>;
  protected abstract createExecutionContext(): Promise<ToolExecutionContext>;

  canHandle(toolName: string): boolean {
    return this.getToolNameSet().has(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported tool: ${toolName}`);
    }

    const spec = this.getToolConfig()[toolName as TToolName];
    if (!spec) {
      throw new Error(`No configuration found for tool: ${toolName}`);
    }

    const processedArgs = this.applyDefaults(spec, args);

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.dispatchTool(toolName, spec, processedArgs),
      spec.logMessage(processedArgs),
    );
  }

  private async dispatchTool(
    toolName: string,
    spec: GenericToolSpec,
    processedArgs: ToolArguments,
  ): Promise<unknown> {
    const context = await this.createExecutionContext();

    if (spec.validate) {
      spec.validate(processedArgs, toolName);
    }

    return spec.exec(processedArgs, context);
  }

  private applyDefaults(spec: GenericToolSpec, args: ToolArguments): ToolArguments {
    return spec.defaults ? { ...args, ...spec.defaults(args) } : args;
  }

  protected async initialize(): Promise<void> {
    if (this._isInitialized) { return; }
    await this.onInitialize();
    this._isInitialized = true;
  }

  protected async onInitialize(): Promise<void> { /* no-op */ }

  async dispose(): Promise<void> {
    try {
      await this.onDispose();
    } finally {
      // Always reset lifecycle state, even when disposal fails.
      this._isInitialized = false;
    }
  }

  protected async onDispose(): Promise<void> { /* no-op */ }

  protected async teardownClient(client: unknown): Promise<void> {
    if (!client) {
      return;
    }

    await teardownLifecycleClient(client);
  }

  protected createResponse(data: unknown, stringify: boolean = true): ToolExecutionResult {
    const structuredContent = isStructuredContentRecord(data) ? data : undefined;
    const payload = structuredContent ?? data;
    const text = stringify
      ? (JSON.stringify(payload, null, 2) ?? 'null')
      : (typeof payload === 'string' ? payload : (JSON.stringify(payload) ?? String(payload)));

    return {
      content: [{ type: 'text', text }],
      structuredContent,
      isError: false,
    };
  }

  protected createErrorResponse(error: Error, toolName: string): ToolExecutionResult {
    this.logger.error(`Error in ${toolName}:`, error);

    const validationError = error instanceof ValidationError ? error : undefined;
    const structuredError = {
      code: validationError?.code ?? 'TOOL_EXECUTION_ERROR',
      message: error.message,
      toolName,
      details: validationError?.details,
    };

    const response: ToolExecutionResult = {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };

    if (INCLUDE_STRUCTURED_ERRORS) {
      response.structuredContent = {
        error: structuredError,
      };
    }

    return response;
  }

  protected async executeWithLogging(
    toolName: string,
    startTime: number,
    operation: () => Promise<unknown>,
    logMessage?: string,
  ): Promise<ToolExecutionResult> {
    try {
      await this.initialize();
      if (logMessage) { this.logger.debug(logMessage); }

      const result = await operation();
      this.logger.timing(toolName, startTime);
      this.logger.debug(`${toolName} completed`, {
        resultType: typeof result,
        resultLength: Array.isArray(result) ? result.length : undefined,
      });

      return this.createResponse(result);
    } catch (error) {
      this.logger.timing(`${toolName}_error`, startTime);
      return this.createErrorResponse(this.toError(error), toolName);
    }
  }

  private toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
