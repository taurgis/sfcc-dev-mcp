import { AgentInstructionsClient } from '../clients/agent-instructions-client.js';
import { Logger } from '../utils/logger.js';

/**
 * Provides gentle, one-time guidance when AGENTS.md or skills are missing.
 */
export class InstructionAdvisor {
  private readonly client: AgentInstructionsClient;
  private readonly logger: Logger;

  constructor(client: AgentInstructionsClient, logger: Logger) {
    this.client = client;
    this.logger = logger;
  }

  async getNotice(): Promise<string | undefined> {
    try {
      const status = await this.client.getStatus();

      this.logger.debug('[InstructionAdvisor] Status', {
        workspaceRoot: status.workspaceRoot,
        hasAgents: status.hasAgents,
        hasSkills: status.hasSkills,
        detectedSkillsDir: status.detectedSkillsDir,
        missingSkills: status.missingSkills,
        sourceSkills: status.sourceSkills,
      });

      // If we cannot determine a workspace root, skip the notice (can't reliably detect presence)
      if (!status.workspaceRoot) { return undefined; }

      if (status.hasAgents && status.hasSkills) { return undefined; }

      const missingParts = [];
      if (!status.hasAgents) { missingParts.push('AGENTS.md'); }
      if (!status.hasSkills) { missingParts.push('skills'); }
      const missingSkills = status.missingSkills?.length
        ? `Missing skills: ${status.missingSkills.join(', ')}`
        : 'All skills will be installed.';

      this.logger.debug('[InstructionAdvisor] Issuing workspace-root notice');
      return [
        '🚨 Agent instructions missing. Stop and run "sync_agent_instructions" before using other tools.',
        `Missing: ${missingParts.join(' + ')}`,
        missingSkills,
        'Minimal requirement: AGENTS.md must exist in this workspace. The tool will also install skills.',
        'Run with destinationType "project" (or "temp" if you need a manual merge). dryRun=true by default.',
      ].join('\n');
    } catch (error) {
      this.logger.debug('InstructionAdvisor failed to evaluate status', error);
      return undefined;
    }
  }

  reset(): void {
    // no-op for now; retained for potential future stateful notice throttling
  }
}
