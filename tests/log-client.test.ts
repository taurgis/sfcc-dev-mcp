import { SFCCLogClient } from '../src/clients/log-client';
import { SFCCConfig, LogLevel } from '../src/types/types';

// Use manual mock for webdav
// eslint-disable-next-line @typescript-eslint/no-require-imports
const webdav = require('webdav');
const mockWebdavClient = webdav.__mockWebdavClient;

// Mock the logger
jest.mock('../src/utils/logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    methodEntry: jest.fn(),
    methodExit: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    timing: jest.fn(),
  })),
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
        'error-20250815-blade1-001.log',
        'warn-20250815-blade1-001.log',
        'info-20250815-blade1-001.log',
        'debug-20250815-blade1-001.log',
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
      it('should process files from newest to oldest and show newest entries first', async () => {
        // Real-world log files - all must have the same date since getLogFiles filters by date
        const mockContents = [
          { type: 'file', filename: 'warn-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'customwarn-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'warn-blade1-20250815.log' },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        // Mock content for each warn file
        const mockContent1 = 'WARN 06:32:07 Newest warning from file 1\nWARN 06:30:00 Another warning from file 1';
        const mockContent2 = 'WARN 08:16:33 Custom warning from file 2';
        const mockContent3 = 'WARN 23:59:25 Warning from file 3';

        // Files should be processed in reverse alphabetical order (newest first)
        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(mockContent1)  // First file
          .mockResolvedValueOnce(mockContent2)  // Custom file
          .mockResolvedValueOnce(mockContent3); // Third file

        const result = await logClient.getLatestLogs('warn' as LogLevel, 3, '20250815');

        expect(result).toContain('Latest 3 warn messages');
        expect(result).toContain('warn-odspod-0-appserver-20250815.log');
        expect(result).toContain('customwarn-odspod-0-appserver-20250815.log');
        expect(result).toContain('warn-blade1-20250815.log');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3);
      });

      it('should properly sort mixed date files and show newest entries at top', async () => {
        const mockContents = [
          { type: 'file', filename: 'error-odspod-0-appserver-20250815.log' },
          { type: 'file', filename: 'error-blade1-20250815.log' },
        ];
        mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

        // Mock file content that will be found by parseLogEntries
        const newestFileContent = 'ERROR 05:17:54 Very recent error\nERROR 05:16:00 Another recent error';
        const olderFileContent = 'ERROR 11:24:07 Yesterday error\nERROR 11:20:00 Another yesterday error';

        mockWebdavClient.getFileContents
          .mockResolvedValueOnce(newestFileContent)  // First file processed
          .mockResolvedValueOnce(olderFileContent);  // Second file processed

        const result = await logClient.getLatestLogs('error' as LogLevel, 3, '20250815');

        // Should contain entries from the files
        expect(result).toContain('Latest 3 error messages from files');
        expect(result).toContain('error-odspod-0-appserver-20250815.log');
        expect(result).toContain('error-blade1-20250815.log');
        expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(2);
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

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockContent)                           // First file succeeds
        .mockRejectedValueOnce(new Error('File read error'))         // Second file fails
        .mockResolvedValueOnce(mockContent);                         // Third file succeeds

      const result = await logClient.getLatestLogs('warn' as LogLevel, 5, '20250815');

      expect(result).toContain('Latest 5 warn messages');
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(3);
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
