/**
 * Best Practices Guide Definitions
 *
 * Central definition of all available best practice guides.
 * Used by both the client and tool definitions to maintain consistency.
 */

export interface GuideDefinition {
  name: string;
  title: string;
  description: string;
}

/**
 * All available best practice guides
 * This is the single source of truth for guide metadata
 */
export const BEST_PRACTICE_GUIDES: GuideDefinition[] = [
  {
    name: 'cartridge_creation',
    title: 'Cartridge Creation Best Practices',
    description: 'Instructions and best practices for creating, configuring, and deploying custom SFRA cartridges',
  },
  {
    name: 'isml_templates',
    title: 'ISML Templates Best Practices',
    description: 'Comprehensive best practices for developing ISML templates within the SFRA framework, including security, performance, and maintainability guidelines',
  },
  {
    name: 'job_framework',
    title: 'Job Framework Best Practices',
    description: 'Comprehensive guide for developing custom jobs in the SFCC Job Framework, covering both task-oriented and chunk-oriented approaches with performance optimization and debugging strategies',
  },
  {
    name: 'localserviceregistry',
    title: 'LocalServiceRegistry Best Practices',
    description: 'Comprehensive guide for creating server-to-server integrations in SFCC using dw.svc.LocalServiceRegistry, including configuration patterns, callback implementation, OAuth flows, and reusable service module patterns',
  },
  {
    name: 'ocapi_hooks',
    title: 'OCAPI Hooks Best Practices',
    description: 'Best practices for implementing OCAPI hooks in Salesforce B2C Commerce Cloud',
  },
  {
    name: 'scapi_hooks',
    title: 'SCAPI Hooks Best Practices',
    description: 'Essential best practices for implementing SCAPI hooks with AI development assistance',
  },
  {
    name: 'scapi_custom_endpoint',
    title: 'Custom SCAPI Endpoint Best Practices',
    description: 'Best practices for creating custom SCAPI endpoints in B2C Commerce Cloud',
  },
  {
    name: 'sfra_controllers',
    title: 'SFRA Controllers Best Practices',
    description: 'Best practices and code patterns for developing SFRA controllers',
  },
  {
    name: 'sfra_models',
    title: 'SFRA Models Best Practices',
    description: 'Best practices for developing SFRA models in Salesforce B2C Commerce Cloud',
  },
  {
    name: 'sfra_client_side_js',
    title: 'SFRA Client-Side JavaScript Best Practices',
    description: 'Comprehensive patterns for architecting, extending, validating, and optimizing client-side JavaScript in SFRA storefronts using jQuery',
  },
  {
    name: 'sfra_scss',
    title: 'SFRA SCSS Best Practices',
    description: 'Implementation-focused SCSS override strategies for SFRA storefronts covering cartridge overlays, theming tokens, responsive mixins, and plugin extension guardrails',
  },
  {
    name: 'performance',
    title: 'Performance and Stability Best Practices',
    description: 'Comprehensive performance optimization strategies, coding standards, and stability guidelines for SFCC development including caching, index-friendly APIs, and job development',
  },
  {
    name: 'security',
    title: 'Security Best Practices',
    description: 'Comprehensive security best practices for SFCC development covering SFRA Controllers, OCAPI/SCAPI Hooks, and Custom SCAPI Endpoints with OWASP compliance guidelines',
  },
];

/**
 * Get all guide names as a const array for use in tool definitions
 */
export const GUIDE_NAMES = BEST_PRACTICE_GUIDES.map(g => g.name) as readonly string[];

/**
 * Hook guide names that support get_hook_reference
 */
export const HOOK_GUIDE_NAMES = ['ocapi_hooks', 'scapi_hooks'] as const;
export type HookGuideName = typeof HOOK_GUIDE_NAMES[number];

/**
 * Check if a guide name is a hook guide
 */
export function isHookGuide(guideName: string): guideName is HookGuideName {
  return HOOK_GUIDE_NAMES.includes(guideName as HookGuideName);
}
