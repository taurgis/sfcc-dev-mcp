/**
 * Programmatic tests for the MCP tool: get_isml_element
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Successful retrieval of valid elements (isif, isloop, isprint)
 * 3. Element normalization (with/without 'is' prefix)
 * 4. JSON structure validation (name, title, description, sections, content, category, attributes, filename)
 * 5. Include options (sections, attributes, content)
 * 6. Error handling for non-existent elements
 * 7. Error handling for missing parameters
 * 8. Content quality and completeness
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_isml_element (programmatic)', () => {
  let client;
  const CONFIG = './aegis.config.docs-only.json';

  before(async () => {
    client = await connect(CONFIG);
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearAllBuffers();
  });

  const TOOL_NAME = 'get_isml_element';
  const REQUIRED_KEYS = ['name', 'title', 'description', 'sections', 'content', 'category', 'attributes', 'filename'];

  test('tool should be registered', async () => {
    const tools = await client.listTools();
    const names = tools.map(t => t.name);
    assert.ok(names.includes(TOOL_NAME), 'Tool not found in listTools');
  });

  async function invoke(elementName, options = {}) {
    const result = await client.callTool(TOOL_NAME, { elementName, ...options });
    return { result, raw: result.content[0]?.text };
  }

  function safeParseElement(raw) {
    let element;
    try {
      element = JSON.parse(raw);
    } catch (err) {
      assert.fail(`Failed to parse response as JSON: ${err.message}\nRaw: ${raw.substring(0, 500)}`);
    }
    assert.ok(typeof element === 'object' && element !== null, 'Parsed element should be object');
    return element;
  }

  test('retrieve isif element with full details', async () => {
    const { result, raw } = await invoke('isif');
    assert.equal(result.isError, false, 'Should not be error');
    
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isif', 'Element name should be isif');
    assert.ok(element.title.includes('isif'), 'Title should mention isif');
    assert.ok(element.description.length > 50, 'Description should be substantial');
    assert.equal(element.category, 'control-flow', 'Should be control-flow category');
    assert.match(element.filename, /isif\.md$/, 'Filename should be isif.md');
  });

  test('retrieve isloop element details', async () => {
    const { result, raw } = await invoke('isloop');
    assert.equal(result.isError, false, 'Should not be error');
    
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isloop', 'Element name should be isloop');
    assert.ok(element.title.includes('isloop'), 'Title should mention isloop');
    assert.equal(element.category, 'control-flow', 'Should be control-flow category');
  });

  test('retrieve isprint element details', async () => {
    const { result, raw } = await invoke('isprint');
    assert.equal(result.isError, false, 'Should not be error');
    
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isprint', 'Element name should be isprint');
    assert.ok(element.title.includes('isprint'), 'Title should mention isprint');
    assert.equal(element.category, 'output', 'Should be output category');
  });

  test('normalize element name without is prefix', async () => {
    const { result, raw } = await invoke('print');
    assert.equal(result.isError, false, 'Should not be error');
    
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isprint', 'Should normalize to isprint');
  });

  test('all required keys present in response', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    for (const key of REQUIRED_KEYS) {
      assert.ok(Object.prototype.hasOwnProperty.call(element, key), `Element should have ${key}`);
    }
  });

  test('sections array is populated and reasonable', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(Array.isArray(element.sections), 'Sections should be array');
    assert.ok(element.sections.length >= 5, 'Should have at least 5 sections');
    assert.ok(element.sections.every(s => typeof s === 'string'), 'All sections should be strings');
    assert.ok(element.sections.every(s => s.length > 0), 'All sections should be non-empty');
  });

  test('attributes array is present', async () => {
    const { raw } = await invoke('isloop');
    const element = safeParseElement(raw);
    
    assert.ok(Array.isArray(element.attributes), 'Attributes should be array');
    // Some elements may have empty attributes array, that's ok
  });

  test('content is substantial markdown text', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(typeof element.content === 'string', 'Content should be string');
    assert.ok(element.content.length > 1000, 'Content should be substantial (>1000 chars)');
    assert.ok(element.content.includes('#'), 'Content should include markdown headers');
  });

  test('error for non-existent element', async () => {
    const { result } = await invoke('nonexistent');
    assert.equal(result.isError, true, 'Should be error');
    assert.ok(result.content[0].text.includes('not found'), 'Error should mention not found');
  });

  test('error for missing elementName parameter', async () => {
    const result = await client.callTool(TOOL_NAME, {});
    assert.equal(result.isError, true, 'Should be error for missing parameter');
    assert.match(result.content[0].text, /elementName/i, 'Error should mention elementName');
  });

  test('include sections option', async () => {
    const { raw } = await invoke('isif', { includeSections: true });
    const element = safeParseElement(raw);
    
    assert.ok(Array.isArray(element.sections), 'Sections should be included');
    assert.ok(element.sections.length > 0, 'Sections should not be empty');
  });

  test('include attributes option', async () => {
    const { raw } = await invoke('isloop', { includeAttributes: true });
    const element = safeParseElement(raw);
    
    assert.ok(Array.isArray(element.attributes), 'Attributes should be included');
  });

  test('include content option', async () => {
    const { raw } = await invoke('isif', { includeContent: true });
    const element = safeParseElement(raw);
    
    assert.ok(element.content, 'Content should be included');
    assert.ok(element.content.length > 0, 'Content should not be empty');
  });

  test('filename pattern validation', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.match(element.filename, /^[a-z0-9-]+\.md$/, 'Filename should be kebab-case .md');
  });

  test('lastModified timestamp present and valid', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(element.lastModified, 'lastModified should be present');
    const timestamp = new Date(element.lastModified);
    assert.ok(!isNaN(timestamp.getTime()), 'lastModified should be valid date');
  });

  test('round-trip JSON parse reproducibility', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    const roundTrip = JSON.parse(JSON.stringify(element));
    assert.deepEqual(roundTrip, element, 'Round trip serialization must preserve element');
  });

  test('retrieve multiple different elements successfully', async () => {
    const elements = ['isif', 'isloop', 'isprint', 'isscript', 'isset'];
    
    for (const elemName of elements) {
      const { result, raw } = await invoke(elemName);
      assert.equal(result.isError, false, `Should retrieve ${elemName} successfully`);
      const element = safeParseElement(raw);
      assert.equal(element.name, elemName, `Element name should match ${elemName}`);
    }
  });

  test('description quality (min 50 chars)', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(element.description.length >= 50, `Description should be at least 50 chars, got ${element.description.length}`);
  });

  test('title quality (reasonable length)', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(element.title.length >= 10, 'Title should be at least 10 chars');
    assert.ok(element.title.length <= 100, 'Title should be at most 100 chars');
  });

  test('negative path: invalid method should return JSON-RPC error', async () => {
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'bad-method-1',
      method: 'tools/call_WRONG',
      params: { name: TOOL_NAME, arguments: { elementName: 'isif' } }
    });
    assert.ok(response.error, 'Expected JSON-RPC error object');
    assert.match(response.error.message || '', /method/i, 'Error message should mention method');
  });

  test('performance: response time under 1000ms', async () => {
    const start = Date.now();
    await invoke('isif');
    const duration = Date.now() - start;
    assert.ok(duration < 1000, `Response should be under 1000ms, got ${duration}ms`);
  });

  test('case insensitive element name lookup', async () => {
    const { result, raw } = await invoke('ISIF');
    assert.equal(result.isError, false, 'Should handle uppercase');
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isif', 'Should normalize to lowercase');
  });

  test('mixed case element name lookup', async () => {
    const { result, raw } = await invoke('IsIf');
    assert.equal(result.isError, false, 'Should handle mixed case');
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isif', 'Should normalize to lowercase');
  });

  test('extraneous parameters are ignored', async () => {
    const { result, raw } = await invoke('isif', { unused: 'value', extra: 123 });
    assert.equal(result.isError, false, 'Should ignore extraneous params');
    const element = safeParseElement(raw);
    assert.equal(element.name, 'isif', 'Should still retrieve element');
  });

  test('content contains expected markdown structure', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    // Should contain typical markdown elements
    assert.ok(element.content.includes('##'), 'Should have H2 headers');
    assert.ok(element.content.includes('```'), 'Should have code blocks');
  });

  test('requiredAttributes and optionalAttributes arrays present', async () => {
    const { raw } = await invoke('isif');
    const element = safeParseElement(raw);
    
    assert.ok(Array.isArray(element.requiredAttributes), 'requiredAttributes should be array');
    assert.ok(Array.isArray(element.optionalAttributes), 'optionalAttributes should be array');
  });
});
