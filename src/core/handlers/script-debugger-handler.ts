import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { ScriptDebuggerClient } from '../../clients/script-debugger/index.js';
import {
  SCRIPT_DEBUGGER_TOOL_CONFIG,
  ScriptDebuggerToolName,
  SCRIPT_DEBUGGER_TOOL_NAMES_SET,
} from '../../tool-configs/script-debugger-tool-config.js';

/**
 * Handler for script debugger tools using config-driven dispatch.
 * Provides script evaluation capabilities via the SFCC Script Debugger API.
 */
export class ScriptDebuggerToolHandler extends ConfiguredClientHandler<
  ScriptDebuggerToolName,
  ScriptDebuggerClient
> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createScriptDebuggerClient(),
      clientContextKey: 'scriptDebuggerClient',
      clientDisplayName: 'Script Debugger',
      clientRequiredError: ClientFactory.getClientRequiredError('ScriptDebugger'),
      toolNameSet: SCRIPT_DEBUGGER_TOOL_NAMES_SET,
      toolConfig: SCRIPT_DEBUGGER_TOOL_CONFIG as Record<
        ScriptDebuggerToolName,
        GenericToolSpec<ToolArguments, unknown>
      >,
    });
  }
}
