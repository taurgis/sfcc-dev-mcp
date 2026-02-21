/**
 * MCP Server for SFCC Development
 *
 * This module implements the Model Context Protocol (MCP) server for accessing
 * Salesforce B2C Commerce Cloud development features. It provides a standardized interface
 * for AI assistants to interact with SFCC development tools and data.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import {
  type CallToolResult,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  RootsListChangedNotificationSchema,
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
import { ValidationError } from '../utils/validator.js';
import { ToolArgumentValidator } from './tool-argument-validator.js';

const DEFAULT_SERVER_VERSION = '0.0.0';

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: unknown;
};

const ALWAYS_AVAILABLE_TOOLS: ToolDefinition[] = [
  ...AGENT_INSTRUCTION_TOOLS,
  ...SFCC_DOCUMENTATION_TOOLS,
  ...SFRA_DOCUMENTATION_TOOLS,
  ...ISML_DOCUMENTATION_TOOLS,
  ...CARTRIDGE_GENERATION_TOOLS,
];

const LOG_CAPABILITY_TOOLS: ToolDefinition[] = [
  ...LOG_TOOLS,
  ...JOB_LOG_TOOLS,
  ...SCRIPT_DEBUGGER_TOOLS,
];

const OCAPI_CAPABILITY_TOOLS: ToolDefinition[] = [
  ...SYSTEM_OBJECT_TOOLS,
  ...CODE_VERSION_TOOLS,
];

const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
  ...ALWAYS_AVAILABLE_TOOLS,
  ...LOG_CAPABILITY_TOOLS,
  ...OCAPI_CAPABILITY_TOOLS,
];

function resolveServerVersion(): string {
  try {
    const candidatePaths = new Set<string>();

    if (process.argv[1]) {
      candidatePaths.add(resolve(dirname(process.argv[1]), '..', 'package.json'));
    }
    candidatePaths.add(resolve(process.cwd(), 'package.json'));

    for (const packageJsonPath of candidatePaths) {
      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as { version?: unknown };
      if (typeof packageJson.version === 'string' && packageJson.version.trim().length > 0) {
        return packageJson.version;
      }
    }
  } catch {
    // Fall through to environment/default fallback.
  }

  return process.env.npm_package_version ?? DEFAULT_SERVER_VERSION;
}

const SERVER_VERSION = resolveServerVersion();
const INCLUDE_STRUCTURED_ERRORS = process.env.SFCC_MCP_STRUCTURED_ERRORS !== 'false';
/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCDevServer {
  private server!: Server;
  private transport: StdioServerTransport | null = null;
  private logger: Logger;
  private config: SFCCConfig;
  private capabilities: ReturnType<typeof ConfigurationFactory.getCapabilities>;
  private handlers: BaseToolHandler[] = [];
  private workspaceRootsService: WorkspaceRootsService;
  private instructionAdvisor: InstructionAdvisor;
  private readonly hasExplicitConfiguration: boolean;
  private reconfigureQueue: Promise<void> = Promise.resolve();
  private readonly toolArgumentValidator: ToolArgumentValidator;
  private readonly allToolNames: Set<string>;
  private readonly alwaysAvailableToolNames: Set<string>;
  private readonly logCapabilityToolNames: Set<string>;
  private readonly ocapiCapabilityToolNames: Set<string>;
  private shutdownPromise: Promise<void> | null = null;
  private readonly onSigInt = (): void => {
    void this.shutdown();
  };
  private readonly onSigTerm = (): void => {
    void this.shutdown();
  };

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   */
  constructor(config: SFCCConfig) {
    this.logger = Logger.getChildLogger('Server');
    this.config = config;
    this.hasExplicitConfiguration = this.isConfiguredHostname(config.hostname);
    this.logMethodEntry('constructor', { hostname: config.hostname });
    this.capabilities = ConfigurationFactory.getCapabilities(config);
    this.workspaceRootsService = new WorkspaceRootsService(this.logger);
    const advisorClient = new AgentInstructionsClient(this.workspaceRootsService, Logger.getChildLogger('AgentInstructionsAdvisor'));
    this.instructionAdvisor = new InstructionAdvisor(advisorClient, this.logger);
    this.toolArgumentValidator = new ToolArgumentValidator(ALL_TOOL_DEFINITIONS);
    this.allToolNames = new Set(ALL_TOOL_DEFINITIONS.map(tool => tool.name));
    this.alwaysAvailableToolNames = new Set(ALWAYS_AVAILABLE_TOOLS.map(tool => tool.name));
    this.logCapabilityToolNames = new Set(LOG_CAPABILITY_TOOLS.map(tool => tool.name));
    this.ocapiCapabilityToolNames = new Set(OCAPI_CAPABILITY_TOOLS.map(tool => tool.name));
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
      this.logger.debug('[Server] oninitialized callback triggered - client handshake complete');
      await this.discoverWorkspaceRoots();
    };

    this.server.setNotificationHandler(RootsListChangedNotificationSchema, async () => {
      this.logger.debug('[Server] Received roots/list_changed notification from client');
      await this.discoverWorkspaceRoots(true);
    });
  }

  private logMethodEntry(methodName: string, params?: unknown): void {
    this.logger.methodEntry(methodName, params);
  }

  private logMethodExit(methodName: string, result?: unknown): void {
    this.logger.methodExit(methodName, result);
  }

  private isConfiguredHostname(hostname: string | undefined): boolean {
    return !!(hostname && hostname.trim().length > 0 && hostname !== 'Local Mode');
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
  private async discoverWorkspaceRoots(forceRefresh: boolean = false): Promise<void> {
    this.logger.debug('[Server] discoverWorkspaceRoots called');

    // Respect discovery priority for explicit config (CLI/ENV).
    if (this.hasExplicitConfiguration) {
      this.logger.debug('[Server] Explicit CLI/ENV configuration detected, skipping MCP workspace discovery');
      return;
    }

    // Non-forced discovery only needs to run before we have an active host.
    if (!forceRefresh && this.isConfiguredHostname(this.config.hostname)) {
      this.logger.debug(`[Server] Already configured from workspace roots (hostname="${this.config.hostname}"), skipping duplicate discovery`);
      return;
    }

    this.logger.debug('[Server] No hostname from CLI/ENV, attempting MCP workspace roots discovery...');

    try {
      this.logger.debug('[Server] Calling server.listRoots()...');

      // Request workspace roots from the MCP client
      const rootsResponse = await this.server.listRoots();

      this.logger.debug('[Server] listRoots() returned roots payload');

      // Delegate discovery to the service (single responsibility)
      const discoveryResult = this.workspaceRootsService.discoverDwJson(rootsResponse?.roots);

      if (!discoveryResult.success || !discoveryResult.config) {
        this.logger.debug(`[Server] Discovery failed: ${discoveryResult.reason}`);
        return;
      }

      // Reconfigure the server with discovered credentials in a serialized queue.
      await this.enqueueReconfigure(discoveryResult.config);

      this.logger.log('[Server] Successfully reconfigured with credentials from workspace roots');
      if (discoveryResult.dwJsonPath) {
        this.logger.debug(`[Server] Discovery source: ${discoveryResult.dwJsonPath}`);
      }
    } catch (error) {
      // The client might not support roots/list - this is not an error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.debug(`[Server] listRoots() threw an error: ${errorMessage}`);
      if (errorStack) {
        this.logger.debug(`[Server] Error stack: ${errorStack}`);
      }

      // Check if the error is because the client doesn't support roots
      if (errorMessage.includes('not supported') || errorMessage.includes('Method not found')) {
        this.logger.debug('[Server] Client does not support workspace roots capability');
      }
    }
  }

  private async enqueueReconfigure(dwConfig: DwJsonConfig): Promise<void> {
    const currentTask = this.reconfigureQueue.then(() => this.reconfigureWithCredentials(dwConfig));

    this.reconfigureQueue = currentTask.catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`[Server] Reconfigure queue task failed: ${message}`);
    });

    await currentTask;
  }

  /**
   * Reconfigure the server with newly discovered SFCC credentials
   *
   * This updates the config, capabilities, and handlers when we discover
   * a dw.json file in the workspace roots after initialization.
   */
  private async reconfigureWithCredentials(dwConfig: DwJsonConfig): Promise<void> {
    this.logMethodEntry('reconfigureWithCredentials', { hostname: dwConfig.hostname });

    const nextConfig = ConfigurationFactory.mapDwJsonToConfig(dwConfig);
    if (this.hasSameConnectionConfig(this.config, nextConfig)) {
      this.logger.log('[Server] Discovered configuration matches active settings, skipping reconfigure');
      this.logMethodExit('reconfigureWithCredentials', { skipped: true });
      return;
    }

    // Dispose of existing handlers
    await this.disposeHandlersSafely('reconfigureWithCredentials');

    // Apply mapped config from discovered dw.json.
    this.config = nextConfig;

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

  private hasSameConnectionConfig(current: SFCCConfig, next: SFCCConfig): boolean {
    return current.hostname === next.hostname &&
      current.username === next.username &&
      current.password === next.password &&
      current.clientId === next.clientId &&
      current.clientSecret === next.clientSecret &&
      current.siteId === next.siteId;
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
      return { tools: this.getAvailableTools() };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      this.logger.methodEntry(`handleToolRequest:${name}`, args);

      try {
        const handler = this.handlers.find((h) => h.canHandle(name));
        if (!handler) {
          throw new ValidationError(`Unknown tool: ${name}`, 'UNKNOWN_TOOL', { toolName: name });
        }

        if (!this.isToolAvailable(name)) {
          throw new ValidationError(
            `Tool not available in current mode: ${name}`,
            'TOOL_NOT_AVAILABLE',
            {
              toolName: name,
              canAccessLogs: this.capabilities.canAccessLogs,
              canAccessOCAPI: this.capabilities.canAccessOCAPI,
            },
          );
        }

        this.toolArgumentValidator.validate(name, args ?? {});

        const preflightNotice = await this.instructionAdvisor.getNotice();
        const result = await handler.handle(name, args ?? {}, startTime);
        const decoratedResult = preflightNotice
          ? this.appendPreflightNotice(result, preflightNotice)
          : result;

        // Log the full response in debug mode
        this.logger.debug(`Full response for ${name}:`, {
          contentItems: decoratedResult.content?.length ?? 0,
          contentTypes: (decoratedResult.content ?? []).map(item => item.type),
          hasStructuredContent: decoratedResult.structuredContent !== undefined,
          isError: decoratedResult.isError ?? false,
        });

        return {
          content: decoratedResult.content,
          structuredContent: decoratedResult.structuredContent,
          isError: decoratedResult.isError,
        };
      } catch (error) {
        this.logger.error(`Error handling tool "${name}":`, error);
        this.logger.timing(`${name}_error`, startTime);
        const structuredError = this.createStructuredError(name, error);
        const errorResult: CallToolResult = {
          content: [
            {
              type: 'text',
              text: `Error: ${structuredError.message}`,
            },
          ],
          isError: true,
        };

        if (INCLUDE_STRUCTURED_ERRORS) {
          errorResult.structuredContent = {
            error: structuredError,
          };
        }

        // Log error response in debug mode
        this.logger.debug(`Error response for ${name}:`, errorResult);

        return errorResult;
      } finally {
        this.logger.methodExit(`handleToolRequest:${name}`);
      }
    });
  }

  private getAvailableTools(): ToolDefinition[] {
    const tools: ToolDefinition[] = [...ALWAYS_AVAILABLE_TOOLS];

    if (this.capabilities.canAccessLogs) {
      tools.push(...LOG_CAPABILITY_TOOLS);
    }

    if (this.capabilities.canAccessOCAPI) {
      tools.push(...OCAPI_CAPABILITY_TOOLS);
    }

    return tools;
  }

  private isToolAvailable(toolName: string): boolean {
    if (this.alwaysAvailableToolNames.has(toolName)) {
      return true;
    }

    if (this.logCapabilityToolNames.has(toolName)) {
      return this.capabilities.canAccessLogs;
    }

    if (this.ocapiCapabilityToolNames.has(toolName)) {
      return this.capabilities.canAccessOCAPI;
    }

    return false;
  }

  private createStructuredError(toolName: string, error: unknown): {
    code: string;
    message: string;
    toolName: string;
    details?: unknown;
  } {
    if (error instanceof ValidationError) {
      return {
        code: error.code,
        message: error.message,
        toolName,
        details: error.details,
      };
    }

    if (error instanceof Error) {
      return {
        code: 'TOOL_EXECUTION_ERROR',
        message: error.message,
        toolName,
      };
    }

    return {
      code: 'TOOL_EXECUTION_ERROR',
      message: String(error),
      toolName,
    };
  }

  /**
   * Start the MCP server
   */
  async run(): Promise<void> {
    this.transport = new StdioServerTransport();

    // Set up graceful shutdown
    process.off('SIGINT', this.onSigInt);
    process.off('SIGTERM', this.onSigTerm);
    process.on('SIGINT', this.onSigInt);
    process.on('SIGTERM', this.onSigTerm);

    await this.server.connect(this.transport);
    this.logger.log('SFCC Development MCP server running on stdio');
  }

  /**
   * Gracefully shutdown the server and dispose of resources
   */
  private async shutdown(): Promise<void> {
    if (this.shutdownPromise) {
      await this.shutdownPromise;
      return;
    }

    this.shutdownPromise = (async () => {
      this.logger.log('Shutting down SFCC Development MCP server...');

      // Detach process listeners first so repeated run()/shutdown() cycles do not retain closures.
      process.off('SIGINT', this.onSigInt);
      process.off('SIGTERM', this.onSigTerm);

      // Dispose of all handlers
      await this.disposeHandlersSafely('shutdown');

      await this.closeConnectionsSafely();
      await this.flushLogsSafely();

      this.logger.log('SFCC Development MCP server shutdown complete');
    })();

    await this.shutdownPromise;
  }

  private async closeConnectionsSafely(): Promise<void> {
    const serverWithClose = this.server as Server & { close?: () => Promise<void> | void };
    const transportWithClose = this.transport as (StdioServerTransport & { close?: () => Promise<void> | void }) | null;

    try {
      if (typeof serverWithClose.close === 'function') {
        await serverWithClose.close();
      }
    } catch (error) {
      this.logger.warn(`[Server] shutdown: failed to close server connection: ${String(error)}`);
    }

    try {
      if (transportWithClose && typeof transportWithClose.close === 'function') {
        await transportWithClose.close();
      }
    } catch (error) {
      this.logger.warn(`[Server] shutdown: failed to close stdio transport: ${String(error)}`);
    } finally {
      this.transport = null;
    }
  }

  private async flushLogsSafely(): Promise<void> {
    try {
      await this.logger.flush();
    } catch (error) {
      process.stderr.write(`[Server] Failed to flush logs during shutdown: ${String(error)}\n`);
    }
  }

  /**
   * Append advisory text as a separate content item without mutating tool payloads.
   */
  private appendPreflightNotice(result: ToolExecutionResult, notice: string): ToolExecutionResult {
    const trimmedNotice = notice.trim();
    if (trimmedNotice.length === 0) {
      return result;
    }

    const content = result?.content ?? [];
    const alreadyIncluded = content.some(item => item.type === 'text' && item.text === trimmedNotice);
    if (alreadyIncluded) {
      return result;
    }

    return {
      ...result,
      content: [...content, { type: 'text', text: trimmedNotice }],
    };
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
