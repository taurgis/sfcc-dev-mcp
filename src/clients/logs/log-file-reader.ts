/**
 * Log file reading operations with range request support
 */

import type { WebDAVClient } from 'webdav';
import { Logger } from '../../utils/logger.js';
import { LOG_CONSTANTS } from './log-constants.js';
import type { FileReadOptions } from './log-types.js';

export class LogFileReader {
  private logger: Logger;
  private webdavClient: WebDAVClient;

  constructor(webdavClient: WebDAVClient, logger: Logger) {
    this.webdavClient = webdavClient;
    this.logger = logger;
  }

  /**
   * Get the last portion of a file using range requests to avoid loading huge files
   *
   * @param filename - The file path to read
   * @param options - Read options including maxBytes
   * @returns Promise<string> - The file content as a string
   */
  async getFileContentsTail(
    filename: string,
    options: FileReadOptions = {},
  ): Promise<string> {
    const { maxBytes = LOG_CONSTANTS.DEFAULT_TAIL_BYTES } = options;

    this.logger.debug(`Reading file tail: ${filename} (maxBytes: ${maxBytes})`);

    try {
      // First, try to get file info to determine the file size
      const stat = await this.webdavClient.stat(filename);
      const fileSize = (stat as any).size;

      if (!fileSize || fileSize <= maxBytes) {
        // File is small enough or size unknown, just get the whole file
        this.logger.debug(`File ${filename} is small (${fileSize} bytes), reading full content`);
        return await this.getFullFileContents(filename);
      }

      // File is large, get only the last portion using range request
      this.logger.debug(`File ${filename} is large (${fileSize} bytes), using range request for last ${maxBytes} bytes`);
      const startByte = fileSize - maxBytes;
      return await this.getRangeFileContents(filename, startByte, fileSize - 1);

    } catch (statError) {
      this.logger.warn(`Failed to get file stats for ${filename}, falling back to full file:`, statError);
      return await this.getFullFileContents(filename);
    }
  }

  /**
   * Read the full contents of a file
   */
  private async getFullFileContents(filename: string): Promise<string> {
    const content = await this.webdavClient.getFileContents(filename, { format: 'text' });
    return content as string;
  }

  /**
   * Read from the beginning of a file with optional size limit
   *
   * @param filename - The file path to read
   * @param maxBytes - Maximum number of bytes to read from the beginning
   * @returns Promise<string> - The file content as a string (truncated if needed)
   */
  async getFileContentsHead(
    filename: string,
    maxBytes?: number,
  ): Promise<string> {
    this.logger.debug(`Reading file head: ${filename} (maxBytes: ${maxBytes ?? 'unlimited'})`);

    if (!maxBytes) {
      // No size limit, read full file
      return await this.getFullFileContents(filename);
    }

    try {
      // First, try to get file info to determine the file size
      const stat = await this.webdavClient.stat(filename);
      const fileSize = (stat as any).size;

      if (!fileSize || fileSize <= maxBytes) {
        // File is small enough or size unknown, just get the whole file
        this.logger.debug(`File ${filename} is small (${fileSize} bytes), reading full content`);
        return await this.getFullFileContents(filename);
      }

      // File is large, get only the first portion using range request
      this.logger.debug(`File ${filename} is large (${fileSize} bytes), using range request for first ${maxBytes} bytes`);
      return await this.getRangeFileContents(filename, 0, maxBytes - 1);

    } catch (statError) {
      this.logger.warn(`Failed to get file stats for ${filename}, falling back to full file with truncation:`, statError);
      // Fallback to reading full file and truncating
      const content = await this.getFullFileContents(filename);
      if (content.length > maxBytes) {
        this.logger.debug(`Truncating full file content from ${content.length} to ${maxBytes} characters`);
        return content.substring(0, maxBytes);
      }
      return content;
    }
  }

  /**
   * Read a range of bytes from a file using streaming
   *
   * @param filename - The file path to read
   * @param start - Start byte position (0-based)
   * @param end - End byte position (inclusive)
   * @returns Promise<string> - The file content as a string
   */
  private async getRangeFileContents(
    filename: string,
    start: number,
    end: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const stream = this.webdavClient.createReadStream(filename, {
          range: { start, end },
        });

        const chunks: Buffer[] = [];

        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        stream.on('end', () => {
          const content = Buffer.concat(chunks).toString('utf-8');
          this.logger.debug(`Successfully read ${content.length} characters from range request (${start}-${end})`);
          resolve(content);
        });

        stream.on('error', (error: any) => {
          this.logger.warn(`Failed to read range ${start}-${end} for ${filename}, falling back to full file:`, error);
          // Fallback to getting the full file
          this.getFullFileContents(filename)
            .then((content: string) => {
              // Truncate to the requested range if possible
              const requestedLength = end - start + 1;
              if (start === 0 && content.length > requestedLength) {
                // Reading from start, truncate
                resolve(content.substring(0, requestedLength));
              } else {
                // Reading from end or full file is smaller, return what we have
                resolve(content);
              }
            })
            .catch((fallbackError: any) => reject(fallbackError));
        });
      } catch (error) {
        // If createReadStream fails, fall back to full file
        this.logger.warn(`Failed to create read stream for ${filename}, falling back to full file:`, error);
        this.getFullFileContents(filename)
          .then((content: string) => {
            const requestedLength = end - start + 1;
            if (start === 0 && content.length > requestedLength) {
              resolve(content.substring(0, requestedLength));
            } else {
              resolve(content);
            }
          })
          .catch((fallbackError: any) => reject(fallbackError));
      }
    });
  }

  /**
   * Read multiple files with tail optimization
   */
  async readMultipleFiles(
    filenames: string[],
    options: FileReadOptions = {},
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const filename of filenames) {
      try {
        const content = await this.getFileContentsTail(filename, options);
        results.set(filename, content);
      } catch (error) {
        this.logger.error(`Error reading file ${filename}:`, error);
        // Continue processing other files even if one fails
      }
    }

    return results;
  }

  /**
   * Check if a file exists and get its basic metadata
   */
  async getFileInfo(filename: string): Promise<{ exists: boolean; size?: number; lastmod?: string }> {
    try {
      const stat = await this.webdavClient.stat(filename);
      return {
        exists: true,
        size: (stat as any).size,
        lastmod: (stat as any).lastmod,
      };
    } catch {
      return { exists: false };
    }
  }
}
