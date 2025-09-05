/**
 * Log file discovery, filtering, and metadata operations
 */

import type { WebDAVClient } from 'webdav';
import { Logger } from '../../utils/logger.js';
import { getCurrentDate, normalizeFilePath } from '../../utils/utils.js';
import { LOG_CONSTANTS, LOG_FILE_PATTERNS, JOB_LOG_CONSTANTS } from './log-constants.js';
import type { LogFileMetadata, LogFileInfo, LogLevel, LogFileFilter, JobLogInfo, JobLogFilter } from './log-types.js';

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

  /**
   * Get job log files from the /jobs/ folder structure
   */
  async getJobLogFiles(filter?: JobLogFilter): Promise<JobLogInfo[]> {
    this.logger.methodEntry('getJobLogFiles', filter);

    try {
      // List all directories in the jobs folder
      const jobsContents = await this.webdavClient.getDirectoryContents(JOB_LOG_CONSTANTS.JOBS_FOLDER);

      const jobDirs = (jobsContents as any[])
        .filter((item: any) => item.type === 'directory')
        .map((item: any) => ({
          name: item.filename.replace(JOB_LOG_CONSTANTS.JOBS_FOLDER, ''),
          path: item.filename,
          lastModified: item.lastmod ?? new Date().toISOString(),
        }));

      this.logger.debug(`Found ${jobDirs.length} job directories`);

      const jobLogInfos: JobLogInfo[] = [];

      // Process each job directory to find log files
      for (const jobDir of jobDirs) {
        try {
          const jobContents = await this.webdavClient.getDirectoryContents(jobDir.path);
          const logFiles = (jobContents as any[])
            .filter((item: any) =>
              item.type === 'file' &&
              JOB_LOG_CONSTANTS.JOB_LOG_PATTERN.test(item.filename.split('/').pop() ?? ''),
            );

          for (const logFile of logFiles) {
            const fileName = logFile.filename.split('/').pop() ?? '';
            jobLogInfos.push({
              jobName: decodeURIComponent(jobDir.name),
              jobId: this.extractJobIdFromFilename(fileName),
              logFile: logFile.filename,
              lastModified: logFile.lastmod ?? jobDir.lastModified,
              size: logFile.size,
            });
          }
        } catch (error) {
          this.logger.warn(`Failed to read job directory ${jobDir.name}: ${error}`);
        }
      }

      // Apply filtering
      let filteredLogs = jobLogInfos;

      if (filter?.jobName) {
        const searchName = filter.jobName.toLowerCase();
        filteredLogs = filteredLogs.filter(log =>
          log.jobName.toLowerCase().includes(searchName),
        );
      }

      // Sort by most recent first if requested (default behavior)
      if (filter?.sortByRecent !== false) {
        filteredLogs.sort((a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
        );
      }

      // Apply limit
      if (filter?.limit) {
        filteredLogs = filteredLogs.slice(0, filter.limit);
      }

      this.logger.methodExit('getJobLogFiles', { count: filteredLogs.length });
      return filteredLogs;

    } catch (error) {
      this.logger.error(`Failed to get job log files: ${error}`);
      throw new Error(`Failed to access job logs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the latest job log files, sorted by modification date
   */
  async getLatestJobLogFiles(limit?: number): Promise<JobLogInfo[]> {
    return this.getJobLogFiles({
      limit: limit ?? JOB_LOG_CONSTANTS.DEFAULT_JOB_LOG_LIMIT,
      sortByRecent: true,
    });
  }

  /**
   * Search for job logs by job name
   */
  async searchJobLogsByName(jobName: string, limit?: number): Promise<JobLogInfo[]> {
    return this.getJobLogFiles({
      jobName,
      limit: limit ?? JOB_LOG_CONSTANTS.DEFAULT_JOB_LOG_LIMIT,
      sortByRecent: true,
    });
  }

  /**
   * Extract job ID from filename (Job-JobName-ID.log format)
   */
  private extractJobIdFromFilename(filename: string): string {
    const match = filename.match(/Job-.+-([^.]+)\.log$/);
    return match ? match[1] : 'unknown';
  }
}
