import {
  getCurrentDate,
  formatBytes,
  parseLogEntries,
  extractUniqueErrors,
  normalizeFilePath,
} from '../src/utils';

describe('utils.ts', () => {
  describe('getCurrentDate', () => {
    it('should return current date in YYYYMMDD format', () => {
      const result = getCurrentDate();

      // Should be 8 characters long
      expect(result).toHaveLength(8);

      // Should match YYYYMMDD pattern
      expect(result).toMatch(/^\d{8}$/);

      // Should be a valid date when parsed
      const year = parseInt(result.substring(0, 4));
      const month = parseInt(result.substring(4, 6));
      const day = parseInt(result.substring(6, 8));

      expect(year).toBeGreaterThan(2020);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
    });

    it('should return today\'s date', () => {
      const now = new Date();
      const expected = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

      expect(getCurrentDate()).toBe(expected);
    });

    it('should pad single digit months and days with zeros', () => {
      // Mock Date to return January 5th, 2023
      const mockDate = new Date('2023-01-05T10:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = getCurrentDate();
      expect(result).toBe('20230105');

      jest.restoreAllMocks();
    });
  });

  describe('formatBytes', () => {
    it('should format zero bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('should format bytes (less than 1024)', () => {
      expect(formatBytes(512)).toBe('512 Bytes');
      expect(formatBytes(1023)).toBe('1023 Bytes');
      expect(formatBytes(1)).toBe('1 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB'); // 1024 + 512
      expect(formatBytes(2048)).toBe('2 KB');
      expect(formatBytes(1024 * 1023)).toBe('1023 KB');
    });

    it('should format megabytes', () => {
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatBytes(1024 * 1024 * 2.75)).toBe('2.75 MB');
      expect(formatBytes(1024 * 1024 * 1023)).toBe('1023 MB');
    });

    it('should format gigabytes', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatBytes(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
      expect(formatBytes(1024 * 1024 * 1024 * 10.25)).toBe('10.25 GB');
    });

    it('should handle decimal values correctly', () => {
      expect(formatBytes(1536.7)).toBe('1.5 KB');
      expect(formatBytes(2097152.5)).toBe('2 MB');
    });

    it('should round to 2 decimal places', () => {
      expect(formatBytes(1126.4)).toBe('1.1 KB'); // 1126.4 / 1024 = 1.1000390625
      expect(formatBytes(1234567)).toBe('1.18 MB'); // Should round to 2 decimal places
    });

    it('should handle large numbers', () => {
      const largeNumber = 1024 * 1024 * 1024 * 1000; // 1TB in bytes
      expect(formatBytes(largeNumber)).toBe('1000 GB');
    });
  });

  describe('parseLogEntries', () => {
    it('should parse single log entry', () => {
      const content = '[2023-08-09T10:30:00.123 GMT] ERROR SomeClass - This is an error message';
      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('[2023-08-09T10:30:00.123 GMT] ERROR SomeClass - This is an error message');
    });

    it('should parse multiple log entries of same level', () => {
      const content = `[2023-08-09T10:30:00.123 GMT] ERROR Class1 - First error
[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Second error
[2023-08-09T10:32:00.789 GMT] ERROR Class3 - Third error`;

      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('[2023-08-09T10:30:00.123 GMT] ERROR Class1 - First error');
      expect(result[1]).toBe('[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Second error');
      expect(result[2]).toBe('[2023-08-09T10:32:00.789 GMT] ERROR Class3 - Third error');
    });

    it('should filter by log level', () => {
      const content = `[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Error message
[2023-08-09T10:31:00.456 GMT] WARN Class2 - Warning message
[2023-08-09T10:32:00.789 GMT] INFO Class3 - Info message
[2023-08-09T10:33:00.012 GMT] ERROR Class4 - Another error`;

      const errorResult = parseLogEntries(content, 'ERROR');
      const warnResult = parseLogEntries(content, 'WARN');
      const infoResult = parseLogEntries(content, 'INFO');

      expect(errorResult).toHaveLength(2);
      expect(warnResult).toHaveLength(1);
      expect(infoResult).toHaveLength(1);

      expect(errorResult[0]).toContain('Error message');
      expect(errorResult[1]).toContain('Another error');
      expect(warnResult[0]).toContain('Warning message');
      expect(infoResult[0]).toContain('Info message');
    });

    it('should handle multi-line log entries', () => {
      const content = `[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Error with stack trace
    at function1 (file1.js:10:5)
    at function2 (file2.js:20:3)
    at main (app.js:100:1)
[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another error`;

      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(2);
      expect(result[0]).toContain('Error with stack trace');
      expect(result[0]).toContain('at function1 (file1.js:10:5)');
      expect(result[0]).toContain('at function2 (file2.js:20:3)');
      expect(result[0]).toContain('at main (app.js:100:1)');
      expect(result[1]).toBe('[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another error');
    });

    it('should handle empty content', () => {
      expect(parseLogEntries('', 'ERROR')).toEqual([]);
      expect(parseLogEntries('   ', 'ERROR')).toEqual([]);
    });

    it('should handle content with no matching log level', () => {
      const content = `[2023-08-09T10:30:00.123 GMT] WARN Class1 - Warning message
[2023-08-09T10:31:00.456 GMT] INFO Class2 - Info message`;

      expect(parseLogEntries(content, 'ERROR')).toEqual([]);
    });

    it('should ignore lines that don\'t match the log pattern', () => {
      const content = `Some random text
[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Valid error
[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another valid error`;

      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Valid error');
      expect(result[1]).toBe('[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another valid error');
    });

    it('should handle edge case with GMT requirement', () => {
      const content = `[2023-08-09T10:30:00.123] ERROR Class1 - Error without GMT
[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Error with GMT`;

      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Error with GMT');
    });

    it('should trim entries properly', () => {
      const content = `  [2023-08-09T10:30:00.123 GMT] ERROR Class1 - Error with leading spaces  
  [2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another error  `;

      const result = parseLogEntries(content, 'ERROR');

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Error with leading spaces');
      expect(result[1]).toBe('[2023-08-09T10:31:00.456 GMT] ERROR Class2 - Another error');
    });
  });

  describe('extractUniqueErrors', () => {
    it('should extract unique error patterns', () => {
      const errors = [
        '[2023-08-09T10:30:00.123 GMT] ERROR ClassName1 - Database connection failed',
        '[2023-08-09T10:31:00.456 GMT] ERROR ClassName2 - File not found',
        '[2023-08-09T10:32:00.789 GMT] ERROR ClassName1 - Database connection failed',
        '[2023-08-09T10:33:00.012 GMT] ERROR ClassName3 - Permission denied',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(3);
      expect(result).toContain('Database connection failed');
      expect(result).toContain('File not found');
      expect(result).toContain('Permission denied');
    });

    it('should limit results to top 10 unique errors', () => {
      const errors = [];
      for (let i = 1; i <= 15; i++) {
        errors.push(`[2023-08-09T10:30:00.123 GMT] ERROR Class${i} - Error message ${i}`);
      }

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(10);
    });

    it('should handle empty array', () => {
      expect(extractUniqueErrors([])).toEqual([]);
    });

    it('should handle errors without proper format', () => {
      const errors = [
        'Invalid log format',
        '[2023-08-09T10:30:00.123 GMT] ERROR ClassName - Valid error message',
        'Another invalid format',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('Valid error message');
    });

    it('should extract error message from multi-line entries', () => {
      const errors = [
        `[2023-08-09T10:30:00.123 GMT] ERROR ClassName - Connection timeout
    at database.connect()
    at service.initialize()`,
        '[2023-08-09T10:31:00.456 GMT] ERROR AnotherClass - File access denied',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(2);
      expect(result).toContain('Connection timeout');
      expect(result).toContain('File access denied');
    });

    it('should handle different class name formats', () => {
      const errors = [
        '[2023-08-09T10:30:00.123 GMT] ERROR dw.system.Pipeline - Pipeline execution failed',
        '[2023-08-09T10:31:00.456 GMT] ERROR CustomClass123 - Custom error occurred',
        '[2023-08-09T10:32:00.789 GMT] ERROR com.demandware.Core - Core system error',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(3);
      expect(result).toContain('Pipeline execution failed');
      expect(result).toContain('Custom error occurred');
      expect(result).toContain('Core system error');
    });

    it('should trim extracted error messages', () => {
      const errors = [
        '[2023-08-09T10:30:00.123 GMT] ERROR ClassName -   Error with extra spaces   ',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('Error with extra spaces');
    });

    it('should maintain order of first occurrence', () => {
      const errors = [
        '[2023-08-09T10:30:00.123 GMT] ERROR Class1 - Third error alphabetically',
        '[2023-08-09T10:31:00.456 GMT] ERROR Class2 - First error alphabetically',
        '[2023-08-09T10:32:00.789 GMT] ERROR Class3 - Second error alphabetically',
      ];

      const result = extractUniqueErrors(errors);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('Third error alphabetically');
      expect(result[1]).toBe('First error alphabetically');
      expect(result[2]).toBe('Second error alphabetically');
    });
  });

  describe('normalizeFilePath', () => {
    it('should remove leading slash from file path', () => {
      expect(normalizeFilePath('/path/to/file.js')).toBe('path/to/file.js');
      expect(normalizeFilePath('/single')).toBe('single');
      expect(normalizeFilePath('/deep/nested/path/file.txt')).toBe('deep/nested/path/file.txt');
    });

    it('should leave path unchanged if no leading slash', () => {
      expect(normalizeFilePath('path/to/file.js')).toBe('path/to/file.js');
      expect(normalizeFilePath('single')).toBe('single');
      expect(normalizeFilePath('deep/nested/path/file.txt')).toBe('deep/nested/path/file.txt');
    });

    it('should handle empty string', () => {
      expect(normalizeFilePath('')).toBe('');
    });

    it('should handle single slash', () => {
      expect(normalizeFilePath('/')).toBe('');
    });

    it('should handle multiple leading slashes (only remove first)', () => {
      expect(normalizeFilePath('//path/to/file')).toBe('/path/to/file');
      expect(normalizeFilePath('///path/to/file')).toBe('//path/to/file');
    });

    it('should handle paths with special characters', () => {
      expect(normalizeFilePath('/path/with spaces/file.js')).toBe('path/with spaces/file.js');
      expect(normalizeFilePath('/path/with-dashes/file_name.txt')).toBe('path/with-dashes/file_name.txt');
      expect(normalizeFilePath('/path/with.dots/file.name.ext')).toBe('path/with.dots/file.name.ext');
    });

    it('should handle Windows-style paths', () => {
      expect(normalizeFilePath('/C:/Windows/System32/file.dll')).toBe('C:/Windows/System32/file.dll');
      expect(normalizeFilePath('/folder\\subfolder\\file.txt')).toBe('folder\\subfolder\\file.txt');
    });

    it('should handle paths with query parameters and fragments', () => {
      expect(normalizeFilePath('/api/endpoint?param=value')).toBe('api/endpoint?param=value');
      expect(normalizeFilePath('/page.html#section')).toBe('page.html#section');
      expect(normalizeFilePath('/file.js?v=1.0.0&cache=false')).toBe('file.js?v=1.0.0&cache=false');
    });
  });

  describe('edge cases and integration', () => {
    it('should handle all functions with edge case inputs', () => {
      // Test all functions with various edge cases
      expect(() => getCurrentDate()).not.toThrow();
      expect(() => formatBytes(-1)).not.toThrow();
      expect(() => parseLogEntries('malformed log', 'INVALID')).not.toThrow();
      expect(() => extractUniqueErrors(['malformed'])).not.toThrow();
      expect(() => normalizeFilePath('  /path/with/spaces  ')).not.toThrow();
    });

    it('should handle realistic SFCC log parsing workflow', () => {
      const logContent = `[2023-08-09T10:30:00.123 GMT] INFO dw.system.Request - Request started
[2023-08-09T10:30:00.145 GMT] ERROR dw.catalog.ProductMgr - Product not found: ID-12345
    at ProductService.getProduct()
    at Controller.showPDP()
[2023-08-09T10:30:00.167 GMT] WARN dw.system.Cache - Cache miss for key: product-12345
[2023-08-09T10:30:00.189 GMT] ERROR dw.order.OrderMgr - Order creation failed: insufficient inventory
[2023-08-09T10:30:00.201 GMT] ERROR dw.catalog.ProductMgr - Product not found: ID-67890`;

      // Parse errors
      const errors = parseLogEntries(logContent, 'ERROR');
      expect(errors).toHaveLength(3);

      // Extract unique error patterns - there are actually 3 unique errors
      const uniqueErrors = extractUniqueErrors(errors);
      expect(uniqueErrors).toHaveLength(3);
      expect(uniqueErrors).toContain('Product not found: ID-12345');
      expect(uniqueErrors).toContain('Order creation failed: insufficient inventory');
      expect(uniqueErrors).toContain('Product not found: ID-67890');

      // Parse warnings
      const warnings = parseLogEntries(logContent, 'WARN');
      expect(warnings).toHaveLength(1);

      // Parse info
      const info = parseLogEntries(logContent, 'INFO');
      expect(info).toHaveLength(1);
    });

    it('should handle performance with large datasets', () => {
      // Test with larger datasets to ensure reasonable performance
      const largeLogContent = Array(1000).fill(0).map((_, i) =>
        `[2023-08-09T10:30:${String(i % 60).padStart(2, '0')}.123 GMT] ERROR Class${i % 10} - Error message ${i}`,
      ).join('\n');

      const start = Date.now();
      const errors = parseLogEntries(largeLogContent, 'ERROR');
      const uniqueErrors = extractUniqueErrors(errors);
      const duration = Date.now() - start;

      expect(errors).toHaveLength(1000);
      expect(uniqueErrors).toHaveLength(10); // Limited to 10 unique errors
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
