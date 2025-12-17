/**
 * Handler Factory
 *
 * Creates standardized tool handlers using the SimpleClientHandler pattern.
 * Eliminates boilerplate for handlers that simply wrap a single client.
 */

import { HandlerContext, GenericToolSpec, ToolArguments } from './base-handler.js';
import { SimpleClientHandler, SimpleClientConfig } from './simple-client-handler.js';

/**
 * Configuration for creating a handler via factory
 */
export interface HandlerFactoryConfig<TToolName extends string, TClient> {
  /** Tool configuration mapping tool names to specs */
  toolConfig: Record<TToolName, GenericToolSpec<ToolArguments, any>>;
  /** Set of tool names for O(1) lookup */
  toolNameSet: Set<TToolName>;
  /** Key name for the client in the execution context */
  clientContextKey: string;
  /** Human-readable client name for logging/errors */
  clientDisplayName: string;
  /** Factory function to create the client */
  createClient: () => TClient;
}

/**
 * Creates a SimpleClientHandler with the given configuration
 *
 * @example
 * const handler = createHandler(context, 'Docs', {
 *   toolConfig: DOCS_TOOL_CONFIG,
 *   toolNameSet: DOC_TOOL_NAMES_SET,
 *   clientContextKey: 'docsClient',
 *   clientDisplayName: 'Documentation',
 *   createClient: () => new SFCCDocumentationClient(),
 * });
 */
export function createHandler<TToolName extends string, TClient>(
  context: HandlerContext,
  subLoggerName: string,
  config: HandlerFactoryConfig<TToolName, TClient>,
): SimpleClientHandler<TToolName, TClient> {
  return new SimpleClientHandler(context, subLoggerName, config as SimpleClientConfig<TToolName, TClient>);
}
