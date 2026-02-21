import { GenericToolSpec, ToolArguments } from '../core/handlers/base-handler.js';
import { AgentInstructionsClient } from '../clients/agent-instructions-client.js';
import { InstructionAdvisor } from '../core/instruction-advisor.js';

export const AGENT_INSTRUCTION_TOOL_NAMES = [
  'sync_agent_instructions',
  'disable_agent_sync',
] as const;

export type AgentInstructionToolName = typeof AGENT_INSTRUCTION_TOOL_NAMES[number];
export const AGENT_INSTRUCTION_TOOL_NAMES_SET = new Set<AgentInstructionToolName>(AGENT_INSTRUCTION_TOOL_NAMES);

export const AGENT_INSTRUCTION_TOOL_CONFIG: Record<
  AgentInstructionToolName,
  GenericToolSpec<ToolArguments, unknown>
> = {
  sync_agent_instructions: {
    exec: async (args: ToolArguments, context) => {
      const client = context.agentInstructionsClient as AgentInstructionsClient;
      return client.syncInstructions({
        destinationType: args.destinationType as 'project' | 'user' | 'temp' | undefined,
        preferredRoot: args.preferredRoot as string | undefined,
        skillsDir: args.skillsDir as string | undefined,
        mergeStrategy: args.mergeStrategy as 'append' | 'replace' | 'skip' | undefined,
        includeAgents: args.includeAgents as boolean | undefined,
        includeSkills: args.includeSkills as boolean | undefined,
        installMissingOnly: args.installMissingOnly as boolean | undefined,
        dryRun: args.dryRun as boolean | undefined,
        tempDir: args.tempDir as string | undefined,
      });
    },
    logMessage: (args: ToolArguments) => `Sync agent instructions (${args.destinationType ?? 'project'})`,
  },
  disable_agent_sync: {
    exec: async (args: ToolArguments, context) => {
      const client = context.agentInstructionsClient as AgentInstructionsClient;
      const advisor = context.instructionAdvisor as InstructionAdvisor;

      // Get workspace root from client status
      const status = await client.getStatus(args.preferredRoot as string | undefined);
      if (!status.workspaceRoot) {
        return {
          success: false,
          message: 'Cannot disable agent sync: no workspace root found. Provide preferredRoot parameter.',
        };
      }

      return advisor.disableAgentSync(status.workspaceRoot);
    },
    logMessage: () => 'Disable agent sync suggestions',
  },
};
