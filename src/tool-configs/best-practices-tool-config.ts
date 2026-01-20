import { GenericToolSpec } from '../core/handlers/base-handler.js';
import { ToolArguments } from '../core/handlers/base-handler.js';
import { ValidationHelpers, CommonValidations } from '../core/handlers/validation-helpers.js';

export const BEST_PRACTICE_TOOL_NAMES = [
  'get_available_best_practice_guides',
  'get_best_practice_guide',
  'search_best_practices',
  'get_hook_reference',
] as const;

export type BestPracticeToolName = typeof BEST_PRACTICE_TOOL_NAMES[number];
export const BEST_PRACTICE_TOOL_NAMES_SET = new Set<BestPracticeToolName>(BEST_PRACTICE_TOOL_NAMES);

/**
 * GitHub repository URL for skills
 */
const SKILLS_REPO_URL = 'https://github.com/taurgis/sfcc-dev-mcp/tree/develop/ai-instructions/skills';

/**
 * Mapping of old guide names to new skill names
 */
const GUIDE_TO_SKILL_MAP: Record<string, string> = {
  cartridge_creation: 'sfcc-cartridge-development',
  isml_templates: 'sfcc-isml-development',
  job_framework: 'sfcc-job-development',
  localserviceregistry: 'sfcc-localserviceregistry',
  ocapi_hooks: 'sfcc-ocapi-hooks',
  scapi_hooks: 'sfcc-scapi-hooks',
  scapi_custom_endpoint: 'sfcc-scapi-custom-endpoints',
  sfra_controllers: 'sfcc-sfra-controllers',
  sfra_models: 'sfcc-sfra-models',
  sfra_client_side_js: 'sfcc-sfra-client-side-js',
  sfra_scss: 'sfcc-sfra-scss',
  performance: 'sfcc-performance',
  security: 'sfcc-security',
};

/**
 * Build deprecation notice for best practices tools
 */
function buildDeprecationNotice(specificSkill?: string): object {
  const skillInfo = specificSkill && GUIDE_TO_SKILL_MAP[specificSkill]
    ? `\n\nThe "${specificSkill}" guide is now available as the "${GUIDE_TO_SKILL_MAP[specificSkill]}" skill.`
    : '';

  return {
    deprecated: true,
    message: `⚠️ DEPRECATION NOTICE: Best practices tools have been deprecated in favor of GitHub Copilot Agent Skills.

Skills provide a better experience as they are automatically loaded into context when relevant, without requiring explicit tool calls.

📥 To use the new skills:
1. Copy the skills folder from the repository to your project:
   ${SKILLS_REPO_URL}

2. Place the skills in one of these locations:
   - Project: .github/skills/ or .claude/skills/
   - Personal: ~/.copilot/skills/ or ~/.claude/skills/

3. Copilot will automatically use the relevant skill based on your prompts.${skillInfo}

📦 Alternative: If you need the old tool-based behavior, use an earlier version of this package:
   npm install sfcc-dev-mcp@1.x

Available skills:
${Object.entries(GUIDE_TO_SKILL_MAP).map(([old, newSkill]) => `  - ${newSkill} (was: ${old})`).join('\n')}`,
    skillsUrl: SKILLS_REPO_URL,
    availableSkills: Object.values(GUIDE_TO_SKILL_MAP),
  };
}

/**
 * Configuration for SFCC best practices tools
 *
 * DEPRECATED: These tools now return deprecation notices pointing to Agent Skills.
 * The best practices content has been migrated to skill files for better AI agent integration.
 */
export const BEST_PRACTICES_TOOL_CONFIG: Record<BestPracticeToolName, GenericToolSpec<ToolArguments, any>> = {
  get_available_best_practice_guides: {
    exec: async () => {
      return buildDeprecationNotice();
    },
    logMessage: () => 'List guides (DEPRECATED)',
  },

  get_best_practice_guide: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), toolName);
    },
    exec: async (args: ToolArguments) => {
      return buildDeprecationNotice(args.guideName as string);
    },
    logMessage: (args: ToolArguments) => `Guide ${args.guideName} (DEPRECATED)`,
  },

  search_best_practices: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('query'), toolName);
    },
    exec: async () => {
      return buildDeprecationNotice();
    },
    logMessage: (args: ToolArguments) => `Search best practices ${args.query} (DEPRECATED)`,
  },

  get_hook_reference: {
    validate: (args: ToolArguments, toolName: string) => {
      ValidationHelpers.validateArguments(args, CommonValidations.requiredString('guideName'), toolName);
    },
    exec: async (args: ToolArguments) => {
      return buildDeprecationNotice(args.guideName as string);
    },
    logMessage: (args: ToolArguments) => `Hook reference ${args.guideName} (DEPRECATED)`,
  },
};
