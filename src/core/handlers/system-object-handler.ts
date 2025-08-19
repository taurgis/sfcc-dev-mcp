import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const SYSTEM_OBJECT_TOOL_NAMES = [
  'get_system_object_definitions',
  'get_system_object_definition',
  'search_system_object_attribute_definitions',
  'search_custom_object_attribute_definitions',
  'search_site_preferences',
  'search_system_object_attribute_groups',
] as const;

export class SystemObjectToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (SYSTEM_OBJECT_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported system object tool: ${toolName}`); }
    const { ocapiClient } = this.context;
    if (!ocapiClient) { throw new Error('OCAPI client not configured - ensure credentials are provided in full mode.'); }
    let result: any; let logMessage = '';
    switch (toolName) {
      case 'get_system_object_definitions':
        logMessage = 'Get system object definitions';
        result = await ocapiClient.systemObjects.getSystemObjectDefinitions();
        break;
      case 'get_system_object_definition':
        if (!args?.objectType) { throw new Error('objectType is required'); }
        logMessage = `Get system object definition for ${args.objectType}`;
        result = await ocapiClient.systemObjects.getSystemObjectDefinition(args.objectType);
        break;
      case 'search_system_object_attribute_definitions':
        if (!args?.objectType) { throw new Error('objectType is required'); }
        logMessage = `Search system object attributes for ${args.objectType}`;
        result = await ocapiClient.systemObjects.searchSystemObjectAttributeDefinitions(
          args.objectType,
          args.searchRequest ?? {
            query: { match_all_query: {} },
            select: '(**)',
            count: 200,
          },
        );
        break;
      case 'search_custom_object_attribute_definitions':
        if (!args?.objectType) { throw new Error('objectType is required'); }
        logMessage = `Search custom object attributes for ${args.objectType}`;
        result = await ocapiClient.systemObjects.searchCustomObjectAttributeDefinitions(
          args.objectType,
          args.searchRequest ?? { query: { match_all_query: {} }, count: 200 },
        );
        break;
      case 'search_site_preferences':
        if (!args?.groupId) { throw new Error('groupId is required'); }
        logMessage = `Search site preferences group ${args.groupId}`;
        result = await ocapiClient.sitePreferences.searchSitePreferences(
          args.groupId,
          args.instanceType ?? 'sandbox',
          args.searchRequest ?? { query: { match_all_query: {} }, count: 200 },
          args.options ?? { expand: 'value' },
        );
        break;
      case 'search_system_object_attribute_groups':
        if (!args?.objectType) { throw new Error('objectType is required'); }
        logMessage = `Search attribute groups for ${args.objectType}`;
        result = await ocapiClient.systemObjects.searchSystemObjectAttributeGroups(
          args.objectType,
          args.searchRequest ?? { query: { match_all_query: {} }, count: 200 },
        );
        break;
      default:
        throw new Error(`Unknown system object tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
