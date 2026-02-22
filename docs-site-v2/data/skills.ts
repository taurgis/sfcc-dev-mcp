export interface SkillMeta {
  name: string;
  description: string;
  dirName: string;
  githubUrl: string;
}

export const skills: SkillMeta[] = [
  {
    name: 'sfcc-caching',
    description: 'Unified caching playbook for SFCC (page cache vs custom cache vs service response cache). Use this when improving performance, reducing external calls, designing cache keys/TTLs, or debugging stale cache behavior.',
    dirName: 'sfcc-caching',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-caching/SKILL.md'
  },
  {
    name: 'sfcc-cartridge-development',
    description: 'Guide for creating, configuring, and deploying custom SFRA cartridges in Salesforce B2C Commerce. Use this when asked to create a new cartridge, set up a cartridge structure, or work with cartridge paths.',
    dirName: 'sfcc-cartridge-development',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-cartridge-development/SKILL.md'
  },
  {
    name: 'sfcc-forms-development',
    description: 'Guide for building, validating, securing, and persisting SFCC storefront forms (SFRA + SiteGenesis patterns). Use this when creating or troubleshooting form XML, controller handling, CSRF, and validation.',
    dirName: 'sfcc-forms-development',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-forms-development/SKILL.md'
  },
  {
    name: 'sfcc-fraud-prevention',
    description: 'Layered fraud prevention playbook for Salesforce B2C Commerce developers. Use this when adding fraud signals, designing a risk scoring approach, integrating third-party tools, or hardening checkout/login against bot-driven abuse.',
    dirName: 'sfcc-fraud-prevention',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-fraud-prevention/SKILL.md'
  },
  {
    name: 'sfcc-isml-development',
    description: 'SFRA-first guide for developing ISML templates in Salesforce B2C Commerce (Bootstrap 4 conventions). Use this when creating, modifying, or troubleshooting SFRA templates, decorators, components, forms, includes, and caching.',
    dirName: 'sfcc-isml-development',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-isml-development/SKILL.md'
  },
  {
    name: 'sfcc-job-development',
    description: 'Guide for developing custom jobs in Salesforce B2C Commerce Job Framework. Use this when asked to create batch jobs, scheduled tasks, chunk-oriented processing, or task-oriented jobs.',
    dirName: 'sfcc-job-development',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-job-development/SKILL.md'
  },
  {
    name: 'sfcc-localization',
    description: 'Guide for localizing templates, forms, and content in Salesforce B2C Commerce. Use this when implementing multi-language support, resource bundles, locale-specific content, and internationalization features.',
    dirName: 'sfcc-localization',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-localization/SKILL.md'
  },
  {
    name: 'sfcc-localserviceregistry',
    description: 'Guide for creating server-to-server integrations in Salesforce B2C Commerce using LocalServiceRegistry. Use this when asked to integrate external APIs, create HTTP services, implement OAuth flows, or configure service credentials.',
    dirName: 'sfcc-localserviceregistry',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-localserviceregistry/SKILL.md'
  },
  {
    name: 'sfcc-logging',
    description: 'Guide for implementing logging in Salesforce B2C Commerce scripts',
    dirName: 'sfcc-logging',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-logging/SKILL.md'
  },
  {
    name: 'sfcc-ocapi-hooks',
    description: 'Guide for implementing OCAPI hooks in Salesforce B2C Commerce. Use this when asked to create OCAPI hooks, extend API endpoints, validate API requests, or modify API responses.',
    dirName: 'sfcc-ocapi-hooks',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-ocapi-hooks/SKILL.md'
  },
  {
    name: 'sfcc-ocapi-scapi-slas',
    description: 'Decision guide for OCAPI vs SCAPI, and practical SLAS token lifecycle guidance (guest tokens, refresh rotation, public vs private clients, and hybrid SFRA/headless auth). Use this when planning integrations or debugging auth/rate-limit issues.',
    dirName: 'sfcc-ocapi-scapi-slas',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-ocapi-scapi-slas/SKILL.md'
  },
  {
    name: 'sfcc-page-designer',
    description: 'Guide for creating Page Designer pages and components in Salesforce B2C Commerce',
    dirName: 'sfcc-page-designer',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-page-designer/SKILL.md'
  },
  {
    name: 'sfcc-performance',
    description: 'Performance optimization strategies for Salesforce B2C Commerce Cloud including caching, efficient data retrieval, index-friendly APIs, and job optimization. Use when asked about SFCC performance, caching strategies, or optimization.',
    dirName: 'sfcc-performance',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-performance/SKILL.md'
  },
  {
    name: 'sfcc-platform-limits',
    description: 'Cheat-sheet and design patterns for surviving SFCC quotas and limits (script timeouts, HTTPClient call caps, session size, custom object quotas, file I/O restrictions, and headless rate limits). Use this when debugging enforced quota violations or designing scalable SFCC architectures.',
    dirName: 'sfcc-platform-limits',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-platform-limits/SKILL.md'
  },
  {
    name: 'sfcc-scapi-custom-endpoints',
    description: 'Guide for developing SCAPI Custom APIs on Salesforce B2C Commerce. Use this when asked to create custom REST endpoints, api.json, schema.yaml, or script implementations.',
    dirName: 'sfcc-scapi-custom-endpoints',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-scapi-custom-endpoints/SKILL.md'
  },
  {
    name: 'sfcc-scapi-hooks',
    description: 'Guide for implementing SCAPI hooks in Salesforce B2C Commerce. Use this when asked to create SCAPI hooks, extend Shopper API endpoints, validate API requests, or modify API responses for headless commerce.',
    dirName: 'sfcc-scapi-hooks',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-scapi-hooks/SKILL.md'
  },
  {
    name: 'sfcc-script-evaluation',
    description: 'Guide for using the evaluate_script tool to execute JavaScript on SFCC instances via the script debugger',
    dirName: 'sfcc-script-evaluation',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-script-evaluation/SKILL.md'
  },
  {
    name: 'sfcc-security',
    description: 'Secure coding best practices for Salesforce B2C Commerce Cloud including CSRF protection, authentication, authorization, cryptography, and secrets management. Use when asked about SFCC security, input validation, or secure coding patterns.',
    dirName: 'sfcc-security',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-security/SKILL.md'
  },
  {
    name: 'sfcc-sfra-client-side-js',
    description: 'Guide for extending, structuring, validating, and optimizing client-side JavaScript in SFRA storefronts. Use when asked to build AJAX flows, form validation, DOM interactions, or client-side customizations.',
    dirName: 'sfcc-sfra-client-side-js',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-sfra-client-side-js/SKILL.md'
  },
  {
    name: 'sfcc-sfra-controllers',
    description: 'Guide for developing SFRA controllers in Salesforce B2C Commerce. Use this when asked to create controllers, extend base functionality, implement middleware chains, handle routing, or customize storefront behavior.',
    dirName: 'sfcc-sfra-controllers',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-sfra-controllers/SKILL.md'
  },
  {
    name: 'sfcc-sfra-models',
    description: 'Guide for creating, extending, and customizing models within SFRA. Use this when asked to develop product models, cart models, customer models, or any JSON transformation layer in SFCC.',
    dirName: 'sfcc-sfra-models',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-sfra-models/SKILL.md'
  },
  {
    name: 'sfcc-sfra-scss',
    description: 'Best practices for styling and theming SFRA storefronts using SCSS. Use when asked to create style overrides, theming, responsive layouts, or CSS customizations in SFCC.',
    dirName: 'sfcc-sfra-scss',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-sfra-scss/SKILL.md'
  },
  {
    name: 'sfcc-webdav-workflows',
    description: 'Practical guide for using WebDAV in Salesforce B2C Commerce Cloud for IMPEX transfers and log access. Use this when setting up WebDAV clients, debugging WebDAV permission issues, or designing automation that reads/writes files via WebDAV.',
    dirName: 'sfcc-webdav-workflows',
    githubUrl: 'https://github.com/taurgis/sfcc-dev-mcp/blob/main/ai-instructions/skills/sfcc-webdav-workflows/SKILL.md'
  }
];
