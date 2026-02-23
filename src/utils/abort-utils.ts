export interface TimeoutAbortController {
  signal: AbortSignal;
  clear: () => void;
  didTimeout: () => boolean;
}

interface CreateTimeoutAbortControllerOptions {
  timeoutMs?: number;
  timeoutMessage: string;
  externalSignal?: AbortSignal | null;
  abortMessage?: string;
}

/**
 * Create an AbortSignal that can enforce timeouts and forward external cancellation.
 */
export function createTimeoutAbortController(
  options: CreateTimeoutAbortControllerOptions,
): TimeoutAbortController | null {
  const {
    timeoutMs,
    timeoutMessage,
    externalSignal,
    abortMessage = 'Request aborted',
  } = options;

  const hasTimeout = typeof timeoutMs === 'number' && timeoutMs > 0;
  if (!hasTimeout && !externalSignal) {
    return null;
  }

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let didTimeout = false;

  let removeExternalAbortListener = (): void => {
    // no-op
  };

  if (hasTimeout) {
    timeoutId = setTimeout(() => {
      didTimeout = true;
      controller.abort(timeoutMessage);
    }, timeoutMs);
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(getAbortReason(externalSignal) ?? abortMessage);
    } else {
      const forwardAbort = (): void => {
        controller.abort(getAbortReason(externalSignal) ?? abortMessage);
      };

      externalSignal.addEventListener('abort', forwardAbort, { once: true });
      removeExternalAbortListener = (): void => {
        externalSignal.removeEventListener('abort', forwardAbort);
      };
    }
  }

  const clear = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    removeExternalAbortListener();
    removeExternalAbortListener = (): void => {
      // no-op
    };
  };

  controller.signal.addEventListener('abort', clear, { once: true });

  return {
    signal: controller.signal,
    clear,
    didTimeout: () => didTimeout,
  };
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function getAbortReason(signal: AbortSignal): string | undefined {
  const reason = signal.reason;
  return typeof reason === 'string' && reason.trim().length > 0 ? reason : undefined;
}
