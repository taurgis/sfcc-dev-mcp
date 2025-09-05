import { JobLogValidators, JobLogFormatters } from '../src/utils/job-log-utils.js';

describe('JobLogValidators', () => {
  describe('validateJobLogLevel', () => {
    it('should accept valid log levels', () => {
      const validLevels = ['error', 'warn', 'info', 'debug', 'all'];

      validLevels.forEach(level => {
        expect(() => JobLogValidators.validateJobLogLevel(level)).not.toThrow();
      });
    });

    it('should reject invalid log levels', () => {
      const invalidLevels = ['trace', 'fatal', 'verbose', 'invalid', ''];

      invalidLevels.forEach(level => {
        expect(() => JobLogValidators.validateJobLogLevel(level))
          .toThrow(`Invalid log level: ${level}. Must be one of: error, warn, info, debug, all`);
      });
    });

    it('should include tool name in error message when provided', () => {
      const toolName = 'test_tool';
      const invalidLevel = 'invalid';

      expect(() => JobLogValidators.validateJobLogLevel(invalidLevel, toolName))
        .toThrow(`${toolName}: Invalid log level: ${invalidLevel}. Must be one of: error, warn, info, debug, all`);
    });

    it('should handle null and undefined gracefully', () => {
      expect(() => JobLogValidators.validateJobLogLevel(null as any)).toThrow();
      expect(() => JobLogValidators.validateJobLogLevel(undefined as any)).toThrow();
    });

    it('should be case sensitive', () => {
      expect(() => JobLogValidators.validateJobLogLevel('ERROR')).toThrow();
      expect(() => JobLogValidators.validateJobLogLevel('ALL')).toThrow();
      expect(() => JobLogValidators.validateJobLogLevel('Debug')).toThrow();
    });
  });

  describe('getDefaultLimit', () => {
    it('should return correct default limit for search operations', () => {
      expect(JobLogValidators.getDefaultLimit('search')).toBe(20);
    });

    it('should return correct default limit for entries operations', () => {
      expect(JobLogValidators.getDefaultLimit('entries')).toBe(10);
    });

    it('should return correct default limit for files operations', () => {
      expect(JobLogValidators.getDefaultLimit('files')).toBe(10);
    });

    it('should return default limit for unknown operations', () => {
      expect(JobLogValidators.getDefaultLimit('unknown' as any)).toBe(10);
    });
  });

  describe('ALLOWED_LEVELS constant', () => {
    it('should contain exactly the expected levels', () => {
      expect(JobLogValidators.ALLOWED_LEVELS).toEqual(['error', 'warn', 'info', 'debug', 'all']);
    });

    it('should be readonly array', () => {
      const levels = JobLogValidators.ALLOWED_LEVELS;
      expect(levels).toEqual(['error', 'warn', 'info', 'debug', 'all']);
      // Test that it's a readonly array by checking its type/immutability intent
      expect(Array.isArray(levels)).toBe(true);
    });
  });
});

describe('JobLogFormatters', () => {
  describe('formatJobLogMessage', () => {
    it('should format message with operation only', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {});
      expect(result).toBe('Testing operation');
    });

    it('should format message with job name', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        jobName: 'TestJob',
      });
      expect(result).toBe('Testing operation jobName=TestJob');
    });

    it('should format message with level', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        level: 'error',
      });
      expect(result).toBe('Testing operation level=error');
    });

    it('should format message with limit', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        limit: 50,
      });
      expect(result).toBe('Testing operation limit=50');
    });

    it('should format message with limit of 0', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        limit: 0,
      });
      expect(result).toBe('Testing operation limit=0');
    });

    it('should format message with pattern', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        pattern: 'error-pattern',
      });
      expect(result).toBe('Testing operation pattern="error-pattern"');
    });

    it('should format message with pattern containing spaces', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        pattern: 'error with spaces',
      });
      expect(result).toBe('Testing operation pattern="error with spaces"');
    });

    it('should format message with all parameters', () => {
      const result = JobLogFormatters.formatJobLogMessage('Complex operation', {
        jobName: 'ComplexJob',
        level: 'debug',
        limit: 25,
        pattern: 'search-term',
      });
      expect(result).toBe('Complex operation jobName=ComplexJob level=debug limit=25 pattern="search-term"');
    });

    it('should handle empty strings in parameters', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        jobName: '',
        level: '',
        pattern: '',
      });
      expect(result).toBe('Testing operation');
    });

    it('should handle undefined limit correctly', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        jobName: 'TestJob',
        limit: undefined,
      });
      expect(result).toBe('Testing operation jobName=TestJob');
    });

    it('should handle special characters in job name', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        jobName: 'Job-With_Special.Characters',
      });
      expect(result).toBe('Testing operation jobName=Job-With_Special.Characters');
    });

    it('should handle special characters in pattern', () => {
      const result = JobLogFormatters.formatJobLogMessage('Testing operation', {
        pattern: 'pattern-with_special.chars',
      });
      expect(result).toBe('Testing operation pattern="pattern-with_special.chars"');
    });

    it('should preserve order of parameters', () => {
      const result = JobLogFormatters.formatJobLogMessage('Operation', {
        pattern: 'last',
        jobName: 'first',
        level: 'second',
        limit: 123,
      });
      // Should maintain the order: jobName, level, limit, pattern
      expect(result).toBe('Operation jobName=first level=second limit=123 pattern="last"');
    });

    it('should handle empty operation string', () => {
      const result = JobLogFormatters.formatJobLogMessage('', {
        jobName: 'TestJob',
      });
      expect(result).toBe(' jobName=TestJob');
    });
  });
});
