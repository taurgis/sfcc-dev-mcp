import { Logger } from '../src/utils/logger';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Logger', () => {
  let logger: Logger;
  let testLogDir: string;

  beforeEach(() => {
    // Create a unique test log directory for each test
    testLogDir = join(tmpdir(), `sfcc-mcp-logs-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Clean up if directory somehow exists
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test log directory
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    it('should create logger and create log directory', () => {
      logger = new Logger('TEST', true, false, testLogDir);

      expect(existsSync(testLogDir)).toBe(true);
      expect(logger.getLogDirectory()).toBe(testLogDir);
    });

    it('should create logger with custom context and write logs correctly', () => {
      logger = new Logger('CUSTOM-CONTEXT', true, false, testLogDir);

      logger.log('test message');

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[CUSTOM-CONTEXT\] test message\n$/);
    });

    it('should create logger with timestamp disabled', () => {
      logger = new Logger('TEST', false, false, testLogDir);

      logger.log('test message');

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toBe('[TEST] test message\n');
    });

    it('should create logger with debug enabled', () => {
      logger = new Logger('TEST', true, true, testLogDir);

      logger.debug('debug message');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(
        /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] \[DEBUG\] debug message\n$/,
      );
    });
  });

  describe('logging methods', () => {
    beforeEach(() => {
      logger = new Logger('TEST', true, false, testLogDir);
    });

    it('should write info messages to info log file', () => {
      logger.info('info message');

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] info message\n$/);
    });

    it('should write log messages to info log file', () => {
      logger.log('log message');

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] log message\n$/);
    });

    it('should write warning messages to warn log file', () => {
      logger.warn('warning message');

      const logFile = join(testLogDir, 'sfcc-mcp-warn.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] warning message\n$/);
    });

    it('should write error messages to error log file', () => {
      logger.error('error message');

      const logFile = join(testLogDir, 'sfcc-mcp-error.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] error message\n$/);
    });

    it('should write debug messages to debug log file when debug is enabled', () => {
      logger = new Logger('TEST', true, true, testLogDir);
      logger.debug('debug message');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(
        /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[TEST\] \[DEBUG\] debug message\n$/,
      );
    });

    it('should not write debug messages when debug is disabled', () => {
      logger = new Logger('TEST', true, false, testLogDir);
      logger.debug('debug message');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(false);
    });

    it('should handle additional arguments', () => {
      const testObject = { key: 'value', number: 42 };
      logger.info('message with args', 'string arg', testObject);

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('message with args');
      expect(logContent).toContain('string arg');
      expect(logContent).toContain('"key": "value"');
      expect(logContent).toContain('"number": 42');
    });
  });

  describe('debug logging methods', () => {
    beforeEach(() => {
      logger = new Logger('TEST', true, true, testLogDir);
    });

    it('should log method entry', () => {
      logger.methodEntry('testMethod', { param1: 'value1' });

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[DEBUG] Entering method: testMethod with params:');
      expect(logContent).toContain('"param1":"value1"');
    });

    it('should log method entry without params', () => {
      logger.methodEntry('testMethod');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[DEBUG] Entering method: testMethod');
      expect(logContent).not.toContain('with params:');
    });

    it('should log method exit', () => {
      logger.methodExit('testMethod', { result: 'success' });

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[DEBUG] Exiting method: testMethod with result:');
      expect(logContent).toContain('"result":"success"');
    });

    it('should log method exit without result', () => {
      logger.methodExit('testMethod');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[DEBUG] Exiting method: testMethod');
      expect(logContent).not.toContain('with result:');
    });

    it('should log timing information', () => {
      const startTime = Date.now() - 100; // Simulate 100ms operation
      logger.timing('testOperation', startTime);

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toMatch(/\[DEBUG\] Performance: testOperation took \d+ms/);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      logger = new Logger('TEST', true, false, testLogDir);
    });

    it('should create child logger with combined context', () => {
      const childLogger = logger.createChildLogger('CHILD');
      childLogger.info('child message');

      const logFile = join(testLogDir, 'sfcc-mcp-info.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[TEST:CHILD] child message');
    });

    it('should enable debug logging dynamically', () => {
      logger.setDebugEnabled(true);
      logger.debug('now debug is enabled');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain('[DEBUG] now debug is enabled');
    });

    it('should disable debug logging dynamically', () => {
      logger = new Logger('TEST', true, true, testLogDir);
      logger.setDebugEnabled(false);
      logger.debug('this should not appear');

      const logFile = join(testLogDir, 'sfcc-mcp-debug.log');
      expect(existsSync(logFile)).toBe(false);
    });

    it('should return log directory path', () => {
      const logDirectory = logger.getLogDirectory();
      expect(logDirectory).toBe(testLogDir);
      expect(existsSync(logDirectory)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle file write errors gracefully', () => {
      // Mock appendFileSync to throw an error
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fsMock = jest.spyOn(require('fs'), 'appendFileSync');
      fsMock.mockImplementation(() => {
        throw new Error('File write error');
      });

      // Mock stderr.write to capture fallback behavior
      const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);

      logger = new Logger('TEST', true, false, testLogDir);
      logger.error('test error message');

      // Should have attempted to write to stderr as fallback
      expect(stderrSpy).toHaveBeenCalledWith('[LOGGER ERROR] Could not write to log file: Error: File write error\n');
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('test error message'));

      stderrSpy.mockRestore();
      fsMock.mockRestore();
    });

    it('should not fallback to stderr for non-error log levels', () => {
      // Mock appendFileSync to throw an error
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fsMock = jest.spyOn(require('fs'), 'appendFileSync');
      fsMock.mockImplementation(() => {
        throw new Error('File write error');
      });

      // Mock stderr.write to capture fallback behavior
      const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);

      logger = new Logger('TEST', true, false, testLogDir);
      logger.info('test info message');

      // Should not have written to stderr for non-error levels
      expect(stderrSpy).not.toHaveBeenCalled();

      stderrSpy.mockRestore();
      fsMock.mockRestore();
    });
  });
});
