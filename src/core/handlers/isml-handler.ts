import { HandlerContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { ISMLClient } from '../../clients/isml-client.js';
import { ISML_TOOL_CONFIG, ISMLToolName, ISML_TOOL_NAMES_SET } from '../../tool-configs/isml-tool-config.js';

/**
 * Handler for ISML documentation tools
 */
export class ISMLToolHandler extends SimpleClientHandler<ISMLToolName, ISMLClient> {
  constructor(context: HandlerContext) {
    super(context, 'ISML', {
      toolConfig: ISML_TOOL_CONFIG,
      toolNameSet: ISML_TOOL_NAMES_SET,
      clientContextKey: 'ismlClient',
      clientDisplayName: 'ISML',
      createClient: () => new ISMLClient(),
    });
  }
}
