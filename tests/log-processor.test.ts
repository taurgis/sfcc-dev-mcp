import { LogProcessor } from '../src/clients/logs/log-processor';
import { LogEntry, LogFileMetadata, LogLevel } from '../src/clients/logs/log-types';
import { Logger } from '../src/utils/logger';

// Mock utils functions
jest.mock('../src/utils/utils', () => ({
  parseLogEntries: jest.fn(),
  extractUniqueErrors: jest.fn(),
  normalizeFilePath: jest.fn((path: string) => path),
  extractTimestampFromLogEntry: jest.fn(),
}));

import { parseLogEntries, extractTimestampFromLogEntry } from '../src/utils/utils';
const mockParseLogEntries = parseLogEntries as jest.MockedFunction<typeof parseLogEntries>;
const mockExtractTimestamp = extractTimestampFromLogEntry as jest.MockedFunction<
  typeof extractTimestampFromLogEntry
>;

describe('LogProcessor', () => {
  let logProcessor: LogProcessor;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      createChildLogger: jest.fn(),
      setDebugEnabled: jest.fn(),
      getLogDirectory: jest.fn(),
    } as unknown as Logger;

    logProcessor = new LogProcessor(mockLogger);
    jest.clearAllMocks();
  });

  describe('processLogFiles', () => {
    it('should process files in chronological order by modification date (newest first)', async () => {
      const files: LogFileMetadata[] = [
        { filename: 'error-server1-20250819.log', lastmod: '2025-08-19T08:00:00.000Z' }, // oldest
        { filename: 'error-server2-20250819.log', lastmod: '2025-08-19T10:00:00.000Z' }, // newest
        { filename: 'error-server3-20250819.log', lastmod: '2025-08-19T09:00:00.000Z' }, // middle
      ];

      const fileContents = new Map([
        ['error-server1-20250819.log', '[2025-08-19T08:30:00.000 GMT] ERROR Class1 - Old error'],
        ['error-server2-20250819.log', '[2025-08-19T10:30:00.000 GMT] ERROR Class2 - New error'],
        ['error-server3-20250819.log', '[2025-08-19T09:30:00.000 GMT] ERROR Class3 - Middle error'],
      ]);

      // Mock parseLogEntries to return the messages as they appear in content
      mockParseLogEntries
        .mockReturnValueOnce(['[2025-08-19T10:30:00.000 GMT] ERROR Class2 - New error']) // newest file processed first
        .mockReturnValueOnce(['[2025-08-19T09:30:00.000 GMT] ERROR Class3 - Middle error']) // middle file
        .mockReturnValueOnce(['[2025-08-19T08:30:00.000 GMT] ERROR Class1 - Old error']); // oldest file processed last

      // Mock extractTimestampFromLogEntry to return appropriate timestamps
      mockExtractTimestamp
        .mockReturnValueOnce(new Date('2025-08-19T10:30:00.000Z')) // newest error
        .mockReturnValueOnce(new Date('2025-08-19T09:30:00.000Z')) // middle error
        .mockReturnValueOnce(new Date('2025-08-19T08:30:00.000Z')); // oldest error

      const result = await logProcessor.processLogFiles(files, 'error' as LogLevel, fileContents);

      // Verify files were processed in chronological order by modification date (newest first)
      expect(mockParseLogEntries).toHaveBeenNthCalledWith(1, fileContents.get('error-server2-20250819.log'), 'ERROR');
      expect(mockParseLogEntries).toHaveBeenNthCalledWith(2, fileContents.get('error-server3-20250819.log'), 'ERROR');
      expect(mockParseLogEntries).toHaveBeenNthCalledWith(3, fileContents.get('error-server1-20250819.log'), 'ERROR');

      // Verify entries have timestamps extracted and order values assigned
      expect(result).toHaveLength(3);
      expect(result[0].timestamp).toEqual(new Date('2025-08-19T10:30:00.000Z')); // newest timestamp
      expect(result[0].order).toBe(0); // newest file, first entry: 0 * 1000000 + 0 = 0
      expect(result[1].timestamp).toEqual(new Date('2025-08-19T09:30:00.000Z')); // middle timestamp
      expect(result[1].order).toBe(1000000); // middle file, first entry: 1 * 1000000 + 0 = 1000000
      expect(result[2].timestamp).toEqual(new Date('2025-08-19T08:30:00.000Z')); // oldest timestamp
      expect(result[2].order).toBe(2000000); // oldest file, first entry: 2 * 1000000 + 0 = 2000000
    });

    it('should assign correct order values for multiple entries within files', async () => {
      const files: LogFileMetadata[] = [
        { filename: 'error-new-20250819.log', lastmod: '2025-08-19T10:00:00.000Z' }, // newer
        { filename: 'error-old-20250819.log', lastmod: '2025-08-19T08:00:00.000Z' }, // older
      ];

      const fileContents = new Map([
        ['error-new-20250819.log', 'content1'],
        ['error-old-20250819.log', 'content2'],
      ]);

      // Mock parseLogEntries to return multiple entries per file
      mockParseLogEntries
        .mockReturnValueOnce([ // newer file (processed first, order starts at 0)
          '[2025-08-19T10:30:00.000 GMT] ERROR Class1 - First new error',
          '[2025-08-19T10:25:00.000 GMT] ERROR Class2 - Second new error',
        ])
        .mockReturnValueOnce([ // older file (processed second, order starts at 1000)
          '[2025-08-19T08:30:00.000 GMT] ERROR Class3 - First old error',
          '[2025-08-19T08:25:00.000 GMT] ERROR Class4 - Second old error',
        ]);

      // Mock extractTimestampFromLogEntry for all entries
      mockExtractTimestamp
        .mockReturnValueOnce(new Date('2025-08-19T10:30:00.000Z')) // First new error
        .mockReturnValueOnce(new Date('2025-08-19T10:25:00.000Z')) // Second new error
        .mockReturnValueOnce(new Date('2025-08-19T08:30:00.000Z')) // First old error
        .mockReturnValueOnce(new Date('2025-08-19T08:25:00.000Z')); // Second old error

      const result = await logProcessor.processLogFiles(files, 'error' as LogLevel, fileContents);

      expect(result).toHaveLength(4);

      // Verify order values and timestamps for all entries
      expect(result[0].order).toBe(0);    // 0 * 1000000 + 0 = 0
      expect(result[0].timestamp).toEqual(new Date('2025-08-19T10:30:00.000Z'));
      expect(result[1].order).toBe(1);    // 0 * 1000000 + 1 = 1
      expect(result[1].timestamp).toEqual(new Date('2025-08-19T10:25:00.000Z'));

      expect(result[2].order).toBe(1000000); // 1 * 1000000 + 0 = 1000000
      expect(result[2].timestamp).toEqual(new Date('2025-08-19T08:30:00.000Z'));
      expect(result[3].order).toBe(1000001); // 1 * 1000000 + 1 = 1000001
      expect(result[3].timestamp).toEqual(new Date('2025-08-19T08:25:00.000Z'));
    });
  });

  describe('sortAndLimitEntries', () => {
    it('should return the most recent entries by timestamp when limit is applied', () => {
      const entries: LogEntry[] = [
        {
          entry: '[file1] Error 1',
          filename: 'file1.log',
          order: 0,
          timestamp: new Date('2025-08-19T08:00:00.000Z'), // oldest
        },
        {
          entry: '[file1] Error 2',
          filename: 'file1.log',
          order: 1,
          timestamp: new Date('2025-08-19T10:00:00.000Z'), // newest
        },
        {
          entry: '[file2] Error 3',
          filename: 'file2.log',
          order: 1000,
          timestamp: new Date('2025-08-19T09:00:00.000Z'), // middle
        },
      ];

      const result = logProcessor.sortAndLimitEntries(entries, 2);

      // Should take the 2 most recent entries chronologically (newest first)
      expect(result).toHaveLength(2);
      expect(result[0].entry).toBe('[file1] Error 2'); // 10:00 - newest timestamp
      expect(result[1].entry).toBe('[file2] Error 3'); // 09:00 - second newest
    });

    it('should handle limit greater than available entries', () => {
      const entries: LogEntry[] = [
        {
          entry: '[file1] Error 1',
          filename: 'file1.log',
          order: 0,
          timestamp: new Date('2025-08-19T08:00:00.000Z'),
        },
        {
          entry: '[file1] Error 2',
          filename: 'file1.log',
          order: 1,
          timestamp: new Date('2025-08-19T09:00:00.000Z'),
        },
      ];

      const result = logProcessor.sortAndLimitEntries(entries, 10);

      expect(result).toHaveLength(2);
      expect(result[0].entry).toBe('[file1] Error 2'); // newest first
      expect(result[1].entry).toBe('[file1] Error 1');
    });

    it('should handle empty entries array', () => {
      const result = logProcessor.sortAndLimitEntries([], 5);
      expect(result).toHaveLength(0);
    });

    it('should fallback to order-based sorting when timestamps are missing', () => {
      const entries: LogEntry[] = [
        { entry: '[file1] Error A', filename: 'file1.log', order: 2 }, // no timestamp
        { entry: '[file1] Error B', filename: 'file1.log', order: 0 }, // no timestamp
        { entry: '[file1] Error C', filename: 'file1.log', order: 1 }, // no timestamp
      ];

      const result = logProcessor.sortAndLimitEntries(entries, 3);

      expect(result).toHaveLength(3);
      // Should sort by order (ascending) when no timestamps
      expect(result[0].entry).toBe('[file1] Error B'); // order: 0
      expect(result[1].entry).toBe('[file1] Error C'); // order: 1
      expect(result[2].entry).toBe('[file1] Error A'); // order: 2
    });

    it('should prioritize entries with timestamps over those without', () => {
      const entries: LogEntry[] = [
        { entry: '[file1] Error A', filename: 'file1.log', order: 0 }, // no timestamp
        {
          entry: '[file1] Error B',
          filename: 'file1.log',
          order: 1000,
          timestamp: new Date('2025-08-19T09:00:00.000Z'), // has timestamp
        },
      ];

      const result = logProcessor.sortAndLimitEntries(entries, 2);

      expect(result).toHaveLength(2);
      // Entry with timestamp should come first
      expect(result[0].entry).toBe('[file1] Error B');
      expect(result[1].entry).toBe('[file1] Error A');
    });
  });

  describe('extractFormattedEntries', () => {
    it('should extract entries from sorted log entries', () => {
      const sortedEntries: LogEntry[] = [
        { entry: '[file1] Error 1', filename: 'file1.log', order: 0 },
        { entry: '[file1] Error 2', filename: 'file1.log', order: 1 },
      ];

      const result = logProcessor.extractFormattedEntries(sortedEntries);

      expect(result).toEqual(['[file1] Error 1', '[file1] Error 2']);
    });

    it('should handle empty array', () => {
      const result = logProcessor.extractFormattedEntries([]);
      expect(result).toEqual([]);
    });
  });
});
