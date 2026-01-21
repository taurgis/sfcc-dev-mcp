// Centralized metadata for MCP tools. Used by ToolsPage for dynamic rendering.
// Keeps descriptive, param, and example prompt info in one place for reuse.

export type ToolMode = 'docs' | 'full' | 'both';
export interface ToolParam {
  name: string;
  required?: boolean;
  description: string;
}
export interface ToolMeta {
  id: string; // unique id also used as anchor
  name: string; // tool name as exposed to MCP
  category: string;
  mode: ToolMode; // availability
  description: string;
  params?: ToolParam[];
  examples?: string[]; // example AI prompts or usage
  tags?: string[];
  popular?: boolean; // mark for quick actions
}

// Helper for brevity
const p = (name: string, description: string, required = true): ToolParam => ({ name, description, required });

export const TOOL_CATEGORIES = [
  'Agent Instructions',
  'Documentation',
  'SFRA Docs',
  'ISML Docs',
  'Cartridge Generation',
  'Log Analysis',
  'System Objects',
  'Code Versions'
] as const;

export const tools: ToolMeta[] = [
  // Agent Instructions
  {
    id: 'sync-agent-instructions',
    name: 'sync_agent_instructions',
    category: 'Agent Instructions',
    mode: 'both',
    description: 'Copy/merge AGENTS.md and bundled SFCC skills into a project, user home, or a temp directory (supports dry-run planning and merge strategies).',
    params: [
      p('destinationType', 'project|user|temp (default: project)', false),
      p('preferredRoot', 'Optional workspace root path or name when multiple roots exist', false),
      p('skillsDir', 'Optional relative skills dir (.github/skills, .cursor/skills, .claude/skills)', false),
      p('mergeStrategy', 'append|replace|skip (default: append)', false),
      p('includeAgents', 'Copy AGENTS.md (boolean, default: true)', false),
      p('includeSkills', 'Copy skills (boolean, default: true)', false),
      p('installMissingOnly', 'Only copy missing skills (boolean, default: true)', false),
      p('dryRun', 'Plan actions without writing (boolean, default: true)', false),
      p('tempDir', 'Custom temp directory when destinationType=temp', false)
    ],
    examples: [
      'Sync agent instructions into this SFCC project (dryRun=false)',
      'Plan what sync_agent_instructions would change (dryRun=true)',
      'Install skills into .github/skills for GitHub Copilot'
    ],
    tags: ['agents','skills','bootstrap','instructions'],
    popular: true
  },

  // Documentation (SFCC classes)
  {
    id: 'get-sfcc-class-info',
    name: 'get_sfcc_class_info',
    category: 'Documentation',
    mode: 'both',
    description: 'Detailed information about an SFCC class with filtering and search capabilities: properties, methods, descriptions.',
    params: [
      p('className', "SFCC class (e.g. 'Catalog' or 'dw.catalog.Catalog')"), 
      p('expand', 'Include referenced type details (boolean)', false),
      p('includeDescription', 'Include class description (boolean, default: true)', false),
      p('includeConstants', 'Include class constants (boolean, default: true)', false),
      p('includeProperties', 'Include class properties (boolean, default: true)', false),
      p('includeMethods', 'Include class methods (boolean, default: true)', false),
      p('includeInheritance', 'Include inheritance info (boolean, default: true)', false),
      p('search', 'Filter results by search term (string)', false)
    ],
    examples: [
      'Show methods and properties on dw.catalog.Product',
      'Show only methods for dw.system.Status class',
      'Search for "get" methods in dw.catalog.Product',
      'Show dw.order.Order class without description or constants',
      'Find "name" related properties and methods in dw.catalog.Product'
    ],
    tags: ['api','classes','introspection','filtering','search'],
    popular: true
  },
  { id: 'search-sfcc-classes', name: 'search_sfcc_classes', category: 'Documentation', mode: 'both', description: 'Search SFCC classes by partial name (single word).', params: [p('query', 'Search term (single word)')], examples: ['Find classes related to price','Search for catalog classes'], tags: ['search'], popular: true },
  { id: 'search-sfcc-methods', name: 'search_sfcc_methods', category: 'Documentation', mode: 'both', description: 'Search methods across all SFCC classes.', params: [p('methodName', 'Method name (single word)')], examples: ['Find get methods on system objects','Search for commit methods'], tags: ['methods','search'] },
  { id: 'list-sfcc-classes', name: 'list_sfcc_classes', category: 'Documentation', mode: 'both', description: 'List of all available SFCC classes.', examples: ['List all available SFCC classes'] },
  { id: 'get-sfcc-class-documentation', name: 'get_sfcc_class_documentation', category: 'Documentation', mode: 'both', description: 'Raw markdown documentation for an SFCC class.', params: [p('className','Exact class name')], examples: ['Get raw docs for dw.system.Logger'] },

  // SFRA Docs
  { id: 'get-available-sfra-documents', name: 'get_available_sfra_documents', category: 'SFRA Docs', mode: 'both', description: 'List all SFRA documents and models.', examples: ['List SFRA docs categories'] },
  { id: 'get-sfra-document', name: 'get_sfra_document', category: 'SFRA Docs', mode: 'both', description: 'Full SFRA document (server, request, cart, product-full etc.).', params: [p('documentName','SFRA document name')], examples: ['Show the server module SFRA docs'] },
  { id: 'search-sfra-documentation', name: 'search_sfra_documentation', category: 'SFRA Docs', mode: 'both', description: 'Search across SFRA docs.', params: [p('query','Search term')], examples: ['Search SFRA docs for middleware'], tags: ['search'] },
  { id: 'get-sfra-categories', name: 'get_sfra_categories', category: 'SFRA Docs', mode: 'both', description: 'List SFRA document categories with counts.' },
  { id: 'get-sfra-documents-by-category', name: 'get_sfra_documents_by_category', category: 'SFRA Docs', mode: 'both', description: 'Get SFRA documents for a category.', params: [p('category','core|product|order|customer|pricing|store|other')], examples: ['List all order category SFRA docs'] },

  // ISML Docs
  { id: 'list-isml-elements', name: 'list_isml_elements', category: 'ISML Docs', mode: 'both', description: 'List all available ISML elements with summaries for template development.', examples: ['List all ISML elements','Show available ISML control flow elements'], tags: ['templates','isml','elements'], popular: true },
  { id: 'get-isml-element', name: 'get_isml_element', category: 'ISML Docs', mode: 'both', description: 'Detailed documentation for a specific ISML element including syntax, attributes, and examples.', params: [p('elementName','ISML element name (e.g., isif, isloop, isprint)'), p('includeContent','Include full content (boolean, default: true)', false), p('includeSections','Include section headings (boolean, default: true)', false), p('includeAttributes','Include attribute info (boolean, default: true)', false)], examples: ['Show documentation for isif element','Get isloop syntax and examples','Explain isprint formatting options'], tags: ['templates','isml','syntax'], popular: true },
  { id: 'search-isml-elements', name: 'search_isml_elements', category: 'ISML Docs', mode: 'both', description: 'Search ISML element documentation for specific terms or functionality.', params: [p('query','Search term (e.g., loop, conditional, format, cache)'), p('category','Optional category filter', false), p('limit','Max results', false)], examples: ['Search ISML elements for caching','Find ISML elements for conditionals','Search for redirect elements'], tags: ['search','templates','isml'] },
  { id: 'get-isml-elements-by-category', name: 'get_isml_elements_by_category', category: 'ISML Docs', mode: 'both', description: 'Get all ISML elements filtered by category (control-flow, output, includes, scripting, cache, etc.).', params: [p('category','control-flow|output|includes|scripting|cache|decorators|special|payment|analytics')], examples: ['List all control flow ISML elements','Show caching ISML elements'], tags: ['templates','isml','categories'] },
  { id: 'get-isml-categories', name: 'get_isml_categories', category: 'ISML Docs', mode: 'both', description: 'Get all ISML element categories with descriptions and element counts.', examples: ['List ISML categories','Show ISML element organization'], tags: ['templates','isml'] },

  // Cartridge Generation
  { id: 'generate-cartridge-structure', name: 'generate_cartridge_structure', category: 'Cartridge Generation', mode: 'both', description: 'Generate cartridge directory structure.', params: [p('cartridgeName','Name of cartridge'), p('targetPath','Target path (optional)', false), p('fullProjectSetup','Include project scaffolding (boolean)', false)], examples: ['Generate cartridge named plugin_demo'], tags: ['scaffold'], popular: true },

  // Log Analysis (Full Mode)
  { id: 'get-latest-error', name: 'get_latest_error', category: 'Log Analysis', mode: 'full', description: 'Fetch latest error log entries.', params: [p('date','YYYYMMDD (optional defaults today)', false), p('limit','Number of entries', false)], examples: ['Show last 5 error log entries'], tags: ['logs','errors'], popular: true },
  { id: 'get-latest-warn', name: 'get_latest_warn', category: 'Log Analysis', mode: 'full', description: 'Fetch latest warn log entries.', params: [p('date','YYYYMMDD', false), p('limit','Entries', false)] },
  { id: 'get-latest-info', name: 'get_latest_info', category: 'Log Analysis', mode: 'full', description: 'Fetch latest info log entries.', params: [p('date','YYYYMMDD', false), p('limit','Entries', false)] },
  { id: 'get-latest-debug', name: 'get_latest_debug', category: 'Log Analysis', mode: 'full', description: 'Fetch latest debug log entries.', params: [p('date','YYYYMMDD', false), p('limit','Entries', false)] },
  { id: 'search-logs', name: 'search_logs', category: 'Log Analysis', mode: 'full', description: 'Search across logs for a pattern.', params: [p('pattern','Search string'), p('date','YYYYMMDD', false), p('limit','Entries', false), p('logLevel','error|warn|info|debug', false)], examples: ['Search logs for OCAPI 500 errors'], tags: ['search'] },
  { id: 'summarize-logs', name: 'summarize_logs', category: 'Log Analysis', mode: 'full', description: 'High level log activity summary.', params: [p('date','YYYYMMDD', false)], examples: ['Summarize today\'s logs'] },
  { id: 'list-log-files', name: 'list_log_files', category: 'Log Analysis', mode: 'full', description: 'List available log files with metadata.', examples: ['List available log files'] },
  { id: 'get-log-file-contents', name: 'get_log_file_contents', category: 'Log Analysis', mode: 'full', description: 'Fetch specific log file contents.', params: [p('filename','File name'), p('maxBytes','Max bytes', false), p('tailOnly','Tail only boolean', false)], examples: ['Show tail of error log'] },
  { id: 'get-latest-job-log-files', name: 'get_latest_job_log_files', category: 'Log Analysis', mode: 'full', description: 'List latest job log files.', params: [p('limit','Number of files', false)], examples: ['List latest 3 job log files'] },
  { id: 'get-job-log-entries', name: 'get_job_log_entries', category: 'Log Analysis', mode: 'full', description: 'Get job log entries filtered by level.', params: [p('jobName','Job name', false), p('level','error|warn|info|debug|all', false), p('limit','Entries', false)], examples: ['Get last 10 job log entries'] },
  { id: 'search-job-logs', name: 'search_job_logs', category: 'Log Analysis', mode: 'full', description: 'Search job logs for pattern.', params: [p('pattern','Search string'), p('jobName','Job name', false), p('limit','Entries', false), p('level','error|warn|info|debug|all', false)], examples: ['Search job logs for timeout'] },
  { id: 'search-job-logs-by-name', name: 'search_job_logs_by_name', category: 'Log Analysis', mode: 'full', description: 'Find job log files by job name.', params: [p('jobName','Partial job name'), p('limit','Files', false)], examples: ['Find job logs for OrderExport'] },
  { id: 'get-job-execution-summary', name: 'get_job_execution_summary', category: 'Log Analysis', mode: 'full', description: 'Execution summary for specific job.', params: [p('jobName','Job name')], examples: ['Summarize last execution of DailyFeed job'] },

  // System Objects
  { id: 'get-system-object-definitions', name: 'get_system_object_definitions', category: 'System Objects', mode: 'full', description: 'All system object definitions with pagination support.', params: [p('start','Start index', false), p('count','Max count', false), p('select','Property selector', false)], examples: ['List system object definitions', 'Get first 10 system objects', 'Get system objects starting from index 5'], tags: ['objects'], popular: true },
  { id: 'get-system-object-definition', name: 'get_system_object_definition', category: 'System Objects', mode: 'full', description: 'Specific system object metadata.', params: [p('objectType','Object type e.g. Product')], examples: ['Get definition for Product object'] },
  { id: 'search-system-object-attribute-definitions', name: 'search_system_object_attribute_definitions', category: 'System Objects', mode: 'full', description: 'Search attributes for a system object.', params: [p('objectType','System object type'), p('searchRequest','Search request body')], examples: ['Search Product attributes for inventory fields'] },
  { id: 'search-system-object-attribute-groups', name: 'search_system_object_attribute_groups', category: 'System Objects', mode: 'full', description: 'Search attribute groups for a system object.', params: [p('objectType','System object type'), p('searchRequest','Search request body')], examples: ['List attribute groups for Product object'] },
  { id: 'search-site-preferences', name: 'search_site_preferences', category: 'System Objects', mode: 'full', description: 'Search site preferences within a group.', params: [p('groupId','Preference group ID'), p('searchRequest','Search request body')], examples: ['Search site preferences in SitePreferencesMarketing group'] },
  { id: 'search-custom-object-attribute-definitions', name: 'search_custom_object_attribute_definitions', category: 'System Objects', mode: 'full', description: 'Search custom object attributes.', params: [p('objectType','Custom object type'), p('searchRequest','Search request body')], examples: ['Search custom object attributes for Global_String'] },

  // Code Versions
  { id: 'get-code-versions', name: 'get_code_versions', category: 'Code Versions', mode: 'full', description: 'List all code versions.', examples: ['List available code versions'], popular: true },
  { id: 'activate-code-version', name: 'activate_code_version', category: 'Code Versions', mode: 'full', description: 'Activate a specific code version.', params: [p('codeVersionId','ID of code version')], examples: ['Activate code version int_2025_09'] }
];

export const popularTools = tools.filter(t => t.popular);
export const categoriesWithCounts = TOOL_CATEGORIES.map(cat => ({
  name: cat,
  count: tools.filter(t => t.category === cat).length
}));
