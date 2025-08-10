import { SFCCLogClient } from '../src/log-client';
import { SFCCConfig, LogLevel } from '../src/types';

// Use manual mock for webdav
const webdav = require('webdav');
const mockWebdavClient = webdav.__mockWebdavClient;

// Mock the logger
jest.mock('../src/logger', () => ({
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
jest.mock('../src/utils', () => ({
  getCurrentDate: jest.fn(() => '20240809'),
  formatBytes: jest.fn((bytes: number) => `${bytes} bytes`),
  parseLogEntries: jest.fn((content: string, level: string) => {
    // Simple mock implementation - split by lines and filter by level
    return content.split('\n').filter(line => line.includes(level));
  }),
  extractUniqueErrors: jest.fn((errors: string[]) => {
    // Mock implementation that returns unique error messages
    return [...new Set(errors.map(error => error.split(' ').slice(0, 5).join(' ')))];
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
        }
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
        }
      );
    });

    it('should throw error when no authentication provided', () => {
      const config: SFCCConfig = {
        hostname: 'test.demandware.net',
      };

      expect(() => new SFCCLogClient(config)).toThrow(
        'Either username/password or clientId/clientSecret must be provided'
      );
    });
  });

  describe('getLogFiles', () => {
    it('should return log files for specified date', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
        { type: 'file', filename: 'warn-20240809-blade1-001.log' },
        { type: 'file', filename: 'info-20240809-blade1-001.log' },
        { type: 'file', filename: 'debug-20240809-blade1-001.log' },
        { type: 'file', filename: 'error-20240808-blade1-001.log' }, // Different date
        { type: 'directory', filename: 'somedir' }, // Directory
        { type: 'file', filename: 'not-a-log.txt' }, // Not a log file
      ];

      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.getLogFiles('20240809');

      expect(result).toEqual([
        'error-20240809-blade1-001.log',
        'warn-20240809-blade1-001.log',
        'info-20240809-blade1-001.log',
        'debug-20240809-blade1-001.log',
      ]);
      expect(mockWebdavClient.getDirectoryContents).toHaveBeenCalledWith('/');
    });

    it('should use current date when no date provided', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      await logClient.getLogFiles();

      // Should call getCurrentDate() from utils which returns '20240809'
      expect(mockWebdavClient.getDirectoryContents).toHaveBeenCalledWith('/');
    });

    it('should return empty array when no log files found', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      const result = await logClient.getLogFiles('20240809');

      expect(result).toEqual([]);
    });
  });

  describe('getLatestLogs', () => {
    beforeEach(() => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
        { type: 'file', filename: 'error-20240809-blade1-002.log' },
        { type: 'file', filename: 'warn-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
    });

    it('should return latest error logs', async () => {
      const mockLogContent = 'ERROR Line 1\nERROR Line 2\nERROR Line 3\nERROR Line 4\nERROR Line 5';
      mockWebdavClient.getFileContents.mockResolvedValue(mockLogContent);

      const result = await logClient.getLatestLogs('error' as LogLevel, 3, '20240809');

      expect(result).toContain('Latest 3 error messages');
      expect(result).toContain('error-20240809-blade1-002.log'); // Should use the latest file
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
        'error-20240809-blade1-002.log',
        { format: 'text' }
      );
    });

    it('should return warning when no files found for level', async () => {
      const mockContents = [
        { type: 'file', filename: 'info-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.getLatestLogs('error' as LogLevel, 10, '20240809');

      expect(result).toContain('No error log files found');
      expect(result).toContain('Available files: info-20240809-blade1-001.log');
    });

    it('should handle different log levels', async () => {
      const mockLogContent = 'WARN Line 1\nWARN Line 2';
      mockWebdavClient.getFileContents.mockResolvedValue(mockLogContent);

      await logClient.getLatestLogs('warn' as LogLevel, 2, '20240809');

      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
        'warn-20240809-blade1-001.log',
        { format: 'text' }
      );
    });

    it('should return latest debug logs', async () => {
      const mockContents = [
        { type: 'file', filename: 'debug-20240809-blade1-001.log' },
        { type: 'file', filename: 'debug-20240809-blade1-002.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const mockLogContent = 'DEBUG Line 1\nDEBUG Line 2\nDEBUG Line 3';
      mockWebdavClient.getFileContents.mockResolvedValue(mockLogContent);

      const result = await logClient.getLatestLogs('debug' as LogLevel, 2, '20240809');

      expect(result).toContain('Latest 2 debug messages');
      expect(result).toContain('debug-20240809-blade1-002.log'); // Should use the latest file
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
        'debug-20240809-blade1-002.log',
        { format: 'text' }
      );
    });
  });

  describe('summarizeLogs', () => {
    it('should return summary when no log files found', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      const result = await logClient.summarizeLogs('20240809');

      expect(result).toBe('No log files found for date 20240809');
    });

    it('should generate comprehensive log summary', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
        { type: 'file', filename: 'warn-20240809-blade1-001.log' },
        { type: 'file', filename: 'info-20240809-blade1-001.log' },
        { type: 'file', filename: 'debug-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const mockErrorContent = ' ERROR Something went wrong\n ERROR Another error\n INFO Some info';
      const mockWarnContent = ' WARN Warning message\n INFO Info message';
      const mockInfoContent = ' INFO First info\n INFO Second info\n INFO Third info';
      const mockDebugContent = ' DEBUG Debug message 1\n DEBUG Debug message 2\n DEBUG Debug message 3';

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockErrorContent)
        .mockResolvedValueOnce(mockWarnContent)
        .mockResolvedValueOnce(mockInfoContent)
        .mockResolvedValueOnce(mockDebugContent);

      const result = await logClient.summarizeLogs('20240809');

      expect(result).toContain('Log Summary for 20240809');
      expect(result).toContain('Errors: 2'); // The parseLogEntries mock filters properly
      expect(result).toContain('Warnings: 1');
      expect(result).toContain('Info: 5');
      expect(result).toContain('Debug: 3');
      expect(result).toContain('Log Files (4)');
      expect(result).toContain('ERROR Something went wrong'); // Key issues section
      expect(result).toContain('ERROR Another error');
    });

    it('should handle file read errors gracefully', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
      mockWebdavClient.getFileContents.mockRejectedValue(new Error('File read error'));

      const result = await logClient.summarizeLogs('20240809');

      expect(result).toContain('Log Summary for 20240809');
      expect(result).toContain('Errors: 0'); // Should handle the error and continue
      expect(result).toContain('Debug: 0'); // Should initialize debug count to 0
    });
  });

  describe('searchLogs', () => {
    beforeEach(() => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
        { type: 'file', filename: 'warn-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
    });

    it('should search across all log files when no level specified', async () => {
      const mockErrorContent = 'ERROR: Database connection failed\nINFO: System started';
      const mockWarnContent = 'WARN: Database connection slow\nINFO: Cache cleared';

      mockWebdavClient.getFileContents
        .mockResolvedValueOnce(mockErrorContent)
        .mockResolvedValueOnce(mockWarnContent);

      const result = await logClient.searchLogs('database', undefined, 20, '20240809');

      expect(result).toContain('Found 2 matches for "database"');
      expect(result).toContain('Database connection failed');
      expect(result).toContain('Database connection slow');
    });

    it('should filter by log level when specified', async () => {
      const mockErrorContent = 'ERROR: Database connection failed';
      mockWebdavClient.getFileContents.mockResolvedValue(mockErrorContent);

      const result = await logClient.searchLogs('database', 'error' as LogLevel, 20, '20240809');

      expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(1);
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
        'error-20240809-blade1-001.log',
        { format: 'text' }
      );
    });

    it('should return no matches message when pattern not found', async () => {
      mockWebdavClient.getFileContents.mockResolvedValue('No matching content here');

      const result = await logClient.searchLogs('nonexistent', undefined, 20, '20240809');

      expect(result).toContain('No matches found for "nonexistent"');
    });

    it('should handle case-insensitive search', async () => {
      const mockContent = 'ERROR: DATABASE CONNECTION FAILED';
      mockWebdavClient.getFileContents.mockResolvedValue(mockContent);

      const result = await logClient.searchLogs('database', undefined, 20, '20240809');

      expect(result).toContain('Found 2 matches for "database"'); // Both files return the same content
      expect(result).toContain('DATABASE CONNECTION FAILED');
    });

    it('should respect the limit parameter', async () => {
      const lines = Array.from({ length: 50 }, (_, i) => `ERROR: Test error ${i}`);
      const mockContent = lines.join('\n');
      mockWebdavClient.getFileContents.mockResolvedValue(mockContent);

      const result = await logClient.searchLogs('test', undefined, 10, '20240809');

      // Should only return 10 matches despite 50 being available
      const matches = result.split('\n\n').length - 1; // Subtract header line
      expect(matches).toBeLessThanOrEqual(11); // 10 matches + header
    });

    it('should filter by debug log level when specified', async () => {
      const mockContents = [
        { type: 'file', filename: 'debug-20240809-blade1-001.log' },
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const mockDebugContent = 'DEBUG: Database query executed';
      mockWebdavClient.getFileContents.mockResolvedValue(mockDebugContent);

      const result = await logClient.searchLogs('database', 'debug' as LogLevel, 20, '20240809');

      expect(mockWebdavClient.getFileContents).toHaveBeenCalledTimes(1);
      expect(mockWebdavClient.getFileContents).toHaveBeenCalledWith(
        'debug-20240809-blade1-001.log',
        { format: 'text' }
      );
      expect(result).toContain('Database query executed');
    });
  });

  describe('listLogFiles', () => {
    it('should list all log files with metadata', async () => {
      const mockContents = [
        {
          type: 'file',
          filename: 'error-20240809-blade1-001.log',
          size: 1024,
          lastmod: '2024-08-09T10:00:00Z',
        },
        {
          type: 'file',
          filename: 'warn-20240809-blade1-001.log',
          size: 2048,
          lastmod: '2024-08-09T11:00:00Z',
        },
        {
          type: 'file',
          filename: 'not-a-log.txt',
          size: 512,
          lastmod: '2024-08-09T12:00:00Z',
        },
        {
          type: 'directory',
          filename: 'somedir',
        },
      ];

      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);

      const result = await logClient.listLogFiles();

      expect(result).toContain('Available log files:');
      expect(result).toContain('error-20240809-blade1-001.log');
      expect(result).toContain('warn-20240809-blade1-001.log');
      expect(result).toContain('1024 bytes'); // formatBytes mock
      expect(result).toContain('2048 bytes');
      expect(result).toContain('2024-08-09T10:00:00Z');
      expect(result).not.toContain('not-a-log.txt'); // Should filter out non-log files
      expect(result).not.toContain('somedir'); // Should filter out directories
    });

    it('should handle WebDAV errors', async () => {
      mockWebdavClient.getDirectoryContents.mockRejectedValue(new Error('Connection failed'));

      await expect(logClient.listLogFiles()).rejects.toThrow('Failed to list log files: Connection failed');
    });

    it('should handle empty directory', async () => {
      mockWebdavClient.getDirectoryContents.mockResolvedValue([]);

      const result = await logClient.listLogFiles();

      expect(result).toContain('Available log files:');
      expect(result.split('\n')).toHaveLength(3); // Header, empty line, and extra empty line
    });
  });

  describe('error handling', () => {
    it('should handle WebDAV connection errors in getLogFiles', async () => {
      mockWebdavClient.getDirectoryContents.mockRejectedValue(new Error('Connection timeout'));

      await expect(logClient.getLogFiles()).rejects.toThrow('Connection timeout');
    });

    it('should handle file read errors in getLatestLogs', async () => {
      const mockContents = [
        { type: 'file', filename: 'error-20240809-blade1-001.log' },
      ];
      mockWebdavClient.getDirectoryContents.mockResolvedValue(mockContents);
      mockWebdavClient.getFileContents.mockRejectedValue(new Error('File not found'));

      await expect(logClient.getLatestLogs('error' as LogLevel, 10)).rejects.toThrow('File not found');
    });
  });
});
