import {
  BaseToolHandler,
  ToolExecutionContext,
  GenericToolSpec,
  HandlerContext,
  ToolArguments,
} from './base-handler.js';
import { ISMLClient } from '../../clients/isml-client.js';
import { ISML_TOOL_CONFIG, ISMLToolName, ISML_TOOL_NAMES_SET } from '../../tool-configs/isml-tool-config.js';

/**
 * Handler for ISML documentation tools using config-driven dispatch
 * Provides access to Internet Store Markup Language element documentation
 */
export class ISMLToolHandler extends BaseToolHandler<ISMLToolName> {
  private ismlClient: ISMLClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.ismlClient) {
      this.ismlClient = new ISMLClient();
      this.logger.debug('ISML client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.ismlClient = null;
    this.logger.debug('ISML client disposed');
  }

  canHandle(toolName: string): boolean {
    return ISML_TOOL_NAMES_SET.has(toolName as ISMLToolName);
  }

  protected getToolNameSet(): Set<ISMLToolName> {
    return ISML_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return ISML_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.ismlClient) {
      throw new Error('ISML client not initialized');
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      ismlClient: this.ismlClient,
    };
  }
}
