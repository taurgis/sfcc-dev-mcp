import { GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
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
export class CodeVersionToolHandler extends AbstractClientHandler<CodeVersionToolName, OCAPICodeVersionsClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected createClient(): OCAPICodeVersionsClient | null {
    return this.clientFactory.createCodeVersionsClient();
  }

  protected getClientContextKey(): string {
    return 'codeVersionsClient';
  }

  protected getClientDisplayName(): string {
    return 'OCAPI (Code Versions)';
  }

  protected getClientRequiredError(): string {
    return ClientFactory.getClientRequiredError('OCAPI');
  }

  protected getToolNameSet(): Set<CodeVersionToolName> {
    return CODE_VERSION_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<CodeVersionToolName, GenericToolSpec<ToolArguments, any>> {
    return CODE_VERSION_TOOL_CONFIG;
  }
}
