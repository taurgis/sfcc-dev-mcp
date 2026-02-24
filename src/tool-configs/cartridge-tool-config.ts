import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { CartridgeGenerationClient } from '../clients/cartridge/index.js';
import { validateTargetPathWithinWorkspace } from '../core/handlers/validation-helpers.js';

export const CARTRIDGE_TOOL_NAMES = [
  'generate_cartridge_structure',
] as const;

export type CartridgeToolName = typeof CARTRIDGE_TOOL_NAMES[number];
export const CARTRIDGE_TOOL_NAMES_SET = new Set<CartridgeToolName>(CARTRIDGE_TOOL_NAMES);

/**
 * Configuration for cartridge generation tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const CARTRIDGE_TOOL_CONFIG: Record<CartridgeToolName, GenericToolSpec<ToolArguments, unknown>> = {
  generate_cartridge_structure: {
    defaults: (args: ToolArguments) => ({
      ...args,
      fullProjectSetup: args.fullProjectSetup ?? true,
    }),
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.cartridgeClient as CartridgeGenerationClient;
      const validatedTargetPath = validateTargetPathWithinWorkspace(
        args.targetPath,
        context,
        'generate_cartridge_structure',
      );

      return client.generateCartridgeStructure({
        cartridgeName: args.cartridgeName as string,
        targetPath: validatedTargetPath,
        fullProjectSetup: args.fullProjectSetup as boolean,
      });
    },
    logMessage: (args: ToolArguments) => `Generate cartridge structure for ${args.cartridgeName}`,
  },
};
