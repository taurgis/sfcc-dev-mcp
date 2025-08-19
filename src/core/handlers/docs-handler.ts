import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { SFCCDocumentationClient } from '../../clients/docs-client.js';

const DOC_TOOL_NAMES = [
  'get_sfcc_class_info',
  'search_sfcc_classes',
  'search_sfcc_methods',
  'list_sfcc_classes',
  'get_sfcc_class_documentation',
] as const;

type DocToolName = typeof DOC_TOOL_NAMES[number];

export class DocsToolHandler extends BaseToolHandler {
  private docsClient: SFCCDocumentationClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.docsClient) {
      this.docsClient = new SFCCDocumentationClient();
      this.logger.debug('Documentation client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.docsClient = null;
    this.logger.debug('Documentation client disposed');
  }

  canHandle(toolName: string): boolean {
    return (DOC_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported docs tool: ${toolName}`);
    }

    const docTool = toolName as DocToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeDocumentationTool(docTool, args),
      this.getLogMessage(docTool, args),
    );
  }

  private async executeDocumentationTool(toolName: DocToolName, args: ToolArguments): Promise<any> {
    if (!this.docsClient) {
      throw new Error('Documentation client not initialized');
    }

    switch (toolName) {
      case 'get_sfcc_class_info':
        return this.handleGetClassInfo(args);
      case 'search_sfcc_classes':
        return this.handleSearchClasses(args);
      case 'search_sfcc_methods':
        return this.handleSearchMethods(args);
      case 'list_sfcc_classes':
        return this.handleListClasses();
      case 'get_sfcc_class_documentation':
        return this.handleGetClassDocumentation(args);
      default:
        throw new Error(`Unknown docs tool: ${toolName}`);
    }
  }

  private async handleGetClassInfo(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('className'), 'get_sfcc_class_info');
    const expand = args.expand as boolean ?? false;
    const result = await this.docsClient!.getClassDetailsExpanded(args.className, expand);
    if (!result) {
      throw new Error(`Class "${args.className}" not found`);
    }
    return result;
  }

  private async handleSearchClasses(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), 'search_sfcc_classes');
    return this.docsClient!.searchClasses(args.query);
  }

  private async handleSearchMethods(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('methodName'), 'search_sfcc_methods');
    return this.docsClient!.searchMethods(args.methodName);
  }

  private async handleListClasses(): Promise<any> {
    return this.docsClient!.getAvailableClasses();
  }

  private async handleGetClassDocumentation(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('className'), 'get_sfcc_class_documentation');
    const result = await this.docsClient!.getClassDocumentation(args.className);
    if (!result) {
      throw new Error(`Documentation for class "${args.className}" not found`);
    }
    return result;
  }

  private getLogMessage(toolName: DocToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_sfcc_class_info':
        return `Class info ${args.className} expand=${args.expand ?? false}`;
      case 'search_sfcc_classes':
        return `Search classes ${args.query}`;
      case 'search_sfcc_methods':
        return `Search methods ${args.methodName}`;
      case 'list_sfcc_classes':
        return 'List classes';
      case 'get_sfcc_class_documentation':
        return `Raw doc ${args.className}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
