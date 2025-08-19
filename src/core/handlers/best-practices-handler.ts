import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const BEST_PRACTICE_TOOL_NAMES = [
  'get_available_best_practice_guides',
  'get_best_practice_guide',
  'search_best_practices',
  'get_hook_reference',
] as const;

export class BestPracticesToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (BEST_PRACTICE_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported best practices tool: ${toolName}`); }
    const bp = this.context.bestPracticesClient;
    let result: any; let logMessage = '';
    switch (toolName) {
      case 'get_available_best_practice_guides':
        logMessage = 'List guides';
        result = await bp.getAvailableGuides();
        break;
      case 'get_best_practice_guide':
        if (!args?.guideName) { throw new Error('guideName is required'); }
        logMessage = `Guide ${args.guideName}`;
        result = await bp.getBestPracticeGuide(args.guideName);
        break;
      case 'search_best_practices':
        if (!args?.query) { throw new Error('query is required'); }
        logMessage = `Search best practices ${args.query}`;
        result = await bp.searchBestPractices(args.query);
        break;
      case 'get_hook_reference':
        if (!args?.guideName) { throw new Error('guideName is required'); }
        logMessage = `Hook reference ${args.guideName}`;
        result = await bp.getHookReference(args.guideName);
        break;
      default:
        throw new Error(`Unknown best practices tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
