import { HandlerContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { SFCCBestPracticesClient } from '../../clients/best-practices-client.js';
import {
  BEST_PRACTICES_TOOL_CONFIG,
  BestPracticeToolName,
  BEST_PRACTICE_TOOL_NAMES_SET,
} from '../../tool-configs/best-practices-tool-config.js';

/**
 * Handler for SFCC best practices tools
 */
export class BestPracticesToolHandler extends SimpleClientHandler<BestPracticeToolName, SFCCBestPracticesClient> {
  constructor(context: HandlerContext) {
    super(context, 'BestPractices', {
      toolConfig: BEST_PRACTICES_TOOL_CONFIG,
      toolNameSet: BEST_PRACTICE_TOOL_NAMES_SET,
      clientContextKey: 'bestPracticesClient',
      clientDisplayName: 'Best practices',
      createClient: () => new SFCCBestPracticesClient(),
    });
  }
}
