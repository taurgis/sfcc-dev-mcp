/**
 * SFCC WebDAV Log Client
 *
 * This module handles all interactions with SFCC's WebDAV log interface.
 * It provides methods to fetch, parse, and analyze log files from the
 * Salesforce B2C Commerce Cloud logging system.
 */

import { createClient } from 'webdav';
import { SFCCConfig, LogLevel, LogFileInfo, LogSummary } from '../types/types.js';
import {
  getCurrentDate,
  formatBytes,
  parseLogEntries,
  extractUniqueErrors,
  normalizeFilePath,
} from '../utils/utils.js';
import { Logger } from '../utils/logger.js';

// Create a logger instance for this module
const logger = new Logger('LogClient');

/**
 * Client for accessing SFCC logs via WebDAV
 *
 * This class encapsulates all the logic for connecting to SFCC's WebDAV interface
 * and performing various log-related operations like fetching, searching, and analyzing logs.
 */
export class SFCCLogClient {
  private webdavClient: any;
  private config: SFCCConfig;

  /**
   * Initialize the SFCC log client
   *
   * @param config - SFCC configuration with authentication details
   */
  constructor(config: SFCCConfig) {
    this.config = config;
    this.setupWebDAVClient();
  }

  /**
   * Set up the WebDAV client with appropriate authentication
   * Supports both basic authentication and OAuth credentials
   *
   * @private
   */
  private setupWebDAVClient(): void {
    const webdavUrl = `https://${this.config.hostname}/on/demandware.servlet/webdav/Sites/Logs/`;

    let authConfig: any = {};

    if (this.config.username && this.config.password) {
      // Basic authentication
      authConfig = {
        username: this.config.username,
        password: this.config.password,
      };
    } else if (this.config.clientId && this.config.clientSecret) {
      // OAuth authentication (using client ID as username and client secret as password for WebDAV)
      authConfig = {
        username: this.config.clientId,
        password: this.config.clientSecret,
      };
    } else {
      throw new Error('Either username/password or clientId/clientSecret must be provided');
    }

    this.webdavClient = createClient(webdavUrl, authConfig);
  }

  /**
   * Get list of log files for a specific date
   *
   * @param date - Date in YYYYMMDD format (defaults to today)
   * @returns Array of log file names for the specified date
   */
  async getLogFiles(date?: string): Promise<string[]> {
    const targetDate = date ?? getCurrentDate();
    logger.methodEntry('getLogFiles', { date: targetDate });

    const startTime = Date.now();
    const contents = await this.webdavClient.getDirectoryContents('/');
    logger.timing('webdav_getDirectoryContents', startTime);

    const logFiles = contents
      .filter((item: any) =>
        item.type === 'file' &&
        item.filename.includes(targetDate) &&
        item.filename.endsWith('.log'),
      )
      .map((item: any) => item.filename);

    logger.debug(`Found ${logFiles.length} log files for date ${targetDate}:`, logFiles);
    logger.methodExit('getLogFiles', { count: logFiles.length });
    return logFiles;
  }

  /**
   * Get the latest log entries for a specific log level
   *
   * @param level - Log level to fetch (error, warn, info, debug)
   * @param limit - Maximum number of entries to return
   * @param date - Date in YYYYMMDD format (defaults to today)
   * @returns Formatted log entries
   */
  async getLatestLogs(level: LogLevel, limit: number, date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    logger.methodEntry('getLatestLogs', { level, limit, date: targetDate });

    const startTime = Date.now();
    const logFiles = await this.getLogFiles(targetDate);

    // Filter files for the specific log level, including both standard and custom logs
    const levelFiles = logFiles.filter(file => {
      const filename = normalizeFilePath(file);
      // Match both standard format (e.g., "warn-") and custom format (e.g., "customwarn-")
      return filename.startsWith(`${level}-`) || filename.startsWith(`custom${level}-`);
    });

    logger.debug(`Filtered to ${levelFiles.length} ${level} log files (including custom logs):`, levelFiles);

    if (levelFiles.length === 0) {
      const availableFiles = logFiles.map(f => normalizeFilePath(f)).join(', ');
      const result = `No ${level} log files found for date ${targetDate}. Available files: ${availableFiles}`;
      logger.warn(result);
      logger.methodExit('getLatestLogs', { result: 'no_files' });
      return result;
    }

    // Sort files in reverse chronological order (newest first) for processing
    const sortedFiles = levelFiles.sort().reverse();

    // Process files from newest to oldest and collect entries with timestamps
    const allLogEntries: Array<{ entry: string; filename: string; order: number }> = [];

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      logger.debug(`Processing file: ${file} (priority: ${i})`);

      try {
        const fileStartTime = Date.now();
        const logContent = await this.webdavClient.getFileContents(file, { format: 'text' });
        logger.timing(`webdav_getFileContents_${file}`, fileStartTime);

        const logEntries = parseLogEntries(logContent as string, level.toUpperCase());

        // Add entries with file priority (lower index = newer file = higher priority)
        logEntries.forEach((entry, entryIndex) => {
          allLogEntries.push({
            entry: `[${normalizeFilePath(file)}] ${entry}`,
            filename: normalizeFilePath(file),
            order: i * 1000000 + entryIndex, // File priority + entry order within file
          });
        });
      } catch (error) {
        logger.error(`Error reading file ${file}:`, error);
        // Continue processing other files even if one fails
      }
    }

    // Sort all entries by order (newest files first, then by entry order within each file)
    // Then take the most recent entries and reverse to show newest at top
    const sortedEntries = allLogEntries
      .sort((a, b) => a.order - b.order) // Ascending order (newest files have lower order values)
      .slice(-limit) // Take the last N entries (most recent)
      .reverse(); // Reverse to show newest entries at the top

    const latestEntries = sortedEntries.map(item => item.entry);

    logger.debug(`Parsed ${allLogEntries.length} total entries from ${sortedFiles.length} files, returning latest ${latestEntries.length}`);
    logger.timing('getLatestLogs', startTime);
    logger.methodExit('getLatestLogs', { entriesReturned: latestEntries.length, filesProcessed: sortedFiles.length });

    const fileList = sortedFiles.map(f => normalizeFilePath(f)).join(', ');
    return `Latest ${limit} ${level} messages from files: ${fileList}\n\n${latestEntries.join('\n\n---\n\n')}`;
  }

  /**
   * Generate a comprehensive summary of logs for a specific date
   *
   * @param date - Date in YYYYMMDD format (defaults to today)
   * @returns Detailed log summary with counts and key issues
   */
  async summarizeLogs(date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    const logFiles = await this.getLogFiles(targetDate);

    if (logFiles.length === 0) {
      return `No log files found for date ${targetDate}`;
    }

    const summary: LogSummary = {
      date: targetDate,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
      keyIssues: [],
      files: logFiles,
    };

    // Analyze each log file for counts and patterns
    for (const file of logFiles) {
      try {
        const content = await this.webdavClient.getFileContents(file, { format: 'text' });
        const lines = (content as string).split('\n');

        // Count different log levels
        for (const line of lines) {
          if (line.includes(' ERROR ')) {summary.errorCount++;}
          if (line.includes(' WARN ')) {summary.warningCount++;}
          if (line.includes(' INFO ')) {summary.infoCount++;}
          if (line.includes(' DEBUG ')) {summary.debugCount++;}
        }

        // Extract key error patterns from error files
        const filename = normalizeFilePath(file);
        if (filename.startsWith('error-')) {
          const errors = parseLogEntries(content as string, 'ERROR');
          const uniqueErrors = extractUniqueErrors(errors);
          summary.keyIssues.push(...uniqueErrors);
        }
      } catch (error) {
        logger.error(`Error reading file ${file}:`, error);
      }
    }

    // Remove duplicate key issues
    summary.keyIssues = [...new Set(summary.keyIssues)];

    return this.formatLogSummary(summary);
  }

  /**
   * Search for specific patterns across log files
   *
   * @param pattern - Search pattern or keyword
   * @param logLevel - Optional log level to restrict search to
   * @param limit - Maximum number of matches to return
   * @param date - Date in YYYYMMDD format (defaults to today)
   * @returns Formatted search results
   */
  async searchLogs(pattern: string, logLevel?: LogLevel, limit: number = 20, date?: string): Promise<string> {
    const targetDate = date ?? getCurrentDate();
    const logFiles = await this.getLogFiles(targetDate);

    let filesToSearch = logFiles;
    if (logLevel) {
      filesToSearch = logFiles.filter(file => {
        const filename = normalizeFilePath(file);
        // Include both standard format (e.g., "warn-") and custom format (e.g., "customwarn-")
        return filename.startsWith(`${logLevel}-`) || filename.startsWith(`custom${logLevel}-`);
      });
    }

    const matchingEntries: string[] = [];

    for (const file of filesToSearch) {
      try {
        const content = await this.webdavClient.getFileContents(file, { format: 'text' });
        const lines = (content as string).split('\n');

        for (const line of lines) {
          if (line.toLowerCase().includes(pattern.toLowerCase()) && matchingEntries.length < limit) {
            matchingEntries.push(`[${normalizeFilePath(file)}] ${line.trim()}`);
          }
        }
      } catch (error) {
        logger.error(`Error searching file ${file}:`, error);
      }
    }

    return matchingEntries.length > 0
      ? `Found ${matchingEntries.length} matches for "${pattern}":\n\n${matchingEntries.join('\n\n')}`
      : `No matches found for "${pattern}" in logs for ${targetDate}`;
  }

  /**
   * List all available log files with metadata
   *
   * @returns Formatted list of log files with size and modification dates (latest 50 files)
   */
  async listLogFiles(): Promise<string> {
    try {
      const contents = await this.webdavClient.getDirectoryContents('/');
      const logFiles: LogFileInfo[] = contents
        .filter((item: any) => item.type === 'file' && item.filename.endsWith('.log'))
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
        .slice(0, 50);

      const totalFiles = contents.filter((item: any) => item.type === 'file' && item.filename.endsWith('.log')).length;
      const showingText = totalFiles > 50 ? ` (showing latest 50 of ${totalFiles} total)` : '';

      return `Available log files${showingText}:\n\n${logFiles.map((file: LogFileInfo) =>
        `📄 ${file.name}\n   Size: ${formatBytes(file.size)}\n   Modified: ${file.lastModified}`,
      ).join('\n\n')}`;
    } catch (error) {
      throw new Error(`Failed to list log files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Format a log summary into a readable string
   *
   * @param summary - Log summary data
   * @returns Formatted summary string
   * @private
   */
  private formatLogSummary(summary: LogSummary): string {
    return `Log Summary for ${summary.date}:\n\n` +
           '📊 Counts:\n' +
           `- Errors: ${summary.errorCount}\n` +
           `- Warnings: ${summary.warningCount}\n` +
           `- Info: ${summary.infoCount}\n` +
           `- Debug: ${summary.debugCount}\n\n` +
           `📁 Log Files (${summary.files.length}):\n` +
           `${summary.files.map((f: string) => `- ${f}`).join('\n')}\n\n` +
           '🔥 Key Issues:\n' +
           `${summary.keyIssues.length > 0 ? summary.keyIssues.map((issue: string) => `- ${issue}`).join('\n') : 'No major issues detected'}`;
  }
}
