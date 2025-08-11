/**
 * Base client class for SFCC MCP Server
 *
 * This abstract class provides common functionality shared across different
 * client implementations, reducing code duplication and ensuring consistency.
 */

import { Logger } from './logger.js';

/**
 * Abstract base class for all SFCC clients
 */
export abstract class BaseClient {
  protected logger: Logger;
  protected clientName: string;

  constructor(clientName: string) {
    this.clientName = clientName;
    this.logger = new Logger(clientName);
  }

  /**
   * Handle common error scenarios and provide consistent error messages
   */
  protected handleError(error: any, operation: string): never {
    this.logger.error(`${operation} failed:`, error);

    if (error.code === 'ENOTFOUND') {
      throw new Error('Network error: Unable to connect to SFCC instance. Please check your hostname and network connection.');
    }

    if (error.status === 401 || error.code === 401) {
      throw new Error('Authentication failed: Please check your credentials.');
    }

    if (error.status === 403 || error.code === 403) {
      throw new Error('Access forbidden: You don\'t have permission to perform this operation.');
    }

    if (error.status === 404 || error.code === 404) {
      throw new Error('Resource not found: The requested resource does not exist.');
    }

    // Re-throw the original error if it's not a common scenario
    throw error;
  }

  /**
   * Validate required parameters
   */
  protected validateRequired(params: Record<string, any>, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!params[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  /**
   * Log method entry with parameters (excluding sensitive data)
   */
  protected logMethodEntry(methodName: string, params: any = {}): void {
    // Create a sanitized version of params for logging
    const sanitizedParams = this.sanitizeParams(params);
    this.logger.methodEntry(methodName, sanitizedParams);
  }

  /**
   * Log method exit with result metadata
   */
  protected logMethodExit(methodName: string, result?: any): void {
    const metadata = result ? { resultType: typeof result, hasData: !!result } : {};
    this.logger.methodExit(methodName, metadata);
  }

  /**
   * Remove sensitive information from parameters for logging
   */
  private sanitizeParams(params: any): any {
    if (!params || typeof params !== 'object') {
      return params;
    }

    const sensitiveFields = ['password', 'clientSecret', 'token', 'auth'];
    const sanitized = { ...params };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
