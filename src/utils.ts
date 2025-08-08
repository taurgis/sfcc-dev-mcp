/**
 * Utility functions for SFCC MCP Server
 *
 * This module contains helper functions for date formatting, file size conversion,
 * and other common operations used throughout the application.
 */

/**
 * Get current date in YYYYMMDD format
 * Used for filtering log files by date
 *
 * @returns Current date string in YYYYMMDD format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Convert bytes to human-readable format
 *
 * @param bytes - Number of bytes to format
 * @returns Formatted string with appropriate unit (Bytes, KB, MB, GB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Parse log content into individual entries based on log level
 * Handles multi-line log entries properly by grouping lines that belong together
 *
 * @param content - Raw log file content
 * @param level - Log level to filter for (ERROR, WARN, INFO)
 * @returns Array of complete log entries
 */
export function parseLogEntries(content: string, level: string): string[] {
  const lines = content.split('\n');
  const entries: string[] = [];
  let currentEntry = '';

  for (const line of lines) {
    // Check if this line starts a new log entry for the specified level
    if (line.includes(`] ${level} `) && line.includes('GMT]')) {
      // Save the previous entry if it exists
      if (currentEntry) {
        entries.push(currentEntry.trim());
      }
      // Start a new entry
      currentEntry = line;
    } else if (currentEntry && line.trim()) {
      // Add continuation lines to the current entry
      currentEntry += '\n' + line;
    }
  }

  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry.trim());
  }

  return entries;
}

/**
 * Extract unique error patterns from error log entries
 * Removes timestamps and common formatting to identify core error messages
 *
 * @param errors - Array of error log entries
 * @returns Array of unique error patterns (limited to top 10)
 */
export function extractUniqueErrors(errors: string[]): string[] {
  const patterns = new Set<string>();

  for (const error of errors) {
    // Extract main error message after the class name
    // Pattern: [timestamp] ERROR ClassName - ErrorMessage
    const match = error.match(/] ERROR [^-]+ - (.+?)(?:\n|$)/);
    if (match) {
      patterns.add(match[1].trim());
    }
  }

  return Array.from(patterns).slice(0, 10); // Limit to top 10 unique errors
}

/**
 * Normalize file path by removing leading slash if present
 * SFCC WebDAV sometimes returns paths with leading slashes that need to be handled
 *
 * @param filePath - File path that may have a leading slash
 * @returns Normalized file path without leading slash
 */
export function normalizeFilePath(filePath: string): string {
  return filePath.startsWith('/') ? filePath.substring(1) : filePath;
}
