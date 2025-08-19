import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { OCAPIClient } from '../../clients/ocapi-client.js';
import { ClientFactory } from './client-factory.js';

const SYSTEM_OBJECT_TOOL_NAMES = [
  'get_system_object_definitions',
  'get_system_object_definition',
  'search_system_object_attribute_definitions',
  'search_custom_object_attribute_definitions',
  'search_site_preferences',
  'search_system_object_attribute_groups',
] as const;

type SystemObjectToolName = typeof SYSTEM_OBJECT_TOOL_NAMES[number];

export class SystemObjectToolHandler extends BaseToolHandler {
  private ocapiClient: OCAPIClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.ocapiClient = this.clientFactory.createOCAPIClient();
    if (this.ocapiClient) {
      this.logger.debug('OCAPI client initialized for system objects');
    }
  }

  protected async onDispose(): Promise<void> {
    this.ocapiClient = null;
    this.logger.debug('OCAPI client disposed');
  }

  canHandle(toolName: string): boolean {
    return (SYSTEM_OBJECT_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported system object tool: ${toolName}`);
    }

    const systemObjectTool = toolName as SystemObjectToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeSystemObjectTool(systemObjectTool, args),
      this.getSystemObjectMessage(systemObjectTool, args),
    );
  }

  private async executeSystemObjectTool(toolName: SystemObjectToolName, args: ToolArguments): Promise<any> {
    if (!this.ocapiClient) {
      throw new Error(ClientFactory.getClientRequiredError('OCAPI'));
    }

    switch (toolName) {
      case 'get_system_object_definitions':
        return this.handleGetSystemObjectDefinitions();
      case 'get_system_object_definition':
        return this.handleGetSystemObjectDefinition(args);
      case 'search_system_object_attribute_definitions':
        return this.handleSearchSystemObjectAttributeDefinitions(args);
      case 'search_custom_object_attribute_definitions':
        return this.handleSearchCustomObjectAttributeDefinitions(args);
      case 'search_site_preferences':
        return this.handleSearchSitePreferences(args);
      case 'search_system_object_attribute_groups':
        return this.handleSearchSystemObjectAttributeGroups(args);
      default:
        throw new Error(`Unknown system object tool: ${toolName}`);
    }
  }

  private async handleGetSystemObjectDefinitions(): Promise<any> {
    return this.ocapiClient!.systemObjects.getSystemObjectDefinitions();
  }

  private async handleGetSystemObjectDefinition(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), 'get_system_object_definition');
    return this.ocapiClient!.systemObjects.getSystemObjectDefinition(args.objectType);
  }

  private async handleSearchSystemObjectAttributeDefinitions(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), 'search_system_object_attribute_definitions');
    const defaultSearchRequest = {
      query: { match_all_query: {} },
      select: '(**)',
      count: 200,
    };
    return this.ocapiClient!.systemObjects.searchSystemObjectAttributeDefinitions(
      args.objectType,
      args.searchRequest ?? defaultSearchRequest,
    );
  }

  private async handleSearchCustomObjectAttributeDefinitions(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), 'search_custom_object_attribute_definitions');
    const defaultSearchRequest = {
      query: { match_all_query: {} },
      count: 200,
    };
    return this.ocapiClient!.systemObjects.searchCustomObjectAttributeDefinitions(
      args.objectType,
      args.searchRequest ?? defaultSearchRequest,
    );
  }

  private async handleSearchSitePreferences(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('groupId'), 'search_site_preferences');
    const defaultSearchRequest = {
      query: { match_all_query: {} },
      count: 200,
    };
    const defaultOptions = { expand: 'value' };
    return this.ocapiClient!.sitePreferences.searchSitePreferences(
      args.groupId,
      args.instanceType ?? 'sandbox',
      args.searchRequest ?? defaultSearchRequest,
      args.options ?? defaultOptions,
    );
  }

  private async handleSearchSystemObjectAttributeGroups(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredString('objectType'), 'search_system_object_attribute_groups');
    const defaultSearchRequest = {
      query: { match_all_query: {} },
      count: 200,
    };
    return this.ocapiClient!.systemObjects.searchSystemObjectAttributeGroups(
      args.objectType,
      args.searchRequest ?? defaultSearchRequest,
    );
  }

  private getSystemObjectMessage(toolName: SystemObjectToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'get_system_object_definitions':
        return 'Get system object definitions';
      case 'get_system_object_definition':
        return `Get system object definition for ${args?.objectType}`;
      case 'search_system_object_attribute_definitions':
        return `Search system object attributes for ${args?.objectType}`;
      case 'search_custom_object_attribute_definitions':
        return `Search custom object attributes for ${args?.objectType}`;
      case 'search_site_preferences':
        return `Search site preferences group ${args?.groupId}`;
      case 'search_system_object_attribute_groups':
        return `Search attribute groups for ${args?.objectType}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
