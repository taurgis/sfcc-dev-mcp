import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
import { CartridgeGenerationClient } from '../../clients/cartridge-generation-client.js';
import {
  CARTRIDGE_TOOL_CONFIG,
  CartridgeToolName,
  CARTRIDGE_TOOL_NAMES_SET,
} from '../../tool-configs/cartridge-tool-config.js';

/**
 * Handler for cartridge generation tools using config-driven dispatch.
 * Provides automated cartridge structure creation with complete project setup.
 */
export class CartridgeToolHandler extends AbstractClientHandler<CartridgeToolName, CartridgeGenerationClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected createClient(): CartridgeGenerationClient {
    return this.clientFactory.createCartridgeClient();
  }

  protected getClientContextKey(): string {
    return 'cartridgeClient';
  }

  protected getClientDisplayName(): string {
    return 'Cartridge Generation';
  }

  protected getToolNameSet(): Set<CartridgeToolName> {
    return CARTRIDGE_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<CartridgeToolName, GenericToolSpec<ToolArguments, any>> {
    return CARTRIDGE_TOOL_CONFIG;
  }
}
