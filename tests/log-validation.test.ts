import { validateLogLevel, formatLogMessage } from '../src/utils/log-validation.js';
import { LogLevelValues } from '../src/utils/log-tool-constants.js';

describe('validateLogLevel', () => {
  it('should accept valid log levels', () => {
    const validLevels = ['error', 'warn', 'info', 'debug', 'all'];

    validLevels.forEach(level => {
      expect(() => validateLogLevel(level, 'test_tool')).not.toThrow();
    });
  });

  it('should reject invalid log levels', () => {
    const invalidLevels = ['trace', 'fatal', 'verbose', 'invalid', ''];

    invalidLevels.forEach(level => {
      expect(() => validateLogLevel(level, 'test_tool'))
        .toThrow(/Invalid log level/);
    });
  });

  it('should include tool name in error message', () => {
    expect(() => validateLogLevel('invalid', 'test_tool'))
      .toThrow(/Invalid log level.*test_tool/);
  });

  it('should handle null and undefined gracefully', () => {
    expect(() => validateLogLevel(null as any, 'test_tool')).toThrow();
    expect(() => validateLogLevel(undefined as any, 'test_tool')).toThrow();
  });

  it('should be case sensitive', () => {
    expect(() => validateLogLevel('ERROR', 'test_tool')).toThrow();
    expect(() => validateLogLevel('ALL', 'test_tool')).toThrow();
    expect(() => validateLogLevel('Debug', 'test_tool')).toThrow();
  });
});

describe('LogLevelValues', () => {
  it('should contain exactly the expected levels', () => {
    expect(Object.values(LogLevelValues)).toEqual(['error', 'warn', 'info', 'debug', 'all']);
  });
});

describe('formatLogMessage', () => {
  it('should format message with operation only', () => {
    const result = formatLogMessage('Testing operation', {});
    expect(result).toBe('Testing operation');
  });

  it('should format message with job name', () => {
    const result = formatLogMessage('Testing operation', { jobName: 'TestJob' });
    expect(result).toBe('Testing operation jobName=TestJob');
  });

  it('should format message with level', () => {
    const result = formatLogMessage('Testing operation', { level: 'error' });
    expect(result).toBe('Testing operation level=error');
  });

  it('should format message with limit', () => {
    const result = formatLogMessage('Testing operation', { limit: 50 });
    expect(result).toBe('Testing operation limit=50');
  });

  it('should format message with limit of 0', () => {
    const result = formatLogMessage('Testing operation', { limit: 0 });
    expect(result).toBe('Testing operation limit=0');
  });

  it('should format message with pattern', () => {
    const result = formatLogMessage('Testing operation', { pattern: 'error-pattern' });
    expect(result).toBe('Testing operation pattern="error-pattern"');
  });

  it('should format message with pattern containing spaces', () => {
    const result = formatLogMessage('Testing operation', { pattern: 'error with spaces' });
    expect(result).toBe('Testing operation pattern="error with spaces"');
  });

  it('should format message with all parameters', () => {
    const result = formatLogMessage('Complex operation', {
      jobName: 'ComplexJob',
      level: 'debug',
      limit: 25,
      pattern: 'search-term',
    });
    expect(result).toBe('Complex operation jobName=ComplexJob level=debug limit=25 pattern="search-term"');
  });

  it('should handle empty strings in parameters', () => {
    const result = formatLogMessage('Testing operation', {
      jobName: '',
      level: '',
      pattern: '',
    });
    expect(result).toBe('Testing operation');
  });

  it('should handle undefined limit correctly', () => {
    const result = formatLogMessage('Testing operation', { jobName: 'TestJob', limit: undefined });
    expect(result).toBe('Testing operation jobName=TestJob');
  });

  it('should handle special characters in job name', () => {
    const result = formatLogMessage('Testing operation', { jobName: 'Job-With_Special.Characters' });
    expect(result).toBe('Testing operation jobName=Job-With_Special.Characters');
  });

  it('should handle special characters in pattern', () => {
    const result = formatLogMessage('Testing operation', { pattern: 'pattern-with_special.chars' });
    expect(result).toBe('Testing operation pattern="pattern-with_special.chars"');
  });

  it('should preserve order of parameters', () => {
    const result = formatLogMessage('Operation', {
      pattern: 'last',
      jobName: 'first',
      level: 'second',
      limit: 123,
    });
    // Should maintain the order: jobName, level, limit, pattern
    expect(result).toBe('Operation jobName=first level=second limit=123 pattern="last"');
  });

  it('should handle empty operation string', () => {
    const result = formatLogMessage('', { jobName: 'TestJob' });
    expect(result).toBe(' jobName=TestJob');
  });

  it('should format message with filename', () => {
    const result = formatLogMessage('Reading file', { filename: 'test.log' });
    expect(result).toBe('Reading file filename=test.log');
  });

  it('should format message with date', () => {
    const result = formatLogMessage('Fetching logs', { date: '20240101' });
    expect(result).toBe('Fetching logs date=20240101');
  });

  it('should format message with maxBytes and tailOnly', () => {
    const result = formatLogMessage('Reading file', {
      filename: 'test.log',
      maxBytes: 1024,
      tailOnly: true,
    });
    expect(result).toBe('Reading file filename=test.log maxBytes=1024 tailOnly=true');
  });
});
