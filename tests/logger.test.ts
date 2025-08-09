import { Logger } from '../src/logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: {
    log: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default values', () => {
      logger = new Logger();

      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[SFCC-MCP\] test message$/),
      );
    });

    it('should create logger with custom context', () => {
      logger = new Logger('CUSTOM-CONTEXT');

      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[CUSTOM-CONTEXT\] test message$/),
      );
    });

    it('should create logger with timestamp disabled', () => {
      logger = new Logger('TEST', false);

      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith('[TEST] test message');
    });

    it('should create logger with debug enabled', () => {
      logger = new Logger('TEST', true, true);

      logger.debug('debug message');

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] \[DEBUG\] debug message$/),
      );
    });

    it('should create logger with all custom options', () => {
      logger = new Logger('CUSTOM', false, true);

      logger.debug('debug message');

      expect(consoleSpy.error).toHaveBeenCalledWith('[CUSTOM] [DEBUG] debug message');
    });
  });

  describe('formatMessage', () => {
    it('should format message with timestamp and context', () => {
      logger = new Logger('TEST-CONTEXT', true);

      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST-CONTEXT\] test message$/),
      );
    });

    it('should format message without timestamp when disabled', () => {
      logger = new Logger('NO-TIMESTAMP', false);

      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith('[NO-TIMESTAMP] test message');
    });

    it('should handle empty messages', () => {
      logger = new Logger('TEST', false);

      logger.log('');

      expect(consoleSpy.log).toHaveBeenCalledWith('[TEST] ');
    });

    it('should handle messages with special characters', () => {
      logger = new Logger('TEST', false);

      logger.log('Message with "quotes" and symbols: !@#$%^&*()');

      expect(consoleSpy.log).toHaveBeenCalledWith('[TEST] Message with "quotes" and symbols: !@#$%^&*()');
    });
  });

  describe('log method', () => {
    beforeEach(() => {
      logger = new Logger('LOG-TEST', false);
    });

    it('should log a simple message', () => {
      logger.log('Simple log message');

      expect(consoleSpy.log).toHaveBeenCalledWith('[LOG-TEST] Simple log message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should log message with additional arguments', () => {
      const obj = { key: 'value' };
      const arr = [1, 2, 3];

      logger.log('Message with args', obj, arr, 42, 'string');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[LOG-TEST] Message with args',
        obj,
        arr,
        42,
        'string'
      );
    });

    it('should handle undefined and null arguments', () => {
      logger.log('Message with null/undefined', null, undefined);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[LOG-TEST] Message with null/undefined',
        null,
        undefined
      );
    });
  });

  describe('info method', () => {
    beforeEach(() => {
      logger = new Logger('INFO-TEST', false);
    });

    it('should log info message', () => {
      logger.info('Info message');

      expect(consoleSpy.info).toHaveBeenCalledWith('[INFO-TEST] Info message');
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    });

    it('should log info message with arguments', () => {
      logger.info('Info with data', { data: 'value' });

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO-TEST] Info with data',
        { data: 'value' }
      );
    });
  });

  describe('warn method', () => {
    beforeEach(() => {
      logger = new Logger('WARN-TEST', false);
    });

    it('should log warning message', () => {
      logger.warn('Warning message');

      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN-TEST] Warning message');
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    });

    it('should log warning with arguments', () => {
      logger.warn('Warning with details', { error: 'details' });

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[WARN-TEST] Warning with details',
        { error: 'details' }
      );
    });
  });

  describe('error method', () => {
    beforeEach(() => {
      logger = new Logger('ERROR-TEST', false);
    });

    it('should log error message', () => {
      logger.error('Error message');

      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR-TEST] Error message');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should log error with Error object', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR-TEST] Error occurred',
        error
      );
    });

    it('should log error with stack trace', () => {
      const error = new Error('Test error with stack');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      logger.error('Stack trace error', error);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR-TEST] Stack trace error',
        error
      );
    });
  });

  describe('debug method', () => {
    it('should log debug message when debug is enabled', () => {
      logger = new Logger('DEBUG-TEST', false, true);

      logger.debug('Debug message');

      expect(consoleSpy.error).toHaveBeenCalledWith('[DEBUG-TEST] [DEBUG] Debug message');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should not log debug message when debug is disabled', () => {
      logger = new Logger('DEBUG-TEST', false, false);

      logger.debug('Debug message');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should log debug message with arguments when enabled', () => {
      logger = new Logger('DEBUG-TEST', false, true);

      logger.debug('Debug with data', { debug: 'info' });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[DEBUG-TEST] [DEBUG] Debug with data',
        { debug: 'info' }
      );
    });

    it('should not log debug message with arguments when disabled', () => {
      logger = new Logger('DEBUG-TEST', false, false);

      logger.debug('Debug with data', { debug: 'info' });

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('methodEntry method', () => {
    it('should log method entry when debug is enabled', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodEntry('testMethod');

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Entering method: testMethod'
      );
    });

    it('should not log method entry when debug is disabled', () => {
      logger = new Logger('METHOD-TEST', false, false);

      logger.methodEntry('testMethod');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should log method entry with parameters', () => {
      logger = new Logger('METHOD-TEST', false, true);
      const params = { id: 123, name: 'test' };

      logger.methodEntry('testMethod', params);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Entering method: testMethod with params: {"id":123,"name":"test"}'
      );
    });

    it('should handle null parameters', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodEntry('testMethod', null);

      // null is falsy, so no params string is shown
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Entering method: testMethod'
      );
    });

    it('should handle undefined parameters', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodEntry('testMethod', undefined);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Entering method: testMethod'
      );
    });

    it('should handle complex object parameters', () => {
      logger = new Logger('METHOD-TEST', false, true);
      const complexParams = {
        user: { id: 1, name: 'John' },
        options: { sort: 'asc', limit: 10 },
        filters: ['active', 'verified']
      };

      logger.methodEntry('complexMethod', complexParams);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Entering method: complexMethod with params: {"user":{"id":1,"name":"John"},"options":{"sort":"asc","limit":10},"filters":["active","verified"]}'
      );
    });
  });

  describe('methodExit method', () => {
    it('should log method exit when debug is enabled', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod');

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod'
      );
    });

    it('should not log method exit when debug is disabled', () => {
      logger = new Logger('METHOD-TEST', false, false);

      logger.methodExit('testMethod');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should log method exit with string result', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod', 'success');

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod with result: success'
      );
    });

    it('should log method exit with number result', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod', 42);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod with result: 42'
      );
    });

    it('should log method exit with boolean result', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod', true);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod with result: true'
      );
    });

    it('should log method exit with object result', () => {
      logger = new Logger('METHOD-TEST', false, true);
      const result = { success: true, data: { id: 1 } };

      logger.methodExit('testMethod', result);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod with result: {"success":true,"data":{"id":1}}'
      );
    });

    it('should handle null result', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod', null);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod with result: null'
      );
    });

    it('should handle undefined result differently than no result', () => {
      logger = new Logger('METHOD-TEST', false, true);

      logger.methodExit('testMethod', undefined);

      // undefined is explicitly checked with !== undefined, so no result string is shown
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[METHOD-TEST] [DEBUG] Exiting method: testMethod'
      );
    });
  });

  describe('timestamp behavior', () => {
    it('should include valid ISO timestamp when enabled', () => {
      logger = new Logger('TIMESTAMP-TEST', true);

      logger.log('test');

      const call = consoleSpy.log.mock.calls[0][0] as string;
      const timestampMatch = call.match(/^\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);

      expect(timestampMatch).not.toBeNull();

      if (timestampMatch) {
        const timestamp = new Date(timestampMatch[1]);
        expect(timestamp).toBeInstanceOf(Date);
        expect(timestamp.getTime()).not.toBeNaN();
      }
    });

    it('should have consistent timestamp format across different log levels', () => {
      logger = new Logger('TIMESTAMP-TEST', true, true);

      logger.log('log message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');
      logger.debug('debug message');

      const logCall = consoleSpy.log.mock.calls[0][0] as string;
      const infoCall = consoleSpy.info.mock.calls[0][0] as string;
      const warnCall = consoleSpy.warn.mock.calls[0][0] as string;
      const errorCall = consoleSpy.error.mock.calls[0][0] as string;
      const debugCall = consoleSpy.error.mock.calls[1][0] as string;

      const timestampRegex = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/;

      expect(logCall).toMatch(timestampRegex);
      expect(infoCall).toMatch(timestampRegex);
      expect(warnCall).toMatch(timestampRegex);
      expect(errorCall).toMatch(timestampRegex);
      expect(debugCall).toMatch(timestampRegex);
    });
  });

  describe('integration scenarios', () => {
    it('should handle method tracing workflow', () => {
      logger = new Logger('TRACE-TEST', false, true);
      const methodName = 'calculateTotal';
      const params = { items: [1, 2, 3], tax: 0.1 };
      const result = { total: 6.6, tax: 0.6 };

      logger.methodEntry(methodName, params);
      logger.debug('Processing items');
      logger.methodExit(methodName, result);

      expect(consoleSpy.error).toHaveBeenCalledTimes(3);
      expect(consoleSpy.error).toHaveBeenNthCalledWith(1,
        '[TRACE-TEST] [DEBUG] Entering method: calculateTotal with params: {"items":[1,2,3],"tax":0.1}'
      );
      expect(consoleSpy.error).toHaveBeenNthCalledWith(2,
        '[TRACE-TEST] [DEBUG] Processing items'
      );
      expect(consoleSpy.error).toHaveBeenNthCalledWith(3,
        '[TRACE-TEST] [DEBUG] Exiting method: calculateTotal with result: {"total":6.6,"tax":0.6}'
      );
    });

    it('should handle error logging with context', () => {
      logger = new Logger('ERROR-CONTEXT', true);
      const error = new Error('Database connection failed');

      logger.error('Failed to save user data', error, { userId: 123, operation: 'save' });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR-CONTEXT\] Failed to save user data$/),
        error,
        { userId: 123, operation: 'save' }
      );
    });

    it('should work correctly when switching debug mode', () => {
      // Start with debug disabled
      logger = new Logger('SWITCH-TEST', false, false);

      logger.debug('This should not appear');
      expect(consoleSpy.error).not.toHaveBeenCalled();

      // Create new logger with debug enabled (simulating runtime configuration change)
      logger = new Logger('SWITCH-TEST', false, true);

      logger.debug('This should appear');
      expect(consoleSpy.error).toHaveBeenCalledWith('[SWITCH-TEST] [DEBUG] This should appear');
    });
  });
});
