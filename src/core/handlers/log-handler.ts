import { AbstractLogToolHandler } from './abstract-log-tool-handler.js';
import { HandlerContext, GenericToolSpec, ToolArguments } from './base-handler.js';
import { LOG_TOOL_CONFIG } from '../../tool-configs/log-tool-config.js';
import { LOG_TOOL_NAMES_SET, LogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for standard log tools using config-driven dispatch
 * Handles log reading, searching, and analysis operations
 */
export class LogToolHandler extends AbstractLogToolHandler<LogToolName> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected getToolNameSet(): Set<LogToolName> {
    return LOG_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return LOG_TOOL_CONFIG;
  }
}
