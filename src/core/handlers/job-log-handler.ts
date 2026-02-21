import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { SFCCLogClient } from '../../clients/logs/index.js';
import { JOB_LOG_TOOL_CONFIG } from '../../tool-configs/job-log-tool-config.js';
import { JOB_LOG_TOOL_NAMES_SET, JobLogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for job-specific log tools using config-driven dispatch
 */
export class JobLogToolHandler extends AbstractClientHandler<JobLogToolName, SFCCLogClient> {
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

  protected getToolNameSet(): Set<JobLogToolName> {
    return JOB_LOG_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, unknown>> {
    return JOB_LOG_TOOL_CONFIG;
  }
}
