import { HandlerContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { SFCCDocumentationClient } from '../../clients/docs-client.js';
import { DOCS_TOOL_CONFIG, DocToolName, DOC_TOOL_NAMES_SET } from '../../tool-configs/docs-tool-config.js';

/**
 * Handler for SFCC documentation tools using config-driven dispatch
 * Provides access to SFCC class information, search, and documentation
 */
export class DocsToolHandler extends SimpleClientHandler<DocToolName, SFCCDocumentationClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      toolConfig: DOCS_TOOL_CONFIG,
      toolNameSet: DOC_TOOL_NAMES_SET,
      clientContextKey: 'docsClient',
      clientDisplayName: 'Documentation',
      createClient: () => new SFCCDocumentationClient(),
    });
  }
}
