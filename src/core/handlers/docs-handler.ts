import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const DOC_TOOL_NAMES = [
  'get_sfcc_class_info',
  'search_sfcc_classes',
  'search_sfcc_methods',
  'list_sfcc_classes',
  'get_sfcc_class_documentation',
] as const;

export class DocsToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (DOC_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported docs tool: ${toolName}`); }
    const docs = this.context.docsClient;
    let result: any; let logMessage = '';
    switch (toolName) {
      case 'get_sfcc_class_info': {
        if (!args?.className) { throw new Error('className is required'); }
        const expand = args?.expand as boolean ?? false;
        logMessage = `Class info ${args.className} expand=${expand}`;
        result = await docs.getClassDetailsExpanded(args.className, expand);
        if (!result) { throw new Error(`Class "${args.className}" not found`); }
        break;
      }
      case 'search_sfcc_classes':
        if (!args?.query) { throw new Error('query is required'); }
        logMessage = `Search classes ${args.query}`;
        result = await docs.searchClasses(args.query);
        break;
      case 'search_sfcc_methods':
        if (!args?.methodName) { throw new Error('methodName is required'); }
        logMessage = `Search methods ${args.methodName}`;
        result = await docs.searchMethods(args.methodName);
        break;
      case 'list_sfcc_classes':
        logMessage = 'List classes';
        result = await docs.getAvailableClasses();
        break;
      case 'get_sfcc_class_documentation':
        if (!args?.className) { throw new Error('className is required'); }
        logMessage = `Raw doc ${args.className}`;
        result = await docs.getClassDocumentation(args.className);
        if (!result) { throw new Error(`Documentation for class "${args.className}" not found`); }
        return this.wrap(toolName, startTime, async () => result, logMessage);
      default:
        throw new Error(`Unknown docs tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
