import { HandlerContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { AgentInstructionsClient } from '../../clients/agent-instructions-client.js';
import {
  AGENT_INSTRUCTION_TOOL_CONFIG,
  AgentInstructionToolName,
  AGENT_INSTRUCTION_TOOL_NAMES_SET,
} from '../../tool-configs/agent-instructions-tool-config.js';
import { WorkspaceRootsService } from '../../config/workspace-roots.js';

/**
 * Handler for installing/merging AGENTS.md and skills into the user's project
 */
export class AgentInstructionsToolHandler extends SimpleClientHandler<
  AgentInstructionToolName,
  AgentInstructionsClient
> {
  constructor(context: HandlerContext) {
    const rootsService = context.workspaceRootsService ?? new WorkspaceRootsService(context.logger);
    super(context, 'AgentInstructions', {
      toolConfig: AGENT_INSTRUCTION_TOOL_CONFIG,
      toolNameSet: AGENT_INSTRUCTION_TOOL_NAMES_SET,
      clientContextKey: 'agentInstructionsClient',
      clientDisplayName: 'Agent instructions',
      createClient: () => new AgentInstructionsClient(rootsService),
    });
  }
}
