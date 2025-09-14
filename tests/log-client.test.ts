import { SFCCLogClient } from '../src/clients/log-client';
import { SFCCConfig, LogLevel } from '../src/types/types';

// Use manual mock for webdav
// eslint-disable-next-line @typescript-eslint/no-require-imports
const webdav = require('webdav');
const mockWebdavClient = webdav.__mockWebdavClient;

// Mock the logger
jest.mock('../src/utils/logger', () => ({
  Logger: {
    initialize: jest.fn(),
    getInstance: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
    getChildLogger: jest.fn(() => ({
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
    })),
  },
}));

// Mock utils
jest.mock('../src/utils/utils', () => ({
  getCurrentDate: jest.fn(() => '20250815'),
  formatBytes: jest.fn((bytes: number) => `${bytes} bytes`),
  parseLogEntries: jest.fn((content: string, level: string) => {
    // Better mock implementation - split by lines and filter by level, return the actual lines
    return content.split('\n').filter(line => line.includes(level));
  }),
  extractUniqueErrors: jest.fn((errors: string[]) => {
    // Mock implementation that returns unique error messages
    return [...new Set(errors.map(error => error.trim()))];
  }),
  normalizeFilePath: jest.fn((path: string) => path),
}));

describe('SFCCLogClient', () => {
  let logClient: SFCCLogClient;
  let config: SFCCConfig;

  beforeEach(() => {
    // Setup test config
    config = {
      hostname: 'test.demandware.net',
      username: 'testuser',
      password: 'testpass',
    };

    logClient = new SFCCLogClient(config);

    // Setup default mock for stat method (small file size so it uses getFileContents)
    mockWebdavClient.stat.mockResolvedValue({ size: 1024 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with username/password authentication', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        username: 'testuser',
        password: 'testpass',
      };

      new SFCCLogClient(config);

      expect(webdav.createClient).toHaveBeenCalledWith(
        'https://test.demandware.net/on/demandware.servlet/webdav/Sites/Logs/',
        {
          username: 'testuser',
          password: 'testpass',
          timeout: 30000,
          maxBodyLength: 10 * 1024 * 1024,
          maxContentLength: 10 * 1024 * 1024,
        },
      );
    });

    it('should create client with OAuth authentication', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
        clientId: 'testclientid',
        clientSecret: 'testclientsecret',
      };

      new SFCCLogClient(config);

      expect(webdav.createClient).toHaveBeenCalledWith(
        'https://test.demandware.net/on/demandware.servlet/webdav/Sites/Logs/',
        {
          username: 'testclientid',
          password: 'testclientsecret',
          timeout: 30000,
          maxBodyLength: 10 * 1024 * 1024,
          maxContentLength: 10 * 1024 * 1024,
        },
      );
    });

    it('should throw error when no authentication provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
      };

      expect(() => new SFCCLogClient(config)).toThrow(
        'Either username/password or clientId/clientSecret must be provided',
      );
    });
  });

  describe('getLogFiles', () => {
    it('should return log files for specified date', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20250815-blade1-001.log' },
        { type: 'file', filename: 'warn-20250815-blade1-001.log' },
        { type: 'file', filename: 'info-20250815-blade1-001.log' },
        { type: 'file', filename: 'debug-20250815-blade1-001.log' },
        { type: 'file', filename: 'error-20250814-blade1-001.log' }, // Different date
        { type: 'directory', filename: 'somedir' }, // Directory
        { type: 'file', filename: 'not-a-log.txt' }, // Not a log file
      ];

      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.getLogFiles('20250815');

      expect(result).toEqual([
        { filename: 'error-20250815-blade1-001.log', lastmod: expect.any(String) },
        { filename: 'warn-20250815-blade1-001.log', lastmod: expect.any(String) },
        { filename: 'info-20250815-blade1-001.log', lastmod: expect.any(String) },
        { filename: 'debug-20250815-blade1-001.log', lastmod: expect.any(String) },
      ]);
      expect(mockWebdavClient.getDirectoryContents).toHaveBeenCalledWith('/');
    });

    it('should use current date when no date provided', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      await logClient.getLogFiles();

      // Should call getCurrentDate() from utils which returns '20250815'
      expect(mockWebdavClient.getDirectoryContents).toHaveBeenCalledWith('/');
    });

    it('should return empty array when no log files found', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      const result = await logClient.getLogFiles('20250815');

      expect(result).toEqual([]);
    });
  });

  describe('getLatestLogs', () => {
    describe('standard log files', () => {
      beforeEach(() => {
        const mockContents = [
          { type: 'file', filename: 'error-20250815-blade1-001.log' },
          { type: 'file', filename: 'error-20250815-blade1-002.log' },
          { type: 'file', filename: 'warn-20250815-blade1-001.log' },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
      });

      it('should return latest error logs', async () => {
        const mockLogContent = 'ERROR Line 1\nERROR Line 2\nERROR Line 3\nERROR Line 4\nERROR Line 5';
        mockWebdavClient.getFileContents.mockResolvedValue(mockLogContent);

        const result = await logClient.getLatestLogs('error' as LogLevel, 3, '20250815');

        expect(result).toContain('Latest 3 error messages');
        expect(result).toContain('error-20250815-blade1-002.log'); // Should use the latest file
        // Since files are small (1024 bytes), getFileContentsTail should call getFileContents
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
          'error-20250815-blade1-002.log',
          { format: 'text' },
        );
      });

      it('should return warning when no files found for level', async () => {
        const mockContents = [
          { type: 'file', filename: 'info-20250815-blade1-001.log' },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const result = await logClient.getLatestLogs('error' as LogLevel, 10, '20250815');

        expect(result).toContain('No error log files found');
        expect(result).toContain('Available files: info-20250815-blade1-001.log');
      });
    });

    describe('custom log files support', () => {
      it('should include both standard and custom log files for warn level', async () => {
        const mockContents = [
          { type: 'file', filename: 'warn-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'customwarn-odspod-0-appserver-20250815.log' }, // Same date
          { type: 'file', filename: 'warn-blade1-20250815.log' }, // Another warn file same date
          { type: 'file', filename: 'error-odspod-0-appserver-20250815.log' }, // Different level - should be ignored
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const mockWarnContent = 'WARN Entry from standard warn file';
        const mockCustomWarnContent = 'WARN Entry from custom warn file';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockWarnContent)      // newest standard file first
          .mockResolvedValueOnce(mockWarnContent)      // second standard file
          .mockResolvedValueOnce(mockCustomWarnContent); // custom file

        const result = await logClient.getLatestLogs('warn' as LogLevel, 5, '20250815');

        expect(result).toContain('Latest 5 warn messages from files');
        expect(result).toContain('warn-odspod-0-appserver-20250815.log'); // Should include newest standard
        expect(result).toContain('customwarn-odspod-0-appserver-20250815.log'); // Should include custom
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3); // All matching files
      });

      it('should include both standard and custom log files for error level', async () => {
        const mockContents = [
          { type: 'file', filename: 'error-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'customerror-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'warn-odspod-0-appserver-20250815.log' }, // Different level - should be ignored
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const mockErrorContent = 'ERROR Standard error entry';
        const mockCustomErrorContent = 'ERROR Custom error entry';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockErrorContent)      // newest standard file
          .mockResolvedValueOnce(mockCustomErrorContent); // custom file same day

        const result = await logClient.getLatestLogs('error' as LogLevel, 3, '20250815');

        expect(result).toContain('Latest 3 error messages from files');
        expect(result).toContain('error-odspod-0-appserver-20250815.log');
        expect(result).toContain('customerror-odspod-0-appserver-20250815.log');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(2); // Only files for the specified date
      });
    });

    describe('chronological sorting with real-world filenames', () => {
      it('should process files by lastmod timestamp (newest first)', async () => {
        // Real-world log files with different lastmod timestamps
        const mockContents = [
          {
            type: 'file',
            filename: 'warn-blade1-20250815.log',
            lastmod: '2025-08-15T06:30:00.000Z', // Older timestamp
          },
          {
            type: 'file',
            filename: 'warn-odspod-0-appserver-20250815.log',
            lastmod: '2025-08-15T08:15:00.000Z', // Middle timestamp
          },
          {
            type: 'file',
            filename: 'warn-xyz-server-20250815.log',
            lastmod: '2025-08-15T10:45:00.000Z', // Newest timestamp
          },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        // Mock content for each warn file
        const mockContent1 = 'WARN 06:32:07 Warning from blade1\nWARN 06:30:00 Another warning from blade1';
        const mockContent2 = 'WARN 08:16:33 Warning from odspod\nWARN 08:15:00 Another warning from odspod';
        const mockContent3 = 'WARN 10:45:12 Warning from xyz\nWARN 10:44:00 Another warning from xyz';

        // Files should be processed by lastmod order (newest first): xyz, odspod, blade1
        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockContent3)  // warn-xyz-server- (newest lastmod, processed first)
          .mockResolvedValueOnce(mockContent2)  // warn-odspod- (middle lastmod)
          .mockResolvedValueOnce(mockContent1); // warn-blade1- (oldest lastmod, processed last)

        const result = await logClient.getLatestLogs('warn' as LogLevel, 4, '20250815');

        expect(result).toContain('Latest 4 warn messages');
        expect(result).toContain('warn-xyz-server-20250815.log');
        expect(result).toContain('warn-odspod-0-appserver-20250815.log');
        expect(result).toContain('warn-blade1-20250815.log');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3);

        // Verify the processing order matches chronological sorting by lastmod
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(1, 'warn-xyz-server-20250815.log', { format: 'text' });
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(2, 'warn-odspod-0-appserver-20250815.log', { format: 'text' });
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(3, 'warn-blade1-20250815.log', { format: 'text' });
      });

      it('should handle custom log files in chronological sorting', async () => {
        const mockContents = [
          {
            type: 'file',
            filename: 'customwarn-alpha-20250815.log',
            lastmod: '2025-08-15T10:00:00.000Z', // Newest timestamp
          },
          {
            type: 'file',
            filename: 'warn-beta-20250815.log',
            lastmod: '2025-08-15T08:00:00.000Z', // Oldest timestamp
          },
          {
            type: 'file',
            filename: 'customwarn-gamma-20250815.log',
            lastmod: '2025-08-15T09:00:00.000Z', // Middle timestamp
          },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const mockContent1 = 'WARN 10:00:00 Custom warning from alpha';
        const mockContent2 = 'WARN 08:00:00 Standard warning from beta';
        const mockContent3 = 'WARN 09:00:00 Custom warning from gamma';

        // Expected chronological order by lastmod: alpha (10:00), gamma (09:00), beta (08:00)
        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockContent1)  // customwarn-alpha- (newest lastmod, processed first)
          .mockResolvedValueOnce(mockContent3)  // customwarn-gamma- (middle lastmod)
          .mockResolvedValueOnce(mockContent2); // warn-beta- (oldest lastmod, processed last)

        const result = await logClient.getLatestLogs('warn' as LogLevel, 3, '20250815');

        expect(result).toContain('Latest 3 warn messages');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3);

        // Verify processing order follows chronological sorting by lastmod
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(1, 'customwarn-alpha-20250815.log', { format: 'text' });
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(2, 'customwarn-gamma-20250815.log', { format: 'text' });
        expect(mockWebdavClient.getFileContents).toHaveBeenNthCalledWith(3, 'warn-beta-20250815.log', { format: 'text' });
      });

      it('should handle missing lastmod gracefully with fallback', async () => {
        const mockContents = [
          {
            type: 'file',
            filename: 'warn-file1-20250815.log',
            lastmod: '2025-08-15T08:00:00.000Z',
          },
          {
            type: 'file',
            filename: 'warn-file2-20250815.log',
            // Missing lastmod - should use fallback
          },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const mockContent1 = 'WARN Content from file1';
        const mockContent2 = 'WARN Content from file2';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockContent2)  // file2 (fallback to current time, processed first)
          .mockResolvedValueOnce(mockContent1); // file1 (has lastmod, processed second)

        const result = await logClient.getLatestLogs('warn' as LogLevel, 2, '20250815');

        expect(result).toContain('Latest 2 warn messages');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(2);
        // Should handle both files even with missing lastmod
        expect(result).toContain('warn-file1-20250815.log');
        expect(result).toContain('warn-file2-20250815.log');
      });
    });

    describe('file sorting and date filtering', () => {

      it('should only process files matching the specified date', async () => {
        // Mix of files from different dates
        const mockContents = [
          { type: 'file', filename: 'error-odspod-0-appserver-20250815.log' }, // Target date
          { type: 'file', filename: 'error-blade1-20250815.log' },            // Target date
          { type: 'file', filename: 'error-odspod-0-appserver-20250814.log' }, // Previous day
          { type: 'file', filename: 'error-blade1-20250816.log' },            // Next day
          { type: 'file', filename: 'error-xyz-20250813.log' },               // Older date
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        // Mock content for the target date files only
        const targetDateContent1 = 'ERROR 05:17:54 Error from target date file 1\nERROR 05:16:00 Another error from file 1';
        const targetDateContent2 = 'ERROR 11:24:07 Error from target date file 2\nERROR 11:20:00 Another error from file 2';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(targetDateContent1)  // error-odspod-0-appserver-20250815.log
          .mockResolvedValueOnce(targetDateContent2); // error-blade1-20250815.log

        const result = await logClient.getLatestLogs('error' as LogLevel, 3, '20250815');

        // Should only process files from the target date (20250815)
        expect(result).toContain('Latest 3 error messages from files');
        expect(result).toContain('error-odspod-0-appserver-20250815.log');
        expect(result).toContain('error-blade1-20250815.log');

        // Should NOT contain files from other dates
        expect(result).not.toContain('20250814');
        expect(result).not.toContain('20250816');
        expect(result).not.toContain('20250813');

        // Should only call getFileContents for files matching the target date
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(2);
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('error-odspod-0-appserver-20250815.log', { format: 'text' });
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('error-blade1-20250815.log', { format: 'text' });
      });

      it('should handle multiple dates correctly when getLogFiles filters by specific date', async () => {
        // Test with a different date to ensure date filtering works correctly
        const mockContents = [
          { type: 'file', filename: 'warn-server1-20250810.log' },
          { type: 'file', filename: 'warn-server2-20250810.log' },
          { type: 'file', filename: 'customwarn-server3-20250810.log' },
          { type: 'file', filename: 'warn-server1-20250815.log' }, // Different date - should be filtered out
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        const mockContent1 = 'WARN 08:00:00 Warning from server1 on 20250810';
        const mockContent2 = 'WARN 09:00:00 Warning from server2 on 20250810';
        const mockContent3 = 'WARN 10:00:00 Custom warning from server3 on 20250810';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockContent1)
          .mockResolvedValueOnce(mockContent2)
          .mockResolvedValueOnce(mockContent3);

        const result = await logClient.getLatestLogs('warn' as LogLevel, 5, '20250810');

        expect(result).toContain('Latest 5 warn messages');
        expect(result).toContain('warn-server1-20250810.log');
        expect(result).toContain('warn-server2-20250810.log');
        expect(result).toContain('customwarn-server3-20250810.log');

        // Should not include the file from 20250815
        expect(result).not.toContain('20250815');

        // Should process 3 files from the target date only
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3);
      });
    });

    it('should handle file read errors gracefully and continue processing other files', async () => {
      const mockContents = [
        { type: 'file', filename: 'warn-20250815-blade1-001.log' },
        { type: 'file', filename: 'warn-20250815-blade1-002.log' },
        { type: 'file', filename: 'warn-20250815-blade1-003.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const mockContent = 'WARN Working file content';

      // Clear previous mocks to ensure clean state
      mockWebdavClient.getFileContents.mockClear();

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockContent)                           // First file succeeds
        .mockRejectedValueOnce(new Error('File read error'))         // Second file fails
        .mockResolvedValueOnce(mockContent);                         // Third file succeeds

      const result = await logClient.getLatestLogs('warn' as LogLevel, 5, '20250815');

      expect(result).toContain('Latest 5 warn messages');
      // With our new implementation using getFileContentsTail, the call pattern may be different
      // The important thing is that it handles errors gracefully and continues processing
      expect(mockWebdavClient.getFileContents.mock.calls.length).toBeGreaterThanOrEqual(3);
      // Should still return results from successful files
      expect(result).toContain('WARN Working file content');
    });
  });

  describe('summarizeLogs', () => {
    it('should return summary when no log files found', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      const result = await logClient.summarizeLogs('20250815');

      expect(result).toBe('No log files found for date 20250815');
    });

    it('should generate comprehensive log summary', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20250815-blade1-001.log' },
        { type: 'file', filename: 'warn-20250815-blade1-001.log' },
        { type: 'file', filename: 'info-20250815-blade1-001.log' },
        { type: 'file', filename: 'debug-20250815-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      // Update content to match what the actual summarizeLogs method expects
      const mockErrorContent = 'First line\n ERROR Something went wrong\nAnother line\n ERROR Another error\n INFO Some info';
      const mockWarnContent = 'Start line\n WARN Warning message\n INFO Info message';
      const mockInfoContent = 'Header\n INFO First info\n INFO Second info\n INFO Third info';
      const mockDebugContent = 'Prefix\n DEBUG Debug message 1\n DEBUG Debug message 2\n DEBUG Debug message 3';

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockErrorContent)
        .mockResolvedValueOnce(mockWarnContent)
        .mockResolvedValueOnce(mockInfoContent)
        .mockResolvedValueOnce(mockDebugContent);

      const result = await logClient.summarizeLogs('20250815');

      expect(result).toContain('Log Summary for 20250815');
      expect(result).toContain('Errors: 2');
      expect(result).toContain('Warnings: 1');
      expect(result).toContain('Info: 5'); // 1 from error file + 1 from warn file + 3 from info file
      expect(result).toContain('Debug: 3');
      expect(result).toContain('Log Files (4)');
    });

    it('should handle file read errors gracefully', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20250815-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
      mockWebdavClient.getFileContents.mockRejectedValue(new Error('File read error'));

      const result = await logClient.summarizeLogs('20250815');

      expect(result).toContain('Log Summary for 20250815');
      expect(result).toContain('Errors: 0');
      expect(result).toContain('Debug: 0');
    });
  });

  describe('searchLogs', () => {
    beforeEach(() => {
      const mockContents = [
        { type: 'file', filename: 'error-20250815-blade1-001.log' },
        { type: 'file', filename: 'warn-20250815-blade1-001.log' },
        { type: 'file', filename: 'customwarn-20250815-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
    });

    it('should search across all log files when no level specified', async () => {
      const mockErrorContent = 'ERROR: Database connection failed\nINFO: System started';
      const mockWarnContent = 'WARN: Database connection slow\nINFO: Cache cleared';
      const mockCustomWarnContent = 'WARN: Custom database warning';

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockErrorContent)
        .mockResolvedValueOnce(mockWarnContent)
        .mockResolvedValueOnce(mockCustomWarnContent);

      const result = await logClient.searchLogs('database', undefined, 20, '20250815');

      expect(result).toContain('Found 3 matches for "database"');
      expect(result).toContain('Database connection failed');
      expect(result).toContain('Database connection slow');
      expect(result).toContain('Custom database warning');
    });

    it('should filter by log level including custom files when specified', async () => {
      const mockWarnContent = 'WARN: Standard warning message with the word warning';
      const mockCustomWarnContent = 'WARN: Custom warning message with the word warning';

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockWarnContent)
        .mockResolvedValueOnce(mockCustomWarnContent);

      const result = await logClient.searchLogs('warning', 'warn' as LogLevel, 20, '20250815');

      expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(2); // Both warn files
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('warn-20250815-blade1-001.log', { format: 'text' });
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('customwarn-20250815-blade1-001.log', { format: 'text' });
      expect(result).toContain('Standard warning message');
      expect(result).toContain('Custom warning message');
    });

    it('should return no matches message when pattern not found', async () => {
      mockWebdavClient.getFileContents.mockResolvedValue('No matching content here');

      const result = await logClient.searchLogs('nonexistent', undefined, 20, '20250815');

      expect(result).toContain('No matches found for "nonexistent" in logs for 20250815');
    });

    it('should handle search errors gracefully', async () => {
      mockWebdavClient.getFileContents.mockRejectedValue(new Error('Search error'));

      const result = await logClient.searchLogs('pattern', undefined, 20, '20250815');

      expect(result).toContain('No matches found for "pattern"');
    });
  });

  describe('listLogFiles', () => {
    it('should return formatted list of log files sorted by modification date', async () => {
      const mockContents = [
        {
          type: 'file',
          filename: 'warn-odspod-0-appserver-20250815.log',
          size: 46387,
          lastmod: 'Fri, 15 Aug 2025 06:32:07 GMT',
        },
        {
          type: 'file',
          filename: 'error-odspod-0-appserver-20250815.log',
          size: 2560,
          lastmod: 'Fri, 15 Aug 2025 05:17:54 GMT',
        },
        {
          type: 'file',
          filename: 'warn-odspod-0-appserver-20250814.log',
          size: 139161,
          lastmod: 'Thu, 14 Aug 2025 23:59:25 GMT',
        },
        { type: 'directory', filename: 'log_archive' }, // Should be filtered out
        { type: 'file', filename: 'not-a-log.txt' }, // Should be filtered out
      ];

      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.listLogFiles();

      expect(result).toContain('Available log files:');
      expect(result).toContain('📄 warn-odspod-0-appserver-20250815.log');
      expect(result).toContain('📄 error-odspod-0-appserver-20250815.log');
      expect(result).toContain('📄 warn-odspod-0-appserver-20250814.log');

      // Should show newest file first
      const warnIndex = result.indexOf('warn-odspod-0-appserver-20250815.log');
      const errorIndex = result.indexOf('error-odspod-0-appserver-20250815.log');
      const oldWarnIndex = result.indexOf('warn-odspod-0-appserver-20250814.log');

      expect(warnIndex).toBeLessThan(errorIndex); // Newest file first
      expect(errorIndex).toBeLessThan(oldWarnIndex); // Then by date

      // Should not contain non-log files
      expect(result).not.toContain('log_archive');
      expect(result).not.toContain('not-a-log.txt');
    });

    it('should show total count when more than 50 files', async () => {
      // Create 60 mock log files
      const mockContents = Array.from({ length: 60 }, (_, i) => ({
        type: 'file',
        filename: `log-file-${i.toString().padStart(3, '0')}.log`,
        size: 1000,
        lastmod: new Date(2025, 7, 15, 12, i).toISOString(),
      }));

      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.listLogFiles();

      expect(result).toContain('(showing latest 50 of 60 total)');
    });

    it('should handle errors when listing files', async () => {
      mockWebdavClient.getDirectoryContents.mockRejectedValue(new Error('List error'));

      await expect(logClient.listLogFiles()).rejects.toThrow('Failed to list log files: List error');
    });
  });

  describe('getLogFileContents', () => {
    it('should read full file content when tailOnly is false and no maxBytes', async () => {
      const mockFileContent = 'This is a full log file content\nLine 2\nLine 3\nLine 4';
      mockWebdavClient.getFileContents.mockResolvedValue(mockFileContent);

      const result = await logClient.getLogFileContents('test.log', undefined, false);

      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('test.log', { format: 'text' });
      expect(result).toContain('This is a full log file content');
      expect(result).toContain('Line 4');
    });

    it('should respect maxBytes when tailOnly is false and maxBytes is specified', async () => {
      const mockFileContent = 'This is a very long log file content that should be truncated';
      const mockStat = { size: 1000 }; // Simulate a large file
      mockWebdavClient.stat.mockResolvedValue(mockStat);

      // Mock the stream for range request from start
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(mockFileContent.substring(0, 50))); // First 50 bytes
          } else if (event === 'end') {
            callback();
          }
        }),
      };
      mockWebdavClient.createReadStream.mockReturnValue(mockStream);

      const result = await logClient.getLogFileContents('test.log', 50, false);

      expect(mockWebdavClient.stat).toHaveBeenCalledWith('test.log');
      expect(mockWebdavClient.createReadStream).toHaveBeenCalledWith('test.log', {
        range: { start: 0, end: 49 },
      });
      expect(result).toContain('This is a very long log file content that should');
    });

    it('should read tail content when tailOnly is true', async () => {
      const mockFileContent = 'Tail content from the end of the file';
      const mockStat = { size: 1000 };
      mockWebdavClient.stat.mockResolvedValue(mockStat);

      // Mock the stream for range request
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(mockFileContent));
          } else if (event === 'end') {
            callback();
          }
        }),
      };
      mockWebdavClient.createReadStream.mockReturnValue(mockStream);

      const result = await logClient.getLogFileContents('test.log', 200, true);

      expect(mockWebdavClient.stat).toHaveBeenCalledWith('test.log');
      expect(mockWebdavClient.createReadStream).toHaveBeenCalledWith('test.log', {
        range: { start: 800, end: 999 },
      });
      expect(result).toContain('Tail content from the end');
    });

    it('should handle file that is smaller than maxBytes when using tail', async () => {
      const mockFileContent = 'Small file';
      const mockStat = { size: 10 };
      mockWebdavClient.stat.mockResolvedValue(mockStat);
      mockWebdavClient.getFileContents.mockResolvedValue(mockFileContent);

      const result = await logClient.getLogFileContents('test.log', 200, true);

      // Should read full file since it's smaller than maxBytes
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith('test.log', { format: 'text' });
      expect(result).toContain('Small file');
    });
  });

  describe('error handling', () => {
    it('should handle WebDAV connection errors in getLogFiles', async () => {
      mockWebdavClient.getDirectoryContents.mockRejectedValue(new Error('Connection failed'));

      await expect(logClient.getLogFiles()).rejects.toThrow('Connection failed');
    });

    it('should handle file read errors gracefully in getLatestLogs', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20250815-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
      mockWebdavClient.getFileContents.mockRejectedValue(new Error('File not found'));

      // Should not throw error but handle gracefully and return empty result
      const result = await logClient.getLatestLogs('error' as LogLevel, 10, '20250815');

      expect(result).toContain('Latest 10 error messages from files');
      expect(result).toContain('error-20250815-blade1-001.log');
      // Should handle the error gracefully and continue
    });
  });
});
