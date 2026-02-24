/**
 * SFCC Script Debugger Client
 *
 * Provides script evaluation capabilities using the SFCC Script Debugger API.
 * This client handles the complete workflow: creating debug sessions, setting breakpoints,
 * triggering script execution, evaluating expressions, and cleanup.
 *
 * This implementation uses the existing Default-Start endpoint from app_storefront_base,
 * eliminating the need to upload custom scripts.
 */

import { createClient, WebDAVClient } from 'webdav';
import { Logger } from '../../utils/logger.js';
import { SFCCConfig } from '../../types/types.js';
import { createTimeoutAbortController, isAbortError } from '../../utils/abort-utils.js';

/** Default timeout for script evaluation in milliseconds */
const DEFAULT_TIMEOUT_MS = 30000;

/** Default site ID if none provided */
const DEFAULT_SITE_ID = 'RefArch';

/** Default locale if none provided */
const DEFAULT_LOCALE = 'default';

/** Polling interval when waiting for halted thread */
const POLL_INTERVAL_MS = 500;

/** Timeout for the storefront trigger request (short - we expect it to hang at breakpoint) */
const TRIGGER_TIMEOUT_MS = 10000;

/** Timeout for individual Script Debugger API calls */
const DEBUGGER_REQUEST_TIMEOUT_MS = 10000;

/**
 * Result of a script evaluation
 */
export interface ScriptEvaluationResult {
  success: boolean;
  result?: string;
  error?: string;
  executionTimeMs?: number;
  warnings?: string[];
}

/**
 * Script thread from debugger API
 */
interface ScriptThread {
  id: number;
  status: 'halted' | 'running';
  call_stack?: Array<{
    index: number;
    location: {
      function_name: string;
      line_number: number;
      script_path: string;
    };
  }>;
}

/**
 * Debugger API response types
 */
interface ThreadsResponse {
  _v: string;
  script_threads?: ScriptThread[];
}

interface EvalResponse {
  _v: string;
  expression: string;
  result: string;
}

interface FaultResponse {
  _v: string;
  fault?: {
    type: string;
    message: string;
  };
}

/** Strategic breakpoint lines to catch executable code without overhead */
const DEFAULT_BREAKPOINT_LINES = [1, 10, 20, 30, 40, 50];

/**
 * Cartridge configuration for breakpoint targeting
 */
interface CartridgeConfig {
  cartridge: string;
  controllerPath: string;
  /** Single line or array of lines for breakpoints */
  breakpointLines: number | number[];
  type: 'sfra' | 'sitegenesis';
}

/** SFRA cartridge configuration */
const SFRA_CONFIG: CartridgeConfig = {
  cartridge: 'app_storefront_base',
  controllerPath: '/cartridge/controllers/Default.js',
  breakpointLines: DEFAULT_BREAKPOINT_LINES, // Lines 1-50 to catch executable code
  type: 'sfra',
};

/** SiteGenesis cartridge configuration */
const SITEGENESIS_CONFIG: CartridgeConfig = {
  cartridge: 'app_storefront_controllers',
  controllerPath: '/cartridge/controllers/Default.js',
  breakpointLines: DEFAULT_BREAKPOINT_LINES, // Lines 1-50 to catch executable code
  type: 'sitegenesis',
};

/**
 * SFCC Script Debugger Client
 *
 * Orchestrates script evaluation through the Script Debugger API workflow:
 * 1. Create debugger client session
 * 2. Set breakpoint on Default.js controller
 * 3. Trigger Default-Start via HTTP
 * 4. Wait for thread to halt at breakpoint
 * 5. Evaluate user's expression in halted context
 * 6. Resume thread and cleanup
 *
 * Supports both SFRA (app_storefront_base) and SiteGenesis (app_storefront_controllers).
 */
export class ScriptDebuggerClient {
  private readonly config: SFCCConfig;
  private readonly logger: Logger;
  private readonly debuggerClientId = 'sfcc-mcp-evaluator';
  private readonly debuggerBaseUrl: string;
  private readonly protocol: 'http' | 'https';
  private cachedAuthHeader: string | null = null;
  private webdavClient: WebDAVClient | null = null;
  private isDebuggerEnabled = false;
  private evaluationQueue: Promise<void> = Promise.resolve();
  private queuedEvaluations = 0;
  private activeEvaluations = 0;

  constructor(config: SFCCConfig, logger?: Logger) {
    this.config = config;
    this.logger = logger ?? Logger.getChildLogger('ScriptDebugger');
    this.protocol = config.hostname?.startsWith('localhost') ? 'http' : 'https';
    this.debuggerBaseUrl = `${this.protocol}://${config.hostname}/s/-/dw/debugger/v2_0`;
  }

  /**
   * Evaluate a script/expression on the SFCC instance
   *
   * This method handles the entire workflow automatically:
   * - Sets up debugger session
   * - Sets breakpoint on Default-Start (or custom file/line)
   * - Triggers execution and captures result
   * - Cleans up all resources
   *
   * @param script The JavaScript code to evaluate
   * @param options Optional configuration for the evaluation
   */
  async evaluateScript(
    script: string,
    options: {
      timeout?: number;
      siteId?: string;
      locale?: string;
      breakpointFile?: string;
      breakpointLine?: number;
    } = {},
  ): Promise<ScriptEvaluationResult> {
    const startTime = Date.now();
    return this.enqueueSerializedEvaluation(async () => {
      const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
      const siteId = options.siteId ?? DEFAULT_SITE_ID;
      const locale = this.normalizeLocale(options.locale ?? DEFAULT_LOCALE);
      const warnings: string[] = [];

      this.logger.debug('Starting script evaluation', {
        scriptLength: script.length,
        timeout,
        siteId,
        customBreakpoint: options.breakpointFile ? `${options.breakpointFile}:${options.breakpointLine}` : undefined,
      });

      try {
        // Resolve breakpoint target for this request.
        const cartridgeConfig = await this.resolveCartridgeConfig(options);
        if (!cartridgeConfig) {
          return {
            success: false,
            error: 'No compatible storefront cartridge found. Ensure either app_storefront_base (SFRA) or app_storefront_controllers (SiteGenesis) is deployed to your code version.',
            executionTimeMs: Date.now() - startTime,
            warnings: [
              'Verify that your storefront cartridge exists in your active code version',
              'Supported cartridges: app_storefront_base (SFRA), app_storefront_controllers (SiteGenesis)',
              'Check that the code version is correctly deployed via WebDAV',
              'Or specify custom breakpointFile and breakpointLine parameters',
            ],
          };
        }

        // Reuse one debugger session across queued evaluations.
        await this.ensureDebuggerSession();
        await this.clearBreakpoints();

        // Set breakpoints for this specific request only.
        await this.setBreakpoints(cartridgeConfig);

        // Trigger request execution in storefront.
        const triggerPromise = this.triggerDefaultStart(siteId, locale);

        // Poll for halted thread
        const thread = await this.waitForHaltedThread(timeout);

        if (!thread) {
          await this.clearBreakpoints();
          return {
            success: false,
            error: 'Timeout waiting for script to hit breakpoint. The Default-Start endpoint may not have been triggered correctly.',
            executionTimeMs: Date.now() - startTime,
            warnings: [
              `Ensure the site "${siteId}" exists and has app_storefront_base in its cartridge path`,
              'Check that the Default-Start route is accessible',
              'Verify script debugging is enabled',
            ],
          };
        }

        // Evaluate expression in halted context.
        const evalResult = await this.evaluateInContext(thread.id, script);
        await this.clearBreakpoints();
        await this.resumeThread(thread.id);

        // Let trigger settle in background (timeout is expected in some cases).
        triggerPromise.catch(() => {
          // Expected - request may timeout after thread resumes.
        });

        return {
          success: true,
          result: evalResult,
          executionTimeMs: Date.now() - startTime,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error('Script evaluation failed', { error: errorMessage });

        try {
          await this.cleanup(false);
        } catch (cleanupError) {
          this.logger.debug('Cleanup after error failed', { cleanupError });
        }

        return {
          success: false,
          error: errorMessage,
          executionTimeMs: Date.now() - startTime,
          warnings: this.getErrorGuidance(errorMessage),
        };
      }
    });
  }

  private async enqueueSerializedEvaluation<T>(operation: () => Promise<T>): Promise<T> {
    this.queuedEvaluations++;

    const run = async (): Promise<T> => {
      this.queuedEvaluations = Math.max(0, this.queuedEvaluations - 1);
      this.activeEvaluations++;

      try {
        return await operation();
      } finally {
        this.activeEvaluations = Math.max(0, this.activeEvaluations - 1);

        if (this.activeEvaluations === 0 && this.queuedEvaluations === 0) {
          await this.disableDebuggerSession();
        }
      }
    };

    const resultPromise = this.evaluationQueue.then(run, run);
    this.evaluationQueue = resultPromise.then(() => undefined, () => undefined);

    return resultPromise;
  }

  private async resolveCartridgeConfig(options: {
    breakpointFile?: string;
    breakpointLine?: number;
  }): Promise<CartridgeConfig | null> {
    if (options.breakpointFile) {
      const customLines = options.breakpointLine ? [options.breakpointLine] : DEFAULT_BREAKPOINT_LINES;
      this.logger.debug('Using custom breakpoint', {
        file: options.breakpointFile,
        lines: options.breakpointLine ?? 'strategic (1,10,20,30,40,50)',
      });

      return {
        cartridge: '',
        controllerPath: options.breakpointFile,
        breakpointLines: customLines,
        type: 'sfra',
      };
    }

    const detected = await this.detectStorefrontCartridge();
    if (detected) {
      this.logger.debug('Using detected cartridge config', {
        cartridge: detected.cartridge,
        type: detected.type,
        breakpointLines: 'strategic (1,10,20,30,40,50)',
      });
    }

    return detected;
  }

  private async ensureDebuggerSession(): Promise<void> {
    if (this.isDebuggerEnabled) {
      return;
    }

    await this.enableDebugger();
  }

  private async clearBreakpoints(): Promise<void> {
    try {
      await this.debuggerRequest('DELETE', '/breakpoints');
    } catch {
      // Ignore - best effort cleanup.
    }
  }

  private async disableDebuggerSession(): Promise<void> {
    if (!this.isDebuggerEnabled) {
      return;
    }

    try {
      await this.debuggerRequest('DELETE', '/client');
    } catch (error) {
      this.logger.debug('Failed to disable debugger session', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.isDebuggerEnabled = false;
    }
  }

  /**
   * Build and cache authentication header for debugger API
   */
  private getAuthHeader(): string {
    if (this.cachedAuthHeader) {
      return this.cachedAuthHeader;
    }

    let credentials: string;
    if (this.config.username && this.config.password) {
      credentials = `${this.config.username}:${this.config.password}`;
    } else if (this.config.clientId && this.config.clientSecret) {
      credentials = `${this.config.clientId}:${this.config.clientSecret}`;
    } else {
      throw new Error('No authentication credentials available');
    }

    this.cachedAuthHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;
    return this.cachedAuthHeader;
  }

  /**
   * Build auth header for storefront trigger requests.
   *
   * Preference order:
   * 1) Dedicated storefront credentials from dw.json
   * 2) Primary basic auth credentials (username/password)
   *
   * OAuth credentials are intentionally not sent to storefront routes.
   */
  private getStorefrontTriggerAuthHeader(): string | undefined {
    const storefrontUsername = this.config.storefrontUsername?.trim();
    const storefrontPassword = this.config.storefrontPassword?.trim();

    if (storefrontUsername || storefrontPassword) {
      if (!storefrontUsername || !storefrontPassword) {
        throw new Error('Storefront credentials must include both storefrontUsername and storefrontPassword');
      }
      return `Basic ${Buffer.from(`${storefrontUsername}:${storefrontPassword}`).toString('base64')}`;
    }

    if (this.config.username && this.config.password) {
      return `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`;
    }

    return undefined;
  }

  /**
   * Get WebDAV client credentials
   */
  private getWebDAVCredentials(): { username: string; password: string } {
    if (this.config.username && this.config.password) {
      return { username: this.config.username, password: this.config.password };
    }
    if (this.config.clientId && this.config.clientSecret) {
      return { username: this.config.clientId, password: this.config.clientSecret };
    }
    throw new Error('No authentication credentials available for WebDAV');
  }

  /**
   * Get or create WebDAV client for cartridge verification
   */
  private getWebDAVClient(): WebDAVClient {
    if (!this.webdavClient) {
      const webdavUrl = `${this.protocol}://${this.config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`;
      this.webdavClient = createClient(webdavUrl, this.getWebDAVCredentials());
    }
    return this.webdavClient;
  }

  /**
   * Check if a specific controller exists in the code version
   */
  private async controllerExists(config: CartridgeConfig): Promise<boolean> {
    try {
      const client = this.getWebDAVClient();
      const codeVersion = this.config.codeVersion ?? 'version1';
      const controllerPath = `/${codeVersion}/${config.cartridge}${config.controllerPath}`;

      this.logger.debug('Checking controller exists', { controllerPath, type: config.type });

      return await client.exists(controllerPath);
    } catch (error) {
      this.logger.debug('Controller check failed', {
        cartridge: config.cartridge,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Detect which storefront cartridge is available (SFRA or SiteGenesis)
   * Returns the cartridge config to use, or null if none found
   */
  private async detectStorefrontCartridge(): Promise<CartridgeConfig | null> {
    // Try SFRA first (preferred)
    if (await this.controllerExists(SFRA_CONFIG)) {
      this.logger.debug('Detected SFRA storefront');
      return SFRA_CONFIG;
    }

    // Fall back to SiteGenesis
    if (await this.controllerExists(SITEGENESIS_CONFIG)) {
      this.logger.debug('Detected SiteGenesis storefront');
      return SITEGENESIS_CONFIG;
    }

    this.logger.debug('No compatible storefront cartridge found');
    return null;
  }

  /**
   * Make a request to the debugger API
   */
  private async debuggerRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    timeoutMs: number = DEBUGGER_REQUEST_TIMEOUT_MS,
  ): Promise<T> {
    const url = `${this.debuggerBaseUrl}${endpoint}`;
    const timeoutController = createTimeoutAbortController({
      timeoutMs,
      timeoutMessage: `Debugger API request timed out after ${timeoutMs}ms`,
    });

    this.logger.debug(`Debugger API ${method} ${endpoint}`);

    const options: RequestInit = {
      method,
      headers: {
        Authorization: this.getAuthHeader(),
        'x-dw-client-id': this.debuggerClientId,
        'Content-Type': 'application/json',
      },
      signal: timeoutController?.signal,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      if (isAbortError(error) && timeoutController?.didTimeout()) {
        throw new Error(`Debugger API request timed out after ${timeoutMs}ms: ${method} ${endpoint}`);
      }

      throw error;
    } finally {
      timeoutController?.clear();
    }

    // 204 No Content is success for some operations
    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      let errorMessage = `Debugger API error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = (await response.json()) as FaultResponse;
        if (errorBody.fault) {
          errorMessage = `${errorBody.fault.type}: ${errorBody.fault.message}`;
        }
      } catch {
        // Could not parse error body
      }
      throw new Error(errorMessage);
    }

    // Some endpoints return no body on success
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  /**
   * Enable the debugger by creating a client session
   */
  private async enableDebugger(): Promise<void> {
    this.logger.debug('Enabling debugger');

    try {
      await this.debuggerRequest('POST', '/client');
      this.isDebuggerEnabled = true;
      this.logger.debug('Debugger enabled successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check if another client already has the debugger
      if (errorMessage.includes('DebuggerAlreadyEnabled') || errorMessage.includes('already')) {
        this.logger.debug('Debugger already enabled by another client, attempting to take over');

        // Delete existing client and retry
        try {
          await this.debuggerRequest('DELETE', '/client');
          await this.debuggerRequest('POST', '/client');
          this.isDebuggerEnabled = true;
          this.logger.debug('Took over debugger session');
          return;
        } catch (retryError) {
          throw new Error(`Failed to take over debugger session: ${retryError instanceof Error ? retryError.message : String(retryError)}`);
        }
      }

      throw error;
    }
  }

  /**
   * Set breakpoints on the controller.
   * Creates multiple breakpoints (lines 1-50 by default) to ensure we catch executable code.
   */
  private async setBreakpoints(config: CartridgeConfig): Promise<number[]> {
    // For custom breakpoints, controllerPath is the full path
    // For auto-detected, we combine cartridge + controllerPath
    const scriptPath = config.cartridge
      ? `/${config.cartridge}${config.controllerPath}`
      : config.controllerPath;

    // Normalize to array of line numbers
    const lineNumbers = Array.isArray(config.breakpointLines)
      ? config.breakpointLines
      : [config.breakpointLines];

    this.logger.debug('Setting breakpoints', { scriptPath, lines: lineNumbers.length > 5 ? `${lineNumbers[0]}-${lineNumbers[lineNumbers.length - 1]}` : lineNumbers });

    // Create breakpoint objects for all lines
    const breakpointRequests = lineNumbers.map((line) => ({
      line_number: line,
      script_path: scriptPath,
    }));

    const response = await this.debuggerRequest<{ breakpoints: Array<{ id: number }> }>('POST', '/breakpoints', {
      breakpoints: breakpointRequests,
    });

    if (!response.breakpoints || response.breakpoints.length === 0) {
      throw new Error('Failed to create breakpoints');
    }

    const breakpointIds = response.breakpoints.map((bp) => bp.id);
    this.logger.debug('Breakpoints set', { count: breakpointIds.length });

    return breakpointIds;
  }

  /**
   * Normalize site ID - extract the ID from "Sites-{id}-Site" format if needed
   */
  private normalizeSiteId(siteId: string): string {
    const match = siteId.match(/^Sites-(.+)-Site$/i);
    return match ? match[1] : siteId;
  }

  /**
   * Normalize locale value by trimming and removing leading/trailing slashes
   */
  private normalizeLocale(locale: string): string {
    const trimmed = locale.trim();
    const cleaned = trimmed.replace(/^\/+/, '').replace(/\/+$/, '');
    return cleaned.length > 0 ? cleaned : DEFAULT_LOCALE;
  }

  /**
   * Trigger the Default-Start endpoint via HTTP
   */
  private async triggerDefaultStart(siteId: string, locale: string): Promise<void> {
    // Normalize site ID in case it's passed as "Sites-{id}-Site"
    const normalizedSiteId = this.normalizeSiteId(siteId);
    const normalizedLocale = this.normalizeLocale(locale);

    // Some instances require the classic storefront URL format.
    // First try without locale (may redirect), then fall back to explicit locale.
    const siteSegment = `Sites-${normalizedSiteId}-Site`;
    const baseUrl = `${this.protocol}://${this.config.hostname}/on/demandware.store/${siteSegment}`;
    const urlWithoutLocale = `${baseUrl}/`;
    const urlWithLocale = `${baseUrl}/${normalizedLocale}`;

    this.logger.debug('Triggering Default-Start', {
      siteId: normalizedSiteId,
      locale: normalizedLocale,
      urlWithoutLocale,
      urlWithLocale,
    });

    const shouldRetryWithLocale = await this.triggerStorefrontUrl(urlWithoutLocale);
    if (shouldRetryWithLocale) {
      await this.triggerStorefrontUrl(urlWithLocale);
    }
  }

  /**
   * Trigger a storefront URL. Returns true if caller should retry with a fallback URL.
   *
   * Important: When debugging is active, the request may hang (and get aborted by timeout)
   * after successfully hitting the breakpoint. In that case we should NOT retry.
   */
  private async triggerStorefrontUrl(url: string): Promise<boolean> {
    const timeoutController = createTimeoutAbortController({
      timeoutMs: TRIGGER_TIMEOUT_MS,
      timeoutMessage: `Storefront trigger timed out after ${TRIGGER_TIMEOUT_MS}ms`,
    });

    const storefrontAuthHeader = this.getStorefrontTriggerAuthHeader();
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml',
    };
    if (storefrontAuthHeader) {
      headers.Authorization = storefrontAuthHeader;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: timeoutController?.signal,
        headers,
      });

      if (!response.ok) {
        this.logger.debug('Storefront trigger non-OK response', { url, status: response.status });
        return true;
      }

      this.logger.debug('Storefront trigger response', { url, status: response.status });
      return false;
    } catch (error) {
      // This is expected - the request may hang while we're debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isAbort = isAbortError(error) || errorMessage.toLowerCase().includes('abort');

      if (isAbort) {
        // Treat as success: likely hit the breakpoint and is now halted
        return false;
      }

      this.logger.debug('Storefront trigger error', { url, error: errorMessage });
      return true;
    } finally {
      timeoutController?.clear();
    }
  }

  /**
   * Wait for a thread to halt at our breakpoint
   */
  private async waitForHaltedThread(timeout: number): Promise<ScriptThread | null> {
    const startTime = Date.now();

    this.logger.debug('Waiting for halted thread', { timeout });

    while (Date.now() - startTime < timeout) {
      const remainingTimeout = timeout - (Date.now() - startTime);
      if (remainingTimeout <= 0) {
        break;
      }

      try {
        const response = await this.debuggerRequest<ThreadsResponse>(
          'GET',
          '/threads',
          undefined,
          Math.min(DEBUGGER_REQUEST_TIMEOUT_MS, remainingTimeout),
        );

        if (response.script_threads && response.script_threads.length > 0) {
          const haltedThread = response.script_threads.find((t) => t.status === 'halted');

          if (haltedThread) {
            this.logger.debug('Found halted thread', { threadId: haltedThread.id });

            // Reset timeout to give us more time
            await this.debuggerRequest('POST', '/threads/reset');

            return haltedThread;
          }
        }
      } catch (error) {
        // Ignore errors during polling - thread might not exist yet
        this.logger.debug('Thread poll error (may be normal)', {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    this.logger.debug('Timeout waiting for halted thread');
    return null;
  }

  /**
   * Evaluate an expression in the context of a halted thread
   */
  private async evaluateInContext(threadId: number, expression: string): Promise<string> {
    // Frame 0 is the current execution point
    const frameIndex = 0;

    // URL encode the expression
    const encodedExpr = encodeURIComponent(expression);

    this.logger.debug('Evaluating expression', { threadId, frameIndex });

    const response = await this.debuggerRequest<EvalResponse>(
      'GET',
      `/threads/${threadId}/frames/${frameIndex}/eval?expr=${encodedExpr}`,
    );

    return response.result ?? 'undefined';
  }

  /**
   * Resume a halted thread
   */
  private async resumeThread(threadId: number): Promise<void> {
    this.logger.debug('Resuming thread', { threadId });

    try {
      await this.debuggerRequest('POST', `/threads/${threadId}/resume`);
    } catch (error) {
      // Thread may have already completed
      this.logger.debug('Resume thread error (may be expected)', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Cleanup: remove breakpoints, disable debugger
   */
  private async cleanup(disableDebugger: boolean = true): Promise<void> {
    this.logger.debug('Starting cleanup');

    // Remove all breakpoints
    await this.clearBreakpoints();

    // Disable debugger (also resumes any halted threads)
    if (disableDebugger) {
      await this.disableDebuggerSession();
    }

    this.logger.debug('Cleanup complete');
  }

  async destroy(): Promise<void> {
    await this.evaluationQueue;
    await this.cleanup(true);
    this.cachedAuthHeader = null;
    this.webdavClient = null;
  }

  /**
   * Get guidance based on error message
   */
  private getErrorGuidance(errorMessage: string): string[] {
    const guidance: string[] = [];

    if (errorMessage.includes('NotAuthorizedException')) {
      guidance.push('Ensure your Business Manager user has the "Modules - Script Debugger" functional permission');
      guidance.push('Check that script debugging is enabled in Administration > Development Setup');
    }

    if (errorMessage.includes('ClientIdRequiredException')) {
      guidance.push('The x-dw-client-id header is required for the Script Debugger API');
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      guidance.push('The script execution may have timed out');
      guidance.push('Ensure the site ID is correct and the Default-Start route is accessible');
      guidance.push('Check that app_storefront_base is in the site\'s cartridge path');
    }

    if (guidance.length === 0) {
      guidance.push('Check SFCC instance connectivity');
      guidance.push('Verify your credentials are correct');
      guidance.push('Ensure script debugging is enabled in Business Manager');
    }

    return guidance;
  }

  /**
   * Test connectivity to the debugger API
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Try to create and immediately delete a client to test connectivity
      await this.ensureDebuggerSession();
      await this.cleanup(true);

      return {
        success: true,
        message: 'Successfully connected to Script Debugger API',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
