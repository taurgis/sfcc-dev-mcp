import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { SFRAClient } from '../../clients/sfra-client.js';

const SFRA_TOOL_NAMES = [
  'get_available_sfra_documents',
  'get_sfra_document',
  'search_sfra_documentation',
  'get_sfra_documents_by_category',
  'get_sfra_categories',
] as const;

type SFRAToolName = typeof SFRA_TOOL_NAMES[number];

export class SFRAToolHandler extends BaseToolHandler {
  private sfraClient: SFRAClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.sfraClient) {
      this.sfraClient = new SFRAClient();
      this.logger.debug('SFRA client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.sfraClient = null;
    this.logger.debug('SFRA client disposed');
  }

  canHandle(toolName: string): boolean {
    return (SFRA_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported SFRA tool: ${toolName}`);
    }

    const sfraTool = toolName as SFRAToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeSFRATool(sfraTool, args),
      this.getLogMessage(sfraTool, args),
    );
  }

  private async executeSFRATool(toolName: SFRAToolName, args: ToolArguments): Promise<any> {
    if (!this.sfraClient) {
      throw new Error('SFRA client not initialized');
    }

    switch (toolName) {
      case 'get_available_sfra_documents':
        return this.handleGetAvailableDocuments();
      case 'get_sfra_document':
        return this.handleGetSFRADocument(args);
      case 'search_sfra_documentation':
        return this.handleSearchSFRADocumentation(args);
      case 'get_sfra_documents_by_category':
        return this.handleGetDocumentsByCategory(args);
      case 'get_sfra_categories':
        return this.handleGetSFRACategories();
      default:
        throw new Error(`Unknown SFRA tool: ${toolName}`);
    }
  }

  private async handleGetAvailableDocuments(): Promise<any> {
    return this.sfraClient!.getAvailableDocuments();
  }

  private async handleGetSFRADocument(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('documentName'), 'get_sfra_document');
    const result = await this.sfraClient!.getSFRADocument(args.documentName);
    if (!result) {
      throw new Error(`SFRA document "${args.documentName}" not found`);
    }
    return result;
  }

  private async handleSearchSFRADocumentation(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), 'search_sfra_documentation');
    return this.sfraClient!.searchSFRADocumentation(args.query);
  }

  private async handleGetDocumentsByCategory(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('category'), 'get_sfra_documents_by_category');
    return this.sfraClient!.getDocumentsByCategory(args.category);
  }

  private async handleGetSFRACategories(): Promise<any> {
    return this.sfraClient!.getAvailableCategories();
  }

  private getLogMessage(toolName: SFRAToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_available_sfra_documents':
        return 'List SFRA docs';
      case 'get_sfra_document':
        return `SFRA doc ${args.documentName}`;
      case 'search_sfra_documentation':
        return `Search SFRA ${args.query}`;
      case 'get_sfra_documents_by_category':
        return `SFRA docs by category ${args.category}`;
      case 'get_sfra_categories':
        return 'SFRA categories';
      default:
        return `Executing ${toolName}`;
    }
  }
}
