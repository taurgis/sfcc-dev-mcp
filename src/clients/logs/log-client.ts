/**
 * Main log client - lightweight orchestrator that composes specialized modules
 */

import { Logger } from '../../utils/logger.js';
import { getCurrentDate, normalizeFilePath } from '../../utils/utils.js';
import { WebDAVClientManager } from './webdav-client-manager.js';
import { LogFileReader } from './log-file-reader.js';
import { LogFileDiscovery } from './log-file-discovery.js';
import { LogProcessor } from './log-processor.js';
import { LogAnalyzer } from './log-analyzer.js';
import { LogFormatter } from './log-formatter.js';
import { LOG_CONSTANTS, LOG_MESSAGES, JOB_LOG_CONSTANTS } from './log-constants.js';
import type {
  LogLevel,
  LogSearchOptions,
  WebDAVClientConfig,
} from './log-types.js';

// Support for backward compatibility with SFCCConfig
interface SFCCConfig {
  hostname?: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
}

export class SFCCLogClient {
  private logger: Logger;
  private webdavManager: WebDAVClientManager;
  private fileReader: LogFileReader;
  private fileDiscovery: LogFileDiscovery;
  private processor: LogProcessor;
  private analyzer: LogAnalyzer;

  constructor(config: SFCCConfig | WebDAVClientConfig, logger?: Logger) {
    this.logger = logger ?? Logger.getChildLogger('LogClient');
    this.webdavManager = new WebDAVClientManager(this.logger);

    // Convert SFCCConfig to WebDAVClientConfig for backward compatibility
    const webdavConfig: WebDAVClientConfig = {
      hostname: config.hostname!,
      username: config.username,
      password: config.password,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    };

    // Setup WebDAV client and initialize modules
    const webdavClient = this.webdavManager.setupClient(webdavConfig);
    this.fileReader = new LogFileReader(webdavClient, this.logger);
    this.fileDiscovery = new LogFileDiscovery(webdavClient, this.logger);
    this.processor = new LogProcessor(this.logger);
    this.analyzer = new LogAnalyzer(this.logger);
  }

  private throwFormattedError(toolName: string, error: unknown): never {
    const errorMessage = LogFormatter.formatError(toolName, error);
    this.logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  /**
   * Get the latest log entries for a specific log level
   */
  async getLatestLogs(level: LogLevel, limit: number, date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    this.logger.methodEntry('getLatestLogs', { level, limit, date: targetDate });

    const startTime = Date.now();

    // Get and filter log files
    const levelFiles = await this.fileDiscovery.getLogFilesByLevel(level, targetDate);

    if (levelFiles.length === 0) {
      const allFiles = await this.fileDiscovery.getLogFiles(targetDate);
      const availableFiles = allFiles.map(f => normalizeFilePath(f.filename));
      const result = LogFormatter.formatNoFilesFound(level, targetDate, availableFiles);
      this.logger.warn(result);
      this.logger.methodExit('getLatestLogs', { result: 'no_files' });
      return result;
    }

    // Sort files by date (newest first)
    const sortedFiles = this.fileDiscovery.sortFilesByDate(levelFiles, true);

    // Read file contents
    const fileContents = await this.fileReader.readMultipleFiles(
      sortedFiles.map(f => f.filename),
      { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
    );

    // Process log entries
    const allLogEntries = await this.processor.processLogFiles(sortedFiles, level, fileContents);
    const sortedEntries = this.processor.sortAndLimitEntries(allLogEntries, limit);
    const latestEntries = this.processor.extractFormattedEntries(sortedEntries);

    // Format response
    const fileList = sortedFiles.map(f => normalizeFilePath(f.filename));
    const result = LogFormatter.formatLatestLogs(latestEntries, level, limit, fileList);

    this.logger.debug(LogFormatter.formatProcessingSummary(
      latestEntries.length,
      sortedFiles.length,
      allLogEntries.length,
    ));
    this.logger.timing('getLatestLogs', startTime);
    this.logger.methodExit('getLatestLogs', {
      entriesReturned: latestEntries.length,
      filesProcessed: sortedFiles.length,
    });

    return result;
  }

  /**
   * Get list of log files for a specific date (backward compatibility)
   */
  async getLogFiles(date?: string): Promise<Array<{ filename: string; lastmod: string }>> {
    const targetDate = date ?? getCurrentDate();
    this.logger.methodEntry('getLogFiles', { date: targetDate });

    const logFiles = await this.fileDiscovery.getLogFiles(targetDate);

    this.logger.methodExit('getLogFiles', { count: logFiles.length });
    return logFiles;
  }

  /**
   * Generate a comprehensive summary of logs for a specific date
   */
  async summarizeLogs(date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    this.logger.methodEntry('summarizeLogs', { date: targetDate });

    const logFiles = await this.fileDiscovery.getLogFiles(targetDate);

    if (logFiles.length === 0) {
      const result = `No log files found for date ${targetDate}`;
      this.logger.methodExit('summarizeLogs', { result: 'no_files' });
      return result;
    }

    // Read file contents
    const fileContents = await this.fileReader.readMultipleFiles(
      logFiles.map(f => f.filename),
      { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
    );

    // Analyze logs
    const summary = await this.analyzer.analyzeLogs(logFiles, fileContents, targetDate);
    const result = LogFormatter.formatLogSummary(summary);

    this.logger.methodExit('summarizeLogs', { filesAnalyzed: logFiles.length });
    return result;
  }

  /**
   * Search for specific patterns across log files
   */
  async searchLogs(options: LogSearchOptions): Promise<string>;
  async searchLogs(pattern: string, logLevel?: LogLevel, limit?: number, date?: string): Promise<string>;
  async searchLogs(
    optionsOrPattern: LogSearchOptions | string,
    logLevel?: LogLevel,
    limit: number = LOG_CONSTANTS.DEFAULT_SEARCH_LIMIT,
    date?: string,
  ): Promise<string> {
    // Handle both new options interface and legacy parameters
    const options: LogSearchOptions = typeof optionsOrPattern === 'string'
      ? {
        pattern: optionsOrPattern,
        logLevel,
        limit,
        date,
      }
      : optionsOrPattern;

    const { pattern, logLevel: level, limit: searchLimit, date: searchDate } = options;
    const targetDate = searchDate ?? getCurrentDate();
    this.logger.methodEntry('searchLogs', { pattern, logLevel: level, limit: searchLimit, date: targetDate });

    const logFiles = await this.fileDiscovery.getLogFiles(targetDate);

    // Filter by log level if specified
    const filesToSearch = level
      ? this.fileDiscovery.filterLogFiles(logFiles, { level })
      : logFiles;

    if (filesToSearch.length === 0) {
      const result = LOG_MESSAGES.NO_SEARCH_MATCHES(pattern, targetDate);
      this.logger.methodExit('searchLogs', { result: 'no_files' });
      return result;
    }

    // Read file contents
    const fileContents = await this.fileReader.readMultipleFiles(
      filesToSearch.map(f => f.filename),
      { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
    );

    // Search for patterns
    const matches = this.processor.processSearchResults(filesToSearch, fileContents, pattern, searchLimit);
    const result = LogFormatter.formatSearchResults(matches, pattern, targetDate);

    this.logger.methodExit('searchLogs', { matchesFound: matches.length });
    return result;
  }

  /**
   * List available log files with metadata
   */
  async listLogFiles(): Promise<string> {
    this.logger.methodEntry('listLogFiles');

    const startTime = Date.now();
    try {
      const files = await this.fileDiscovery.getAllLogFiles();
      const result = LogFormatter.formatLogFilesList(files);
      this.logger.methodExit('listLogFiles', { fileCount: files.length });
      return result;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.methodExit('listLogFiles', { error: true });
      throw new Error(`Failed to list log files: ${reason}`);
    } finally {
      const duration = Date.now() - startTime;
      this.logger.debug(`listLogFiles completed in ${duration}ms`);
    }
  }

  /**
   * Get the complete contents of a specific log file
   */
  async getLogFileContents(filename: string, maxBytes?: number, tailOnly?: boolean): Promise<string> {
    this.logger.methodEntry('getLogFileContents', { filename, maxBytes, tailOnly });

    const startTime = Date.now();
    try {
      // Use tailOnly flag to determine reading strategy
      if (tailOnly) {
        const content = await this.fileReader.getFileContentsTail(filename, {
          maxBytes: maxBytes ?? LOG_CONSTANTS.DEFAULT_TAIL_BYTES,
        });
        const result = this.formatLogFileContents(filename, content, true);
        this.logger.methodExit('getLogFileContents', { tailOnly: true });
        return result;
      } else {
        // Read full file from beginning with optional size limit
        const content = await this.fileReader.getFileContentsHead(filename, maxBytes);
        const result = this.formatLogFileContents(filename, content, false);
        this.logger.methodExit('getLogFileContents', { tailOnly: false });
        return result;
      }
    } catch (error) {
      this.logger.methodExit('getLogFileContents', { error: true });
      this.throwFormattedError('get_log_file_contents', error);
    } finally {
      const duration = Date.now() - startTime;
      this.logger.debug(`getLogFileContents completed in ${duration}ms`);
    }
  }

  /**
   * Format log file contents for display
   */
  private formatLogFileContents(filename: string, content: string, isTailOnly: boolean): string {
    const lines = content.split('\n').filter(line => line.trim());
    const readType = isTailOnly ? 'tail' : 'full';

    return `# Log File Contents: ${filename} (${readType} read)

Total lines: ${lines.length}
Content size: ${content.length} bytes

---

${content}`;
  }

  /**
   * Get advanced log analysis with patterns and recommendations
   */
  async getAdvancedAnalysis(date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    this.logger.methodEntry('getAdvancedAnalysis', { date: targetDate });

    const logFiles = await this.fileDiscovery.getLogFiles(targetDate);

    if (logFiles.length === 0) {
      return `No log files found for date ${targetDate}`;
    }

    // Read file contents
    const fileContents = await this.fileReader.readMultipleFiles(
      logFiles.map(f => f.filename),
      { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
    );

    // Perform comprehensive analysis
    const summary = await this.analyzer.analyzeLogs(logFiles, fileContents, targetDate);

    // Parse entries for pattern detection
    const allEntries = Array.from(fileContents.values())
      .flatMap(content => content.split('\n'))
      .filter(line => line.trim())
      .map(line => this.processor.parseLogEntry(line));

    const patterns = this.analyzer.detectPatterns(allEntries);
    const healthScore = this.analyzer.calculateHealthScore(summary);
    const recommendations = this.analyzer.generateRecommendations(summary, patterns);

    const result = this.analyzer.formatAnalysisResults(summary, patterns, healthScore, recommendations);

    this.logger.methodExit('getAdvancedAnalysis', {
      filesAnalyzed: logFiles.length,
      entriesProcessed: allEntries.length,
    });

    return result;
  }

  /**
   * Test WebDAV connection
   */
  async testConnection(): Promise<boolean> {
    return await this.webdavManager.testConnection();
  }

  /**
   * Get log statistics for a date range
   */
  async getLogStats(date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    const stats = await this.fileDiscovery.getLogFileStats(targetDate);

    const sections = [
      `Log Statistics for ${targetDate}:`,
      '',
      '📊 Overview:',
      `- Total Files: ${stats.totalFiles}`,
      `- Files by Level: ${LogFormatter.formatLogLevelStats(stats.filesByLevel)}`,
      '',
      '📁 File Info:',
      `- Newest: ${stats.newestFile ?? 'N/A'}`,
      `- Oldest: ${stats.oldestFile ?? 'N/A'}`,
    ];

    return sections.join('\n');
  }

  /**
   * Get latest job log files
   */
  async getLatestJobLogFiles(limit?: number): Promise<string> {
    this.logger.methodEntry('getLatestJobLogFiles', { limit });

    try {
      const jobLogs = await this.fileDiscovery.getLatestJobLogFiles(limit);
      const result = LogFormatter.formatJobLogList(jobLogs);
      this.logger.methodExit('getLatestJobLogFiles', { count: jobLogs.length });
      return result;
    } catch (error) {
      this.logger.methodExit('getLatestJobLogFiles', { error: true });
      this.throwFormattedError('get_latest_job_log_files', error);
    }
  }

  /**
   * Search job logs by job name
   */
  async searchJobLogsByName(jobName: string, limit?: number): Promise<string> {
    this.logger.methodEntry('searchJobLogsByName', { jobName, limit });

    try {
      const jobLogs = await this.fileDiscovery.searchJobLogsByName(jobName, limit);
      const result = LogFormatter.formatJobLogList(jobLogs);
      this.logger.methodExit('searchJobLogsByName', { count: jobLogs.length });
      return result;
    } catch (error) {
      this.logger.methodExit('searchJobLogsByName', { error: true });
      this.throwFormattedError('search_job_logs_by_name', error);
    }
  }

  /**
   * Get job log entries for a specific log level or all levels
   */
  async getJobLogEntries(
    level: LogLevel | 'all' = 'all',
    limit: number = JOB_LOG_CONSTANTS.DEFAULT_JOB_LOG_LIMIT,
    jobName?: string,
  ): Promise<string> {
    this.logger.methodEntry('getJobLogEntries', { level, limit, jobName });

    try {
      // Get job logs based on filter
      const jobLogs = jobName
        ? await this.fileDiscovery.searchJobLogsByName(jobName, limit)
        : await this.fileDiscovery.getLatestJobLogFiles(limit);

      if (jobLogs.length === 0) {
        const result = jobName
          ? `No job logs found for job name: ${jobName}`
          : 'No job logs found';
        this.logger.methodExit('getJobLogEntries', { result: 'no_logs' });
        return result;
      }

      // Read job log contents
      const fileContents = await this.fileReader.readMultipleFiles(
        jobLogs.map(job => job.logFile),
        { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
      );

      // Process job log entries
      const jobLogEntries = await this.processor.processJobLogFiles(jobLogs, level, fileContents);
      const sortedEntries = this.processor.sortAndLimitEntries(jobLogEntries, limit);
      const latestEntries = this.processor.extractFormattedEntries(sortedEntries);

      // Format response
      const jobContext = jobName ? `job: ${jobName}` : 'latest jobs';
      const result = LogFormatter.formatJobLogEntries(latestEntries, level, limit, jobContext);

      this.logger.methodExit('getJobLogEntries', {
        entriesReturned: latestEntries.length,
        jobLogsProcessed: jobLogs.length,
      });

      return result;
    } catch (error) {
      this.logger.methodExit('getJobLogEntries', { error: true });
      this.throwFormattedError('get_job_log_entries', error);
    }
  }

  /**
   * Search for patterns in job logs
   */
  async searchJobLogs(
    pattern: string,
    level?: LogLevel | 'all',
    limit: number = LOG_CONSTANTS.DEFAULT_SEARCH_LIMIT,
    jobName?: string,
  ): Promise<string> {
    this.logger.methodEntry('searchJobLogs', { pattern, level, limit, jobName });

    try {
      // Get job logs based on filter
      const jobLogs = jobName
        ? await this.fileDiscovery.searchJobLogsByName(jobName)
        : await this.fileDiscovery.getLatestJobLogFiles();

      if (jobLogs.length === 0) {
        const result = jobName
          ? `No job logs found for job name: ${jobName}`
          : 'No job logs found';
        this.logger.methodExit('searchJobLogs', { result: 'no_logs' });
        return result;
      }

      // Read job log contents
      const fileContents = await this.fileReader.readMultipleFiles(
        jobLogs.map(job => job.logFile),
        { maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES },
      );

      // Search for patterns in job logs
      const matches: string[] = [];
      for (const jobLog of jobLogs) {
        const content = fileContents.get(jobLog.logFile);
        if (!content) {
          continue;
        }

        const lines = content.split('\n');
        for (const line of lines) {
          if (line.toLowerCase().includes(pattern.toLowerCase()) && matches.length < limit) {
            // Filter by level if specified
            if (level && level !== 'all') {
              const levelUpper = level.toUpperCase();
              if (!line.includes(` ${levelUpper} `)) {
                continue;
              }
            }
            matches.push(`[${jobLog.jobName}] ${line.trim()}`);
          }
        }
      }

      const jobContext = jobName ? `job: ${jobName}` : 'job logs';
      const result = LogFormatter.formatJobSearchResults(matches, pattern, jobContext);

      this.logger.methodExit('searchJobLogs', { matchesFound: matches.length });
      return result;
    } catch (error) {
      this.logger.methodExit('searchJobLogs', { error: true });
      this.throwFormattedError('search_job_logs', error);
    }
  }

  /**
   * Get job execution summary for a specific job
   */
  async getJobExecutionSummary(jobName: string): Promise<string> {
    this.logger.methodEntry('getJobExecutionSummary', { jobName });

    try {
      const jobLogs = await this.fileDiscovery.searchJobLogsByName(jobName, 1);

      if (jobLogs.length === 0) {
        const result = `No job logs found for job name: ${jobName}`;
        this.logger.methodExit('getJobExecutionSummary', { result: 'no_logs' });
        return result;
      }

      const latestJobLog = jobLogs[0];
      const content = await this.fileReader.getFileContentsTail(latestJobLog.logFile, {
        maxBytes: LOG_CONSTANTS.DEFAULT_TAIL_BYTES,
      });

      const summary = this.processor.extractJobExecutionSummary(content);
      const result = LogFormatter.formatJobExecutionSummary(summary, jobName);

      this.logger.methodExit('getJobExecutionSummary', { jobLog: latestJobLog.logFile });
      return result;
    } catch (error) {
      this.logger.methodExit('getJobExecutionSummary', { error: true });
      this.throwFormattedError('get_job_execution_summary', error);
    }
  }
}
