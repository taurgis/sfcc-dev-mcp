import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { SFCCLogClient } from '../../clients/logs/index.js';
import { LOG_TOOL_CONFIG } from '../../tool-configs/log-tool-config.js';
import { LOG_TOOL_NAMES_SET, LogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for standard log tools using config-driven dispatch
 */
export class LogToolHandler extends AbstractClientHandler<LogToolName, SFCCLogClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected createClient(): SFCCLogClient | null {
    return this.clientFactory.createLogClient();
  }

  protected getClientContextKey(): string {
    return 'logClient';
  }

  protected getClientDisplayName(): string {
    return 'Log';
  }

  protected getClientRequiredError(): string {
    return ClientFactory.getClientRequiredError('Log');
  }

  protected getToolNameSet(): Set<LogToolName> {
    return LOG_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return LOG_TOOL_CONFIG;
  }
}
