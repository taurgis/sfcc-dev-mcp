/**
 * Log file discovery, filtering, and metadata operations
 */

import type { WebDAVClient } from 'webdav';
import { Logger } from '../../utils/logger.js';
import { getCurrentDate, normalizeFilePath } from '../../utils/utils.js';
import { LOG_CONSTANTS, LOG_FILE_PATTERNS } from './log-constants.js';
import type { LogFileMetadata, LogFileInfo, LogLevel, LogFileFilter } from './log-types.js';

export class LogFileDiscovery {
  private logger: Logger;
  private webdavClient: WebDAVClient;

  constructor(webdavClient: WebDAVClient, logger: Logger) {
    this.webdavClient = webdavClient;
    this.logger = logger;
  }

  /**
   * Get list of log files for a specific date
   */
  async getLogFiles(date?: string): Promise<LogFileMetadata[]> {
    const targetDate = date ?? getCurrentDate();
    this.logger.methodEntry('getLogFiles', { date: targetDate });

    const startTime = Date.now();
    const contents = await this.webdavClient.getDirectoryContents('/');
    this.logger.timing('webdav_getDirectoryContents', startTime);

    const logFiles = (contents as any[])
      .filter((item: any) =>
        item.type === 'file' &&
        item.filename.includes(targetDate) &&
        item.filename.endsWith('.log'),
      )
      .map((item: any) => ({
        filename: item.filename,
        lastmod: item.lastmod ?? new Date().toISOString(), // Fallback to current time if no lastmod
      }));

    this.logger.debug(`Found ${logFiles.length} log files for date ${targetDate}:`, logFiles.map((f: LogFileMetadata) => f.filename));
    this.logger.methodExit('getLogFiles', { count: logFiles.length });
    return logFiles;
  }

  /**
   * Filter log files by level and other criteria
   */
  filterLogFiles(files: LogFileMetadata[], filter: LogFileFilter): LogFileMetadata[] {
    if (!filter.level) {
      return files;
    }

    const { level, includeCustom = true } = filter;

    return files.filter(file => {
      const filename = normalizeFilePath(file.filename);
      const standardPattern = LOG_FILE_PATTERNS.STANDARD(level);
      const customPattern = LOG_FILE_PATTERNS.CUSTOM(level);

      if (filename.startsWith(standardPattern)) {
        return true;
      }

      if (includeCustom && filename.startsWith(customPattern)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Get log files filtered by level with detailed logging
   */
  async getLogFilesByLevel(level: LogLevel, date?: string): Promise<LogFileMetadata[]> {
    const targetDate = date ?? getCurrentDate();
    const allFiles = await this.getLogFiles(targetDate);

    const filteredFiles = this.filterLogFiles(allFiles, { level, includeCustom: true });

    this.logger.debug(`Filtered to ${filteredFiles.length} ${level} log files (including custom logs):`,
      filteredFiles.map(f => f.filename));

    return filteredFiles;
  }

  /**
   * Sort log files by modification date
   */
  sortFilesByDate(files: LogFileMetadata[], descending = true): LogFileMetadata[] {
    return files.sort((a, b) => {
      const dateA = new Date(a.lastmod).getTime();
      const dateB = new Date(b.lastmod).getTime();
      return descending ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Get all available log files with detailed metadata
   */
  async getAllLogFiles(): Promise<LogFileInfo[]> {
    try {
      const contents = await this.webdavClient.getDirectoryContents('/');
      const allLogFiles = (contents as any[])
        .filter((item: any) => item.type === 'file' && item.filename.endsWith('.log'));

      const logFiles: LogFileInfo[] = allLogFiles
        .map((item: any) => ({
          name: item.filename,
          size: item.size,
          lastModified: item.lastmod,
        }))
        // Sort by lastModified date in descending order (newest first)
        .sort((a: LogFileInfo, b: LogFileInfo) => {
          const dateA = new Date(a.lastModified).getTime();
          const dateB = new Date(b.lastModified).getTime();
          return dateB - dateA;
        })
        // Limit to 50 most recent files
        .slice(0, LOG_CONSTANTS.MAX_LOG_FILES_DISPLAY);

      // Store total count for formatting
      (logFiles as any).totalCount = allLogFiles.length;

      return logFiles;
    } catch (error) {
      throw new Error(`Failed to list log files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get unique log levels available for a specific date
   */
  async getAvailableLogLevels(date?: string): Promise<LogLevel[]> {
    const files = await this.getLogFiles(date);
    const levels = new Set<LogLevel>();

    for (const file of files) {
      const filename = normalizeFilePath(file.filename);

      for (const level of LOG_CONSTANTS.LOG_LEVELS) {
        if (filename.startsWith(LOG_FILE_PATTERNS.STANDARD(level)) ||
            filename.startsWith(LOG_FILE_PATTERNS.CUSTOM(level))) {
          levels.add(level);
        }
      }
    }

    return Array.from(levels);
  }

  /**
   * Get log file statistics for a date
   */
  async getLogFileStats(date?: string): Promise<{
    totalFiles: number;
    filesByLevel: Record<LogLevel, number>;
    totalSize: number;
    oldestFile?: string;
    newestFile?: string;
  }> {
    const files = await this.getLogFiles(date);
    const sortedFiles = this.sortFilesByDate(files, true);

    const stats = {
      totalFiles: files.length,
      filesByLevel: {} as Record<LogLevel, number>,
      totalSize: 0,
      oldestFile: sortedFiles[sortedFiles.length - 1]?.filename,
      newestFile: sortedFiles[0]?.filename,
    };

    // Initialize level counts
    for (const level of LOG_CONSTANTS.LOG_LEVELS) {
      stats.filesByLevel[level] = 0;
    }

    // Count files by level
    for (const file of files) {
      for (const level of LOG_CONSTANTS.LOG_LEVELS) {
        const filteredFiles = this.filterLogFiles([file], { level });
        if (filteredFiles.length > 0) {
          stats.filesByLevel[level]++;
        }
      }
    }

    return stats;
  }
}
