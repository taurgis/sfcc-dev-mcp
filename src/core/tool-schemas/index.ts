/**
 * MCP Tool Definitions Index
 *
 * Aggregates all tool schema definitions from modular files.
 * This keeps the main file clean while allowing easy imports.
 */

// Re-export shared schemas for external use
export {
  QUERY_SCHEMA,
  SORTS_SCHEMA,
  PAGINATION_SCHEMA,
  createSearchRequestSchema,
  DATE_PARAM_SCHEMA,
  createLimitSchema,
} from './shared-schemas.js';

// Re-export all tool definitions
export { SFCC_DOCUMENTATION_TOOLS } from './documentation-tools.js';
export { SFRA_DOCUMENTATION_TOOLS } from './sfra-tools.js';
export { ISML_DOCUMENTATION_TOOLS } from './isml-tools.js';
export { LOG_TOOLS, JOB_LOG_TOOLS } from './log-tools.js';
export { SYSTEM_OBJECT_TOOLS } from './system-object-tools.js';
export { CARTRIDGE_GENERATION_TOOLS } from './cartridge-tools.js';
export { CODE_VERSION_TOOLS } from './code-version-tools.js';
export { AGENT_INSTRUCTION_TOOLS } from './agent-instruction-tools.js';
export { SCRIPT_DEBUGGER_TOOLS } from './script-debugger-tools.js';
