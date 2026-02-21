import { HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { SFCCLogClient } from '../../clients/logs/index.js';
import { LOG_TOOL_CONFIG } from '../../tool-configs/log-tool-config.js';
import { LOG_TOOL_NAMES_SET, LogToolName } from '../../utils/log-tool-constants.js';

/**
 * Handler for standard log tools using config-driven dispatch
 */
export class LogToolHandler extends ConfiguredClientHandler<LogToolName, SFCCLogClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createLogClient(),
      clientContextKey: 'logClient',
      clientDisplayName: 'Log',
      clientRequiredError: ClientFactory.getClientRequiredError('Log'),
      toolNameSet: LOG_TOOL_NAMES_SET,
      toolConfig: LOG_TOOL_CONFIG,
    });
  }
}
