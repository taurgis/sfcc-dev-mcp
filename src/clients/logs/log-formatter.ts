/**
 * Output formatting and presentation logic for logs
 */

import { formatBytes } from '../../utils/utils.js';
import { LOG_CONSTANTS, LOG_MESSAGES } from './log-constants.js';
import type { LogSummary, LogFileInfo, LogLevel, JobLogInfo } from './log-types.js';

export class LogFormatter {
  /**
   * Format latest log entries response
   */
  static formatLatestLogs(
    entries: string[],
    level: LogLevel,
    limit: number,
    files: string[],
  ): string {
    const fileList = files.join(', ');
    return `Latest ${limit} ${level} messages from files: ${fileList}\n\n${entries.join('\n\n---\n\n')}`;
  }

  /**
   * Format search results
   */
  static formatSearchResults(
    matches: string[],
    pattern: string,
    date: string,
  ): string {
    if (matches.length === 0) {
      return LOG_MESSAGES.NO_SEARCH_MATCHES(pattern, date);
    }

    return `${LOG_MESSAGES.SEARCH_RESULTS(matches.length, pattern)}\n\n${matches.join('\n\n')}`;
  }

  /**
   * Format "no files found" message
   */
  static formatNoFilesFound(
    level: LogLevel,
    date: string,
    availableFiles: string[],
  ): string {
    const available = availableFiles.join(', ');
    return LOG_MESSAGES.NO_FILES_FOUND(level, date, available);
  }

  /**
   * Format log summary into a readable string
   */
  static formatLogSummary(summary: LogSummary): string {
    const keyIssuesSection = summary.keyIssues.length > 0
      ? summary.keyIssues.map((issue: string) => `- ${issue}`).join('\n')
      : 'No major issues detected';

    return [
      `Log Summary for ${summary.date}:`,
      '',
      '📊 Counts:',
      `- Errors: ${summary.errorCount}`,
      `- Warnings: ${summary.warningCount}`,
      `- Info: ${summary.infoCount}`,
      `- Debug: ${summary.debugCount}`,
      '',
      `📁 Log Files (${summary.files.length}):`,
      summary.files.map((f: string) => `- ${f}`).join('\n'),
      '',
      '🔥 Key Issues:',
      keyIssuesSection,
    ].join('\n');
  }

  /**
   * Format log files list with metadata
   */
  static formatLogFilesList(logFiles: LogFileInfo[]): string {
    const totalFiles = (logFiles as any).totalCount ?? logFiles.length;
    const showingText = totalFiles > LOG_CONSTANTS.MAX_LOG_FILES_DISPLAY
      ? ` (showing latest ${LOG_CONSTANTS.MAX_LOG_FILES_DISPLAY} of ${totalFiles} total)`
      : '';

    return `Available log files${showingText}:\n\n${logFiles.map((file: LogFileInfo) =>
      `📄 ${file.name}\n   Size: ${formatBytes(file.size)}\n   Modified: ${file.lastModified}`,
    ).join('\n\n')}`;
  }

  /**
   * Format file processing summary
   */
  static formatProcessingSummary(
    entriesReturned: number,
    filesProcessed: number,
    totalEntries: number,
  ): string {
    return `Parsed ${totalEntries} total entries from ${filesProcessed} files, returning latest ${entriesReturned}`;
  }

  /**
   * Format log level statistics
   */
  static formatLogLevelStats(stats: Record<LogLevel, number>): string {
    const entries = Object.entries(stats) as Array<[LogLevel, number]>;
    return entries
      .map(([level, count]) => `${level}: ${count}`)
      .join(', ');
  }

  /**
   * Format error message with context
   */
  static formatError(operation: string, error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return `Failed to ${operation}: ${message}`;
  }

  /**
   * Format file list for debugging
   */
  static formatFileList(files: string[], prefix = ''): string {
    return files.map(f => `${prefix}${f}`).join(', ');
  }

  /**
   * Format timestamp for display
   */
  static formatTimestamp(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Format log entry with timestamp and level highlighting
   */
  static formatLogEntry(entry: string, highlightLevel = false): string {
    if (!highlightLevel) {
      return entry;
    }

    return entry
      .replace(/ ERROR /g, ' 🔴 ERROR ')
      .replace(/ WARN /g, ' 🟡 WARN ')
      .replace(/ INFO /g, ' 🔵 INFO ')
      .replace(/ DEBUG /g, ' 🟢 DEBUG ');
  }

  /**
   * Format progress indicator
   */
  static formatProgress(current: number, total: number, operation: string): string {
    const percentage = Math.round((current / total) * 100);
    return `${operation}: ${current}/${total} (${percentage}%)`;
  }

  /**
   * Format file size summary
   */
  static formatFileSizes(files: Array<{ name: string; size: number }>): string {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const avgSize = totalSize / files.length;

    return `Total: ${formatBytes(totalSize)}, Average: ${formatBytes(avgSize)}, Files: ${files.length}`;
  }

  /**
   * Truncate long text with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength - 3)}...`;
  }

  /**
   * Format job log list
   */
  static formatJobLogList(jobLogs: JobLogInfo[]): string {
    if (jobLogs.length === 0) {
      return 'No job logs found.';
    }

    return `Found ${jobLogs.length} job logs:\n\n${jobLogs.map((jobLog: JobLogInfo) => {
      const baseInfo = `🔧 Job: ${jobLog.jobName}\n   ID: ${jobLog.jobId}\n   File: ${jobLog.logFile.split('/').pop()}\n   Modified: ${jobLog.lastModified}`;
      const sizeInfo = jobLog.size ? `\n   Size: ${formatBytes(jobLog.size)}` : '';
      return baseInfo + sizeInfo;
    }).join('\n\n')}`;
  }

  /**
   * Format job log entries with job context
   */
  static formatJobLogEntries(
    entries: string[],
    level: LogLevel | 'all',
    limit: number,
    jobContext?: string,
  ): string {
    const levelDisplay = level === 'all' ? 'all levels' : level;
    const contextText = jobContext ? ` from ${jobContext}` : '';

    return `Latest ${limit} ${levelDisplay} messages${contextText}:\n\n${entries.join('\n\n---\n\n')}`;
  }

  /**
   * Format job execution summary
   */
  static formatJobExecutionSummary(summary: {
    startTime?: string;
    endTime?: string;
    status?: string;
    duration?: string;
    errorCount: number;
    warningCount: number;
    steps: string[];
  }, jobName: string): string {
    const sections = [
      `Job Execution Summary: ${jobName}`,
      '',
      '⏱️ Timing:',
      `- Start: ${summary.startTime ?? 'Unknown'}`,
      `- End: ${summary.endTime ?? 'Unknown'}`,
      `- Duration: ${summary.duration ?? 'Unknown'}`,
      '',
      '📊 Status:',
      `- Status: ${summary.status ?? 'Unknown'}`,
      `- Errors: ${summary.errorCount}`,
      `- Warnings: ${summary.warningCount}`,
    ];

    if (summary.steps.length > 0) {
      sections.push(
        '',
        '🔄 Steps:',
        ...summary.steps.map(step => `- ${step}`),
      );
    }

    return sections.join('\n');
  }

  /**
   * Format job search results
   */
  static formatJobSearchResults(
    matches: string[],
    pattern: string,
    jobContext?: string,
  ): string {
    if (matches.length === 0) {
      const contextText = jobContext ? ` in ${jobContext} logs` : ' in job logs';
      return `No matches found for "${pattern}"${contextText}`;
    }

    const contextText = jobContext ? ` in ${jobContext} logs` : ' in job logs';
    return `Found ${matches.length} matches for "${pattern}"${contextText}:\n\n${matches.join('\n\n')}`;
  }
}
