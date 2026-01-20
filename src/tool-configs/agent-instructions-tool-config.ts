import { GenericToolSpec, ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers } from '../core/handlers/validation-helpers.js';
import { AgentInstructionsClient } from '../clients/agent-instructions-client.js';

export const AGENT_INSTRUCTION_TOOL_NAMES = [
  'sync_agent_instructions',
] as const;

export type AgentInstructionToolName = typeof AGENT_INSTRUCTION_TOOL_NAMES[number];
export const AGENT_INSTRUCTION_TOOL_NAMES_SET = new Set<AgentInstructionToolName>(AGENT_INSTRUCTION_TOOL_NAMES);

const DESTINATION_VALUES = ['project', 'user', 'temp'];
const MERGE_VALUES = ['append', 'replace', 'skip'];

export const AGENT_INSTRUCTION_TOOL_CONFIG: Record<AgentInstructionToolName, GenericToolSpec<ToolArguments, any>> = {
  sync_agent_instructions: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, [
        {
          field: 'destinationType',
          required: false,
          type: 'string',
          validator: (value: string) => DESTINATION_VALUES.includes(value),
          errorMessage: 'destinationType must be one of project | user | temp',
        },
        {
          field: 'mergeStrategy',
          required: false,
          type: 'string',
          validator: (value: string) => MERGE_VALUES.includes(value),
          errorMessage: 'mergeStrategy must be one of append | replace | skip',
        },
        { field: 'preferredRoot', required: false, type: 'string' },
        { field: 'skillsDir', required: false, type: 'string' },
        { field: 'tempDir', required: false, type: 'string' },
        { field: 'includeAgents', required: false, type: 'boolean' },
        { field: 'includeSkills', required: false, type: 'boolean' },
        { field: 'installMissingOnly', required: false, type: 'boolean' },
        { field: 'dryRun', required: false, type: 'boolean' },
      ], toolName);
    },
    exec: async (args: ToolArguments, context) => {
      const client = context.agentInstructionsClient as AgentInstructionsClient;
      return client.syncInstructions({
        destinationType: args.destinationType,
        preferredRoot: args.preferredRoot,
        skillsDir: args.skillsDir,
        mergeStrategy: args.mergeStrategy,
        includeAgents: args.includeAgents,
        includeSkills: args.includeSkills,
        installMissingOnly: args.installMissingOnly,
        dryRun: args.dryRun,
        tempDir: args.tempDir,
      });
    },
    logMessage: (args: ToolArguments) => `Sync agent instructions (${args.destinationType ?? 'project'})`,
  },
};
