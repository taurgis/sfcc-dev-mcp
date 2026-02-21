import {
  ToolArgumentValidationError,
  ToolArgumentValidator,
} from '../src/core/tool-argument-validator.js';
import { LOG_TOOLS } from '../src/core/tool-schemas/log-tools.js';
import { SFCC_DOCUMENTATION_TOOLS } from '../src/core/tool-schemas/documentation-tools.js';

describe('ToolArgumentValidator', () => {
  it('rejects invalid enum values', () => {
    const validator = new ToolArgumentValidator(LOG_TOOLS);

    expect(() => {
      validator.validate('search_logs', { pattern: 'order', logLevel: 'fatal' });
    }).toThrow(ToolArgumentValidationError);
  });

  it('rejects unknown top-level keys by default', () => {
    const validator = new ToolArgumentValidator(SFCC_DOCUMENTATION_TOOLS);

    expect(() => {
      validator.validate('search_sfcc_classes', { query: 'catalog', extra: true });
    }).toThrow(ToolArgumentValidationError);
  });

  it('allows unknown keys when additionalProperties is true', () => {
    const validator = new ToolArgumentValidator([
      {
        name: 'custom_tool',
        inputSchema: {
          type: 'object',
          additionalProperties: true,
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
    ]);

    expect(() => {
      validator.validate('custom_tool', { query: 'ok', extra: true });
    }).not.toThrow();
  });

  it('enforces numeric minimum and maximum constraints', () => {
    const validator = new ToolArgumentValidator([
      {
        name: 'bounded_tool',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', minimum: 1, maximum: 10 },
          },
          required: ['limit'],
        },
      },
    ]);

    expect(() => {
      validator.validate('bounded_tool', { limit: 0 });
    }).toThrow(ToolArgumentValidationError);

    expect(() => {
      validator.validate('bounded_tool', { limit: 11 });
    }).toThrow(ToolArgumentValidationError);

    expect(() => {
      validator.validate('bounded_tool', { limit: 5 });
    }).not.toThrow();
  });

  it('enforces integer type constraints', () => {
    const validator = new ToolArgumentValidator([
      {
        name: 'integer_tool',
        inputSchema: {
          type: 'object',
          properties: {
            breakpointLine: { type: 'integer', minimum: 1 },
          },
        },
      },
    ]);

    expect(() => {
      validator.validate('integer_tool', { breakpointLine: 1.5 });
    }).toThrow(ToolArgumentValidationError);

    expect(() => {
      validator.validate('integer_tool', { breakpointLine: 1 });
    }).not.toThrow();
  });

  it('enforces string pattern constraints', () => {
    const validator = new ToolArgumentValidator([
      {
        name: 'date_tool',
        inputSchema: {
          type: 'object',
          properties: {
            date: { type: 'string', pattern: '^\\d{8}$' },
          },
        },
      },
    ]);

    expect(() => {
      validator.validate('date_tool', { date: '2026-02-21' });
    }).toThrow(ToolArgumentValidationError);

    expect(() => {
      validator.validate('date_tool', { date: '20260221' });
    }).not.toThrow();
  });
});
