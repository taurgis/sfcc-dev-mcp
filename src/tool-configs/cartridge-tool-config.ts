import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { CartridgeGenerationClient } from '../clients/cartridge/index.js';

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
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredField(
        'cartridgeName',
        'string',
        (value: unknown) => typeof value === 'string' && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value),
        'cartridgeName must be a valid identifier (letters, numbers, underscore, hyphen)',
      ), toolName);
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.cartridgeClient as CartridgeGenerationClient;
      return client.generateCartridgeStructure({
        cartridgeName: args.cartridgeName as string,
        targetPath: args.targetPath as string | undefined,
        fullProjectSetup: args.fullProjectSetup as boolean,
      });
    },
    logMessage: (args: ToolArguments) => `Generate cartridge structure for ${args.cartridgeName}`,
  },
};
