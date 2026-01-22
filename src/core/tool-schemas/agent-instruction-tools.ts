/**
 * Agent instruction setup tools
 */

export const AGENT_INSTRUCTION_TOOLS = [
  {
    name: 'sync_agent_instructions',
    description: 'ONLY FOR SALESFORCE B2C COMMERCE (SFCC) PROJECTS. IMPORTANT: Before calling this tool, ALWAYS ASK THE USER if they want to install AGENTS.md and bundled SFCC skills into their project. If the user declines, do NOT call this tool - instead call disable_agent_sync to permanently disable this suggestion. This tool installs/merges AGENTS.md and bundled SFCC skills into the project (or a temp dir for manual merge). Supports dry-run planning, append/replace/skip merge strategies, and selecting skills directory (.github/skills, .cursor/skills, .claude/skills).',
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
  {
    name: 'disable_agent_sync',
    description: 'Creates or updates mcp-dev.json in the project root with {"disableAgentSync": true} to permanently disable agent sync suggestions. Call this when the user declines to install AGENTS.md and skills, so they will not be prompted again.',
    inputSchema: {
      type: 'object',
      properties: {
        preferredRoot: {
          type: 'string',
          description: 'Optional workspace root path or name to target when multiple roots are available.',
        },
      },
    },
  },
];
