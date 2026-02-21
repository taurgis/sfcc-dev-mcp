/**
 * MCP Server for SFCC Development
 *
 * This module implements the Model Context Protocol (MCP) server for accessing
 * Salesforce B2C Commerce Cloud development features. It provides a standardized interface
 * for AI assistants to interact with SFCC development tools and data.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SFCCConfig, DwJsonConfig } from '../types/types.js';
import { Logger } from '../utils/logger.js';
import { ConfigurationFactory } from '../config/configuration-factory.js';
import { WorkspaceRootsService } from '../config/workspace-roots.js';
import {
  SFCC_DOCUMENTATION_TOOLS,
  SFRA_DOCUMENTATION_TOOLS,
  ISML_DOCUMENTATION_TOOLS,
  LOG_TOOLS,
  JOB_LOG_TOOLS,
  SYSTEM_OBJECT_TOOLS,
  CARTRIDGE_GENERATION_TOOLS,
  CODE_VERSION_TOOLS,
  AGENT_INSTRUCTION_TOOLS,
  SCRIPT_DEBUGGER_TOOLS,
} from './tool-definitions.js';

// Modular tool handlers
import { BaseToolHandler, HandlerContext, ToolExecutionResult } from './handlers/base-handler.js';
import { LogToolHandler } from './handlers/log-handler.js';
import { JobLogToolHandler } from './handlers/job-log-handler.js';
import { DocsToolHandler } from './handlers/docs-handler.js';
import { SFRAToolHandler } from './handlers/sfra-handler.js';
import { ISMLToolHandler } from './handlers/isml-handler.js';
import { SystemObjectToolHandler } from './handlers/system-object-handler.js';
import { CodeVersionToolHandler } from './handlers/code-version-handler.js';
import { CartridgeToolHandler } from './handlers/cartridge-handler.js';
import { AgentInstructionsToolHandler } from './handlers/agent-instructions-handler.js';
import { ScriptDebuggerToolHandler } from './handlers/script-debugger-handler.js';
import { InstructionAdvisor } from './instruction-advisor.js';
import { AgentInstructionsClient } from '../clients/agent-instructions-client.js';

const DEFAULT_SERVER_VERSION = '0.0.0';

function resolveServerVersion(): string {
  try {
    const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as { version?: unknown };
    if (typeof packageJson.version === 'string' && packageJson.version.trim().length > 0) {
      return packageJson.version;
    }
  } catch {
    // Fall through to environment/default fallback.
  }

  return process.env.npm_package_version ?? DEFAULT_SERVER_VERSION;
}

const SERVER_VERSION = resolveServerVersion();
/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCDevServer {
  private server!: Server;
  private logger: Logger;
  private config: SFCCConfig;
  private capabilities: ReturnType<typeof ConfigurationFactory.getCapabilities>;
  private handlers: BaseToolHandler[] = [];
  private workspaceRootsService: WorkspaceRootsService;
  private instructionAdvisor: InstructionAdvisor;

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   */
  constructor(config: SFCCConfig) {
    this.logger = Logger.getChildLogger('Server');
    this.config = config;
    this.logMethodEntry('constructor', { hostname: config.hostname });
    this.capabilities = ConfigurationFactory.getCapabilities(config);
    this.workspaceRootsService = new WorkspaceRootsService(this.logger);
    const advisorClient = new AgentInstructionsClient(this.workspaceRootsService, Logger.getChildLogger('AgentInstructionsAdvisor'));
    this.instructionAdvisor = new InstructionAdvisor(advisorClient, this.logger);
    this.initializeServer();
    this.registerHandlers();
    this.setupToolHandlers();

    this.logMethodExit('constructor');
  }

  private initializeServer(): void {
    this.server = new Server(
      {
        name: 'SFCC Development MCP Server',
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Set up callback for when client is fully initialized
    // This is when we can request workspace roots from the client
    this.server.oninitialized = async () => {
      this.logger.log('[Server] oninitialized callback triggered - client handshake complete');
      await this.discoverWorkspaceRoots();
    };
  }

  private logMethodEntry(methodName: string, params?: any): void {
    this.logger.methodEntry(methodName, params);
  }

  private logMethodExit(methodName: string, result?: any): void {
    this.logger.methodExit(methodName, result);
  }

  /**
   * Discover workspace roots from the MCP client and search for dw.json
   *
   * This method is called after the client is initialized. It uses the
   * MCP roots/list capability to get the client's workspace directories,
   * then delegates to WorkspaceRootsService for discovery and validation.
   *
   * Priority: This is only called when no CLI parameter or environment
   * variables provided credentials (those take precedence).
   */
  private async discoverWorkspaceRoots(): Promise<void> {
    this.logger.log('[Server] discoverWorkspaceRoots called');

    // If we already have a fully configured server (hostname is set), skip discovery
    // This respects the priority: CLI > ENV > MCP workspace roots
    if (this.config.hostname && this.config.hostname !== 'Local Mode' && this.config.hostname !== '') {
      this.logger.log(`[Server] Already configured via CLI or ENV (hostname="${this.config.hostname}"), skipping MCP workspace discovery`);
      return;
    }

    this.logger.log('[Server] No hostname from CLI/ENV, attempting MCP workspace roots discovery...');

    try {
      this.logger.log('[Server] Calling server.listRoots()...');

      // Request workspace roots from the MCP client
      const rootsResponse = await this.server.listRoots();

      this.logger.log(`[Server] listRoots() returned: ${JSON.stringify(rootsResponse)}`);

      // Delegate discovery to the service (single responsibility)
      const discoveryResult = this.workspaceRootsService.discoverDwJson(rootsResponse?.roots);

      if (!discoveryResult.success || !discoveryResult.config) {
        this.logger.log(`[Server] Discovery failed: ${discoveryResult.reason}`);
        return;
      }

      // Reconfigure the server with the discovered credentials
      await this.reconfigureWithCredentials(discoveryResult.config);

      this.logger.log(`[Server] Successfully reconfigured with credentials from ${discoveryResult.dwJsonPath}`);
    } catch (error) {
      // The client might not support roots/list - this is not an error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.log(`[Server] listRoots() threw an error: ${errorMessage}`);
      if (errorStack) {
        this.logger.debug(`[Server] Error stack: ${errorStack}`);
      }

      // Check if the error is because the client doesn't support roots
      if (errorMessage.includes('not supported') || errorMessage.includes('Method not found')) {
        this.logger.log('[Server] Client does not support workspace roots capability');
      }
    }
  }

  /**
   * Reconfigure the server with newly discovered SFCC credentials
   *
   * This updates the config, capabilities, and handlers when we discover
   * a dw.json file in the workspace roots after initialization.
   */
  private async reconfigureWithCredentials(dwConfig: DwJsonConfig): Promise<void> {
    this.logMethodEntry('reconfigureWithCredentials', { hostname: dwConfig.hostname });

    // Dispose of existing handlers
    await this.disposeHandlersSafely('reconfigureWithCredentials');

    // Map dw.json config to SFCCConfig format
    this.config = ConfigurationFactory.mapDwJsonToConfig(dwConfig);

    // Update capabilities
    this.capabilities = ConfigurationFactory.getCapabilities(this.config);

    this.logger.log('Server reconfigured with discovered credentials');
    this.logger.log(`  Hostname: ${this.config.hostname}`);
    this.logger.log(`  Can access logs: ${this.capabilities.canAccessLogs}`);
    this.logger.log(`  Can access OCAPI: ${this.capabilities.canAccessOCAPI}`);

    // Re-register handlers with new configuration
    this.registerHandlers();

    // Notify the client that the tools list has changed
    // This is critical - without this notification, the client won't know
    // that additional tools are now available
    try {
      this.logger.log('[Server] Sending tools/list_changed notification to client...');
      await this.server.sendToolListChanged();
      this.logger.log('[Server] Successfully sent tools/list_changed notification');
    } catch (error) {
      // Some clients may not support this notification - log but don't fail
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.log(`[Server] Failed to send tools/list_changed notification: ${errorMessage}`);
    }

    this.logMethodExit('reconfigureWithCredentials');
  }

  // Register modular handlers (each encapsulates its own responsibility)
  private registerHandlers(): void {
    const context: HandlerContext = {
      logger: this.logger,
      config: this.config,
      capabilities: this.capabilities,
      workspaceRootsService: this.workspaceRootsService,
    };
    this.handlers = [
      new AgentInstructionsToolHandler(context),
      new LogToolHandler(context, 'Log'),
      new JobLogToolHandler(context, 'JobLog'),
      new DocsToolHandler(context),
      new SFRAToolHandler(context),
      new ISMLToolHandler(context),
      new SystemObjectToolHandler(context, 'SystemObjects'),
      new CodeVersionToolHandler(context, 'CodeVersions'),
      new CartridgeToolHandler(context, 'Cartridge'),
      new ScriptDebuggerToolHandler(context, 'ScriptDebugger'),
    ];
  }

  /**
   * Set up MCP tool handlers for SFCC operations
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      // Always available tools
      tools.push(...AGENT_INSTRUCTION_TOOLS);
      tools.push(...SFCC_DOCUMENTATION_TOOLS);
      tools.push(...SFRA_DOCUMENTATION_TOOLS);
      tools.push(...ISML_DOCUMENTATION_TOOLS);
      tools.push(...CARTRIDGE_GENERATION_TOOLS);

      // Conditional tools based on available capabilities
      if (this.capabilities.canAccessLogs) {
        tools.push(...LOG_TOOLS);
        tools.push(...JOB_LOG_TOOLS);
        tools.push(...SCRIPT_DEBUGGER_TOOLS);
      }

      if (this.capabilities.canAccessOCAPI) {
        tools.push(...SYSTEM_OBJECT_TOOLS);
        tools.push(...CODE_VERSION_TOOLS);
      }

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      this.logger.methodEntry(`handleToolRequest:${name}`, args);

      try {
        const preflightNotice = await this.instructionAdvisor.getNotice();
        const handler = this.handlers.find((h) => h.canHandle(name));
        if (!handler) {
          this.logger.error(`Unknown tool requested: ${name}`);
          throw new Error(`Unknown tool: ${name}`);
        }
        const result = await handler.handle(name, args ?? {}, startTime);
        const decoratedResult = preflightNotice
          ? this.attachError(result, preflightNotice)
          : result;

        // Log the full response in debug mode
        this.logger.debug(`Full response for ${name}:`, {
          contentType: decoratedResult.content?.[0]?.type,
          contentLength: decoratedResult.content?.[0]?.text?.length ?? 0,
          responsePreview: decoratedResult.content?.[0]?.text?.substring(0, 200) + (decoratedResult.content?.[0]?.text?.length > 200 ? '...' : ''),
          fullResponse: decoratedResult.content?.[0]?.text,
        });

        return decoratedResult as any;
      } catch (error) {
        this.logger.error(`Error handling tool "${name}":`, error);
        this.logger.timing(`${name}_error`, startTime);
        const errorResult = {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };

        // Log error response in debug mode
        this.logger.debug(`Error response for ${name}:`, errorResult);

        return errorResult as any;
      } finally {
        this.logger.methodExit(`handleToolRequest:${name}`);
      }
    });
  }

  /**
   * Start the MCP server
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();

    // Set up graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    await this.server.connect(transport);
    this.logger.log('SFCC Development MCP server running on stdio');
  }

  /**
   * Gracefully shutdown the server and dispose of resources
   */
  private async shutdown(): Promise<void> {
    this.logger.log('Shutting down SFCC Development MCP server...');

    // Dispose of all handlers
    await this.disposeHandlersSafely('shutdown');

    this.logger.log('SFCC Development MCP server shutdown complete');
    process.exit(0);
  }

  /**
   * Inject a preflight error into JSON responses while preserving existing structure.
   * Falls back to text concatenation if the payload is not valid JSON.
   */
  private attachError(result: ToolExecutionResult, errorMessage: string): ToolExecutionResult {
    const content = result?.content ?? [];
    const [first, ...rest] = content;

    if (first?.type !== 'text' || typeof first.text !== 'string') {
      return result;
    }

    try {
      const parsed = JSON.parse(first.text);
      const existingErrors = Array.isArray(parsed.error)
        ? parsed.error
        : parsed.error
          ? [parsed.error]
          : [];

      const combinedErrors = [...existingErrors, errorMessage];
      parsed.error = combinedErrors.length === 1 ? combinedErrors[0] : combinedErrors;

      return {
        ...result,
        content: [{ ...first, text: JSON.stringify(parsed, null, 2) }, ...rest],
      };
    } catch {
      const merged = [errorMessage, first.text].filter(Boolean).join('\n\n');
      return {
        ...result,
        content: [{ ...first, text: merged }, ...rest],
      };
    }
  }

  /**
   * Dispose handlers without aborting cleanup when one handler fails.
   */
  private async disposeHandlersSafely(operation: string): Promise<void> {
    const disposalResults = await Promise.allSettled(this.handlers.map(handler => handler.dispose()));

    disposalResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const handlerName = this.handlers[index]?.constructor?.name ?? `Handler#${index}`;
        this.logger.warn(
          `[Server] ${operation}: failed to dispose ${handlerName}: ${String(result.reason)}`,
        );
      }
    });
  }
}
