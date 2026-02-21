import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { SFCCLogClient } from '../../clients/logs/index.js';
import { JOB_LOG_TOOL_CONFIG } from '../../tool-configs/job-log-tool-config.js';
import { JOB_LOG_TOOL_NAMES_SET, JobLogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for job-specific log tools using config-driven dispatch
 */
export class JobLogToolHandler extends ConfiguredClientHandler<JobLogToolName, SFCCLogClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createLogClient(),
      clientContextKey: 'logClient',
      clientDisplayName: 'Log',
      clientRequiredError: ClientFactory.getClientRequiredError('Log'),
      toolNameSet: JOB_LOG_TOOL_NAMES_SET,
      toolConfig: JOB_LOG_TOOL_CONFIG as Record<JobLogToolName, GenericToolSpec<ToolArguments, unknown>>,
    });
  }
}
