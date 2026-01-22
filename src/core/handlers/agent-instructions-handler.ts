import { HandlerContext, ToolExecutionContext } from './base-handler.js';
import { SimpleClientHandler } from './simple-client-handler.js';
import { AgentInstructionsClient } from '../../clients/agent-instructions-client.js';
import { InstructionAdvisor } from '../instruction-advisor.js';
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
  private readonly instructionAdvisor: InstructionAdvisor;
  private agentInstructionsClient: AgentInstructionsClient | null = null;

  constructor(context: HandlerContext) {
    const rootsService = context.workspaceRootsService ?? new WorkspaceRootsService(context.logger);
    const client = new AgentInstructionsClient(rootsService);
    super(context, 'AgentInstructions', {
      toolConfig: AGENT_INSTRUCTION_TOOL_CONFIG,
      toolNameSet: AGENT_INSTRUCTION_TOOL_NAMES_SET,
      clientContextKey: 'agentInstructionsClient',
      clientDisplayName: 'Agent instructions',
      createClient: () => {
        this.agentInstructionsClient = client;
        return client;
      },
    });
    this.instructionAdvisor = new InstructionAdvisor(client, context.logger);
  }

  /**
   * Override to add instructionAdvisor to execution context
   */
  protected override async createExecutionContext(): Promise<ToolExecutionContext> {
    const baseContext = await super.createExecutionContext();
    return {
      ...baseContext,
      instructionAdvisor: this.instructionAdvisor,
    };
  }
}
