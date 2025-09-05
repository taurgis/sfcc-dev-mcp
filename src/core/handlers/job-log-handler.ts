import { AbstractLogToolHandler } from './abstract-log-tool-handler.js';
import { HandlerContext } from './base-handler.js';
import { GenericToolSpec } from './base-handler.js';
import { ToolArguments } from './base-handler.js';
import { JOB_LOG_TOOL_CONFIG } from '../../tool-configs/job-log-tool-config.js';
import { JOB_LOG_TOOL_NAMES_SET, JobLogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for job-specific log tools using config-driven dispatch
 * Separates job log operations from standard log operations for better maintainability
 */
export class JobLogToolHandler extends AbstractLogToolHandler<JobLogToolName> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  canHandle(toolName: string): boolean {
    return JOB_LOG_TOOL_NAMES_SET.has(toolName as JobLogToolName);
  }

  protected getToolNameSet(): Set<JobLogToolName> {
    return JOB_LOG_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return JOB_LOG_TOOL_CONFIG;
  }
}
