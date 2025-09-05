import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { SFRAClient } from '../../clients/sfra-client.js';
import {
  SFRA_TOOL_CONFIG,
  SFRAToolName,
  SFRA_TOOL_NAMES_SET,
} from '../../tool-configs/sfra-tool-config.js';

/**
 * Handler for SFRA documentation tools using config-driven dispatch
 * Provides access to Storefront Reference Architecture documentation
 */
export class SFRAToolHandler extends BaseToolHandler<SFRAToolName> {
  private sfraClient: SFRAClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.sfraClient) {
      this.sfraClient = new SFRAClient();
      this.logger.debug('SFRA client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.sfraClient = null;
    this.logger.debug('SFRA client disposed');
  }

  canHandle(toolName: string): boolean {
    return SFRA_TOOL_NAMES_SET.has(toolName as SFRAToolName);
  }

  protected getToolNameSet(): Set<SFRAToolName> {
    return SFRA_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return SFRA_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.sfraClient) {
      throw new Error('SFRA client not initialized');
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      sfraClient: this.sfraClient,
    };
  }
}
