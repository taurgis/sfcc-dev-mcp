import { LogToolHandler } from '../src/core/handlers/log-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { SFCCLogClient } from '../src/clients/log-client.js';
import { Logger } from '../src/utils/logger.js';

// Mock the SFCCLogClient
jest.mock('../src/clients/log-client.js');

describe('LogToolHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockLogClient: jest.Mocked<SFCCLogClient>;
  let context: HandlerContext;
  let handler: LogToolHandler;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
    } as any;

    mockLogClient = {
      getLatestLogs: jest.fn(),
      summarizeLogs: jest.fn(),
      searchLogs: jest.fn(),
      listLogFiles: jest.fn(),
      getLogFileContents: jest.fn(),
    } as any;

    (SFCCLogClient as jest.MockedClass<typeof SFCCLogClient>).mockImplementation(() => mockLogClient);

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: {
        hostname: 'test.demandware.net',
        username: 'test',
        password: 'test',
        clientId: 'test',
        clientSecret: 'test',
      },
      capabilities: { canAccessLogs: true, canAccessOCAPI: true },
    };

    handler = new LogToolHandler(context, 'Log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('canHandle', () => {
    it('should handle log-related tools', () => {
      expect(handler.canHandle('get_latest_error')).toBe(true);
      expect(handler.canHandle('get_latest_warn')).toBe(true);
      expect(handler.canHandle('get_latest_info')).toBe(true);
      expect(handler.canHandle('get_latest_debug')).toBe(true);
      expect(handler.canHandle('summarize_logs')).toBe(true);
      expect(handler.canHandle('search_logs')).toBe(true);
      expect(handler.canHandle('list_log_files')).toBe(true);
      expect(handler.canHandle('get_log_file_contents')).toBe(true);
    });

    it('should not handle non-log tools', () => {
      expect(handler.canHandle('get_sfcc_class_info')).toBe(false);
      expect(handler.canHandle('unknown_tool')).toBe(false);
    });
  });

  // Helper function to initialize handler for tests that need it
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('initialization', () => {
    it('should initialize log client when capabilities allow', async () => {
      // Manually trigger initialization
      await (handler as any).initialize();

      expect(SFCCLogClient).toHaveBeenCalledWith(context.config);
      expect(mockLogger.debug).toHaveBeenCalledWith('Log client initialized');
    });

    it('should not initialize log client when capabilities do not allow', async () => {
      const contextWithoutLogs = {
        ...context,
        capabilities: { canAccessLogs: false, canAccessOCAPI: false },
      };
      const handlerWithoutLogs = new LogToolHandler(contextWithoutLogs, 'Log');

      // Manually trigger initialization to test the capabilities check
      await (handlerWithoutLogs as any).initialize();

      // Reset the mock counter for this test
      (SFCCLogClient as jest.MockedClass<typeof SFCCLogClient>).mockClear();

      const result = await handlerWithoutLogs.handle('get_latest_error', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Log client not configured - ensure log access is enabled.');

      expect(SFCCLogClient).not.toHaveBeenCalled();
    });

    it('should not initialize without config', async () => {
      const contextWithoutConfig = {
        ...context,
        config: null as any,
      };
      const handlerWithoutConfig = new LogToolHandler(contextWithoutConfig, 'Log');

      const result = await handlerWithoutConfig.handle('get_latest_error', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Log client not configured - ensure log access is enabled.');
    });
  });

  describe('disposal', () => {
    it('should dispose log client properly', async () => {
      // Initialize first
      await initializeHandler();

      // Dispose
      await (handler as any).dispose();

      expect(mockLogger.debug).toHaveBeenCalledWith('Log client disposed');
    });
  });

  describe('get_latest_* tools', () => {
    beforeEach(async () => {
      await initializeHandler();
      mockLogClient.getLatestLogs.mockResolvedValue('Test log entry\n2023-01-01T00:00:00Z');
    });

    it('should handle get_latest_error', async () => {
      const result = await handler.handle('get_latest_error', { limit: 5, date: '20230101' }, Date.now());

      expect(mockLogClient.getLatestLogs).toHaveBeenCalledWith('error', 5, '20230101');
      expect(result.content[0].text).toContain('Test log entry');
      expect(mockLogger.debug).toHaveBeenCalledWith('Fetching latest error logs limit=5 date=20230101');
    });

    it('should handle get_latest_warn with default parameters', async () => {
      await handler.handle('get_latest_warn', {}, Date.now());

      expect(mockLogClient.getLatestLogs).toHaveBeenCalledWith('warn', 10, undefined);
      expect(mockLogger.debug).toHaveBeenCalledWith('Fetching latest warn logs limit=10 date=today');
    });

    it('should handle get_latest_info', async () => {
      await handler.handle('get_latest_info', { limit: 15 }, Date.now());

      expect(mockLogClient.getLatestLogs).toHaveBeenCalledWith('info', 15, undefined);
    });

    it('should handle get_latest_debug', async () => {
      await handler.handle('get_latest_debug', { date: '20230101' }, Date.now());

      expect(mockLogClient.getLatestLogs).toHaveBeenCalledWith('debug', 10, '20230101');
    });
  });

  describe('summarize_logs tool', () => {
    beforeEach(async () => {
      await initializeHandler();
    });
    it('should handle summarize_logs', async () => {
      const mockSummary = JSON.stringify({
        date: '20230101',
        totalLogs: 100,
        errorCount: 5,
        warnCount: 10,
        infoCount: 85,
      });
      mockLogClient.summarizeLogs.mockResolvedValue(mockSummary);

      await handler.handle('summarize_logs', { date: '20230101' }, Date.now());

      expect(mockLogClient.summarizeLogs).toHaveBeenCalledWith('20230101');
      expect(mockLogger.debug).toHaveBeenCalledWith('Summarizing logs for date date=20230101');
    });

    it('should handle summarize_logs with default date', async () => {
      const mockSummary = JSON.stringify({ date: 'today', totalLogs: 50 });
      mockLogClient.summarizeLogs.mockResolvedValue(mockSummary);

      await handler.handle('summarize_logs', {}, Date.now());

      expect(mockLogClient.summarizeLogs).toHaveBeenCalledWith(undefined);
      expect(mockLogger.debug).toHaveBeenCalledWith('Summarizing logs for date date=today');
    });
  });

  describe('search_logs tool', () => {
    beforeEach(async () => {
      await initializeHandler();
    });
    it('should handle search_logs with required pattern', async () => {
      const mockResults = JSON.stringify({
        results: [{ message: 'Error occurred', timestamp: '2023-01-01T00:00:00Z' }],
        total: 1,
      });
      mockLogClient.searchLogs.mockResolvedValue(mockResults);

      const args = { pattern: 'error', logLevel: 'error', limit: 25, date: '20230101' };
      const result = await handler.handle('search_logs', args, Date.now());

      expect(mockLogClient.searchLogs).toHaveBeenCalledWith('error', 'error', 25, '20230101');
      expect(result.content[0].text).toContain('Error occurred');
      expect(mockLogger.debug).toHaveBeenCalledWith('Searching logs level=error limit=25 pattern="error"');
    });

    it('should handle search_logs with default parameters', async () => {
      const mockResults = JSON.stringify({ results: [], total: 0 });
      mockLogClient.searchLogs.mockResolvedValue(mockResults);

      await handler.handle('search_logs', { pattern: 'test' }, Date.now());

      expect(mockLogClient.searchLogs).toHaveBeenCalledWith('test', undefined, 20, undefined);
      expect(mockLogger.debug).toHaveBeenCalledWith('Searching logs level=all limit=20 pattern="test"');
    });

    it('should not enforce required pattern in handler (validated at MCP boundary)', async () => {
      const mockResults = JSON.stringify({ results: [], total: 0 });
      mockLogClient.searchLogs.mockResolvedValue(mockResults);

      const result = await handler.handle('search_logs', {}, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.searchLogs).toHaveBeenCalledWith(undefined, undefined, 20, undefined);
    });

    it('should allow empty pattern in handler (validated at MCP boundary)', async () => {
      const mockResults = JSON.stringify({ results: [], total: 0 });
      mockLogClient.searchLogs.mockResolvedValue(mockResults);

      const result = await handler.handle('search_logs', { pattern: '' }, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.searchLogs).toHaveBeenCalledWith('', undefined, 20, undefined);
    });
  });

  describe('get_log_file_contents tool', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle get_log_file_contents with filename', async () => {
      const mockFileContents = 'Log file contents with some test data\nMore log entries...';
      mockLogClient.getLogFileContents.mockResolvedValue(mockFileContents);

      const result = await handler.handle('get_log_file_contents', { filename: 'error-2023-01-01.log' }, Date.now());

      expect(mockLogClient.getLogFileContents).toHaveBeenCalledWith('error-2023-01-01.log', undefined, undefined);
      expect(result.content[0].text).toContain('Log file contents with some test data');
      expect(mockLogger.debug).toHaveBeenCalledWith('Reading log file contents: filename=error-2023-01-01.log');
    });

    it('should handle get_log_file_contents with maxBytes and tailOnly options', async () => {
      const mockFileContents = 'Tail content of log file...';
      mockLogClient.getLogFileContents.mockResolvedValue(mockFileContents);

      const result = await handler.handle('get_log_file_contents', {
        filename: 'large-log.log',
        maxBytes: 1024,
        tailOnly: true,
      }, Date.now());

      expect(mockLogClient.getLogFileContents).toHaveBeenCalledWith('large-log.log', 1024, true);
      expect(result.content[0].text).toContain('Tail content of log file');
      expect(mockLogger.debug).toHaveBeenCalledWith('Reading log file contents: filename=large-log.log maxBytes=1024 tailOnly=true');
    });

    it('should handle get_log_file_contents with maxBytes and tailOnly=false (full file with size limit)', async () => {
      const mockFileContents = 'Full file content with size limit applied...';
      mockLogClient.getLogFileContents.mockResolvedValue(mockFileContents);

      const result = await handler.handle('get_log_file_contents', {
        filename: 'large-log.log',
        maxBytes: 512,
        tailOnly: false,
      }, Date.now());

      expect(mockLogClient.getLogFileContents).toHaveBeenCalledWith('large-log.log', 512, false);
      expect(result.content[0].text).toContain('Full file content with size limit');
      expect(mockLogger.debug).toHaveBeenCalledWith('Reading log file contents: filename=large-log.log maxBytes=512 tailOnly=false');
    });

    it('should require filename parameter', async () => {
      const result = await handler.handle('get_log_file_contents', {}, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Filename is required for get_log_file_contents');
    });

    it('should handle empty filename', async () => {
      const result = await handler.handle('get_log_file_contents', { filename: '' }, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Filename is required for get_log_file_contents');
    });
  });

  describe('list_log_files tool', () => {
    beforeEach(async () => {
      await initializeHandler();
    });
    it('should handle list_log_files', async () => {
      const mockFiles = JSON.stringify([
        { name: 'error-2023-01-01.log', size: 1024, modified: '2023-01-01T00:00:00Z' },
        { name: 'info-2023-01-01.log', size: 2048, modified: '2023-01-01T00:00:00Z' },
      ]);
      mockLogClient.listLogFiles.mockResolvedValue(mockFiles);

      const result = await handler.handle('list_log_files', {}, Date.now());

      expect(mockLogClient.listLogFiles).toHaveBeenCalled();
      expect(result.content[0].text).toContain('error-2023-01-01.log');
      expect(result.content[0].text).toContain('info-2023-01-01.log');
      expect(mockLogger.debug).toHaveBeenCalledWith('Listing log files');
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      mockLogClient.getLatestLogs.mockRejectedValue(new Error('Client connection failed'));

      const result = await handler.handle('get_latest_error', {}, Date.now());
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Client connection failed');
    });

    it('should throw error for unsupported tools', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool');
    });
  });

  describe('timing and logging', () => {
    beforeEach(async () => {
      await initializeHandler();
    });
    it('should log timing information', async () => {
      mockLogClient.getLatestLogs.mockResolvedValue('empty logs');

      const startTime = Date.now();
      await handler.handle('get_latest_error', {}, startTime);

      expect(mockLogger.timing).toHaveBeenCalledWith('get_latest_error', startTime);
    });

    it('should log execution details', async () => {
      mockLogClient.getLatestLogs.mockResolvedValue('test logs');

      await handler.handle('get_latest_error', { limit: 5 }, Date.now());

      expect(mockLogger.debug).toHaveBeenCalledWith('Fetching latest error logs limit=5 date=today');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'get_latest_error completed',
        expect.any(Object),
      );
    });
  });
});
