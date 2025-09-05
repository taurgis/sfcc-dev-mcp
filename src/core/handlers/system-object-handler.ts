import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { OCAPIClient } from '../../clients/ocapi-client.js';
import { ClientFactory } from './client-factory.js';
import {
  SYSTEM_OBJECT_TOOL_CONFIG,
  SystemObjectToolName,
  SYSTEM_OBJECT_TOOL_NAMES_SET,
} from '../../tool-configs/system-object-tool-config.js';

/**
 * Handler for system object tools using config-driven dispatch
 * Provides access to SFCC system object definitions, attributes, and site preferences
 */
export class SystemObjectToolHandler extends BaseToolHandler<SystemObjectToolName> {
  private ocapiClient: OCAPIClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.ocapiClient = this.clientFactory.createOCAPIClient();
    if (this.ocapiClient) {
      this.logger.debug('OCAPI client initialized for system objects');
    }
  }

  protected async onDispose(): Promise<void> {
    this.ocapiClient = null;
    this.logger.debug('OCAPI client disposed');
  }

  canHandle(toolName: string): boolean {
    return SYSTEM_OBJECT_TOOL_NAMES_SET.has(toolName as SystemObjectToolName);
  }

  protected getToolNameSet(): Set<SystemObjectToolName> {
    return SYSTEM_OBJECT_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return SYSTEM_OBJECT_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.ocapiClient) {
      throw new Error(ClientFactory.getClientRequiredError('OCAPI'));
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      ocapiClient: this.ocapiClient,
    };
  }
}
