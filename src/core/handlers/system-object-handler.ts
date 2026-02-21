import { HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { OCAPIClient } from '../../clients/ocapi-client.js';
import {
  SYSTEM_OBJECT_TOOL_CONFIG,
  SystemObjectToolName,
  SYSTEM_OBJECT_TOOL_NAMES_SET,
} from '../../tool-configs/system-object-tool-config.js';

/**
 * Handler for system object tools using config-driven dispatch.
 * Provides access to SFCC system object definitions, attributes, and site preferences.
 */
export class SystemObjectToolHandler extends ConfiguredClientHandler<SystemObjectToolName, OCAPIClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createOCAPIClient(),
      clientContextKey: 'ocapiClient',
      clientDisplayName: 'OCAPI (System Objects)',
      clientRequiredError: ClientFactory.getClientRequiredError('OCAPI'),
      toolNameSet: SYSTEM_OBJECT_TOOL_NAMES_SET,
      toolConfig: SYSTEM_OBJECT_TOOL_CONFIG,
    });
  }
}
