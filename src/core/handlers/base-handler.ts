import { Logger } from '../../utils/logger.js';
import { SFCCConfig } from '../../types/types.js';
import { WorkspaceRootsService } from '../../config/workspace-roots.js';

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
  isError?: boolean;
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

export class HandlerError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly code: string = 'HANDLER_ERROR',
    public readonly details?: unknown,
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

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.dispatchTool(spec, args),
      spec.logMessage(this.applyDefaults(spec, args)),
    );
  }

  private async dispatchTool(spec: GenericToolSpec, args: ToolArguments): Promise<unknown> {
    const context = await this.createExecutionContext();
    const processedArgs = this.applyDefaults(spec, args);

    if (spec.validate) {
      spec.validate(processedArgs, 'tool');
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
    await this.onDispose();
    this._isInitialized = false;
  }

  protected async onDispose(): Promise<void> { /* no-op */ }

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

  protected createResponse(data: unknown, stringify: boolean = true): ToolExecutionResult {
    const text = stringify
      ? (JSON.stringify(data, null, 2) ?? 'null')
      : (typeof data === 'string' ? data : (JSON.stringify(data) ?? String(data)));

    return {
      content: [{ type: 'text', text }],
      isError: false,
    };
  }

  protected createErrorResponse(error: Error, toolName: string): ToolExecutionResult {
    this.logger.error(`Error in ${toolName}:`, error);
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
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
