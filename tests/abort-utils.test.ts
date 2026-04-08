import { createTimeoutAbortController } from '../src/utils/abort-utils';

describe('abort-utils', () => {
  it('should unref timeout timers so they do not keep the event loop alive', () => {
    const unref = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockReturnValue({
      unref,
    } as unknown as ReturnType<typeof setTimeout>);
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout').mockImplementation(() => undefined);

    const controller = createTimeoutAbortController({
      timeoutMs: 1000,
      timeoutMessage: 'Request timed out',
    });

    expect(unref).toHaveBeenCalledTimes(1);

    controller?.clear();
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });
});
