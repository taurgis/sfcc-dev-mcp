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
   * @param options - Read options including maxBytes and useRangeRequest flag
   * @returns Promise<string> - The file content as a string
   */
  async getFileContentsTail(
    filename: string,
    options: FileReadOptions = {},
  ): Promise<string> {
    const {
      maxBytes = LOG_CONSTANTS.DEFAULT_TAIL_BYTES,
      useRangeRequest = true,
    } = options;

    this.logger.debug(`Reading file tail: ${filename} (maxBytes: ${maxBytes}, useRange: ${useRangeRequest})`);

    if (!useRangeRequest) {
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

      // File is large, get only the last portion using range request
      this.logger.debug(`File ${filename} is large (${fileSize} bytes), using range request for last ${maxBytes} bytes`);
      return await this.getRangeFileContents(filename, fileSize, maxBytes);

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
   * Read a range of bytes from the end of a file using streaming
   */
  private async getRangeFileContents(
    filename: string,
    fileSize: number,
    maxBytes: number,
  ): Promise<string> {
    const startByte = fileSize - maxBytes;

    return new Promise((resolve, reject) => {
      try {
        const stream = this.webdavClient.createReadStream(filename, {
          range: {
            start: startByte,
            end: fileSize - 1,
          },
        });

        const chunks: Buffer[] = [];

        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        stream.on('end', () => {
          const content = Buffer.concat(chunks).toString('utf-8');
          this.logger.debug(`Successfully read ${content.length} characters from range request`);
          resolve(content);
        });

        stream.on('error', (error: any) => {
          this.logger.warn(`Failed to read file tail for ${filename}, falling back to full file:`, error);
          // Fallback to getting the full file if range request fails
          this.getFullFileContents(filename)
            .then((content: string) => resolve(content))
            .catch((fallbackError: any) => reject(fallbackError));
        });
      } catch (error) {
        // If createReadStream fails, fall back to full file
        this.logger.warn(`Failed to create read stream for ${filename}, falling back to full file:`, error);
        this.getFullFileContents(filename)
          .then((content: string) => resolve(content))
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
