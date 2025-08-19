import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { SFCCLogClient } from '../../clients/log-client.js';
import { ClientFactory } from './client-factory.js';

const LOG_TOOL_NAMES = [
  'get_latest_error',
  'get_latest_warn',
  'get_latest_info',
  'get_latest_debug',
  'summarize_logs',
  'search_logs',
  'list_log_files',
] as const;

type LogToolName = typeof LOG_TOOL_NAMES[number];

export class LogToolHandler extends BaseToolHandler {
  private logClient: SFCCLogClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.logClient = this.clientFactory.createLogClient();
    if (this.logClient) {
      this.logger.debug('Log client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.logClient = null;
    this.logger.debug('Log client disposed');
  }

  canHandle(toolName: string): boolean {
    return (LOG_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported log tool: ${toolName}`);
    }

    const logTool = toolName as LogToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeLogTool(logTool, args),
      this.getLogMessage(logTool, args),
    );
  }

  private async executeLogTool(toolName: LogToolName, args: ToolArguments): Promise<any> {
    if (!this.logClient) {
      throw new Error(ClientFactory.getClientRequiredError('Log'));
    }

    const limit = (args?.limit as number) || (toolName === 'search_logs' ? 20 : 10);
    const date = args?.date as string;

    switch (toolName) {
      case 'get_latest_error':
      case 'get_latest_warn':
      case 'get_latest_info':
      case 'get_latest_debug':
        return this.handleGetLatestLogs(toolName, limit, date);
      case 'summarize_logs':
        return this.handleSummarizeLogs(date);
      case 'search_logs':
        return this.handleSearchLogs(args, limit, date);
      case 'list_log_files':
        return this.handleListLogFiles();
      default:
        throw new Error(`Unknown log tool: ${toolName}`);
    }
  }

  private async handleGetLatestLogs(toolName: LogToolName, limit: number, date?: string): Promise<any> {
    const level = toolName.replace('get_latest_', '') as any; // Cast to avoid type issues
    return this.logClient!.getLatestLogs(level, limit, date);
  }

  private async handleSummarizeLogs(date?: string): Promise<any> {
    return this.logClient!.summarizeLogs(date);
  }

  private async handleSearchLogs(args: ToolArguments, limit: number, date?: string): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), 'search_logs');
    return this.logClient!.searchLogs(args.pattern, args.logLevel, limit, date);
  }

  private async handleListLogFiles(): Promise<any> {
    return this.logClient!.listLogFiles();
  }

  private getLogMessage(toolName: LogToolName, args: ToolArguments): string {
    const limit = (args?.limit as number) || (toolName === 'search_logs' ? 20 : 10);
    const date = args?.date as string;

    switch (toolName) {
      case 'get_latest_error':
      case 'get_latest_warn':
      case 'get_latest_info':
      case 'get_latest_debug': {
        const level = toolName.replace('get_latest_', '');
        return `Fetching latest ${level} logs limit=${limit} date=${date || 'today'}`;
      }
      case 'summarize_logs':
        return `Summarizing logs for date ${date || 'today'}`;
      case 'search_logs':
        return `Searching logs pattern="${args.pattern}" level=${args.logLevel ?? 'all'} limit=${limit}`;
      case 'list_log_files':
        return 'Listing log files';
      default:
        return `Executing ${toolName}`;
    }
  }
}
