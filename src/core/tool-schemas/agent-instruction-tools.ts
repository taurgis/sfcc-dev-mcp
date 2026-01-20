/**
 * Agent instruction setup tools
 */

export const AGENT_INSTRUCTION_TOOLS = [
  {
    name: 'sync_agent_instructions',
    description: 'Critical first step when AGENTS.md or skills are missing: run this to install/merge AGENTS.md and bundled SFCC skills into the project (or a temp dir for manual merge). If AGENTS.md or any skills are absent, execute this before using other tools. Supports dry-run planning, append/replace/skip merge strategies, and selecting skills directory (.github/skills, .cursor/skills, .claude/skills).',
    inputSchema: {
      type: 'object',
      properties: {
        destinationType: {
          type: 'string',
          enum: ['project', 'user', 'temp'],
          description: 'Where to place the files: project workspace (default), user home, or a temporary directory.',
          default: 'project',
        },
        preferredRoot: {
          type: 'string',
          description: 'Optional workspace root path or name to target when multiple roots are available.',
        },
        skillsDir: {
          type: 'string',
          description: 'Optional relative skills directory (default prefers existing .github/skills, .cursor/skills, or .claude/skills).',
        },
        mergeStrategy: {
          type: 'string',
          enum: ['append', 'replace', 'skip'],
          description: 'How to handle an existing AGENTS.md (default append).',
          default: 'append',
        },
        includeAgents: {
          type: 'boolean',
          description: 'Whether to copy AGENTS.md (default true).',
          default: true,
        },
        includeSkills: {
          type: 'boolean',
          description: 'Whether to copy skills (default true).',
          default: true,
        },
        installMissingOnly: {
          type: 'boolean',
          description: 'Copy only missing skills when true (default) or overwrite existing directories when false.',
          default: true,
        },
        dryRun: {
          type: 'boolean',
          description: 'Plan actions without writing files (default true).',
          default: true,
        },
        tempDir: {
          type: 'string',
          description: 'Custom directory to use when destinationType is temp.',
        },
      },
    },
  },
];
