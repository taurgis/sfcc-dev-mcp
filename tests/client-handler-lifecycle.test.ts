import { Logger } from '../src/utils/logger.js';
import { HandlerContext, GenericToolSpec, ToolArguments } from '../src/core/handlers/base-handler.js';
import { SimpleClientHandler } from '../src/core/handlers/simple-client-handler.js';
import { AbstractClientHandler } from '../src/core/handlers/abstract-client-handler.js';

type TestToolName = 'test_tool';

interface TestLifecycleClient {
  destroy?: jest.Mock;
  dispose?: jest.Mock;
  close?: jest.Mock;
}

const TEST_TOOL_CONFIG: Record<TestToolName, GenericToolSpec<ToolArguments, unknown>> = {
  test_tool: {
    exec: async () => ({ ok: true }),
    logMessage: () => 'running test tool',
  },
};

const TEST_TOOL_NAMES = new Set<TestToolName>(['test_tool']);

class TestAbstractClientHandler extends AbstractClientHandler<TestToolName, TestLifecycleClient> {
  private readonly mockClient: TestLifecycleClient;

  constructor(context: HandlerContext, mockClient: TestLifecycleClient) {
    super(context, 'AbstractLifecycleTest');
    this.mockClient = mockClient;
  }

  protected createClient(): TestLifecycleClient {
    return this.mockClient;
  }

  protected getClientContextKey(): string {
    return 'mockClient';
  }

  protected getClientDisplayName(): string {
    return 'AbstractLifecycleClient';
  }

  protected getToolConfig(): Record<TestToolName, GenericToolSpec<ToolArguments, unknown>> {
    return TEST_TOOL_CONFIG;
  }

  protected getToolNameSet(): Set<TestToolName> {
    return TEST_TOOL_NAMES;
  }
}

describe('Client handler lifecycle teardown', () => {
  let context: HandlerContext;

  beforeEach(() => {
    const mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    } as unknown as Logger;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);

    context = {
      logger: mockLogger,
      config: { hostname: 'test.example.com' },
      capabilities: { canAccessLogs: true, canAccessOCAPI: true },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('SimpleClientHandler calls destroy() during dispose', async () => {
    const client: TestLifecycleClient = { destroy: jest.fn() };
    const handler = new SimpleClientHandler<TestToolName, TestLifecycleClient>(
      context,
      'SimpleLifecycleTest',
      {
        toolConfig: TEST_TOOL_CONFIG,
        toolNameSet: TEST_TOOL_NAMES,
        clientContextKey: 'mockClient',
        clientDisplayName: 'SimpleLifecycleClient',
        createClient: () => client,
      },
    );

    await handler.handle('test_tool', {}, Date.now());
    await handler.dispose();

    expect(client.destroy).toHaveBeenCalledTimes(1);
  });

  it('SimpleClientHandler falls back to dispose() when destroy() is absent', async () => {
    const client: TestLifecycleClient = { dispose: jest.fn() };
    const handler = new SimpleClientHandler<TestToolName, TestLifecycleClient>(
      context,
      'SimpleLifecycleTest',
      {
        toolConfig: TEST_TOOL_CONFIG,
        toolNameSet: TEST_TOOL_NAMES,
        clientContextKey: 'mockClient',
        clientDisplayName: 'SimpleLifecycleClient',
        createClient: () => client,
      },
    );

    await handler.handle('test_tool', {}, Date.now());
    await handler.dispose();

    expect(client.dispose).toHaveBeenCalledTimes(1);
  });

  it('AbstractClientHandler falls back to close() when destroy/dispose are absent', async () => {
    const client: TestLifecycleClient = { close: jest.fn() };
    const handler = new TestAbstractClientHandler(context, client);

    await handler.handle('test_tool', {}, Date.now());
    await handler.dispose();

    expect(client.close).toHaveBeenCalledTimes(1);
  });
});
