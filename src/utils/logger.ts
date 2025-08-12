/**
 * Logger class for standardized logging across the SFCC MCP application.
 * Provides consistent logging with optional timestamps and log levels.
 */
export class Logger {
  private context: string;
  private enableTimestamp: boolean;
  private debugEnabled: boolean;

  /**
   * Create a new Logger instance
   * @param context The context/component name for this logger
   * @param enableTimestamp Whether to include timestamps in log messages (default: true)
   * @param debugEnabled Whether to enable debug logging (default: true)
   */
  constructor(context: string = 'SFCC-MCP', enableTimestamp: boolean = true, debugEnabled: boolean = false) {
    this.context = context;
    this.enableTimestamp = enableTimestamp;
    this.debugEnabled = debugEnabled;
  }

  /**
   * Format a log message with optional timestamp and context
   * @param message The message to format
   * @returns Formatted message string
   */
  private formatMessage(message: string): string {
    const timestamp = this.enableTimestamp ? `[${new Date().toISOString()}] ` : '';
    return `${timestamp}[${this.context}] ${message}`;
  }

  /**
   * Log an informational message
   * @param message The message to log
   * @param args Optional arguments to include
   */
  public log(message: string, ...args: any[]): void {
    console.log(this.formatMessage(message), ...args);
  }

  /**
   * Log an informational message (alias for log)
   * @param message The message to log
   * @param args Optional arguments to include
   */
  public info(message: string, ...args: any[]): void {
    console.info(this.formatMessage(message), ...args);
  }

  /**
   * Log a warning message
   * @param message The warning message to log
   * @param args Optional arguments to include
   */
  public warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage(message), ...args);
  }

  /**
   * Log an error message
   * @param message The error message to log
   * @param args Optional arguments to include
   */
  public error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(message), ...args);
  }

  /**
   * Log a debug message (only if debug is enabled)
   * @param message The debug message to log
   * @param args Optional arguments to include
   */
  public debug(message: string, ...args: any[]): void {
    if (this.debugEnabled) {
      console.error(this.formatMessage(`[DEBUG] ${message}`), ...args);
    }
  }

  /**
   * Log method entry with parameters
   * @param methodName The name of the method being entered
   * @param params Optional parameters being passed to the method
   */
  public methodEntry(methodName: string, params?: any): void {
    if (this.debugEnabled) {
      const paramStr = params ? ` with params: ${JSON.stringify(params)}` : '';
      this.debug(`Entering method: ${methodName}${paramStr}`);
    }
  }

  /**
   * Log method exit with optional result
   * @param methodName The name of the method being exited
   * @param result Optional result being returned from the method
   */
  public methodExit(methodName: string, result?: any): void {
    if (this.debugEnabled) {
      const resultStr = result !== undefined ? ` with result: ${typeof result === 'object' ? JSON.stringify(result) : result}` : '';
      this.debug(`Exiting method: ${methodName}${resultStr}`);
    }
  }

  /**
   * Log performance timing information
   * @param operation The operation being timed
   * @param startTime The start time (from performance.now() or Date.now())
   */
  public timing(operation: string, startTime: number): void {
    if (this.debugEnabled) {
      const duration = Date.now() - startTime;
      this.debug(`Performance: ${operation} took ${duration}ms`);
    }
  }

  /**
   * Create a child logger with a new context but inheriting other settings
   * @param subContext The sub-context to append to the current context
   * @returns A new Logger instance with the combined context
   */
  public createChildLogger(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`, this.enableTimestamp, this.debugEnabled);
  }

  /**
   * Enable or disable debug logging
   * @param enabled Whether debug logging should be enabled
   */
  public setDebugEnabled(enabled: boolean): void {
    this.debugEnabled = enabled;
  }
}

// Create a default instance for global usage
export const logger = new Logger();
