/**
 * Logger class for standardized logging across the SFCC MCP application.
 * Provides consistent logging with timestamps and log levels.
 * Always logs to files for consistent debugging and to avoid interfering with stdio.
 *
 * ## Log Directory Location
 *
 * The logger uses the operating system's temporary directory via Node.js `os.tmpdir()`:
 * - **macOS**: `/var/folders/{user-specific-path}/T/sfcc-mcp-logs/`
 * - **Linux**: `/tmp/sfcc-mcp-logs/` (typically)
 * - **Windows**: `%TEMP%\sfcc-mcp-logs\` (typically `C:\Users\{user}\AppData\Local\Temp\`)
 *
 * This approach provides:
 * - User-specific isolation (more secure than system-wide `/tmp`)
 * - Automatic cleanup by the OS
 * - Platform-appropriate temporary storage
 * - Proper permissions handling
 *
 * To find your log directory, use `Logger.getInstance().getLogDirectory()` or check
 * the debug logs which show the directory path during initialization.
 */

import { appendFileSync, existsSync, mkdirSync, promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { inspect } from 'util';

export class Logger {
  private context: string;
  private enableTimestamp: boolean;
  private debugEnabled: boolean;
  private logDir: string;
  private writeQueue: Promise<void> = Promise.resolve();
  private pendingWriteCount = 0;
  private droppedLogCount = 0;
  private readonly useSyncWrites: boolean;
  private static instance: Logger | null = null;
  private static readonly MAX_PENDING_WRITES = 5000;
  private static readonly DROP_NOTICE_INTERVAL = 100;

  private static shouldUseSyncWrites(customLogDir: string | undefined): boolean {
    // Synchronous writes are only needed for deterministic unit tests.
    return customLogDir !== undefined && process.env.NODE_ENV === 'test';
  }

  /**
   * Create a new Logger instance
   * @param context The context/component name for this logger
   * @param enableTimestamp Whether to include timestamps in log messages (default: true)
   * @param debugEnabled Whether to enable debug logging (default: false)
   * @param customLogDir Custom log directory for testing purposes
   */
  constructor(context: string = 'SFCC-MCP', enableTimestamp: boolean = true, debugEnabled: boolean = false, customLogDir?: string) {
    this.context = context;
    this.enableTimestamp = enableTimestamp;
    this.debugEnabled = debugEnabled;

    // Set up log directory - use custom directory for testing or default for production
    this.logDir = customLogDir ?? join(tmpdir(), 'sfcc-mcp-logs');
    // Only tests should force sync writes; runtime must stay non-blocking.
    this.useSyncWrites = Logger.shouldUseSyncWrites(customLogDir);
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Initialize the global logger instance with specific settings
   * This should be called once at application startup
   */
  public static initialize(context: string = 'SFCC-MCP', enableTimestamp: boolean = true, debugEnabled: boolean = false, customLogDir?: string): void {
    Logger.instance = new Logger(context, enableTimestamp, debugEnabled, customLogDir);
  }

  /**
   * Get the global logger instance
   * If not initialized, creates a default instance
   */
  public static getInstance(): Logger {
    Logger.instance ??= new Logger();
    return Logger.instance;
  }

  /**
   * Create a child logger with a new context but inheriting other settings from the global instance
   * @param subContext The sub-context to append to the current context
   * @returns A new Logger instance with the combined context
   */
  public static getChildLogger(subContext: string): Logger {
    const globalLogger = Logger.getInstance();
    return new Logger(`${globalLogger.context}:${subContext}`, globalLogger.enableTimestamp, globalLogger.debugEnabled, globalLogger.logDir);
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
   * Patterns for sensitive data that should be masked in logs
   * These patterns match common credential formats to prevent accidental leakage
   */
  private static readonly SENSITIVE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
    // Password fields in JSON
    { pattern: /"password"\s*:\s*"[^"]+"/gi, replacement: '"password": "[REDACTED]"' },
    // Client secret fields in JSON
    { pattern: /"client[-_]?secret"\s*:\s*"[^"]+"/gi, replacement: '"client-secret": "[REDACTED]"' },
    { pattern: /"clientSecret"\s*:\s*"[^"]+"/gi, replacement: '"clientSecret": "[REDACTED]"' },
    // Access tokens
    { pattern: /"access[-_]?token"\s*:\s*"[^"]+"/gi, replacement: '"access_token": "[REDACTED]"' },
    { pattern: /"accessToken"\s*:\s*"[^"]+"/gi, replacement: '"accessToken": "[REDACTED]"' },
    // Bearer tokens in Authorization headers
    { pattern: /Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*/gi, replacement: 'Bearer [REDACTED]' },
    // Basic auth headers
    { pattern: /Basic\s+[A-Za-z0-9+/=]+/gi, replacement: 'Basic [REDACTED]' },
    // API keys
    { pattern: /"api[-_]?key"\s*:\s*"[^"]+"/gi, replacement: '"api_key": "[REDACTED]"' },
  ];

  /**
   * Mask sensitive data in log messages
   * @param text The text to sanitize
   * @returns Sanitized text with sensitive data masked
   */
  private maskSensitiveData(text: string): string {
    let sanitized = text;
    for (const { pattern, replacement } of Logger.SENSITIVE_PATTERNS) {
      sanitized = sanitized.replace(pattern, replacement);
    }
    return sanitized;
  }

  /**
   * Write log message to appropriate log file
   */
  private writeLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, ...args: unknown[]): void {
    if (!this.useSyncWrites && this.pendingWriteCount >= Logger.MAX_PENDING_WRITES) {
      this.droppedLogCount++;

      // Avoid stderr spam while still surfacing sustained backpressure.
      if (this.droppedLogCount % Logger.DROP_NOTICE_INTERVAL === 0) {
        process.stderr.write(
          `[LOGGER WARN] Dropped ${this.droppedLogCount} log entries due to write backpressure\n`,
        );
      }

      return;
    }

    const formattedMessage = this.formatMessage(message);
    const serializedArgs = args.map(arg => this.serializeArg(arg)).join(' ');
    const rawFullMessage = serializedArgs.length > 0
      ? `${formattedMessage} ${serializedArgs}`
      : formattedMessage;

    // Apply sensitive data masking before writing to log
    const fullMessage = this.maskSensitiveData(rawFullMessage);

    // Always write to log files
    const logFile = join(this.logDir, `sfcc-mcp-${level}.log`);
    const logEntry = `${fullMessage}\n`;

    if (this.useSyncWrites) {
      try {
        appendFileSync(logFile, logEntry, 'utf8');
      } catch (error) {
        this.handleWriteFailure(level, logEntry, error);
      }
      return;
    }

    this.pendingWriteCount++;
    this.writeQueue = this.writeQueue
      .then(async () => {
        await fs.appendFile(logFile, logEntry, 'utf8');
      })
      .catch((error: unknown) => {
        this.handleWriteFailure(level, logEntry, error);
      })
      .finally(() => {
        this.pendingWriteCount = Math.max(0, this.pendingWriteCount - 1);
      });
  }

  private serializeArg(value: unknown, pretty: boolean = true): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value !== 'object' || value === null) {
      return String(value);
    }

    try {
      return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
    } catch {
      return inspect(value, { depth: 4, breakLength: 120 });
    }
  }

  private handleWriteFailure(level: 'info' | 'warn' | 'error' | 'debug', logEntry: string, error: unknown): void {
    // Fallback: if file logging fails, try stderr for critical errors only
    if (level === 'error') {
      process.stderr.write(`[LOGGER ERROR] Could not write to log file: ${String(error)}\n`);
      process.stderr.write(logEntry);
    }
  }

  /**
   * Log an informational message
   * @param message The message to log
   * @param args Optional arguments to include
   */
  public log(message: string, ...args: unknown[]): void {
    this.writeLog('info', message, ...args);
  }

  /**
   * Log an informational message (alias for log)
   * @param message The message to log
   * @param args Optional arguments to include
   */
  public info(message: string, ...args: unknown[]): void {
    this.writeLog('info', message, ...args);
  }

  /**
   * Log a warning message
   * @param message The warning message to log
   * @param args Optional arguments to include
   */
  public warn(message: string, ...args: unknown[]): void {
    this.writeLog('warn', message, ...args);
  }

  /**
   * Log an error message
   * @param message The error message to log
   * @param args Optional arguments to include
   */
  public error(message: string, ...args: unknown[]): void {
    this.writeLog('error', message, ...args);
  }

  /**
   * Log a debug message (only if debug is enabled)
   * @param message The debug message to log
   * @param args Optional arguments to include
   */
  public debug(message: string, ...args: unknown[]): void {
    if (this.debugEnabled) {
      this.writeLog('debug', `[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log method entry with parameters
   * @param methodName The name of the method being entered
   * @param params Optional parameters being passed to the method
   */
  public methodEntry(methodName: string, params?: unknown): void {
    if (this.debugEnabled) {
      const paramStr = params ? ` with params: ${this.serializeArg(params, false)}` : '';
      this.debug(`Entering method: ${methodName}${paramStr}`);
    }
  }

  /**
   * Log method exit with optional result
   * @param methodName The name of the method being exited
   * @param result Optional result being returned from the method
   */
  public methodExit(methodName: string, result?: unknown): void {
    if (this.debugEnabled) {
      const resultStr = result !== undefined ? ` with result: ${this.serializeArg(result, false)}` : '';
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
    return new Logger(`${this.context}:${subContext}`, this.enableTimestamp, this.debugEnabled, this.logDir);
  }

  /**
   * Enable or disable debug logging
   * @param enabled Whether debug logging should be enabled
   */
  public setDebugEnabled(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  /**
   * Wait for pending asynchronous log writes to complete.
   */
  public async flush(): Promise<void> {
    await this.writeQueue;
  }

  /**
   * Get the current log directory
   */
  public getLogDirectory(): string {
    return this.logDir;
  }
}

// Export the singleton instance getter for convenience
export const getLogger = Logger.getInstance;
