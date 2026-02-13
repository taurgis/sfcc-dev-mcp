import { GenericToolSpec, ToolExecutionContext } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';
import { ScriptDebuggerClient } from '../clients/script-debugger/index.js';

export const SCRIPT_DEBUGGER_TOOL_NAMES = ['evaluate_script'] as const;

export type ScriptDebuggerToolName = (typeof SCRIPT_DEBUGGER_TOOL_NAMES)[number];
export const SCRIPT_DEBUGGER_TOOL_NAMES_SET = new Set<ScriptDebuggerToolName>(SCRIPT_DEBUGGER_TOOL_NAMES);

/**
 * Configuration for script debugger tools
 * Maps each tool to its validation, execution, and messaging logic
 */
export const SCRIPT_DEBUGGER_TOOL_CONFIG: Record<
  ScriptDebuggerToolName,
  GenericToolSpec<ToolArguments, any>
> = {
  evaluate_script: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(
        args,
        CommonValidations.requiredString('script'),
        toolName,
      );

      // Optional locale
      ValidationHelpers.validateArguments(
        args,
        CommonValidations.optionalField(
          'locale',
          'string',
          (value: string) => value.trim().length > 0,
          'locale must be a non-empty string when provided',
        ),
        toolName,
      );

      // Optional breakpointLine (defaults to 1 when breakpointFile is provided)
      ValidationHelpers.validateArguments(
        args,
        CommonValidations.optionalField(
          'breakpointLine',
          'number',
          (value: number) => Number.isInteger(value) && value >= 1,
          'breakpointLine must be an integer >= 1 when provided',
        ),
        toolName,
      );
    },
    exec: async (args: ToolArguments, context: ToolExecutionContext) => {
      const client = context.scriptDebuggerClient as ScriptDebuggerClient;
      const result = await client.evaluateScript(args.script as string, {
        timeout: args.timeout as number | undefined,
        siteId: args.siteId as string | undefined,
        locale: args.locale as string | undefined,
        breakpointFile: args.breakpointFile as string | undefined,
        breakpointLine: args.breakpointLine as number | undefined,
      });

      return result;
    },
    logMessage: (args: ToolArguments) => {
      const script = (args?.script as string) ?? '';
      const preview = script.length > 50 ? `${script.substring(0, 50)  }...` : script;
      return `Evaluate script: ${preview}`;
    },
  },
};
