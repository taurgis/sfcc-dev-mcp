/**
 * Log parsing, entry processing, and data manipulation
 */

import { parseLogEntries, extractUniqueErrors, normalizeFilePath, extractTimestampFromLogEntry } from '../../utils/utils.js';
import { Logger } from '../../utils/logger.js';
import { LOG_CONSTANTS } from './log-constants.js';
import type { LogEntry, LogLevel, LogFileMetadata, ProcessedLogEntry, JobLogInfo } from './log-types.js';

export class LogProcessor {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Process log files and extract entries with priority ordering
   */
  async processLogFiles(
    files: LogFileMetadata[],
    level: LogLevel,
    fileContents: Map<string, string>,
  ): Promise<LogEntry[]> {
    const sortedFiles = this.sortFilesByPriority(files);
    const allLogEntries: LogEntry[] = [];

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      const content = fileContents.get(file.filename);

      if (!content) {
        this.logger.warn(`No content found for file: ${file.filename}`);
        continue;
      }

      this.logger.debug(`Processing file: ${file.filename} (priority: ${i})`);

      try {
        const logEntries = parseLogEntries(content, level.toUpperCase());

        // Add entries with extracted timestamps for chronological sorting
        logEntries.forEach((entry, entryIndex) => {
          const timestamp = extractTimestampFromLogEntry(entry);
          allLogEntries.push({
            entry: `[${normalizeFilePath(file.filename)}] ${entry}`,
            filename: normalizeFilePath(file.filename),
            order: i * LOG_CONSTANTS.FILE_ORDER_MULTIPLIER + entryIndex, // Keep for fallback sorting
            timestamp: timestamp ?? undefined, // Convert null to undefined
          });
        });
      } catch (error) {
        this.logger.error(`Error processing file ${file.filename}:`, error);
        // Continue processing other files even if one fails
      }
    }

    return allLogEntries;
  }

  /**
   * Sort files by modification date (newest first) for processing priority
   */
  private sortFilesByPriority(files: LogFileMetadata[]): LogFileMetadata[] {
    return files
      .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
      .map(file => ({ ...file, filename: file.filename }));
  }

  /**
   * Sort and limit log entries by chronological order (actual timestamps)
   */
  sortAndLimitEntries(entries: LogEntry[], limit: number): LogEntry[] {
    return entries
      .sort((a, b) => {
        // Primary sort: by timestamp (newest first)
        if (a.timestamp && b.timestamp) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        // Fallback for entries without timestamps: use file order (newest files first)
        if (a.timestamp && !b.timestamp) {
          return -1;
        }
        if (!a.timestamp && b.timestamp) {
          return 1;
        }
        return a.order - b.order; // Original order-based sorting as fallback
      })
      .slice(0, limit); // Take the first N entries (most recent chronologically)
  }

  /**
   * Extract formatted log entries from sorted entries
   */
  extractFormattedEntries(sortedEntries: LogEntry[]): string[] {
    return sortedEntries.map(item => item.entry);
  }

  /**
   * Process search results from file contents
   */
  processSearchResults(
    files: LogFileMetadata[],
    fileContents: Map<string, string>,
    pattern: string,
    limit: number,
  ): string[] {
    const matchingEntries: string[] = [];

    for (const file of files) {
      const content = fileContents.get(file.filename);
      if (!content) {
        continue;
      }

      const lines = content.split('\n');

      for (const line of lines) {
        if (line.toLowerCase().includes(pattern.toLowerCase()) && matchingEntries.length < limit) {
          matchingEntries.push(`[${normalizeFilePath(file.filename)}] ${line.trim()}`);
        }
      }
    }

    return matchingEntries;
  }

  /**
   * Count log levels in content
   */
  countLogLevels(content: string): {
    errorCount: number;
    warningCount: number;
    infoCount: number;
    debugCount: number;
  } {
    const lines = content.split('\n');
    const counts = {
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
    };

    for (const line of lines) {
      if (line.includes(' ERROR ')) { counts.errorCount++; }
      if (line.includes(' WARN ')) { counts.warningCount++; }
      if (line.includes(' INFO ')) { counts.infoCount++; }
      if (line.includes(' DEBUG ')) { counts.debugCount++; }
    }

    return counts;
  }

  /**
   * Extract key issues from error content
   */
  extractKeyIssues(content: string): string[] {
    const errors = parseLogEntries(content, 'ERROR');
    return extractUniqueErrors(errors);
  }

  /**
   * Parse individual log entry for structured data
   */
  parseLogEntry(entry: string): ProcessedLogEntry {
    // Basic parsing - can be enhanced based on log format
    const timestampMatch = entry.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/);
    const levelMatch = entry.match(/\s(ERROR|WARN|INFO|DEBUG)\s/);

    return {
      content: entry,
      timestamp: timestampMatch ? timestampMatch[0] : undefined,
      level: levelMatch ? levelMatch[1].toLowerCase() : undefined,
      source: this.extractSourceFromEntry(entry),
    };
  }

  /**
   * Extract source information from log entry
   */
  private extractSourceFromEntry(entry: string): string | undefined {
    // Look for common source patterns like [ClassName] or package.ClassName
    const sourceMatch = entry.match(/\[([^\]]+)\]/) ?? entry.match(/([a-zA-Z]+\.[a-zA-Z]+)/);
    return sourceMatch ? sourceMatch[1] : undefined;
  }

  /**
   * Group entries by source/category
   */
  groupEntriesBySource(entries: ProcessedLogEntry[]): Map<string, ProcessedLogEntry[]> {
    const groups = new Map<string, ProcessedLogEntry[]>();

    for (const entry of entries) {
      const source = entry.source ?? 'unknown';
      if (!groups.has(source)) {
        groups.set(source, []);
      }
      groups.get(source)!.push(entry);
    }

    return groups;
  }

  /**
   * Filter entries by time range
   */
  filterEntriesByTimeRange(
    entries: ProcessedLogEntry[],
    startTime?: Date,
    endTime?: Date,
  ): ProcessedLogEntry[] {
    return entries.filter(entry => {
      if (!entry.timestamp) {
        return true; // Include entries without timestamps
      }

      const entryTime = new Date(entry.timestamp);

      if (startTime && entryTime < startTime) {
        return false;
      }
      if (endTime && entryTime > endTime) {
        return false;
      }

      return true;
    });
  }

  /**
   * Process job log files - handles all log levels in one file
   */
  async processJobLogFiles(
    jobLogs: JobLogInfo[],
    level: LogLevel | 'all',
    fileContents: Map<string, string>,
  ): Promise<LogEntry[]> {
    const allLogEntries: LogEntry[] = [];

    for (let i = 0; i < jobLogs.length; i++) {
      const jobLog = jobLogs[i];
      const content = fileContents.get(jobLog.logFile);

      if (!content) {
        this.logger.warn(`No content found for job log file: ${jobLog.logFile}`);
        continue;
      }

      this.logger.debug(`Processing job log file: ${jobLog.logFile} (job: ${jobLog.jobName})`);

      try {
        // For job logs, we need to parse entries based on the level or all levels
        const logEntries = level === 'all'
          ? this.parseAllLogLevelsFromContent(content)
          : parseLogEntries(content, level.toUpperCase());

        // Add entries with job context and priority
        logEntries.forEach((entry, entryIndex) => {
          allLogEntries.push({
            entry: `[${jobLog.jobName}] ${entry}`,
            filename: `Job: ${jobLog.jobName} (${jobLog.jobId})`,
            order: i * LOG_CONSTANTS.FILE_ORDER_MULTIPLIER + entryIndex,
          });
        });
      } catch (error) {
        this.logger.error(`Error processing job log file ${jobLog.logFile}:`, error);
      }
    }

    return allLogEntries;
  }

  /**
   * Parse all log levels from job log content
   */
  private parseAllLogLevelsFromContent(content: string): string[] {
    const lines = content.split('\n');
    const logEntries: string[] = [];

    for (const line of lines) {
      if (line.trim() && this.isLogEntry(line)) {
        logEntries.push(line.trim());
      }
    }

    return logEntries;
  }

  /**
   * Check if a line is a log entry (contains timestamp and level)
   */
  private isLogEntry(line: string): boolean {
    // Look for timestamp pattern and log level in the line
    const timestampPattern = /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/;
    const levelPattern = /\s(ERROR|WARN|INFO|DEBUG)\s/;

    return timestampPattern.test(line) && levelPattern.test(line);
  }

  /**
   * Filter job log entries by specific log level
   */
  filterJobLogEntriesByLevel(entries: string[], level: LogLevel): string[] {
    const levelUpper = level.toUpperCase();
    return entries.filter(entry => entry.includes(` ${levelUpper} `));
  }

  /**
   * Extract job execution summary from job log content
   */
  extractJobExecutionSummary(content: string): {
    startTime?: string;
    endTime?: string;
    status?: string;
    duration?: string;
    errorCount: number;
    warningCount: number;
    steps: string[];
  } {
    const lines = content.split('\n');
    const summary = {
      startTime: undefined as string | undefined,
      endTime: undefined as string | undefined,
      status: undefined as string | undefined,
      duration: undefined as string | undefined,
      errorCount: 0,
      warningCount: 0,
      steps: [] as string[],
    };

    const stepPattern = /Step\s+\d+:/i;

    for (const line of lines) {
      // Extract start time (first timestamp)
      if (!summary.startTime) {
        const timestampMatch = line.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
        if (timestampMatch) {
          summary.startTime = timestampMatch[1];
        }
      }

      // Extract end time (last timestamp with completion indicators)
      if (line.includes('completed') || line.includes('finished') || line.includes('ended')) {
        const timestampMatch = line.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
        if (timestampMatch) {
          summary.endTime = timestampMatch[1];
        }
      }

      // Extract status
      if (line.includes('Job completed') || line.includes('Job finished')) {
        summary.status = line.includes('successfully') ? 'SUCCESS' : 'COMPLETED';
      } else if (line.includes('Job failed') || line.includes('ERROR')) {
        summary.status = 'FAILED';
      }

      // Count errors and warnings
      if (line.includes(' ERROR ')) {
        summary.errorCount++;
      }
      if (line.includes(' WARN ')) {
        summary.warningCount++;
      }

      // Extract step information
      if (stepPattern.test(line)) {
        const stepInfo = line.trim();
        if (!summary.steps.includes(stepInfo)) {
          summary.steps.push(stepInfo);
        }
      }
    }

    // Calculate duration if we have start and end times
    if (summary.startTime && summary.endTime) {
      const start = new Date(summary.startTime);
      const end = new Date(summary.endTime);
      const durationMs = end.getTime() - start.getTime();
      summary.duration = this.formatDuration(durationMs);
    }

    return summary;
  }

  /**
   * Format duration in milliseconds to human readable string
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
