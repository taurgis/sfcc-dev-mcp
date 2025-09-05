import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { CartridgeGenerationClient } from '../../clients/cartridge-generation-client.js';
import { ClientFactory } from './client-factory.js';
import {
  CARTRIDGE_TOOL_CONFIG,
  CartridgeToolName,
  CARTRIDGE_TOOL_NAMES_SET,
} from '../../tool-configs/cartridge-tool-config.js';

/**
 * Handler for cartridge generation tools using config-driven dispatch
 * Provides automated cartridge structure creation with complete project setup
 */
export class CartridgeToolHandler extends BaseToolHandler<CartridgeToolName> {
  private cartridgeClient: CartridgeGenerationClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.cartridgeClient) {
      this.cartridgeClient = this.clientFactory.createCartridgeClient();
      this.logger.debug('Cartridge generation client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.cartridgeClient = null;
    this.logger.debug('Cartridge generation client disposed');
  }

  canHandle(toolName: string): boolean {
    return CARTRIDGE_TOOL_NAMES_SET.has(toolName as CartridgeToolName);
  }

  protected getToolNameSet(): Set<CartridgeToolName> {
    return CARTRIDGE_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return CARTRIDGE_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.cartridgeClient) {
      throw new Error('Cartridge generation client not initialized');
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      cartridgeClient: this.cartridgeClient,
    };
  }
}
