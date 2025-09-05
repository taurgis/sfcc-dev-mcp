import { ToolSpec, LogToolValidators, LogMessageFormatter } from '../../utils/log-tool-utils.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { LogToolName, getLimit } from '../../utils/log-tool-constants.js';

/**
 * Configuration for standard log tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const LOG_TOOL_CONFIG: Record<LogToolName, ToolSpec> = {
  get_latest_error: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'latest'),
    }),
    validate: (args) => LogToolValidators.validateLimit(args.limit as number, 'get_latest_error'),
    exec: async (args, client) => client.getLatestLogs('error', args.limit as number, args.date as string),
    logMessage: (args) => LogMessageFormatter.formatLatestLogs('error', args.limit as number, args.date as string),
  },

  get_latest_warn: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'latest'),
    }),
    validate: (args) => LogToolValidators.validateLimit(args.limit as number, 'get_latest_warn'),
    exec: async (args, client) => client.getLatestLogs('warn', args.limit as number, args.date as string),
    logMessage: (args) => LogMessageFormatter.formatLatestLogs('warn', args.limit as number, args.date as string),
  },

  get_latest_info: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'latest'),
    }),
    validate: (args) => LogToolValidators.validateLimit(args.limit as number, 'get_latest_info'),
    exec: async (args, client) => client.getLatestLogs('info', args.limit as number, args.date as string),
    logMessage: (args) => LogMessageFormatter.formatLatestLogs('info', args.limit as number, args.date as string),
  },

  get_latest_debug: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'latest'),
    }),
    validate: (args) => LogToolValidators.validateLimit(args.limit as number, 'get_latest_debug'),
    exec: async (args, client) => client.getLatestLogs('debug', args.limit as number, args.date as string),
    logMessage: (args) => LogMessageFormatter.formatLatestLogs('debug', args.limit as number, args.date as string),
  },

  summarize_logs: {
    exec: async (args, client) => client.summarizeLogs(args.date as string),
    logMessage: (args) => LogMessageFormatter.formatSummarizeLogs(args.date as string),
  },

  search_logs: {
    defaults: (args) => ({
      limit: getLimit(args.limit as number, 'search'),
    }),
    validate: (args, toolName) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('pattern'), toolName);
      LogToolValidators.validateLimit(args.limit as number, toolName);
      if (args.logLevel) {
        LogToolValidators.validateLogLevel(args.logLevel as string, toolName);
      }
    },
    exec: async (args, client) => client.searchLogs(
      args.pattern as string,
      args.logLevel as any,
      args.limit as number,
      args.date as string,
    ),
    logMessage: (args) => LogMessageFormatter.formatSearchLogs(
      args.pattern as string,
      args.logLevel as string,
      args.limit as number,
      args.date as string,
    ),
  },

  list_log_files: {
    exec: async (args, client) => client.listLogFiles(),
    logMessage: () => LogMessageFormatter.formatListLogFiles(),
  },

  get_log_file_contents: {
    validate: (args, toolName) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('filename'), toolName);
      LogToolValidators.validateFilename(args.filename as string, toolName);
      LogToolValidators.validateMaxBytes(args.maxBytes as number, toolName);
    },
    exec: async (args, client) => client.getLogFileContents(
      args.filename as string,
      args.maxBytes as number,
      args.tailOnly as boolean,
    ),
    logMessage: (args) => LogMessageFormatter.formatGetLogFileContents(
      args.filename as string,
      args.maxBytes as number,
      args.tailOnly as boolean,
    ),
  },
};
