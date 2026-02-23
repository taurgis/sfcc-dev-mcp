import {
  createStructuredToolError,
  createToolErrorResponse,
} from '../src/core/tool-error-response.js';
import { ValidationError } from '../src/utils/validator.js';

describe('tool-error-response', () => {
  it('preserves ValidationError details and message', () => {
    const error = new ValidationError('Missing required field: query', 'INVALID_TOOL_ARGUMENTS', { field: 'query' });

    const result = createStructuredToolError('search_sfcc_classes', error);

    expect(result.code).toBe('INVALID_TOOL_ARGUMENTS');
    expect(result.message).toBe('Missing required field: query');
    expect(result.details).toEqual({ field: 'query' });
  });

  it('strips upstream HTTP body text from request failures', () => {
    const result = createStructuredToolError(
      'search_logs',
      new Error('Request failed: 500 Internal Server Error - stacktrace and backend internals'),
    );

    expect(result.code).toBe('TOOL_EXECUTION_ERROR');
    expect(result.message).toBe('Request failed: 500 Internal Server Error');
  });

  it('redacts credential-like tokens in generic errors', () => {
    const result = createStructuredToolError(
      'search_logs',
      new Error('Authorization failed with Bearer abc.def.ghi and password=secret123 client-secret=mySecret'),
    );

    expect(result.message).toContain('Bearer [REDACTED]');
    expect(result.message).toContain('password=[REDACTED]');
    expect(result.message).toContain('client-secret=[REDACTED]');
    expect(result.message).not.toContain('secret123');
    expect(result.message).not.toContain('mySecret');
  });

  it('returns sanitized text in tool error response content', () => {
    const response = createToolErrorResponse(
      'search_logs',
      new Error('Request failed after retry: 401 Unauthorized - token expired for user foo'),
    );

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toBe('Error: Request failed after retry: 401 Unauthorized');
    expect(response.structuredContent?.error.message).toBe('Request failed after retry: 401 Unauthorized');
  });
});
