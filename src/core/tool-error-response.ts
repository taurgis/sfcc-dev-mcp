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

const SENSITIVE_MESSAGE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /Bearer\s+[^\s]+/gi, replacement: 'Bearer [REDACTED]' },
  { pattern: /Basic\s+[A-Za-z0-9+/=]+/gi, replacement: 'Basic [REDACTED]' },
  { pattern: /(client[-_]?secret\s*[:=]\s*)\S+/gi, replacement: '$1[REDACTED]' },
  { pattern: /(password\s*[:=]\s*)\S+/gi, replacement: '$1[REDACTED]' },
  { pattern: /(access[-_]?token\s*[:=]\s*)\S+/gi, replacement: '$1[REDACTED]' },
  { pattern: /(api[-_]?key\s*[:=]\s*)\S+/gi, replacement: '$1[REDACTED]' },
];

function sanitizeToolErrorMessage(message: string): string {
  let sanitized = message.trim();

  if (/^Request failed(?: after retry)?:\s*\d{3}\b/i.test(sanitized)) {
    const separatorIndex = sanitized.indexOf(' - ');
    if (separatorIndex >= 0) {
      sanitized = sanitized.slice(0, separatorIndex);
    }
  }

  for (const { pattern, replacement } of SENSITIVE_MESSAGE_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  if (!sanitized) {
    return 'Tool execution failed';
  }

  return sanitized.length > 500
    ? `${sanitized.slice(0, 500)}...`
    : sanitized;
}

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
      message: sanitizeToolErrorMessage(error.message),
      toolName,
    };
  }

  return {
    code: 'TOOL_EXECUTION_ERROR',
    message: sanitizeToolErrorMessage(String(error)),
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
