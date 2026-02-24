import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Logger } from '../utils/logger.js';
import { PathResolver } from '../utils/path-resolver.js';
import { WorkspaceRootsService } from '../config/workspace-roots.js';

const WORKSPACE_SKILLS_DIRS = [
  '.github/skills',
  '.agents/skills',
  '.claude/skills',
  '.agent/skills',
  // Kept for backward compatibility with existing Cursor setups.
  '.cursor/skills',
] as const;

const USER_HOME_SKILLS_DIRS = [
  '.copilot/skills',
  '.agents/skills',
  '.claude/skills',
] as const;

export type DestinationType = 'project' | 'user' | 'temp';
export type MergeStrategy = 'append' | 'replace' | 'skip';

export interface InstructionStatus {
  workspaceRoot?: string;
  hasAgents: boolean;
  hasSkills: boolean;
  detectedSkillsDir?: string;
  missingSkills: string[];
  sourceSkills: string[];
}

export interface SyncOptions {
  destinationType?: DestinationType;
  preferredRoot?: string;
  skillsDir?: string;
  mergeStrategy?: MergeStrategy;
  includeAgents?: boolean;
  includeSkills?: boolean;
  installMissingOnly?: boolean;
  dryRun?: boolean;
  tempDir?: string;
}

export interface SyncPlan {
  destinationType: DestinationType;
  basePath: string;
  agentsTarget?: string;
  skillsTarget?: string;
  actions: {
    agentsAction: 'create' | 'append' | 'replace' | 'skip' | 'none';
    skillsToCopy: string[];
    skillsSkipped: string[];
  };
  notes: string[];
}

export interface SyncResult {
  plan: SyncPlan;
  applied: boolean;
  message: string;
}

/**
 * Manages copying AGENTS.md and bundled skills into the user's workspace.
 */
export class AgentInstructionsClient {
  private readonly logger: Logger;
  private readonly workspaceRootsService: WorkspaceRootsService;
  private readonly sourceAgentsPath: string;
  private readonly sourceSkillsPath: string;

  constructor(workspaceRootsService: WorkspaceRootsService, logger?: Logger) {
    this.workspaceRootsService = workspaceRootsService;
    this.logger = logger ?? Logger.getChildLogger('AgentInstructionsClient');
    this.sourceAgentsPath = PathResolver.getAgentsInstructionsFile();
    this.sourceSkillsPath = PathResolver.getSkillsSourcePath();
  }

  async getStatus(preferredRoot?: string): Promise<InstructionStatus> {
    const rootPath = this.resolveWorkspaceRoot(preferredRoot);
    const sourceSkills = await this.getSourceSkillNames();

    if (!rootPath) {
      return {
        workspaceRoot: undefined,
        hasAgents: false,
        hasSkills: false,
        detectedSkillsDir: undefined,
        missingSkills: sourceSkills,
        sourceSkills,
      };
    }

    const agentsTarget = path.join(rootPath, 'AGENTS.md');
    const hasAgents = await this.exists(agentsTarget);

    const candidateSkillsDirs = this.getStatusSkillsCandidates(rootPath);

    const detectedSkillsDir = await this.findFirstExistingDir(candidateSkillsDirs);
    const missingSkills = await this.findMissingSkills(detectedSkillsDir, sourceSkills);
    const hasSkills = !!detectedSkillsDir && missingSkills.length === 0 && sourceSkills.length > 0;

    return {
      workspaceRoot: rootPath,
      hasAgents,
      hasSkills,
      detectedSkillsDir,
      missingSkills,
      sourceSkills,
    };
  }

  async syncInstructions(options: SyncOptions = {}): Promise<SyncResult> {
    const mergedOptions: Required<SyncOptions> = {
      destinationType: options.destinationType ?? 'project',
      preferredRoot: options.preferredRoot ?? '',
      skillsDir: options.skillsDir ?? '',
      mergeStrategy: options.mergeStrategy ?? 'append',
      includeAgents: options.includeAgents ?? true,
      includeSkills: options.includeSkills ?? true,
      installMissingOnly: options.installMissingOnly ?? true,
      dryRun: options.dryRun ?? true,
      tempDir: options.tempDir ?? '',
    };

    const basePath = this.resolveBasePath(
      mergedOptions.destinationType,
      mergedOptions.preferredRoot,
      mergedOptions.tempDir,
    );
    if (!basePath) {
      return {
        plan: {
          destinationType: mergedOptions.destinationType,
          basePath: '',
          actions: { agentsAction: 'none', skillsToCopy: [], skillsSkipped: [] },
          notes: [
            'Workspace root not discovered; provide a root or use destinationType "temp" or "user".',
          ],
        },
        applied: false,
        message: 'No accessible base path for installation',
      };
    }

    const sourceSkills = await this.getSourceSkillNames();
    const skillsTarget = mergedOptions.includeSkills
      ? await this.resolveSkillsTarget(basePath, mergedOptions.skillsDir)
      : undefined;
    const agentsTarget = mergedOptions.includeAgents
      ? path.join(basePath, 'AGENTS.md')
      : undefined;

    const plan: SyncPlan = {
      destinationType: mergedOptions.destinationType,
      basePath,
      agentsTarget,
      skillsTarget,
      actions: {
        agentsAction: 'none',
        skillsToCopy: [],
        skillsSkipped: [],
      },
      notes: [],
    };

    if (mergedOptions.includeAgents && agentsTarget) {
      plan.actions.agentsAction = await this.planAgentMerge(agentsTarget, mergedOptions.mergeStrategy);
    }

    if (mergedOptions.includeSkills && skillsTarget) {
      const skillCopyPlan = await this.planSkillCopy(skillsTarget, sourceSkills, mergedOptions.installMissingOnly);
      plan.actions.skillsToCopy = skillCopyPlan.toCopy;
      plan.actions.skillsSkipped = skillCopyPlan.skipped;
    }

    if (mergedOptions.dryRun) {
      return {
        plan,
        applied: false,
        message: 'Dry run only. No files were written.',
      };
    }

    await this.applyPlan(plan, mergedOptions.mergeStrategy);

    return {
      plan,
      applied: true,
      message: 'Agent instructions synchronized',
    };
  }

  private resolveWorkspaceRoot(preferredRoot?: string): string | undefined {
    const roots = this.workspaceRootsService.getRoots();
    if (!roots || roots.length === 0) { return undefined; }

    if (preferredRoot) {
      const matched = roots.find(root => root.path === preferredRoot || root.name === preferredRoot);
      if (matched) { return matched.path; }
    }

    return roots[0]?.path;
  }

  private resolveBasePath(
    destinationType: DestinationType,
    preferredRoot: string,
    tempDir: string,
  ): string | undefined {
    if (destinationType === 'project') {
      return this.resolveWorkspaceRoot(preferredRoot);
    }

    if (destinationType === 'user') {
      return os.homedir();
    }

    const resolvedTemp = tempDir
      ? path.resolve(tempDir)
      : path.join(os.tmpdir(), 'sfcc-dev-mcp-ai-instructions');
    return resolvedTemp;
  }

  private async resolveSkillsTarget(basePath: string, preferredDir: string): Promise<string> {
    const safeDir = this.sanitizePreferredSkillsDir(preferredDir);

    const candidates = [safeDir, ...this.getDefaultSkillsCandidates(basePath)].filter(Boolean);

    for (const candidate of candidates) {
      const resolved = path.resolve(basePath, candidate);
      if (!resolved.startsWith(basePath)) {
        continue;
      }
      if (await this.isDirectory(resolved)) {
        return resolved;
      }
    }

    const defaultCandidates = this.getDefaultSkillsCandidates(basePath);
    return path.resolve(basePath, candidates[0] || defaultCandidates[0] || '.github/skills');
  }

  private getStatusSkillsCandidates(rootPath: string): string[] {
    const workspaceCandidates = WORKSPACE_SKILLS_DIRS.map(dir => path.join(rootPath, dir));

    // Also check user-level skill locations used by VS Code chat settings.
    const homePath = path.resolve(os.homedir());
    const homeCandidates = USER_HOME_SKILLS_DIRS.map(dir => path.join(homePath, dir));

    return [...new Set([...workspaceCandidates, ...homeCandidates])];
  }

  private getDefaultSkillsCandidates(basePath: string): string[] {
    const isUserHomeBasePath = path.resolve(basePath) === path.resolve(os.homedir());
    const defaultDirs = isUserHomeBasePath
      ? [...USER_HOME_SKILLS_DIRS, ...WORKSPACE_SKILLS_DIRS]
      : [...WORKSPACE_SKILLS_DIRS];

    return [...new Set(defaultDirs)];
  }

  private sanitizePreferredSkillsDir(preferredDir: string): string {
    const normalizedPreferredDir = preferredDir.trim();
    if (!normalizedPreferredDir) {
      return '';
    }

    const safeDir = !normalizedPreferredDir.includes('..') && !path.isAbsolute(normalizedPreferredDir)
      ? normalizedPreferredDir
      : '';

    return safeDir;
  }

  private async planAgentMerge(targetPath: string, strategy: MergeStrategy): Promise<'create' | 'append' | 'replace' | 'skip'> {
    const exists = await this.exists(targetPath);
    if (!exists) { return 'create'; }

    if (strategy === 'skip') {
      return 'skip';
    }

    if (strategy === 'replace') {
      return 'replace';
    }

    const existingContent = await fs.readFile(targetPath, 'utf-8');
    const sourceContent = await fs.readFile(this.sourceAgentsPath, 'utf-8');

    if (existingContent.includes(sourceContent.trim())) {
      return 'skip';
    }

    return 'append';
  }

  private async planSkillCopy(
    targetDir: string,
    sourceSkills: string[],
    missingOnly: boolean,
  ): Promise<{ toCopy: string[]; skipped: string[] }> {
    const toCopy: string[] = [];
    const skipped: string[] = [];

    for (const skill of sourceSkills) {
      const targetSkillDir = path.join(targetDir, skill);
      const exists = await this.isDirectory(targetSkillDir);
      if (exists && missingOnly) {
        skipped.push(skill);
        continue;
      }
      toCopy.push(skill);
    }

    return { toCopy, skipped };
  }

  private async applyPlan(plan: SyncPlan, mergeStrategy: MergeStrategy): Promise<void> {
    if (plan.agentsTarget && plan.actions.agentsAction !== 'none' && plan.actions.agentsAction !== 'skip') {
      await this.writeAgents(plan.agentsTarget, mergeStrategy, plan.actions.agentsAction);
    }

    if (plan.skillsTarget && plan.actions.skillsToCopy.length > 0) {
      await this.copySkills(plan.skillsTarget, plan.actions.skillsToCopy);
    }
  }

  private async writeAgents(targetPath: string, strategy: MergeStrategy, plannedAction: 'create' | 'append' | 'replace'): Promise<void> {
    const targetDir = path.dirname(targetPath);
    await fs.mkdir(targetDir, { recursive: true });
    const sourceContent = await fs.readFile(this.sourceAgentsPath, 'utf-8');

    if (plannedAction === 'create' || strategy === 'replace') {
      await fs.writeFile(targetPath, sourceContent, 'utf-8');
      return;
    }

    const existingContent = await fs.readFile(targetPath, 'utf-8');
    const merged = [
      existingContent,
      '',
      '<!-- merged from sfcc-dev-mcp AI instructions -->',
      sourceContent,
    ].join('\n');
    await fs.writeFile(targetPath, merged, 'utf-8');
  }

  private async copySkills(targetDir: string, skills: string[]): Promise<void> {
    await fs.mkdir(targetDir, { recursive: true });

    for (const skill of skills) {
      const sourceDir = path.join(this.sourceSkillsPath, skill);
      const destinationDir = path.join(targetDir, skill);
      await fs.cp(sourceDir, destinationDir, { recursive: true, force: false });
    }
  }

  private async findMissingSkills(skillsDir: string | undefined, sourceSkills: string[]): Promise<string[]> {
    if (!skillsDir) { return sourceSkills; }

    const missing: string[] = [];
    for (const skill of sourceSkills) {
      const target = path.join(skillsDir, skill);
      const exists = await this.isDirectory(target);
      if (!exists) {
        missing.push(skill);
      }
    }
    return missing;
  }

  private async getSourceSkillNames(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.sourceSkillsPath, { withFileTypes: true });
      return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
    } catch (error) {
      this.logger.error('Failed to read source skills', error);
      return [];
    }
  }

  private async findFirstExistingDir(pathsToCheck: string[]): Promise<string | undefined> {
    for (const candidate of pathsToCheck) {
      if (await this.isDirectory(candidate)) {
        return candidate;
      }
    }
    return undefined;
  }

  private async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  private async isDirectory(targetPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(targetPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
