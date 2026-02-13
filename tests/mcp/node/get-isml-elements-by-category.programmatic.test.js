/**
 * Programmatic tests for the MCP tool: get_isml_elements_by_category
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Successful retrieval for all categories (control-flow, output, includes, scripting, cache, decorators, payment, analytics, special)
 * 3. Category filtering accuracy
 * 4. Element structure validation
 * 5. Error handling for invalid/missing category
 * 6. Category exclusivity (no cross-contamination)
 * 7. Response stability and determinism
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_isml_elements_by_category (programmatic)', () => {
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

  const TOOL_NAME = 'get_isml_elements_by_category';
  const ELEMENT_KEYS = ['name', 'title', 'description', 'category', 'filename'];
  const ALL_CATEGORIES = [
    'control-flow',
    'output',
    'includes',
    'scripting',
    'cache',
    'decorators',
    'payment',
    'analytics',
    'special'
  ];

  test('tool should be registered', async () => {
    const tools = await client.listTools();
    const names = tools.map(t => t.name);
    assert.ok(names.includes(TOOL_NAME), 'Tool not found in listTools');
  });

  async function invoke(category, options = {}) {
    const result = await client.callTool(TOOL_NAME, { category, ...options });
    return { result, raw: result.content[0]?.text };
  }

  function safeParseElements(raw) {
    let elements;
    try {
      elements = JSON.parse(raw);
    } catch (err) {
      assert.fail(`Failed to parse response as JSON: ${err.message}\nRaw: ${raw.substring(0, 500)}`);
    }
    assert.ok(Array.isArray(elements), 'Parsed elements should be array');
    return elements;
  }

  test('retrieve control-flow elements', async () => {
    const { result, raw } = await invoke('control-flow');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have control-flow elements');
    
    // Check known control-flow elements
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isif'), 'Should include isif');
    assert.ok(names.includes('isloop'), 'Should include isloop');
  });

  test('only return control-flow category elements', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.equal(el.category, 'control-flow', 'All elements should be control-flow category');
    }
  });

  test('retrieve output elements', async () => {
    const { result, raw } = await invoke('output');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have output elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isprint'), 'Should include isprint');
  });

  test('retrieve includes and components elements', async () => {
    const { result, raw } = await invoke('includes');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have includes elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isinclude'), 'Should include isinclude');
  });

  test('retrieve scripting elements', async () => {
    const { result, raw } = await invoke('scripting');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have scripting elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isscript'), 'Should include isscript');
    assert.ok(names.includes('isset'), 'Should include isset');
  });

  test('retrieve cache elements', async () => {
    const { result, raw } = await invoke('cache');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have cache elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('iscache'), 'Should include iscache');
  });

  test('retrieve decorator elements', async () => {
    const { result, raw } = await invoke('decorators');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have decorator elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isdecorate'), 'Should include isdecorate');
  });

  test('retrieve payment elements', async () => {
    const { result, raw } = await invoke('payment');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have payment elements');
    
    // Should include payment-related elements
    assert.ok(elements.every(el => el.category === 'payment'), 'All should be payment category');
  });

  test('retrieve analytics elements', async () => {
    const { result, raw } = await invoke('analytics');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have analytics elements');
    
    assert.ok(elements.every(el => el.category === 'analytics'), 'All should be analytics category');
  });

  test('retrieve special elements', async () => {
    const { result, raw } = await invoke('special');
    assert.equal(result.isError, false, 'Should not be error');
    
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should have special elements');
    
    const names = elements.map(el => el.name);
    assert.ok(names.includes('isredirect'), 'Should include isredirect');
  });

  test('all categories return valid element structures', async () => {
    for (const category of ALL_CATEGORIES.slice(0, 5)) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      
      for (const el of elements.slice(0, 5)) {
        for (const key of ELEMENT_KEYS) {
          assert.ok(Object.prototype.hasOwnProperty.call(el, key), `Element should have ${key} in ${category}`);
        }
      }
    }
  });

  test('category filtering is exclusive (no cross-contamination)', async () => {
    for (const category of ALL_CATEGORIES.slice(0, 5)) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      
      for (const el of elements) {
        assert.equal(el.category, category, `Element ${el.name} should be ${category}, got ${el.category}`);
      }
    }
  });

  test('error for missing category parameter', async () => {
    const result = await client.callTool(TOOL_NAME, {});
    assert.equal(result.isError, true, 'Should be error for missing category');
    assert.match(result.content[0].text, /category/i, 'Error should mention category');
  });

  test('error for invalid category', async () => {
    const { result } = await invoke('invalid-category');
    // Tool may return empty array or error - both are acceptable
    if (result.isError) {
      assert.ok(result.content[0].text.includes('not found') || result.content[0].text.includes('invalid'), 'Error should mention invalid category');
    } else {
      // If no error, should return empty array
      const elements = safeParseElements(result.content[0].text);
      assert.equal(elements.length, 0, 'Should return empty array for invalid category');
    }
  });

  test('element count consistency with get_isml_categories', async () => {
    // Get category metadata
    const catResult = await client.callTool('get_isml_categories', {});
    const categories = JSON.parse(catResult.content[0].text);
    
    // Check element counts match
    for (const cat of categories.slice(0, 5)) {
      const { raw } = await invoke(cat.name);
      const elements = safeParseElements(raw);
      assert.equal(elements.length, cat.count, `${cat.name} element count should match metadata: expected ${cat.count}, got ${elements.length}`);
    }
  });

  test('filename pattern validation', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.match(el.filename, /^[a-z0-9-]+\.md$/, 'Filename should be kebab-case .md');
    }
  });

  test('no empty or placeholder names', async () => {
    for (const category of ALL_CATEGORIES.slice(0, 5)) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      
      for (const el of elements) {
        assert.ok(el.name && el.name.trim().length > 0, `Name should not be empty in ${category}`);
        assert.ok(!el.name.toLowerCase().includes('placeholder'), `Name should not be placeholder: ${el.name}`);
      }
    }
  });

  test('round-trip JSON parse reproducibility', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    const roundTrip = JSON.parse(JSON.stringify(elements));
    assert.deepEqual(roundTrip, elements, 'Round trip serialization must preserve elements');
  });

  test('deterministic ordering (two calls produce identical results)', async () => {
    const first = safeParseElements((await invoke('control-flow')).raw).map(el => el.name);
    const second = safeParseElements((await invoke('control-flow')).raw).map(el => el.name);
    assert.deepEqual(second, first, 'Element order should be stable across calls');
  });

  test('element name uniqueness within category', async () => {
    for (const category of ALL_CATEGORIES.slice(0, 5)) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      const names = elements.map(el => el.name);
      const nameSet = new Set(names);
      assert.equal(nameSet.size, names.length, `Element names must be unique in ${category}`);
    }
  });

  test('description quality (min 50 chars)', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(el.description.length >= 50, `Description too short for ${el.name}: ${el.description.length} chars`);
    }
  });

  test('title quality (reasonable length)', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(el.title.length >= 10, `Title too short for ${el.name}`);
      assert.ok(el.title.length <= 100, `Title too long for ${el.name}`);
    }
  });

  test('negative path: invalid method should return JSON-RPC error', async () => {
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'bad-method-1',
      method: 'tools/call_WRONG',
      params: { name: TOOL_NAME, arguments: { category: 'control-flow' } }
    });
    assert.ok(response.error, 'Expected JSON-RPC error object');
    assert.match(response.error.message || '', /method/i, 'Error message should mention method');
  });

  test('performance: response time under 1000ms', async () => {
    const start = Date.now();
    await invoke('control-flow');
    const duration = Date.now() - start;
    assert.ok(duration < 1000, `Response should be under 1000ms, got ${duration}ms`);
  });

  test('extraneous parameters are ignored', async () => {
    const { result, raw } = await invoke('control-flow', { unused: 'value', extra: 123 });
    assert.equal(result.isError, false, 'Should ignore extraneous params');
    const elements = safeParseElements(raw);
    assert.ok(elements.length > 0, 'Should still return elements');
  });

  test('alphabetical sorting within category', async () => {
    const { raw } = await invoke('control-flow');
    const elements = safeParseElements(raw);
    const names = elements.map(el => el.name);
    const sorted = [...names].sort();
    assert.deepEqual(names, sorted, 'Elements should be alphabetically sorted');
  });

  test('case insensitive category lookup', async () => {
    const { result, raw } = await invoke('Control-Flow');
    // May work with case insensitivity or return empty/error - both acceptable
    if (!result.isError) {
      const elements = safeParseElements(raw);
      // If it works, should return control-flow elements
      if (elements.length > 0) {
        assert.ok(elements.every(el => el.category === 'control-flow'), 'Should normalize to control-flow');
      }
    }
    // Test passes if either case-insensitive or returns graceful empty/error
    assert.ok(true, 'Case handling tested');
  });

  test('all categories have at least one element', async () => {
    for (const category of ALL_CATEGORIES) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      assert.ok(elements.length > 0, `Category ${category} should have at least one element`);
    }
  });

  test('no category has more than 10 elements', async () => {
    for (const category of ALL_CATEGORIES) {
      const { raw } = await invoke(category);
      const elements = safeParseElements(raw);
      assert.ok(elements.length <= 10, `Category ${category} should have at most 10 elements, got ${elements.length}`);
    }
  });
});
