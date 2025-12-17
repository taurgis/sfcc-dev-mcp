import { AbstractLogToolHandler } from './abstract-log-tool-handler.js';
import { HandlerContext, GenericToolSpec, ToolArguments } from './base-handler.js';
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

  protected getToolNameSet(): Set<JobLogToolName> {
    return JOB_LOG_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return JOB_LOG_TOOL_CONFIG;
  }
}
