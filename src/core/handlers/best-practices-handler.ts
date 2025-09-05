import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { SFCCBestPracticesClient } from '../../clients/best-practices-client.js';
import {
  BEST_PRACTICES_TOOL_CONFIG,
  BestPracticeToolName,
  BEST_PRACTICE_TOOL_NAMES_SET,
} from '../../tool-configs/best-practices-tool-config.js';

/**
 * Handler for SFCC best practices tools using config-driven dispatch
 * Provides access to development guides, security recommendations, and hook references
 */
export class BestPracticesToolHandler extends BaseToolHandler<BestPracticeToolName> {
  private bestPracticesClient: SFCCBestPracticesClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.bestPracticesClient) {
      this.bestPracticesClient = new SFCCBestPracticesClient();
      this.logger.debug('Best practices client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.bestPracticesClient = null;
    this.logger.debug('Best practices client disposed');
  }

  canHandle(toolName: string): boolean {
    return BEST_PRACTICE_TOOL_NAMES_SET.has(toolName as BestPracticeToolName);
  }

  protected getToolNameSet(): Set<BestPracticeToolName> {
    return BEST_PRACTICE_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return BEST_PRACTICES_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.bestPracticesClient) {
      throw new Error('Best practices client not initialized');
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      bestPracticesClient: this.bestPracticesClient,
    };
  }
}
