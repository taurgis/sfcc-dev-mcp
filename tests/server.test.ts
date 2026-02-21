import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  RootsListChangedNotificationSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  AGENT_INSTRUCTION_TOOLS,
  CARTRIDGE_GENERATION_TOOLS,
  ISML_DOCUMENTATION_TOOLS,
  SFCC_DOCUMENTATION_TOOLS,
  SFRA_DOCUMENTATION_TOOLS,
} from '../src/core/tool-definitions.js';
import type { DwJsonConfig } from '../src/types/types.js';

let SFCCDevServer: typeof import('../src/core/server.js').SFCCDevServer;

class MockHandler {
  canHandle(_toolName: string): boolean {
    return false;
  }

  async handle(): Promise<{ content: Array<{ type: 'text'; text: string }>; isError: boolean }> {
    return {
      content: [{ type: 'text', text: 'mocked handler response' }],
      isError: false,
    };
  }

  async dispose(): Promise<void> {
    return;
  }
}

jest.mock('../src/core/handlers/log-handler.js', () => ({ LogToolHandler: MockHandler }));
jest.mock('../src/core/handlers/job-log-handler.js', () => ({ JobLogToolHandler: MockHandler }));
jest.mock('../src/core/handlers/docs-handler.js', () => ({ DocsToolHandler: MockHandler }));
jest.mock('../src/core/handlers/sfra-handler.js', () => ({ SFRAToolHandler: MockHandler }));
jest.mock('../src/core/handlers/isml-handler.js', () => ({ ISMLToolHandler: MockHandler }));
jest.mock('../src/core/handlers/system-object-handler.js', () => ({ SystemObjectToolHandler: MockHandler }));
jest.mock('../src/core/handlers/code-version-handler.js', () => ({ CodeVersionToolHandler: MockHandler }));
jest.mock('../src/core/handlers/cartridge-handler.js', () => ({ CartridgeToolHandler: MockHandler }));
jest.mock('../src/core/handlers/agent-instructions-handler.js', () => ({ AgentInstructionsToolHandler: MockHandler }));
jest.mock('../src/core/handlers/script-debugger-handler.js', () => ({ ScriptDebuggerToolHandler: MockHandler }));
jest.mock('../src/clients/agent-instructions-client.js', () => ({
  AgentInstructionsClient: class {
    async getStatus(): Promise<{
      workspaceRoot?: string;
      hasAgents: boolean;
      hasSkills: boolean;
      missingSkills: string[];
      sourceSkills: string[];
    }> {
      return {
        workspaceRoot: undefined,
        hasAgents: true,
        hasSkills: true,
        missingSkills: [],
        sourceSkills: [],
      };
    }
  },
}));

type RequestHandler = (request: { params: { name: string; arguments?: Record<string, unknown> } }) => Promise<unknown>;
type ListToolsHandler = () => Promise<{ tools: unknown[] }>;
type NotificationHandler = (notification: { method: string; params?: Record<string, unknown> }) => Promise<void> | void;

interface MockMcpServer {
  oninitialized?: () => Promise<void> | void;
  setRequestHandler: jest.Mock;
  setNotificationHandler: jest.Mock;
  listRoots: jest.Mock;
  sendToolListChanged: jest.Mock;
  connect: jest.Mock;
}

const serverInstances: MockMcpServer[] = [];

jest.mock('@modelcontextprotocol/sdk/server/index.js', () => {
  return {
    Server: jest.fn().mockImplementation(() => {
      const mockServer: MockMcpServer = {
        oninitialized: undefined,
        setRequestHandler: jest.fn(),
        setNotificationHandler: jest.fn(),
        listRoots: jest.fn().mockResolvedValue({ roots: [] }),
        sendToolListChanged: jest.fn().mockResolvedValue(undefined),
        connect: jest.fn().mockResolvedValue(undefined),
      };

      serverInstances.push(mockServer);
      return mockServer;
    }),
  };
});

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => {
  return {
    StdioServerTransport: jest.fn().mockImplementation(() => ({})),
  };
});

function getLatestMockServer(): MockMcpServer {
  const latest = serverInstances[serverInstances.length - 1];
  if (!latest) {
    throw new Error('Expected mocked MCP server instance to exist');
  }
  return latest;
}

function getListToolsHandler(mockServer: MockMcpServer): ListToolsHandler {
  const match = mockServer.setRequestHandler.mock.calls.find(([schema]) => schema === ListToolsRequestSchema);
  if (!match) {
    throw new Error('ListTools request handler was not registered');
  }
  return match[1] as ListToolsHandler;
}

function getCallToolHandler(mockServer: MockMcpServer): RequestHandler {
  const match = mockServer.setRequestHandler.mock.calls.find(([schema]) => schema === CallToolRequestSchema);
  if (!match) {
    throw new Error('CallTool request handler was not registered');
  }
  return match[1] as RequestHandler;
}

function getRootsChangedHandler(mockServer: MockMcpServer): NotificationHandler {
  const match = mockServer.setNotificationHandler.mock.calls.find(
    ([schema]) => schema === RootsListChangedNotificationSchema,
  );
  if (!match) {
    throw new Error('Roots list changed notification handler was not registered');
  }
  return match[1] as NotificationHandler;
}

describe('SFCCDevServer', () => {
  beforeAll(async () => {
    ({ SFCCDevServer } = await import('../src/core/server.js'));
  });

  beforeEach(() => {
    serverInstances.length = 0;
    jest.clearAllMocks();
  });

  it('returns docs-only tool surface when credentials are unavailable', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    expect(server).toBeDefined();

    const mockServer = getLatestMockServer();
    const listToolsHandler = getListToolsHandler(mockServer);

    const result = await listToolsHandler();
    const expectedDocsOnlyCount = AGENT_INSTRUCTION_TOOLS.length +
      SFCC_DOCUMENTATION_TOOLS.length +
      SFRA_DOCUMENTATION_TOOLS.length +
      ISML_DOCUMENTATION_TOOLS.length +
      CARTRIDGE_GENERATION_TOOLS.length;

    expect(result.tools).toHaveLength(expectedDocsOnlyCount);
  });

  it('returns tool error for unknown tools', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
    };

    serverAny.handlers = [];
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({ params: { name: 'unknown_tool' } }) as {
      isError: boolean;
      structuredContent?: { error?: { code?: string } };
    };

    expect(result).toMatchObject({ isError: true });
    expect(JSON.stringify(result)).toContain('Unknown tool: unknown_tool');
    expect(result.structuredContent).toBeUndefined();
  });

  it('rejects tools that are unavailable in the current mode before handler execution', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
    };

    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'search_logs',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'should not run' }],
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({
      params: {
        name: 'search_logs',
        arguments: { pattern: 'order' },
      },
    }) as {
      content: Array<{ type: string; text: string }>;
      isError: boolean;
    };

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('Tool not available in current mode');
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('rejects missing required arguments for known tools before handler execution', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
    };

    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'search_sfra_documentation',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'should not run' }],
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({
      params: {
        name: 'search_sfra_documentation',
        arguments: {},
      },
    }) as {
      content: Array<{ type: string; text: string }>;
      isError: boolean;
      structuredContent?: { error?: { code?: string } };
    };

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toBeUndefined();
    expect(result.content[0]?.text).toContain('Invalid arguments for tool');
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('rejects invalid enum values before handler execution for conditional tools', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
      capabilities: { canAccessLogs: boolean; canAccessOCAPI: boolean };
    };

    // Force capability on so validation can execute instead of availability guard short-circuiting.
    serverAny.capabilities = { canAccessLogs: true, canAccessOCAPI: false };

    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'search_logs',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'should not run' }],
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({
      params: {
        name: 'search_logs',
        arguments: { pattern: 'order', logLevel: 'fatal' },
      },
    }) as {
      content: Array<{ type: string; text: string }>;
      isError: boolean;
    };

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('must be one of');
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('rejects unknown top-level arguments before handler execution', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
    };

    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'search_sfcc_classes',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'should not run' }],
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({
      params: {
        name: 'search_sfcc_classes',
        arguments: { query: 'catalog', extra: true },
      },
    }) as {
      content: Array<{ type: string; text: string }>;
      isError: boolean;
    };

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('is not allowed');
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('appends preflight notice as a separate content entry without mutating tool payload text', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
      allToolNames: Set<string>;
      alwaysAvailableToolNames: Set<string>;
    };

    const originalPayload = JSON.stringify({ ok: true, data: [1, 2, 3] });
    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'mock_tool',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: originalPayload }],
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.allToolNames.add('mock_tool');
    serverAny.alwaysAvailableToolNames.add('mock_tool');
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue('Please decide whether to install skills.') };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({ params: { name: 'mock_tool', arguments: {} } }) as {
      content: Array<{ type: string; text: string }>;
      isError: boolean;
    };

    expect(result.isError).toBe(false);
    expect(result.content).toHaveLength(2);
    expect(result.content[0]?.text).toBe(originalPayload);
    expect(result.content[1]?.text).toContain('Please decide whether to install skills.');
  });

  it('propagates structuredContent from handlers', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      handlers: Array<{ canHandle: (toolName: string) => boolean; handle: jest.Mock }>;
      instructionAdvisor: { getNotice: jest.Mock };
      allToolNames: Set<string>;
      alwaysAvailableToolNames: Set<string>;
    };

    const structuredPayload = { ok: true, count: 2, ids: ['a', 'b'] };
    const mockHandler = {
      canHandle: (toolName: string) => toolName === 'mock_tool',
      handle: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(structuredPayload) }],
        structuredContent: structuredPayload,
        isError: false,
      }),
      dispose: jest.fn().mockResolvedValue(undefined),
    };

    serverAny.handlers = [mockHandler];
    serverAny.allToolNames.add('mock_tool');
    serverAny.alwaysAvailableToolNames.add('mock_tool');
    serverAny.instructionAdvisor = { getNotice: jest.fn().mockResolvedValue(undefined) };

    const mockServer = getLatestMockServer();
    const callToolHandler = getCallToolHandler(mockServer);
    const result = await callToolHandler({ params: { name: 'mock_tool', arguments: {} } }) as {
      content: Array<{ type: string; text: string }>;
      structuredContent?: unknown;
      isError: boolean;
    };

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toEqual(structuredPayload);
    expect(result.content[0]?.text).toBe(JSON.stringify(structuredPayload));
  });

  it('discovers workspace roots on initialization and triggers reconfigure on success', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      workspaceRootsService: { discoverDwJson: jest.Mock };
      reconfigureWithCredentials: jest.Mock;
    };

    const discoveredConfig: DwJsonConfig = {
      hostname: 'example.sandbox.us01.dx.commercecloud.salesforce.com',
      username: 'user',
      password: 'pass',
      'client-id': 'client-id',
      'client-secret': 'client-secret',
    };

    serverAny.workspaceRootsService.discoverDwJson = jest.fn().mockReturnValue({
      success: true,
      config: discoveredConfig,
      dwJsonPath: '/tmp/workspace/dw.json',
    });

    const reconfigureSpy = jest.spyOn(serverAny, 'reconfigureWithCredentials').mockResolvedValue(undefined);

    const mockServer = getLatestMockServer();
    mockServer.listRoots.mockResolvedValue({ roots: [{ uri: 'file:///tmp/workspace', name: 'workspace' }] });

    await mockServer.oninitialized?.();

    expect(mockServer.listRoots).toHaveBeenCalledTimes(1);
    expect(reconfigureSpy).toHaveBeenCalledWith(discoveredConfig);
  });

  it('refreshes workspace-root discovery on roots/list_changed notifications', async () => {
    const server = new SFCCDevServer({ hostname: '' });
    const serverAny = server as unknown as {
      workspaceRootsService: { discoverDwJson: jest.Mock };
    };

    serverAny.workspaceRootsService.discoverDwJson = jest.fn().mockReturnValue({
      success: false,
      reason: 'No dw.json found in workspace roots',
    });

    const mockServer = getLatestMockServer();
    mockServer.listRoots.mockResolvedValue({ roots: [{ uri: 'file:///tmp/workspace' }] });

    const rootsChangedHandler = getRootsChangedHandler(mockServer);
    await rootsChangedHandler({ method: 'notifications/roots/list_changed' });

    expect(mockServer.listRoots).toHaveBeenCalledTimes(1);
    expect(serverAny.workspaceRootsService.discoverDwJson).toHaveBeenCalledTimes(1);
  });

  it('does not override explicit CLI/ENV configuration on roots/list_changed notifications', async () => {
    const server = new SFCCDevServer({
      hostname: 'explicit-host.sandbox.us01.dx.commercecloud.salesforce.com',
      username: 'user',
      password: 'pass',
    });
    const serverAny = server as unknown as {
      workspaceRootsService: { discoverDwJson: jest.Mock };
    };

    serverAny.workspaceRootsService.discoverDwJson = jest.fn();

    const mockServer = getLatestMockServer();
    const rootsChangedHandler = getRootsChangedHandler(mockServer);
    await rootsChangedHandler({ method: 'notifications/roots/list_changed' });

    expect(mockServer.listRoots).not.toHaveBeenCalled();
    expect(serverAny.workspaceRootsService.discoverDwJson).not.toHaveBeenCalled();
  });

  it('cleans up process signal listeners and exits only once during repeated shutdown calls', async () => {
    const onSpy = jest.spyOn(process, 'on');
    const offSpy = jest.spyOn(process, 'off');
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

    const server = new SFCCDevServer({ hostname: '' });
    await server.run();

    expect(onSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));

    await (server as unknown as { shutdown: () => Promise<void> }).shutdown();
    await (server as unknown as { shutdown: () => Promise<void> }).shutdown();

    expect(offSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(exitSpy).toHaveBeenCalledTimes(1);

    onSpy.mockRestore();
    offSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
