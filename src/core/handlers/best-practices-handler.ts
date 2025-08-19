import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { SFCCBestPracticesClient } from '../../clients/best-practices-client.js';

const BEST_PRACTICE_TOOL_NAMES = [
  'get_available_best_practice_guides',
  'get_best_practice_guide',
  'search_best_practices',
  'get_hook_reference',
] as const;

type BestPracticeToolName = typeof BEST_PRACTICE_TOOL_NAMES[number];

export class BestPracticesToolHandler extends BaseToolHandler {
  private bestPracticesClient: SFCCBestPracticesClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.bestPracticesClient) {
      this.bestPracticesClient = new SFCCBestPracticesClient();
      this.logger.debug('Best practices client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.bestPracticesClient = null;
    this.logger.debug('Best practices client disposed');
  }

  canHandle(toolName: string): boolean {
    return (BEST_PRACTICE_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported best practices tool: ${toolName}`);
    }

    const bpTool = toolName as BestPracticeToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeBestPracticesTool(bpTool, args),
      this.getLogMessage(bpTool, args),
    );
  }

  private async executeBestPracticesTool(toolName: BestPracticeToolName, args: ToolArguments): Promise<any> {
    if (!this.bestPracticesClient) {
      throw new Error('Best practices client not initialized');
    }

    switch (toolName) {
      case 'get_available_best_practice_guides':
        return this.handleGetAvailableGuides();
      case 'get_best_practice_guide':
        return this.handleGetBestPracticeGuide(args);
      case 'search_best_practices':
        return this.handleSearchBestPractices(args);
      case 'get_hook_reference':
        return this.handleGetHookReference(args);
      default:
        throw new Error(`Unknown best practices tool: ${toolName}`);
    }
  }

  private async handleGetAvailableGuides(): Promise<any> {
    return this.bestPracticesClient!.getAvailableGuides();
  }

  private async handleGetBestPracticeGuide(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), 'get_best_practice_guide');
    return this.bestPracticesClient!.getBestPracticeGuide(args.guideName);
  }

  private async handleSearchBestPractices(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), 'search_best_practices');
    return this.bestPracticesClient!.searchBestPractices(args.query);
  }

  private async handleGetHookReference(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), 'get_hook_reference');
    return this.bestPracticesClient!.getHookReference(args.guideName);
  }

  private getLogMessage(toolName: BestPracticeToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_available_best_practice_guides':
        return 'List guides';
      case 'get_best_practice_guide':
        return `Guide ${args.guideName}`;
      case 'search_best_practices':
        return `Search best practices ${args.query}`;
      case 'get_hook_reference':
        return `Hook reference ${args.guideName}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
