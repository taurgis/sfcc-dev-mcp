import { promises as fs } from 'fs';
import path from 'path';
import { AgentInstructionsClient } from '../clients/agent-instructions-client.js';
import { Logger } from '../utils/logger.js';

export interface McpDevConfig {
  disableAgentSync?: boolean;
}

/**
 * Provides gentle, one-time guidance when AGENTS.md or skills are missing.
 * Respects mcp-dev.json configuration to permanently disable sync suggestions.
 */
export class InstructionAdvisor {
  private readonly client: AgentInstructionsClient;
  private readonly logger: Logger;
  private noticeEvaluated = false;
  private noticeToShow?: string;
  private hasShownNotice = false;

  constructor(client: AgentInstructionsClient, logger: Logger) {
    this.client = client;
    this.logger = logger;
  }

  /**
   * Check if agent sync is disabled via mcp-dev.json in the workspace root.
   */
  async isAgentSyncDisabled(workspaceRoot: string): Promise<boolean> {
    try {
      const configPath = path.join(workspaceRoot, 'mcp-dev.json');
      const content = await fs.readFile(configPath, 'utf-8');
      const config: McpDevConfig = JSON.parse(content);
      return config.disableAgentSync === true;
    } catch {
      // File doesn't exist or is invalid - sync is not disabled
      return false;
    }
  }

  /**
   * Create or update mcp-dev.json to disable agent sync suggestions.
   */
  async disableAgentSync(workspaceRoot: string): Promise<{ success: boolean; message: string }> {
    try {
      const configPath = path.join(workspaceRoot, 'mcp-dev.json');
      let config: McpDevConfig = {};

      // Try to read existing config
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        config = JSON.parse(content);
      } catch {
        // File doesn't exist, start with empty config
      }

      config.disableAgentSync = true;
      await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8');

      return {
        success: true,
        message: `Created/updated ${configPath} with disableAgentSync: true. Agent sync suggestions are now disabled for this workspace.`,
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to create mcp-dev.json: ${errMsg}`,
      };
    }
  }

  async getNotice(): Promise<string | undefined> {
    if (this.hasShownNotice) {
      return undefined;
    }

    if (this.noticeEvaluated) {
      if (this.noticeToShow) {
        this.hasShownNotice = true;
        return this.noticeToShow;
      }
      return undefined;
    }

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
      if (!status.workspaceRoot) {
        // Not definitive yet: workspace roots may be discovered later.
        return undefined;
      }

      // Check if agent sync is disabled via mcp-dev.json
      const syncDisabled = await this.isAgentSyncDisabled(status.workspaceRoot);
      if (syncDisabled) {
        this.logger.debug('[InstructionAdvisor] Agent sync disabled via mcp-dev.json');
        this.noticeEvaluated = true;
        this.noticeToShow = undefined;
        return undefined;
      }

      if (status.hasAgents && status.hasSkills) {
        this.noticeEvaluated = true;
        this.noticeToShow = undefined;
        return undefined;
      }

      const missingParts = [];
      if (!status.hasAgents) { missingParts.push('AGENTS.md'); }
      if (!status.hasSkills) { missingParts.push('skills'); }
      const missingSkills = status.missingSkills?.length
        ? `Missing skills: ${status.missingSkills.join(', ')}`
        : 'All skills will be installed.';

      this.logger.debug('[InstructionAdvisor] Issuing workspace-root notice');
      this.noticeToShow = [
        '📋 Agent instructions available for this SFCC project.',
        `Missing: ${missingParts.join(' + ')}`,
        missingSkills,
        '',
        '👉 ASK THE USER: "Would you like me to install AGENTS.md and SFCC development skills into your project?"',
        '',
        'If YES: Run sync_agent_instructions with dryRun=false',
        'If NO: Create mcp-dev.json with {"disableAgentSync": true} to permanently disable this suggestion.',
      ].join('\n');

      this.noticeEvaluated = true;
      this.hasShownNotice = true;
      return this.noticeToShow;
    } catch (error) {
      this.logger.debug('InstructionAdvisor failed to evaluate status', error);
      return undefined;
    }
  }

  reset(): void {
    this.noticeEvaluated = false;
    this.noticeToShow = undefined;
    this.hasShownNotice = false;
  }
}
