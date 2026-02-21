import { HandlerContext } from './base-handler.js';
import { ConfiguredClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { OCAPICodeVersionsClient } from '../../clients/ocapi/code-versions-client.js';
import {
  CODE_VERSION_TOOL_CONFIG,
  CodeVersionToolName,
  CODE_VERSION_TOOL_NAMES_SET,
} from '../../tool-configs/code-version-tool-config.js';

/**
 * Handler for code version management tools using config-driven dispatch.
 * Provides code version listing, activation, and deployment management.
 */
export class CodeVersionToolHandler extends ConfiguredClientHandler<CodeVersionToolName, OCAPICodeVersionsClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName, {
      createClient: (clientFactory) => clientFactory.createCodeVersionsClient(),
      clientContextKey: 'codeVersionsClient',
      clientDisplayName: 'OCAPI (Code Versions)',
      clientRequiredError: ClientFactory.getClientRequiredError('OCAPI'),
      toolNameSet: CODE_VERSION_TOOL_NAMES_SET,
      toolConfig: CODE_VERSION_TOOL_CONFIG,
    });
  }
}
