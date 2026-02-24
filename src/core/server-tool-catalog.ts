import {
  AGENT_INSTRUCTION_TOOLS,
  CARTRIDGE_GENERATION_TOOLS,
  CODE_VERSION_TOOLS,
  ISML_DOCUMENTATION_TOOLS,
  JOB_LOG_TOOLS,
  LOG_TOOLS,
  SCRIPT_DEBUGGER_TOOLS,
  SFCC_DOCUMENTATION_TOOLS,
  SFRA_DOCUMENTATION_TOOLS,
  SYSTEM_OBJECT_TOOLS,
} from './tool-definitions.js';

export type LogCapabilityState = 'available' | 'unavailable' | 'unknown';

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: unknown;
};

export type ToolNameSets = {
  alwaysAvailable: Set<string>;
  logCapability: Set<string>;
  ocapiCapability: Set<string>;
};

export const ALWAYS_AVAILABLE_TOOLS: ToolDefinition[] = [
  ...AGENT_INSTRUCTION_TOOLS,
  ...SFCC_DOCUMENTATION_TOOLS,
  ...SFRA_DOCUMENTATION_TOOLS,
  ...ISML_DOCUMENTATION_TOOLS,
  ...CARTRIDGE_GENERATION_TOOLS,
];

export const LOG_CAPABILITY_TOOLS: ToolDefinition[] = [
  ...LOG_TOOLS,
  ...JOB_LOG_TOOLS,
  ...SCRIPT_DEBUGGER_TOOLS,
];

export const OCAPI_CAPABILITY_TOOLS: ToolDefinition[] = [
  ...SYSTEM_OBJECT_TOOLS,
  ...CODE_VERSION_TOOLS,
];

export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
  ...ALWAYS_AVAILABLE_TOOLS,
  ...LOG_CAPABILITY_TOOLS,
  ...OCAPI_CAPABILITY_TOOLS,
];

export function createToolNameSets(): ToolNameSets {
  return {
    alwaysAvailable: new Set(ALWAYS_AVAILABLE_TOOLS.map((tool) => tool.name)),
    logCapability: new Set(LOG_CAPABILITY_TOOLS.map((tool) => tool.name)),
    ocapiCapability: new Set(OCAPI_CAPABILITY_TOOLS.map((tool) => tool.name)),
  };
}

export function getAvailableTools(
  logCapabilityState: LogCapabilityState,
  canAccessOCAPI: boolean,
): ToolDefinition[] {
  const tools: ToolDefinition[] = [...ALWAYS_AVAILABLE_TOOLS];

  if (logCapabilityState === 'available') {
    tools.push(...LOG_CAPABILITY_TOOLS);
  }

  if (canAccessOCAPI) {
    tools.push(...OCAPI_CAPABILITY_TOOLS);
  }

  return tools;
}

export function isToolAvailable(
  toolName: string,
  logCapabilityState: LogCapabilityState,
  canAccessOCAPI: boolean,
  toolNames: ToolNameSets,
): boolean {
  if (toolNames.alwaysAvailable.has(toolName)) {
    return true;
  }

  if (toolNames.logCapability.has(toolName)) {
    return logCapabilityState === 'available';
  }

  if (toolNames.ocapiCapability.has(toolName)) {
    return canAccessOCAPI;
  }

  return false;
}
