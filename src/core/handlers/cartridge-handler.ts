import { BaseToolHandler, ToolExecutionResult } from './base-handler.js';

const CARTRIDGE_TOOL_NAMES = [
  'generate_cartridge_structure',
] as const;

export class CartridgeToolHandler extends BaseToolHandler {
  canHandle(toolName: string): boolean { return (CARTRIDGE_TOOL_NAMES as readonly string[]).includes(toolName); }
  async handle(toolName: string, args: any, startTime: number): Promise<ToolExecutionResult> {
    if (!this.canHandle(toolName)) { throw new Error(`Unsupported cartridge tool: ${toolName}`); }
    let result: any;
    let logMessage = '';
    switch (toolName) {
      case 'generate_cartridge_structure':
        if (!args?.cartridgeName) { throw new Error('cartridgeName is required'); }
        logMessage = `Generate cartridge structure for ${args.cartridgeName}`;
        if (!this.context.cartridgeGenerator) {
          throw new Error('cartridge generator not configured');
        }
        result = await this.context.cartridgeGenerator.generateCartridgeStructure(
          {
            cartridgeName: args.cartridgeName,
            targetPath: args.targetPath,
            fullProjectSetup: args.fullProjectSetup ?? true,
          },
        );
        break;
      default:
        throw new Error(`Unknown cartridge tool: ${toolName}`);
    }
    return this.wrap(toolName, startTime, async () => result, logMessage);
  }
}
