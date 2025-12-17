import { GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';

/**
 * Abstract base class for OCAPI-based tool handlers.
 * Extends AbstractClientHandler with OCAPI-specific error handling.
 *
 * This class handles:
 * - OCAPI-specific error messages via ClientFactory
 *
 * Subclasses only need to implement:
 * - getToolConfig(): Return the tool configuration
 * - getToolNameSet(): Return the set of tool names
 * - createClient(): Create the specific OCAPI client
 * - getClientContextKey(): Return the context key for the client
 * - getClientDisplayName(): Return a descriptive name for logging
 */
export abstract class AbstractOCAPIHandler<
  TToolName extends string,
  TClient
> extends AbstractClientHandler<TToolName, TClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  /**
   * Override to use the standard OCAPI error message from ClientFactory.
   */
  protected getClientRequiredError(): string {
    return ClientFactory.getClientRequiredError('OCAPI');
  }

  /**
   * Abstract method to get tool configuration.
   * Each concrete handler implements this with their specific config.
   */
  protected abstract getToolConfig(): Record<TToolName, GenericToolSpec<ToolArguments, any>>;

  /**
   * Abstract method to get tool name set for O(1) lookup.
   * Each concrete handler implements this with their specific tool set.
   */
  protected abstract getToolNameSet(): Set<TToolName>;
}
