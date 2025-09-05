import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { SFCCLogClient } from '../../clients/log-client.js';
import { ClientFactory } from './client-factory.js';
import { JobLogValidators, JobLogFormatters } from '../../utils/job-log-utils.js';

const JOB_LOG_TOOL_NAMES = [
  'get_latest_job_log_files',
  'search_job_logs_by_name',
  'get_job_log_entries',
  'search_job_logs',
  'get_job_execution_summary',
] as const;

type JobLogToolName = typeof JOB_LOG_TOOL_NAMES[number];

/**
 * Dedicated handler for job-specific log tools
 * Separates job log operations from standard log operations for better maintainability
 */
export class JobLogToolHandler extends BaseToolHandler {
  private logClient: SFCCLogClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.logClient = this.clientFactory.createLogClient();
    if (this.logClient) {
      this.logger.debug('Job log client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.logClient = null;
    this.logger.debug('Job log client disposed');
  }

  canHandle(toolName: string): boolean {
    return (JOB_LOG_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported job log tool: ${toolName}`);
    }

    const jobLogTool = toolName as JobLogToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeJobLogTool(jobLogTool, args),
      this.getJobLogMessage(jobLogTool, args),
    );
  }

  private async executeJobLogTool(toolName: JobLogToolName, args: ToolArguments): Promise<any> {
    if (!this.logClient) {
      throw new Error(ClientFactory.getClientRequiredError('Log'));
    }

    switch (toolName) {
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
        throw new Error(`Unknown job log tool: ${toolName}`);
    }
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
    const limit = (args?.limit as number) || JobLogValidators.getDefaultLimit('entries');
    const jobName = args?.jobName as string | undefined;

    JobLogValidators.validateJobLogLevel(level, 'get_job_log_entries');
    return this.logClient!.getJobLogEntries(level as any, limit, jobName);
  }

  private async handleSearchJobLogs(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), 'search_job_logs');
    const level = (args?.level as string) || 'all';
    const limit = (args?.limit as number) || JobLogValidators.getDefaultLimit('search');
    const jobName = args?.jobName as string | undefined;

    JobLogValidators.validateJobLogLevel(level, 'search_job_logs');
    return this.logClient!.searchJobLogs(args.pattern, level as any, limit, jobName);
  }

  private async handleGetJobExecutionSummary(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('jobName'), 'get_job_execution_summary');
    return this.logClient!.getJobExecutionSummary(args.jobName);
  }

  /**
   * Generate descriptive log messages for job log operations
   */
  private getJobLogMessage(toolName: JobLogToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_latest_job_log_files':
        return JobLogFormatters.formatJobLogMessage('Fetching latest job log files', {
          limit: args?.limit as number,
        });
      case 'search_job_logs_by_name':
        return JobLogFormatters.formatJobLogMessage('Searching job logs by name', {
          jobName: args.jobName,
          limit: args?.limit as number,
        });
      case 'get_job_log_entries':
        return JobLogFormatters.formatJobLogMessage('Fetching job log entries', {
          level: args?.level as string || 'all',
          limit: (args?.limit as number) || JobLogValidators.getDefaultLimit('entries'),
          jobName: args?.jobName as string,
        });
      case 'search_job_logs':
        return JobLogFormatters.formatJobLogMessage('Searching job logs', {
          pattern: args.pattern,
          level: args?.level as string || 'all',
          limit: (args?.limit as number) || JobLogValidators.getDefaultLimit('search'),
          jobName: args?.jobName as string,
        });
      case 'get_job_execution_summary':
        return `Getting job execution summary for: ${args.jobName}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
