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
  'get_log_file_contents',
  'get_latest_job_log_files',
  'search_job_logs_by_name',
  'get_job_log_entries',
  'search_job_logs',
  'get_job_execution_summary',
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
      case 'get_log_file_contents':
        return this.handleGetLogFileContents(args);
      case 'get_latest_job_log_files':
        return this.handleGetLatestJobLogFiles(args);
      case 'search_job_logs_by_name':
        return this.handleSearchJobLogsByName(args);
      case 'get_job_log_entries':
        return this.handleGetJobLogEntries(args);
      case 'search_job_logs':
        return this.handleSearchJobLogs(args);
      case 'get_job_execution_summary':
        return this.handleGetJobExecutionSummary(args);
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

  private async handleGetLogFileContents(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('filename'), 'get_log_file_contents');
    const maxBytes = args.maxBytes as number | undefined;
    const tailOnly = args.tailOnly as boolean | undefined;
    return this.logClient!.getLogFileContents(args.filename, maxBytes, tailOnly);
  }

  private async handleGetLatestJobLogFiles(args: ToolArguments): Promise<any> {
    const limit = args?.limit as number | undefined;
    return this.logClient!.getLatestJobLogFiles(limit);
  }

  private async handleSearchJobLogsByName(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), 'search_job_logs_by_name');
    const limit = args?.limit as number | undefined;
    return this.logClient!.searchJobLogsByName(args.jobName, limit);
  }

  private async handleGetJobLogEntries(args: ToolArguments): Promise<any> {
    const level = (args?.level as string) || 'all';
    const limit = (args?.limit as number) || 10;
    const jobName = args?.jobName as string | undefined;

    // Validate level is one of the allowed values
    const allowedLevels = ['error', 'warn', 'info', 'debug', 'all'];
    if (!allowedLevels.includes(level)) {
      throw new Error(`Invalid log level: ${level}. Must be one of: ${allowedLevels.join(', ')}`);
    }

    return this.logClient!.getJobLogEntries(level as any, limit, jobName);
  }

  private async handleSearchJobLogs(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), 'search_job_logs');
    const level = (args?.level as string) || 'all';
    const limit = (args?.limit as number) || 20;
    const jobName = args?.jobName as string | undefined;

    // Validate level is one of the allowed values
    const allowedLevels = ['error', 'warn', 'info', 'debug', 'all'];
    if (!allowedLevels.includes(level)) {
      throw new Error(`Invalid log level: ${level}. Must be one of: ${allowedLevels.join(', ')}`);
    }

    return this.logClient!.searchJobLogs(args.pattern, level as any, limit, jobName);
  }

  private async handleGetJobExecutionSummary(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), 'get_job_execution_summary');
    return this.logClient!.getJobExecutionSummary(args.jobName);
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
      case 'get_log_file_contents':
        return `Reading log file contents: ${args.filename} (maxBytes=${args.maxBytes ?? 'default'}, tailOnly=${args.tailOnly ?? false})`;
      case 'get_latest_job_log_files':
        return `Fetching latest job log files (limit=${limit})`;
      case 'search_job_logs_by_name':
        return `Searching job logs by name: ${args.jobName} (limit=${limit})`;
      case 'get_job_log_entries':
        return `Fetching job log entries level=${args.level ?? 'all'} limit=${limit} jobName=${args.jobName ?? 'all'}`;
      case 'search_job_logs':
        return `Searching job logs pattern="${args.pattern}" level=${args.level ?? 'all'} limit=${limit} jobName=${args.jobName ?? 'all'}`;
      case 'get_job_execution_summary':
        return `Getting job execution summary for: ${args.jobName}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
