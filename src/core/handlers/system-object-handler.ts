import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
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
export class SystemObjectToolHandler extends AbstractClientHandler<SystemObjectToolName, OCAPIClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected createClient(): OCAPIClient | null {
    return this.clientFactory.createOCAPIClient();
  }

  protected getClientContextKey(): string {
    return 'ocapiClient';
  }

  protected getClientDisplayName(): string {
    return 'OCAPI (System Objects)';
  }

  protected getClientRequiredError(): string {
    return ClientFactory.getClientRequiredError('OCAPI');
  }

  protected getToolNameSet(): Set<SystemObjectToolName> {
    return SYSTEM_OBJECT_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<SystemObjectToolName, GenericToolSpec<ToolArguments, any>> {
    return SYSTEM_OBJECT_TOOL_CONFIG;
  }
}
