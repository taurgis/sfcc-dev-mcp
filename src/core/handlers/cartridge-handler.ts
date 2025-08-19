import { BaseToolHandler, ToolExecutionResult, ToolArguments, HandlerContext } from './base-handler.js';
import { ValidationHelpers, CommonValidations } from './validation-helpers.js';
import { CartridgeGenerationClient } from '../../clients/cartridge-generation-client.js';
import { ClientFactory } from './client-factory.js';

const CARTRIDGE_TOOL_NAMES = [
  'generate_cartridge_structure',
] as const;

type CartridgeToolName = typeof CARTRIDGE_TOOL_NAMES[number];

export class CartridgeToolHandler extends BaseToolHandler {
  private cartridgeClient: CartridgeGenerationClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.cartridgeClient) {
      this.cartridgeClient = this.clientFactory.createCartridgeClient();
      this.logger.debug('Cartridge generation client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.cartridgeClient = null;
    this.logger.debug('Cartridge generation client disposed');
  }

  canHandle(toolName: string): boolean {
    return (CARTRIDGE_TOOL_NAMES as readonly string[]).includes(toolName);
  }

  async handle(toolName: string, args: ToolArguments, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) {
      throw new Error(`Unsupported cartridge tool: ${toolName}`);
    }

    const cartridgeTool = toolName as CartridgeToolName;

    return this.executeWithLogging(
      toolName,
      startTime,
      () => this.executeCartridgeTool(cartridgeTool, args),
      this.getLogMessage(cartridgeTool, args),
    );
  }

  private async executeCartridgeTool(toolName: CartridgeToolName, args: ToolArguments): Promise<any> {
    if (!this.cartridgeClient) {
      throw new Error('Cartridge generation client not initialized');
    }

    switch (toolName) {
      case 'generate_cartridge_structure':
        return this.handleGenerateCartridgeStructure(args);
      default:
        throw new Error(`Unknown cartridge tool: ${toolName}`);
    }
  }

  private async handleGenerateCartridgeStructure(args: ToolArguments): Promise<any> {
    ValidationHelpers.validateArguments(args, CommonValidations.requiredField(
      'cartridgeName',
      'string',
      (value: string) => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value),
      'cartridgeName must be a valid identifier (letters, numbers, underscore, hyphen)',
    ), 'generate_cartridge_structure');

    return this.cartridgeClient!.generateCartridgeStructure({
      cartridgeName: args.cartridgeName,
      targetPath: args.targetPath,
      fullProjectSetup: args.fullProjectSetup ?? true,
    });
  }

  private getLogMessage(toolName: CartridgeToolName, args: ToolArguments): string {
    switch (toolName) {
      case 'generate_cartridge_structure':
        return `Generate cartridge structure for ${args.cartridgeName}`;
      default:
        return `Executing ${toolName}`;
    }
  }
}
