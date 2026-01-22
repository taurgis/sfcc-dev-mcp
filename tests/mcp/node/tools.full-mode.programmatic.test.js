import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('SFCC Development MCP Server - Full Mode with Credentials Tests (Tool Presence Only)', () => {
  let client;
  let toolsCache;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  test('should successfully connect to server with credentials', async () => {
    assert.ok(client.connected, 'Client should be connected');
  });

  test('should list all available tools in full mode', async () => {
    const tools = await client.listTools();
    toolsCache = tools; // Cache for other tests
    
    assert.ok(Array.isArray(tools), 'Tools should be an array');
    assert.ok(tools.length > 15, 'Should have more tools than documentation-only mode');
  });

  test('should have all documentation tools available', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // SFCC Documentation Tools
    assert.ok(toolNames.includes('get_sfcc_class_info'), 'Should have SFCC class info tool');
    assert.ok(toolNames.includes('search_sfcc_classes'), 'Should have SFCC class search tool');
    assert.ok(toolNames.includes('list_sfcc_classes'), 'Should have SFCC class list tool');

    // Agent Instructions Tool
    assert.ok(toolNames.includes('sync_agent_instructions'), 'Should have agent instructions sync tool');
    
    // SFRA Documentation Tools
    assert.ok(toolNames.includes('get_available_sfra_documents'), 'Should have SFRA documents list tool');
    assert.ok(toolNames.includes('get_sfra_document'), 'Should have SFRA document tool');
    
    // Cartridge Generation Tools
    assert.ok(toolNames.includes('generate_cartridge_structure'), 'Should have cartridge generation tool');
  });

  test('should have log analysis tools in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // Log analysis tools should be available with credentials
    assert.ok(toolNames.includes('get_latest_error'), 'Should have log error tool');
    assert.ok(toolNames.includes('get_latest_info'), 'Should have log info tool');
    assert.ok(toolNames.includes('get_latest_warn'), 'Should have log warn tool');
    assert.ok(toolNames.includes('get_latest_debug'), 'Should have log debug tool');
    assert.ok(toolNames.includes('summarize_logs'), 'Should have log summary tool');
    assert.ok(toolNames.includes('search_logs'), 'Should have log search tool');
    assert.ok(toolNames.includes('list_log_files'), 'Should have log file listing tool');
  });

  test('should have OCAPI system object tools in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // System object tools should be available with credentials
    assert.ok(toolNames.includes('get_system_object_definitions'), 'Should have system object definitions tool');
    assert.ok(toolNames.includes('get_system_object_definition'), 'Should have system object definition tool');
    assert.ok(toolNames.includes('search_system_object_attribute_definitions'), 'Should have system object attribute search tool');
    assert.ok(toolNames.includes('search_system_object_attribute_groups'), 'Should have system object attribute groups search tool');
    assert.ok(toolNames.includes('search_site_preferences'), 'Should have site preferences search tool');
  });

  test('should have code version tools in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // Code version tools should be available with credentials
    assert.ok(toolNames.includes('get_code_versions'), 'Should have code versions tool');
    assert.ok(toolNames.includes('activate_code_version'), 'Should have code version activation tool');
  });

  test('should have job log tools in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // Job log tools should be available with credentials
    assert.ok(toolNames.includes('get_latest_job_log_files'), 'Should have job log files tool');
    assert.ok(toolNames.includes('get_job_log_entries'), 'Should have job log entries tool');
    assert.ok(toolNames.includes('search_job_logs'), 'Should have job log search tool');
    assert.ok(toolNames.includes('search_job_logs_by_name'), 'Should have job log search by name tool');
    assert.ok(toolNames.includes('get_job_execution_summary'), 'Should have job execution summary tool');
  });

  // NOTE: We intentionally do NOT test tool execution in full mode because:
  // 1. The test credentials are not real SFCC instances
  // 2. Tools would fail with authentication/connection errors  
  // 3. This test suite is designed to verify tool PRESENCE, not functionality
  // 4. Tool functionality testing should be done against real SFCC development instances

  test('should have exactly 39 tools available in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    
    // Full mode should have exactly 39 tools
    assert.equal(tools.length, 39, `Should have exactly 39 tools, got ${tools.length}`);
  });

  test('should have WebDAV-dependent tools (log analysis)', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // WebDAV-dependent tools should be available
    assert.ok(toolNames.includes('summarize_logs'), 'Should have summarize_logs tool');
    assert.ok(toolNames.includes('get_log_file_contents'), 'Should have get_log_file_contents tool');
  });

  test('should have OCAPI-dependent tools (system objects)', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // OCAPI-dependent tools should be available
    assert.ok(toolNames.includes('search_site_preferences'), 'Should have search_site_preferences tool');
    assert.ok(toolNames.includes('search_custom_object_attribute_definitions'), 'Should have search_custom_object_attribute_definitions tool');
  });

  test('should include all docs-only tools in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    const toolNames = tools.map(tool => tool.name);
    
    // Verify that docs-only tools are NOT missing in full mode
    assert.ok(toolNames.includes('search_sfra_documentation'), 'Should have search_sfra_documentation tool');
    assert.ok(toolNames.includes('get_sfcc_class_info'), 'Should have get_sfcc_class_info tool');
    assert.ok(toolNames.includes('sync_agent_instructions'), 'Should have sync_agent_instructions tool');
  });

  test('should validate all tool schemas in full mode', async () => {
    const tools = toolsCache || await client.listTools();
    
    for (const tool of tools) {
      assert.ok(tool.name, `Tool should have a name: ${JSON.stringify(tool, null, 2)}`);
      assert.ok(tool.description, `Tool ${tool.name} should have a description`);
      assert.ok(tool.inputSchema, `Tool ${tool.name} should have an input schema`);
      assert.equal(tool.inputSchema.type, 'object', `Tool ${tool.name} input schema should be object type`);
    }
  });
});
