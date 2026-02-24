import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ToolArgumentValidator } from './tool-argument-validator.js';
import { createToolErrorResponse } from './tool-error-response.js';
import { BaseToolHandler, ToolExecutionResult } from './handlers/base-handler.js';
import { ValidationError } from '../utils/validator.js';
import { Logger } from '../utils/logger.js';
import { LogCapabilityState } from './server-tool-catalog.js';

export type ProgressToken = string | number;

export interface ToolRequestExecutionExtras {
  signal?: AbortSignal;
  sendNotification?: (notification: { method: string; params?: Record<string, unknown> }) => Promise<void>;
}

interface ToolCallRequest {
  params: {
    name: string;
    arguments?: Record<string, unknown>;
    _meta?: { progressToken?: ProgressToken };
  };
}

export interface ToolCallLifecycleContext {
  logger: Logger;
  getHandlers: () => BaseToolHandler[];
  logCapabilityToolNames: Set<string>;
  ensureLogCapabilityResolved: () => Promise<void>;
  isToolAvailable: (toolName: string) => boolean;
  getCapabilitySnapshot: () => {
    logCapabilityState: LogCapabilityState;
    canAccessOCAPI: boolean;
  };
  toolArgumentValidator: ToolArgumentValidator;
  getPreflightNotice: () => Promise<string | undefined>;
}

export function createToolCallHandler(
  context: ToolCallLifecycleContext,
): (request: ToolCallRequest, extra?: ToolRequestExecutionExtras) => Promise<CallToolResult> {
  return async (request: ToolCallRequest, extra?: ToolRequestExecutionExtras): Promise<CallToolResult> => {
    const { name, arguments: args } = request.params;
    const startTime = Date.now();
    const progressToken = request.params._meta?.progressToken;
    const executionExtras: ToolRequestExecutionExtras = {
      signal: extra?.signal,
      sendNotification: extra?.sendNotification,
    };

    context.logger.methodEntry(`handleToolRequest:${name}`, args);

    try {
      assertRequestNotCancelled(name, executionExtras.signal);
      await emitProgress(context.logger, executionExtras, progressToken, 0, 100, `Starting ${name}`);

      if (context.logCapabilityToolNames.has(name)) {
        await context.ensureLogCapabilityResolved();
      }

      assertRequestNotCancelled(name, executionExtras.signal);
      await emitProgress(context.logger, executionExtras, progressToken, 20, 100, 'Resolving handler');

      const handler = context.getHandlers().find((h) => h.canHandle(name));
      if (!handler) {
        throw new ValidationError(`Unknown tool: ${name}`, 'UNKNOWN_TOOL', { toolName: name });
      }

      if (!context.isToolAvailable(name)) {
        const capabilitySnapshot = context.getCapabilitySnapshot();
        throw new ValidationError(
          `Tool not available in current mode: ${name}`,
          'TOOL_NOT_AVAILABLE',
          {
            toolName: name,
            canAccessLogs: capabilitySnapshot.logCapabilityState === 'available',
            logCapabilityState: capabilitySnapshot.logCapabilityState,
            canAccessOCAPI: capabilitySnapshot.canAccessOCAPI,
          },
        );
      }

      assertRequestNotCancelled(name, executionExtras.signal);
      await emitProgress(context.logger, executionExtras, progressToken, 40, 100, 'Validating arguments');

      context.toolArgumentValidator.validate(name, args ?? {});

      assertRequestNotCancelled(name, executionExtras.signal);
      await emitProgress(context.logger, executionExtras, progressToken, 60, 100, 'Executing tool');

      const preflightNotice = await context.getPreflightNotice();
      const result = await awaitWithCancellation(
        name,
        handler.handle(name, args ?? {}, startTime),
        executionExtras.signal,
      );
      const decoratedResult = preflightNotice
        ? appendPreflightNotice(result, preflightNotice)
        : result;

      await emitProgress(context.logger, executionExtras, progressToken, 100, 100, `${name} complete`);

      context.logger.debug(`Full response for ${name}:`, {
        contentItems: decoratedResult.content?.length ?? 0,
        contentTypes: (decoratedResult.content ?? []).map((item) => item.type),
        hasStructuredContent: decoratedResult.structuredContent !== undefined,
        isError: decoratedResult.isError ?? false,
      });

      return {
        content: decoratedResult.content,
        structuredContent: decoratedResult.structuredContent,
        isError: decoratedResult.isError,
      };
    } catch (error) {
      context.logger.error(`Error handling tool "${name}":`, error);
      context.logger.timing(`${name}_error`, startTime);
      const errorResult: CallToolResult = createToolErrorResponse(name, error);

      context.logger.debug(`Error response for ${name}:`, errorResult);
      return errorResult;
    } finally {
      context.logger.methodExit(`handleToolRequest:${name}`);
    }
  };
}

function appendPreflightNotice(result: ToolExecutionResult, notice: string): ToolExecutionResult {
  const trimmedNotice = notice.trim();
  if (trimmedNotice.length === 0) {
    return result;
  }

  const content = result?.content ?? [];
  const alreadyIncluded = content.some((item) => item.type === 'text' && item.text === trimmedNotice);
  if (alreadyIncluded) {
    return result;
  }

  return {
    ...result,
    content: [...content, { type: 'text', text: trimmedNotice }],
  };
}

function assertRequestNotCancelled(toolName: string, signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new ValidationError(
      `Tool call cancelled: ${toolName}`,
      'REQUEST_CANCELLED',
      { toolName },
    );
  }
}

async function awaitWithCancellation<T>(
  toolName: string,
  operation: Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  assertRequestNotCancelled(toolName, signal);

  if (!signal) {
    return operation;
  }

  return await new Promise<T>((resolve, reject) => {
    const onAbort = (): void => {
      reject(new ValidationError(
        `Tool call cancelled: ${toolName}`,
        'REQUEST_CANCELLED',
        { toolName },
      ));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    operation.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

async function emitProgress(
  logger: Logger,
  extra: ToolRequestExecutionExtras,
  progressToken: ProgressToken | undefined,
  progress: number,
  total: number,
  message: string,
): Promise<void> {
  if (progressToken === undefined || !extra.sendNotification) {
    return;
  }

  try {
    await extra.sendNotification({
      method: 'notifications/progress',
      params: {
        progressToken,
        progress,
        total,
        message,
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logger.debug(`[Server] Failed to emit progress notification: ${reason}`);
  }
}
