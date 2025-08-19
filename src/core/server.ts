/**
 * MCP Server for SFCC Development
 *
 * This module implements the Model Context Protocol (MCP) server for accessing
 * Salesforce B2C Commerce Cloud development features. It provides a standardized interface
 * for AI assistants to interact with SFCC development tools and data.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { SFCCConfig } from '../types/types.js';
import { SFCCLogClient } from '../clients/log-client.js';
import { SFCCDocumentationClient } from '../clients/docs-client.js';
import { SFCCBestPracticesClient } from '../clients/best-practices-client.js';
import { SFRAClient } from '../clients/sfra-client.js';
import { OCAPIClient } from '../clients/ocapi-client.js';
import { CartridgeGenerationClient } from '../clients/cartridge-generation-client.js';
import { Logger } from '../utils/logger.js';
import { ConfigurationFactory } from '../config/configuration-factory.js';
import {
  SFCC_DOCUMENTATION_TOOLS,
  BEST_PRACTICES_TOOLS,
  SFRA_DOCUMENTATION_TOOLS,
  LOG_TOOLS,
  SYSTEM_OBJECT_TOOLS,
  CARTRIDGE_GENERATION_TOOLS,
  CODE_VERSION_TOOLS,
} from './tool-definitions.js';

// Modular tool handlers
import { BaseToolHandler, HandlerContext } from './handlers/base-handler.js';
import { LogToolHandler } from './handlers/log-handler.js';
import { DocsToolHandler } from './handlers/docs-handler.js';
import { BestPracticesToolHandler } from './handlers/best-practices-handler.js';
import { SFRAToolHandler } from './handlers/sfra-handler.js';
import { SystemObjectToolHandler } from './handlers/system-object-handler.js';
import { CodeVersionToolHandler } from './handlers/code-version-handler.js';
import { CartridgeToolHandler } from './handlers/cartridge-handler.js';
/**
 * MCP Server implementation for SFCC development assistance
 *
 * This class sets up the MCP server, defines available tools, and handles
 * requests from MCP clients (like AI assistants) to interact with SFCC development features.
 */
export class SFCCDevServer {
  private server!: Server;
  private logClient: SFCCLogClient | null = null;
  private docsClient!: SFCCDocumentationClient;
  private bestPracticesClient!: SFCCBestPracticesClient;
  private sfraClient!: SFRAClient;
  private ocapiClient: OCAPIClient | null = null;
  private logger: Logger;
  private cartridgeClient: CartridgeGenerationClient | null = null;
  private capabilities: ReturnType<typeof ConfigurationFactory.getCapabilities>;
  private handlers: BaseToolHandler[] = [];

  /**
   * Initialize the SFCC Development MCP Server
   *
   * @param config - SFCC configuration for connecting to the logging system
   */
  constructor(config: SFCCConfig) {
    this.logger = Logger.getChildLogger('Server');
    this.logMethodEntry('constructor', { hostname: config.hostname });
    this.capabilities = ConfigurationFactory.getCapabilities(config);
    this.initializeClients(config);
    this.initializeServer();
    this.registerHandlers();
    this.setupToolHandlers();

    this.logMethodExit('constructor');
  }

  private initializeClients(config: SFCCConfig): void {
    // Always available clients
    this.docsClient = new SFCCDocumentationClient();
    this.bestPracticesClient = new SFCCBestPracticesClient();
    this.sfraClient = new SFRAClient();

    this.cartridgeClient = new CartridgeGenerationClient();
    // Conditional clients based on capabilities
    if (this.capabilities.canAccessLogs) {
      this.logClient = new SFCCLogClient(config);
      this.logger.debug('Log client initialized');
    }

    if (this.capabilities.canAccessOCAPI) {
      this.ocapiClient = new OCAPIClient({
        hostname: config.hostname!,
        clientId: config.clientId!,
        clientSecret: config.clientSecret!,
        version: 'v23_2',
      });
      this.logger.debug('OCAPI client initialized');
    }
  }

  private initializeServer(): void {
    this.server = new Server(
      {
        name: 'SFCC Development MCP Server',
        version: '1.0.9',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );
  }

  private logMethodEntry(methodName: string, params?: any): void {
    this.logger.methodEntry(methodName, params);
  }

  private logMethodExit(methodName: string, result?: any): void {
    this.logger.methodExit(methodName, result);
  }

  // (Legacy helper methods removed after modular refactor)

  // Register modular handlers (each encapsulates its own responsibility)
  private registerHandlers(): void {
    const context: HandlerContext = {
      logger: this.logger,
      logClient: this.logClient ?? undefined,
      docsClient: this.docsClient,
      bestPracticesClient: this.bestPracticesClient,
      sfraClient: this.sfraClient,
      ocapiClient: this.ocapiClient ?? undefined,
      cartridgeGenerator: this.cartridgeClient ?? undefined,
    } as HandlerContext;
    this.handlers = [
      new LogToolHandler(context, 'Log'),
      new DocsToolHandler(context, 'Docs'),
      new BestPracticesToolHandler(context, 'BestPractices'),
      new SFRAToolHandler(context, 'SFRA'),
      new SystemObjectToolHandler(context, 'SystemObjects'),
      new CodeVersionToolHandler(context, 'CodeVersions'),
      new CartridgeToolHandler(context, 'Cartridge'),
    ];
  }

  /**
   * Set up MCP tool handlers for SFCC operations
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      // Always available tools
      tools.push(...SFCC_DOCUMENTATION_TOOLS);
      tools.push(...BEST_PRACTICES_TOOLS);
      tools.push(...SFRA_DOCUMENTATION_TOOLS);
      tools.push(...CARTRIDGE_GENERATION_TOOLS);

      // Conditional tools based on available clients
      if (this.logClient) {
        tools.push(...LOG_TOOLS);
      }

      if (this.ocapiClient) {
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
        const handler = this.handlers.find((h) => h.canHandle(name));
        if (!handler) {
          this.logger.error(`Unknown tool requested: ${name}`);
          throw new Error(`Unknown tool: ${name}`);
        }
        const result = await handler.handle(name, args, startTime);

        // Log the full response in debug mode
        this.logger.debug(`Full response for ${name}:`, {
          contentType: result.content?.[0]?.type,
          contentLength: result.content?.[0]?.text?.length ?? 0,
          responsePreview: result.content?.[0]?.text?.substring(0, 200) + (result.content?.[0]?.text?.length > 200 ? '...' : ''),
          fullResponse: result.content?.[0]?.text,
        });

        return result as any;
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
    await this.server.connect(transport);
    this.logger.log('SFCC Development MCP server running on stdio');
  }
}
