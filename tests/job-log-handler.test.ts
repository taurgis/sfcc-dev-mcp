import { JobLogToolHandler } from '../src/core/handlers/job-log-handler.js';
import { HandlerContext } from '../src/core/handlers/base-handler.js';
import { SFCCLogClient } from '../src/clients/log-client.js';
import { Logger } from '../src/utils/logger.js';

// Mock dependencies
jest.mock('../src/clients/log-client.js');
jest.mock('../src/utils/logger.js');

describe('JobLogToolHandler', () => {
  let mockContext: HandlerContext;
  let handler: JobLogToolHandler;
  let mockLogger: jest.Mocked<Logger>;
  let mockLogClient: jest.Mocked<SFCCLogClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
    } as any;

    mockLogClient = {
      getLatestJobLogFiles: jest.fn(),
      searchJobLogsByName: jest.fn(),
      getJobLogEntries: jest.fn(),
      searchJobLogs: jest.fn(),
      getJobExecutionSummary: jest.fn(),
    } as any;

    // Mock the SFCCLogClient constructor
    (SFCCLogClient as jest.MockedClass<typeof SFCCLogClient>).mockImplementation(() => mockLogClient);

    // Mock Logger.getChildLogger
    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    mockContext = {
      logger: mockLogger,
      config: {
        hostname: 'test.demandware.net',
        username: 'test',
        password: 'test',
        clientId: 'test',
        clientSecret: 'test',
      },
      capabilities: {
        canAccessLogs: true,
        canAccessOCAPI: true,
      },
    };

    handler = new JobLogToolHandler(mockContext, 'job-log-handler');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to initialize handler
  const initializeHandler = async () => {
    await (handler as any).initialize();
  };

  describe('canHandle', () => {
    it('should handle job log tool names', () => {
      const jobLogTools = [
        'get_latest_job_log_files',
        'search_job_logs_by_name',
        'get_job_log_entries',
        'search_job_logs',
        'get_job_execution_summary',
      ];

      jobLogTools.forEach(toolName => {
        expect(handler.canHandle(toolName)).toBe(true);
      });
    });

    it('should not handle non-job-log tool names', () => {
      const nonJobLogTools = [
        'get_latest_error',
        'search_logs',
        'get_log_file_contents',
        'summarize_logs',
        'list_log_files',
        'unknown_tool',
        '',
      ];

      nonJobLogTools.forEach(toolName => {
        expect(handler.canHandle(toolName)).toBe(false);
      });
    });

    it('should handle case-sensitive tool names only', () => {
      expect(handler.canHandle('GET_LATEST_JOB_LOG_FILES')).toBe(false);
      expect(handler.canHandle('get_Latest_Job_Log_Files')).toBe(false);
      expect(handler.canHandle('get_latest_job_log_files')).toBe(true);
    });
  });

  describe('handle method - get_latest_job_log_files', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle get_latest_job_log_files with default limit', async () => {
      const mockResult = 'Latest job log files result';
      mockLogClient.getLatestJobLogFiles.mockResolvedValue(mockResult);

      const result = await handler.handle('get_latest_job_log_files', {}, Date.now());

      expect(mockLogClient.getLatestJobLogFiles).toHaveBeenCalledWith(10); // default limit
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should handle get_latest_job_log_files with custom limit', async () => {
      const mockResult = 'Latest job log files result';
      mockLogClient.getLatestJobLogFiles.mockResolvedValue(mockResult);

      const result = await handler.handle('get_latest_job_log_files', { limit: 25 }, Date.now());

      expect(mockLogClient.getLatestJobLogFiles).toHaveBeenCalledWith(25);
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should not validate limit in handler (validated at MCP boundary)', async () => {
      mockLogClient.getLatestJobLogFiles.mockResolvedValue('Latest job log files result');
      const result = await handler.handle('get_latest_job_log_files', { limit: -1 }, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.getLatestJobLogFiles).toHaveBeenCalledWith(-1);
    });
  });

  describe('handle method - search_job_logs_by_name', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle search_job_logs_by_name with required jobName', async () => {
      const mockResult = 'Search job logs by name result';
      mockLogClient.searchJobLogsByName.mockResolvedValue(mockResult);

      const result = await handler.handle('search_job_logs_by_name', {
        jobName: 'TestJob',
        limit: 15,
      }, Date.now());

      expect(mockLogClient.searchJobLogsByName).toHaveBeenCalledWith('TestJob', 15);
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should not validate missing jobName in handler (validated at MCP boundary)', async () => {
      mockLogClient.searchJobLogsByName.mockResolvedValue('Search job logs by name result');
      const result = await handler.handle('search_job_logs_by_name', {}, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.searchJobLogsByName).toHaveBeenCalledWith(undefined, 10);
    });
  });

  describe('handle method - get_job_log_entries', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle get_job_log_entries with default parameters', async () => {
      const mockResult = 'Job log entries result';
      mockLogClient.getJobLogEntries.mockResolvedValue(mockResult);

      const result = await handler.handle('get_job_log_entries', {}, Date.now());

      expect(mockLogClient.getJobLogEntries).toHaveBeenCalledWith('all', 10, undefined); // default limit is 10 for job entries
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should not validate log level in handler (validated at MCP boundary)', async () => {
      mockLogClient.getJobLogEntries.mockResolvedValue('Job log entries result');
      const result = await handler.handle('get_job_log_entries', { level: 'invalid' }, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.getJobLogEntries).toHaveBeenCalledWith('invalid', 10, undefined);
    });
  });

  describe('handle method - search_job_logs', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle search_job_logs with required pattern', async () => {
      const mockResult = 'Search job logs result';
      mockLogClient.searchJobLogs.mockResolvedValue(mockResult);

      const result = await handler.handle('search_job_logs', {
        pattern: 'error-pattern',
      }, Date.now());

      expect(mockLogClient.searchJobLogs).toHaveBeenCalledWith('error-pattern', 'all', 20, undefined);
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should not validate missing pattern in handler (validated at MCP boundary)', async () => {
      mockLogClient.searchJobLogs.mockResolvedValue('Search job logs result');
      const result = await handler.handle('search_job_logs', {}, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.searchJobLogs).toHaveBeenCalledWith(undefined, 'all', 20, undefined);
    });
  });

  describe('handle method - get_job_execution_summary', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle get_job_execution_summary with required jobName', async () => {
      const mockResult = 'Job execution summary result';
      mockLogClient.getJobExecutionSummary.mockResolvedValue(mockResult);

      const result = await handler.handle('get_job_execution_summary', {
        jobName: 'SummaryJob',
      }, Date.now());

      expect(mockLogClient.getJobExecutionSummary).toHaveBeenCalledWith('SummaryJob');
      expect(result.content[0].text).toContain(mockResult);
    });

    it('should not validate missing jobName in handler (validated at MCP boundary)', async () => {
      mockLogClient.getJobExecutionSummary.mockResolvedValue('Job execution summary result');
      const result = await handler.handle('get_job_execution_summary', {}, Date.now());

      expect(result.isError).toBe(false);
      expect(mockLogClient.getJobExecutionSummary).toHaveBeenCalledWith(undefined);
    });
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await initializeHandler();
    });

    it('should handle client errors gracefully', async () => {
      const clientError = new Error('Client connection failed');
      mockLogClient.getLatestJobLogFiles.mockRejectedValue(clientError);

      const result = await handler.handle('get_latest_job_log_files', {}, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Client connection failed');
    });

    it('should handle unsupported tool names', async () => {
      await expect(handler.handle('unsupported_tool', {}, Date.now()))
        .rejects.toThrow('Unsupported tool: unsupported_tool');
    });
  });

  describe('initialization', () => {
    it('should initialize log client when capabilities allow', async () => {
      await initializeHandler();

      expect(SFCCLogClient).toHaveBeenCalledWith(mockContext.config);
      expect(mockLogger.debug).toHaveBeenCalledWith('Log client initialized');
    });

    it('should handle missing capabilities gracefully', async () => {
      const contextWithoutLogs = {
        ...mockContext,
        capabilities: { canAccessLogs: false, canAccessOCAPI: false },
      };
      const handlerWithoutLogs = new JobLogToolHandler(contextWithoutLogs, 'job-log');

      const result = await handlerWithoutLogs.handle('get_latest_job_log_files', {}, Date.now());

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Log client not configured');
    });
  });
});
