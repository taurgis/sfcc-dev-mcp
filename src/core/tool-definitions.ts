/**
 * MCP Tool Definitions for SFCC Development
 *
 * This module re-exports all tool definitions from modular schema files.
 * The definitions are organized by category for maintainability.
 *
 * @see ./tool-schemas/ for individual schema modules
 */

// Re-export all tool definitions from modular files
export {
  SFCC_DOCUMENTATION_TOOLS,
  SFRA_DOCUMENTATION_TOOLS,
  ISML_DOCUMENTATION_TOOLS,
  LOG_TOOLS,
  JOB_LOG_TOOLS,
  SYSTEM_OBJECT_TOOLS,
  CARTRIDGE_GENERATION_TOOLS,
  CODE_VERSION_TOOLS,
  AGENT_INSTRUCTION_TOOLS,
  SCRIPT_DEBUGGER_TOOLS,
} from './tool-schemas/index.js';

// Re-export shared schemas for any external consumers
export {
  QUERY_SCHEMA,
  SORTS_SCHEMA,
  PAGINATION_SCHEMA,
  createSearchRequestSchema,
} from './tool-schemas/index.js';
