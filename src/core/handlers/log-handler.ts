import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const LOG_TOOL_NAMES = [
  'get_latest_error',
  'get_latest_warn',
  'get_latest_info',
  'get_latest_debug',
  'summarize_logs',
  'search_logs',
  'list_log_files',
] as const;

export class LogToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (LOG_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported log tool: ${toolName}`); }
    if (!this.context.logClient) { throw new Error('Log client not available. SFCC credentials are required for log analysis tools.'); }
    const limit = (args?.limit as number) || (toolName === 'search_logs' ? 20 : 10);
    const date = args?.date as string;
    let logMessage = '';
    let result: any;
    switch (toolName) {
      case 'get_latest_error':
      case 'get_latest_warn':
      case 'get_latest_info':
      case 'get_latest_debug': {
        const level = toolName.replace('get_latest_', '');
        logMessage = `Fetching latest ${level} logs limit=${limit} date=${date || 'today'}`;
        result = await this.context.logClient.getLatestLogs(level, limit, date);
        break;
      }
      case 'summarize_logs':
        logMessage = `Summarizing logs for date ${date || 'today'}`;
        result = await this.context.logClient.summarizeLogs(date);
        break;
      case 'search_logs':
        if (!args?.pattern) { throw new Error('Pattern is required for log search'); }
        logMessage = `Searching logs pattern="${args.pattern}" level=${args.logLevel ?? 'all'} limit=${limit}`;
        result = await this.context.logClient.searchLogs(args.pattern, args.logLevel, limit, date);
        break;
      case 'list_log_files':
        logMessage = 'Listing log files';
        result = await this.context.logClient.listLogFiles();
        break;
      default:
        throw new Error(`Unknown log tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
