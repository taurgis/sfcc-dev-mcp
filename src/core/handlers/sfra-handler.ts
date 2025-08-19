import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const SFRA_TOOL_NAMES = [
  'get_available_sfra_documents',
  'get_sfra_document',
  'search_sfra_documentation',
  'get_sfra_documents_by_category',
  'get_sfra_categories',
] as const;

export class SFRAToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (SFRA_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported SFRA tool: ${toolName}`); }
    const sfra = this.context.sfraClient;
    let result: any; let logMessage = '';
    switch (toolName) {
      case 'get_available_sfra_documents':
        logMessage = 'List SFRA docs';
        result = await sfra.getAvailableDocuments();
        break;
      case 'get_sfra_document':
        if (!args?.documentName) { throw new Error('documentName is required'); }
        logMessage = `SFRA doc ${args.documentName}`;
        result = await sfra.getSFRADocument(args.documentName);
        if (!result) { throw new Error(`SFRA document "${args.documentName}" not found`); }
        break;
      case 'search_sfra_documentation':
        if (!args?.query) { throw new Error('query is required'); }
        logMessage = `Search SFRA ${args.query}`;
        result = await sfra.searchSFRADocumentation(args.query);
        break;
      case 'get_sfra_documents_by_category':
        if (!args?.category) { throw new Error('category is required'); }
        logMessage = `SFRA docs by category ${args.category}`;
        result = await sfra.getDocumentsByCategory(args.category);
        break;
      case 'get_sfra_categories':
        logMessage = 'SFRA categories';
        result = await sfra.getAvailableCategories();
        break;
      default:
        throw new Error(`Unknown SFRA tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
