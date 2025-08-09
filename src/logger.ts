/**
 * Logger class for standardized logging across the SFCC MCP application.
 * Provides consistent logging with optional timestamps and log levels.
 */
export class Logger {
  private context: string;
  private enableTimestamp: boolean;

  /**
   * Create a new Logger instance
   * @param context The context/component name for this logger
   * @param enableTimestamp Whether to include timestamps in log messages (default: true)
   */
  constructor(context: string = 'SFCC-MCP', enableTimestamp: boolean = true) {
    this.context = context;
    this.enableTimestamp = enableTimestamp;
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
   * Log a debug message
   * @param message The debug message to log
   * @param args Optional arguments to include
   */
  public debug(message: string, ...args: any[]): void {
    console.debug(this.formatMessage(message), ...args);
  }

  /**
   * Create a child logger with a new context but inheriting other settings
   * @param subContext The sub-context to append to the current context
   * @returns A new Logger instance with the combined context
   */
  public createChildLogger(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`, this.enableTimestamp);
  }
}

// Create a default instance for global usage
export const logger = new Logger();
