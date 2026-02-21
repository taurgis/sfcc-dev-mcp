import { ValidationError } from '../utils/validator.js';

export interface StructuredToolError {
  code: string;
  message: string;
  toolName: string;
  details?: unknown;
}

export interface ToolErrorResponseShape {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError: true;
  structuredContent?: { error: StructuredToolError };
}

export const INCLUDE_STRUCTURED_ERRORS = process.env.SFCC_MCP_STRUCTURED_ERRORS !== 'false';

export function createStructuredToolError(toolName: string, error: unknown): StructuredToolError {
  if (error instanceof ValidationError) {
    return {
      code: error.code,
      message: error.message,
      toolName,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'TOOL_EXECUTION_ERROR',
      message: error.message,
      toolName,
    };
  }

  return {
    code: 'TOOL_EXECUTION_ERROR',
    message: String(error),
    toolName,
  };
}

export function createToolErrorResponse(toolName: string, error: unknown): ToolErrorResponseShape {
  const structuredError = createStructuredToolError(toolName, error);

  const response: ToolErrorResponseShape = {
    content: [{ type: 'text', text: `Error: ${structuredError.message}` }],
    isError: true,
  };

  if (INCLUDE_STRUCTURED_ERRORS) {
    response.structuredContent = {
      error: structuredError,
    };
  }

  return response;
}
