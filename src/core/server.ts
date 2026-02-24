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
  CallToolRequestSchema,
  ListToolsRequestSchema,
  RootsListChangedNotificationSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SFCCConfig, DwJsonConfig } from '../types/types.js';
import { Logger } from '../utils/logger.js';
import { ConfigurationFactory } from '../config/configuration-factory.js';
import { WorkspaceRootsService } from '../config/workspace-roots.js';
import {
  ALL_TOOL_DEFINITIONS,
  createToolNameSets,
  getAvailableTools,
  isToolAvailable,
  type LogCapabilityState,
  type ToolDefinition,
  type ToolNameSets,
} from './server-tool-catalog.js';

// Modular tool handlers
import { BaseToolHandler, HandlerContext } from './handlers/base-handler.js';
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
import { SFCCLogClient } from '../clients/log-client.js';
import { ToolArgumentValidator } from './tool-argument-validator.js';
import { createToolCallHandler } from './server-tool-call-lifecycle.js';
import {
  discoverWorkspaceRootsFlow,
  reconfigureWithCredentialsFlow,
} from './server-workspace-discovery.js';

const DEFAULT_SERVER_VERSION = '0.0.0';

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
  private readonly alwaysAvailableToolNames: Set<string>;
  private readonly logCapabilityToolNames: Set<string>;
  private readonly ocapiCapabilityToolNames: Set<string>;
  private readonly toolNameSets: ToolNameSets;
  private logCapabilityState: LogCapabilityState;
  private logCapabilityProbePromise: Promise<void> | null = null;
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
    this.toolNameSets = createToolNameSets();
    this.alwaysAvailableToolNames = this.toolNameSets.alwaysAvailable;
    this.logCapabilityToolNames = this.toolNameSets.logCapability;
    this.ocapiCapabilityToolNames = this.toolNameSets.ocapiCapability;
    this.logCapabilityState = this.determineInitialLogCapabilityState();
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

  private hasBasicWebDAVCredentials(config: SFCCConfig = this.config): boolean {
    return !!(config.username && config.password);
  }

  private hasClientCredentials(config: SFCCConfig = this.config): boolean {
    return !!(config.clientId && config.clientSecret);
  }

  private determineInitialLogCapabilityState(): LogCapabilityState {
    if (!this.capabilities.canAccessLogs) {
      return 'unavailable';
    }

    if (this.hasBasicWebDAVCredentials()) {
      return 'available';
    }

    if (this.hasClientCredentials()) {
      return 'unknown';
    }

    return 'unavailable';
  }

  private async ensureLogCapabilityResolved(): Promise<void> {
    if (this.logCapabilityState !== 'unknown') {
      return;
    }

    this.logCapabilityProbePromise ??= (async () => {
      const verified = await this.verifyWebDAVLogAccess();
      this.logCapabilityState = verified ? 'available' : 'unavailable';
      this.logger.log(`[Server] WebDAV capability probe result: ${this.logCapabilityState}`);
    })().finally(() => {
      this.logCapabilityProbePromise = null;
    });

    await this.logCapabilityProbePromise;
  }

  private async verifyWebDAVLogAccess(): Promise<boolean> {
    if (!this.capabilities.canAccessLogs) {
      return false;
    }

    if (this.hasBasicWebDAVCredentials()) {
      return true;
    }

    if (!this.hasClientCredentials()) {
      return false;
    }

    try {
      const probeClient = new SFCCLogClient(this.config, Logger.getChildLogger('LogCapabilityProbe'));
      await probeClient.listLogFiles();
      return true;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(`[Server] WebDAV capability probe failed: ${reason}`);
      return false;
    }
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
    await discoverWorkspaceRootsFlow({
      logger: this.logger,
      forceRefresh,
      hasExplicitConfiguration: this.hasExplicitConfiguration,
      currentConfig: this.config,
      isConfiguredHostname: (hostname: string | undefined) => this.isConfiguredHostname(hostname),
      listRoots: async () => await this.server.listRoots(),
      workspaceRootsService: this.workspaceRootsService,
      enqueueReconfigure: async (dwConfig: DwJsonConfig) => await this.enqueueReconfigure(dwConfig),
    });
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

    const result = await reconfigureWithCredentialsFlow({
      logger: this.logger,
      dwConfig,
      currentConfig: this.config,
      mapDwJsonToConfig: ConfigurationFactory.mapDwJsonToConfig,
      hasSameConnectionConfig: (current: SFCCConfig, next: SFCCConfig) => this.hasSameConnectionConfig(current, next),
      disposeHandlers: async () => await this.disposeHandlersSafely('reconfigureWithCredentials'),
      applyConfig: (nextConfig: SFCCConfig) => {
        this.config = nextConfig;
        this.capabilities = ConfigurationFactory.getCapabilities(this.config);
        this.logCapabilityState = this.determineInitialLogCapabilityState();
        this.logCapabilityProbePromise = null;

        return {
          hostname: this.config.hostname,
          canAccessLogs: this.capabilities.canAccessLogs,
          canAccessOCAPI: this.capabilities.canAccessOCAPI,
        };
      },
      registerHandlers: () => this.registerHandlers(),
      sendToolListChanged: async () => await this.server.sendToolListChanged(),
    });

    this.logMethodExit('reconfigureWithCredentials', { skipped: result.skipped });
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
      await this.ensureLogCapabilityResolved();
      return { tools: this.getAvailableTools() };
    });

    this.server.setRequestHandler(
      CallToolRequestSchema,
      createToolCallHandler({
        logger: this.logger,
        getHandlers: () => this.handlers,
        logCapabilityToolNames: this.logCapabilityToolNames,
        ensureLogCapabilityResolved: async () => await this.ensureLogCapabilityResolved(),
        isToolAvailable: (toolName: string) => this.isToolAvailable(toolName),
        getCapabilitySnapshot: () => ({
          logCapabilityState: this.logCapabilityState,
          canAccessOCAPI: this.capabilities.canAccessOCAPI,
        }),
        toolArgumentValidator: this.toolArgumentValidator,
        getPreflightNotice: async () => await this.instructionAdvisor.getNotice(),
      }),
    );
  }

  private getAvailableTools(): ToolDefinition[] {
    return getAvailableTools(this.logCapabilityState, this.capabilities.canAccessOCAPI);
  }

  private isToolAvailable(toolName: string): boolean {
    return isToolAvailable(
      toolName,
      this.logCapabilityState,
      this.capabilities.canAccessOCAPI,
      this.toolNameSets,
    );
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
