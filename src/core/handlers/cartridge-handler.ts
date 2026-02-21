import { HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { CartridgeGenerationClient } from '../../clients/cartridge/index.js';
import {
  CARTRIDGE_TOOL_CONFIG,
  CartridgeToolName,
  CARTRIDGE_TOOL_NAMES_SET,
} from '../../tool-configs/cartridge-tool-config.js';

/**
 * Handler for cartridge generation tools using config-driven dispatch.
 * Provides automated cartridge structure creation with complete project setup.
 */
export class CartridgeToolHandler extends ConfiguredClientHandler<CartridgeToolName, CartridgeGenerationClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createCartridgeClient(),
      clientContextKey: 'cartridgeClient',
      clientDisplayName: 'Cartridge Generation',
      clientRequiredError: 'Cartridge Generation client not initialized',
      toolNameSet: CARTRIDGE_TOOL_NAMES_SET,
      toolConfig: CARTRIDGE_TOOL_CONFIG,
    });
  }
}
