import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { OCAPICodeVersionsClient } from '../../clients/ocapi/code-versions-client.js';
import { ClientFactory } from './client-factory.js';

const CODE_VERSION_TOOL_NAMES = [
  'get_code_versions',
  'activate_code_version',
] as const;

type CodeVersionToolName = typeof CODE_VERSION_TOOL_NAMES[number];

export class CodeVersionToolHandler extends BaseToolHandler {
  private codeVersionsClient: OCAPICodeVersionsClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.codeVersionsClient = this.clientFactory.createCodeVersionsClient();
    if (this.codeVersionsClient) {
      this.logger.debug('Code versions client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.codeVersionsClient = null;
    this.logger.debug('Code versions client disposed');
  }

  canHandle(toolName: string): boolean {
    return (CODE_VERSION_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported code version tool: ${toolName}`);
    }

    const codeVersionTool = toolName as CodeVersionToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeCodeVersionTool(codeVersionTool, args),
      this.getCodeVersionMessage(codeVersionTool, args),
    );
  }

  private async executeCodeVersionTool(toolName: CodeVersionToolName, args: ToolArguments): Promise<any> {
    if (!this.codeVersionsClient) {
      throw new Error(ClientFactory.getClientRequiredError('OCAPI'));
    }

    switch (toolName) {
      case 'get_code_versions':
        return this.handleGetCodeVersions();
      case 'activate_code_version':
        return this.handleActivateCodeVersion(args);
      default:
        throw new Error(`Unknown code version tool: ${toolName}`);
    }
  }

  private async handleGetCodeVersions(): Promise<any> {
    return this.codeVersionsClient!.getCodeVersions();
  }

  private async handleActivateCodeVersion(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('codeVersionId'), 'activate_code_version');
    return this.codeVersionsClient!.activateCodeVersion(args.codeVersionId);
  }

  private getCodeVersionMessage(toolName: CodeVersionToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_code_versions':
        return 'Get code versions';
      case 'activate_code_version':
        return `Activate code version ${args?.codeVersionId}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
