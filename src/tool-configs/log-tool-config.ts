import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { LogToolValidators, LogMessageFormatter } from '../utils/log-tool-utils.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { LogToolName, getLimit } from '../utils/log-tool-constants.js';
import { SFCCLogClient } from '../clients/log-client.js';
import { LogLevel } from '../clients/logs/log-types.js';

/**
 * Factory function to create get_latest_* tool specifications
 * Eliminates repetition across error/warn/info/debug tools
 */
function createLatestLogTool(
  level: LogLevel,
  toolName: LogToolName,
): GenericToolSpec<ToolArguments, any> {
  return {
    defaults: (args: ToolArguments) => ({
      limit: getLimit(args.limit as number, 'latest'),
    }),
    validate: (args: ToolArguments) => LogToolValidators.validateLimit(args.limit as number, toolName),
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.getLatestLogs(level, args.limit as number, args.date as string);
    },
    logMessage: (args: ToolArguments) =>
      LogMessageFormatter.formatLatestLogs(level, args.limit as number, args.date as string),
  };
}

/**
 * Configuration for standard log tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const LOG_TOOL_CONFIG: Record<LogToolName, GenericToolSpec<ToolArguments, any>> = {
  get_latest_error: createLatestLogTool('error', 'get_latest_error'),
  get_latest_warn: createLatestLogTool('warn', 'get_latest_warn'),
  get_latest_info: createLatestLogTool('info', 'get_latest_info'),
  get_latest_debug: createLatestLogTool('debug', 'get_latest_debug'),

  summarize_logs: {
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.summarizeLogs(args.date as string);
    },
    logMessage: (args: ToolArguments) => LogMessageFormatter.formatSummarizeLogs(args.date as string),
  },

  search_logs: {
    defaults: (args: ToolArguments) => ({
      limit: getLimit(args.limit as number, 'search'),
    }),
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), toolName);
      LogToolValidators.validateLimit(args.limit as number, toolName);
      if (args.logLevel) {
        LogToolValidators.validateLogLevel(args.logLevel as string, toolName);
      }
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.searchLogs(
        args.pattern as string,
        args.logLevel as any,
        args.limit as number,
        args.date as string,
      );
    },
    logMessage: (args: ToolArguments) => LogMessageFormatter.formatSearchLogs(
      args.pattern as string,
      args.logLevel as string,
      args.limit as number,
      args.date as string,
    ),
  },

  list_log_files: {
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.listLogFiles();
    },
    logMessage: () => LogMessageFormatter.formatListLogFiles(),
  },

  get_log_file_contents: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('filename'), toolName);
      LogToolValidators.validateFilename(args.filename as string, toolName);
      LogToolValidators.validateMaxBytes(args.maxBytes as number, toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.logClient as SFCCLogClient;
      return client.getLogFileContents(
        args.filename as string,
        args.maxBytes as number,
        args.tailOnly as boolean,
      );
    },
    logMessage: (args: ToolArguments) => LogMessageFormatter.formatGetLogFileContents(
      args.filename as string,
      args.maxBytes as number,
      args.tailOnly as boolean,
    ),
  },
};
