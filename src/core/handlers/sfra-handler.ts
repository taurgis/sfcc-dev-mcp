import { HandlerContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { SFRAClient } from '../../clients/sfra-client.js';
import {
  SFRA_TOOL_CONFIG,
  SFRAToolName,
  SFRA_TOOL_NAMES_SET,
} from '../../tool-configs/sfra-tool-config.js';

/**
 * Handler for SFRA documentation tools
 */
export class SFRAToolHandler extends SimpleClientHandler<SFRAToolName, SFRAClient> {
  constructor(context: HandlerContext) {
    super(context, 'SFRA', {
      toolConfig: SFRA_TOOL_CONFIG,
      toolNameSet: SFRA_TOOL_NAMES_SET,
      clientContextKey: 'sfraClient',
      clientDisplayName: 'SFRA',
      createClient: () => new SFRAClient(),
    });
  }
}
