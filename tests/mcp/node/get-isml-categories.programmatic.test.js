/**
 * Programmatic tests for the MCP tool: get_isml_categories
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Basic successful invocation returns non-empty array JSON string
 * 3. JSON parse yields objects with required keys (name, displayName, description, elementCount)
 * 4. All expected categories present (analytics, cache, control-flow, decorators, includes, output, payment, scripting, special)
 * 5. Element count accuracy and reasonableness
 * 6. Extraneous argument tolerance
 * 7. Negative error paths
 * 8. Response stability and determinism
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_isml_categories (programmatic)', () => {
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

  const TOOL_NAME = 'get_isml_categories';
  const REQUIRED_KEYS = ['name', 'displayName', 'description', 'count'];
  const EXPECTED_CATEGORIES = [
    'analytics',
    'cache',
    'control-flow',
    'decorators',
    'includes',
    'output',
    'payment',
    'scripting',
    'special'
  ];

  test('tool should be registered', async () => {
    const tools = await client.listTools();
    const names = tools.map(t => t.name);
    assert.ok(names.includes(TOOL_NAME), 'Tool not found in listTools');
  });

  async function invoke(extraArgs = {}) {
    const result = await client.callTool(TOOL_NAME, { ...extraArgs });
    assert.equal(result.isError, false, 'Tool invocation should not be error');
    assert.ok(result.content && Array.isArray(result.content) && result.content.length > 0, 'Content array expected');
    const textBlocks = result.content.filter(c => c.type === 'text');
    assert.ok(textBlocks.length > 0, 'At least one text block expected');
    const raw = textBlocks.map(t => t.text).join('\n');
    return { raw, result };
  }

  function safeParseCategories(raw) {
    let categories;
    try {
      categories = JSON.parse(raw);
    } catch (err) {
      assert.fail(`Failed to parse response as JSON: ${err.message}\nRaw: ${raw.substring(0, 500)}`);
    }
    assert.ok(Array.isArray(categories), 'Parsed categories should be array');
    assert.equal(categories.length, EXPECTED_CATEGORIES.length, `Should have exactly ${EXPECTED_CATEGORIES.length} categories`);
    return categories;
  }

  test('basic invocation returns valid JSON array with required keys', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    
    for (const cat of categories) {
      for (const key of REQUIRED_KEYS) {
        assert.ok(Object.prototype.hasOwnProperty.call(cat, key), `Category should have ${key}: ${JSON.stringify(cat)}`);
        if (key === 'count') {
          assert.ok(typeof cat[key] === 'number', `${key} should be number`);
          assert.ok(cat[key] > 0, `${key} should be positive`);
        } else {
          assert.ok(typeof cat[key] === 'string', `${key} should be string`);
          assert.ok(cat[key].length > 0, `${key} should be non-empty string`);
        }
      }
    }
  });

  test('all expected categories present', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const categoryNames = new Set(categories.map(cat => cat.name));
    
    for (const expected of EXPECTED_CATEGORIES) {
      assert.ok(categoryNames.has(expected), `Expected category ${expected} not found`);
    }
  });

  test('no unexpected categories', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const categoryNames = categories.map(cat => cat.name);
    
    for (const name of categoryNames) {
      assert.ok(EXPECTED_CATEGORIES.includes(name), `Unexpected category found: ${name}`);
    }
  });

  test('category name uniqueness', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const names = categories.map(cat => cat.name);
    const nameSet = new Set(names);
    assert.equal(nameSet.size, names.length, 'Category names must be unique');
  });

  test('element count total reasonableness (expect 25-40 total elements)', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const totalElements = categories.reduce((sum, cat) => sum + cat.count, 0);
    assert.ok(totalElements >= 25, `Total element count too low: ${totalElements}`);
    assert.ok(totalElements <= 40, `Total element count too high: ${totalElements}`);
  });

  test('control-flow category has expected element count', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const controlFlow = categories.find(cat => cat.name === 'control-flow');
    assert.ok(controlFlow, 'control-flow category should exist');
    assert.ok(controlFlow.count >= 5, `control-flow should have at least 5 elements, got ${controlFlow.count}`);
  });

    test('extraneous argument is rejected', async () => {
      const result = await client.callTool(TOOL_NAME, { unused: 'value', extra: 123 });
      assert.equal(result.isError, true, 'Tool invocation should be error for unknown arguments');
      assert.ok(result.content?.[0]?.text?.includes('is not allowed'), 'Error should mention unknown arguments');
  });

  test('deterministic ordering (two calls produce identical category order)', async () => {
    const first = safeParseCategories((await invoke()).raw).map(cat => cat.name);
    const second = safeParseCategories((await invoke()).raw).map(cat => cat.name);
    assert.deepEqual(second, first, 'Category order should be stable across calls');
  });

  test('displayName formatting quality (capitalized, reasonable length)', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    
    for (const cat of categories) {
      assert.ok(cat.displayName.length >= 4, `displayName too short: ${cat.displayName}`);
      assert.ok(cat.displayName.length <= 30, `displayName too long: ${cat.displayName}`);
      // Should start with capital letter
      assert.match(cat.displayName, /^[A-Z]/, `displayName should start with capital: ${cat.displayName}`);
    }
  });

  test('description quality (reasonable length 30-150 chars)', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    
    for (const cat of categories) {
      assert.ok(cat.description.length >= 30, `Description too short for ${cat.name}: ${cat.description.length} chars`);
      assert.ok(cat.description.length <= 150, `Description too long for ${cat.name}: ${cat.description.length} chars`);
    }
  });

  test('name format (kebab-case)', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    
    for (const cat of categories) {
      assert.match(cat.name, /^[a-z]+(-[a-z]+)*$/, `Category name should be kebab-case: ${cat.name}`);
    }
  });

  test('round-trip JSON parse reproducibility', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const roundTrip = JSON.parse(JSON.stringify(categories));
    assert.deepEqual(roundTrip, categories, 'Round trip serialization must preserve categories');
  });

  test('no empty or placeholder names/descriptions', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    
    for (const cat of categories) {
      assert.ok(cat.name && cat.name.trim().length > 0, 'Name should not be empty');
      assert.ok(cat.displayName && cat.displayName.trim().length > 0, 'DisplayName should not be empty');
      assert.ok(cat.description && cat.description.trim().length > 0, 'Description should not be empty');
      assert.ok(!cat.name.toLowerCase().includes('placeholder'), `Name should not be placeholder: ${cat.name}`);
      assert.ok(!cat.description.toLowerCase().includes('todo'), `Description should not be TODO: ${cat.description}`);
    }
  });

  test('category count stable across two invocations', async () => {
    const firstLen = safeParseCategories((await invoke()).raw).length;
    const secondLen = safeParseCategories((await invoke()).raw).length;
    assert.equal(secondLen, firstLen, 'Category count should be identical across calls');
  });

  test('element count histogram logged for diagnostic insight (non-asserting)', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const histogram = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.count;
      return acc;
    }, {});
    console.log('Element Count by Category:', histogram);
  });

  test('negative path: invalid method should return JSON-RPC error', async () => {
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'bad-method-1',
      method: 'tools/call_WRONG',
      params: { name: TOOL_NAME, arguments: {} }
    });
    assert.ok(response.error, 'Expected JSON-RPC error object');
    assert.match(response.error.message || '', /method/i, 'Error message should mention method');
  });

  test('performance: response time under 500ms', async () => {
    const start = Date.now();
    await invoke();
    const duration = Date.now() - start;
    assert.ok(duration < 500, `Response should be under 500ms, got ${duration}ms`);
  });

  test('alphabetical name sorting verification', async () => {
    const { raw } = await invoke();
    const categories = safeParseCategories(raw);
    const names = categories.map(cat => cat.name);
    const sorted = [...names].sort();
    assert.deepEqual(names, sorted, 'Category names should be alphabetically sorted');
  });

  test('element count consistency with list_isml_elements tool', async () => {
    // Get categories
    const { raw: catRaw } = await invoke();
    const categories = safeParseCategories(catRaw);
    const totalByCat = categories.reduce((sum, cat) => sum + cat.count, 0);
    
    // Get elements
    const elemResult = await client.callTool('list_isml_elements', {});
    const elemRaw = elemResult.content[0].text;
    const elements = JSON.parse(elemRaw);
    
    // Counts should match
    assert.equal(elements.length, totalByCat, 'Total element count should match sum of category counts');
  });

  test('each category name matches elements in list_isml_elements', async () => {
    // Get categories
    const { raw: catRaw } = await invoke();
    const categories = safeParseCategories(catRaw);
    
    // Get elements
    const elemResult = await client.callTool('list_isml_elements', {});
    const elemRaw = elemResult.content[0].text;
    const elements = JSON.parse(elemRaw);
    const elementCategories = new Set(elements.map(el => el.category));
    
    // All categories should be represented in elements
    for (const cat of categories) {
      assert.ok(elementCategories.has(cat.name), `Category ${cat.name} should have elements in list_isml_elements`);
    }
  });
});
