/**
 * Log parsing, entry processing, and data manipulation
 */

import { parseLogEntries, extractUniqueErrors, normalizeFilePath } from '../../utils/utils.js';
import { Logger } from '../../utils/logger.js';
import { LOG_CONSTANTS } from './log-constants.js';
import type { LogEntry, LogLevel, LogFileMetadata, ProcessedLogEntry } from './log-types.js';

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

        // Add entries with file priority (lower index = newer file = higher priority)
        logEntries.forEach((entry, entryIndex) => {
          allLogEntries.push({
            entry: `[${normalizeFilePath(file.filename)}] ${entry}`,
            filename: normalizeFilePath(file.filename),
            order: i * LOG_CONSTANTS.FILE_ORDER_MULTIPLIER + entryIndex,
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
   * Sort and limit log entries by recency
   */
  sortAndLimitEntries(entries: LogEntry[], limit: number): LogEntry[] {
    return entries
      .sort((a, b) => a.order - b.order) // Ascending order (newest files have lower order values)
      .slice(-limit) // Take the last N entries (most recent)
      .reverse(); // Reverse to show newest entries at the top
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
}
