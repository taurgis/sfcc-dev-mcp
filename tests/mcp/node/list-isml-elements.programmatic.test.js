/**
 * Programmatic tests for the MCP tool: list_isml_elements
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Basic successful invocation returns non-empty array JSON string
 * 3. JSON parse yields objects with required keys (name, title, description, category, filename)
 * 4. Category coverage (expects at least: control-flow, output, includes, scripting, cache, decorators, payment, analytics, special)
 * 5. Essential element presence (isif, isloop, isprint, isscript, isset)
 * 6. Extraneous argument tolerance (should ignore unexpected params)
 * 7. Negative invalid method error path via raw JSON-RPC call
 * 8. Response stability and determinism
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('list_isml_elements (programmatic)', () => {
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
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  const TOOL_NAME = 'list_isml_elements';
  const REQUIRED_CATEGORIES = ['control-flow', 'output', 'includes', 'scripting', 'cache', 'decorators', 'payment', 'analytics', 'special'];
  const REQUIRED_KEYS = ['name', 'title', 'description', 'category', 'filename'];
  const ESSENTIAL_ELEMENTS = ['isif', 'isloop', 'isprint', 'isscript', 'isset'];

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

  function safeParseElements(raw) {
    let elements;
    try {
      elements = JSON.parse(raw);
    } catch (err) {
      assert.fail(`Failed to parse response as JSON: ${err.message}\nRaw: ${raw.substring(0, 500)}`);
    }
    assert.ok(Array.isArray(elements), 'Parsed elements should be array');
    assert.ok(elements.length >= 20, 'Expect at least 20 ISML elements');
    return elements;
  }

  test('basic invocation returns valid JSON array with required keys', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    // Validate keys & reasonable string values
    for (const el of elements.slice(0, 30)) {
      for (const key of REQUIRED_KEYS) {
        assert.ok(Object.prototype.hasOwnProperty.call(el, key), `Element should have ${key}: ${JSON.stringify(el)}`);
        if (typeof el[key] === 'string') {
          assert.ok(el[key].length > 0, `${key} should be non-empty string`);
        }
      }
      // Validate category is one of expected
      assert.ok(REQUIRED_CATEGORIES.includes(el.category), `Category ${el.category} should be in expected list`);
      // Validate filename pattern
      assert.match(el.filename, /^[a-z0-9-]+\.md$/, 'Filename should be kebab-case .md');
    }
  });

  test('category coverage present', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const categories = new Set(elements.map(el => el.category));
    
    for (const cat of REQUIRED_CATEGORIES) {
      assert.ok(categories.has(cat), `Expected category ${cat} not found in elements`);
    }
  });

  test('essential ISML elements present', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const elementNames = new Set(elements.map(el => el.name));
    
    for (const essential of ESSENTIAL_ELEMENTS) {
      assert.ok(elementNames.has(essential), `Essential element ${essential} not found`);
    }
  });

  test('extraneous argument is ignored', async () => {
    const { raw } = await invoke({ unused: 'value', extra: 123 });
    const elements = safeParseElements(raw);
    assert.ok(elements.length >= 20, 'At least 20 elements expected with extraneous arguments');
  });

  test('element name uniqueness', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const names = elements.map(el => el.name);
    const nameSet = new Set(names);
    assert.equal(nameSet.size, names.length, 'Element names must be unique');
  });

  test('filename uniqueness', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const filenames = elements.map(el => el.filename);
    const fileSet = new Set(filenames);
    assert.equal(fileSet.size, filenames.length, 'Filenames must be unique');
  });

  test('category distribution sanity (no category monopolizes >60%)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const counts = elements.reduce((acc, el) => {
      acc[el.category] = (acc[el.category] || 0) + 1;
      return acc;
    }, {});
    const total = elements.length;
    
    for (const [cat, cnt] of Object.entries(counts)) {
      assert.ok(cnt / total <= 0.6, `Category ${cat} has ${cnt}/${total} (${(cnt/total*100).toFixed(1)}%) - too concentrated`);
    }
  });

  test('deterministic ordering (two calls produce identical first 10 names)', async () => {
    const first = safeParseElements((await invoke()).raw).slice(0, 10).map(el => el.name);
    const second = safeParseElements((await invoke()).raw).slice(0, 10).map(el => el.name);
    assert.deepEqual(second, first, 'First 10 element names should be stable across calls');
  });

  test('sample elements contain expected semantic keywords', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const textBlob = JSON.stringify(elements.slice(0, 30)).toLowerCase();
    const expected = ['isif', 'isloop', 'isprint', 'template', 'control'];
    
    for (const token of expected) {
      assert.ok(textBlob.includes(token), `Expected keyword "${token}" not found in sample elements`);
    }
  });

  test('no empty or placeholder names/titles', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(el.name && el.name.trim().length > 0, 'Name should not be empty');
      assert.ok(el.title && el.title.trim().length > 0, 'Title should not be empty');
      assert.ok(!el.name.toLowerCase().includes('placeholder'), `Name should not be placeholder: ${el.name}`);
      assert.ok(!el.title.toLowerCase().includes('todo'), `Title should not be TODO: ${el.title}`);
    }
  });

  test('round-trip JSON parse reproducibility (stringify->parse equality for first 5)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw).slice(0, 5);
    const roundTrip = JSON.parse(JSON.stringify(elements));
    assert.deepEqual(roundTrip, elements, 'Round trip serialization must preserve first 5 elements');
  });

  test('at least one element per required category', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const counts = elements.reduce((acc, el) => {
      acc[el.category] = (acc[el.category] || 0) + 1;
      return acc;
    }, {});
    
    for (const cat of REQUIRED_CATEGORIES) {
      assert.ok(counts[cat] && counts[cat] > 0, `Category ${cat} should have at least one element`);
    }
  });

  test('element count stable across two invocations (delta <= 2)', async () => {
    const firstLen = safeParseElements((await invoke()).raw).length;
    const secondLen = safeParseElements((await invoke()).raw).length;
    const delta = Math.abs(secondLen - firstLen);
    assert.ok(delta <= 2, `Element count should be stable: first=${firstLen}, second=${secondLen}, delta=${delta}`);
  });

  test('category histogram logged for diagnostic insight (non-asserting)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const histogram = elements.reduce((acc, el) => {
      acc[el.category] = (acc[el.category] || 0) + 1;
      return acc;
    }, {});
    console.log('Category Distribution:', histogram);
  });

  test('ensure presence of canonical control-flow elements', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const controlFlow = elements.filter(el => el.category === 'control-flow');
    const controlNames = new Set(controlFlow.map(el => el.name));
    
    const canonical = ['isif', 'isloop', 'isbreak', 'iscontinue'];
    for (const name of canonical) {
      assert.ok(controlNames.has(name), `Canonical control-flow element ${name} should be present`);
    }
  });

  test('ensure presence of key output and scripting elements', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    const names = new Set(elements.map(el => el.name));
    
    const keyElements = ['isprint', 'isscript', 'isset'];
    for (const name of keyElements) {
      assert.ok(names.has(name), `Key element ${name} should be present`);
    }
  });

  test('no obvious placeholder filenames', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(!el.filename.includes('placeholder'), `Filename should not be placeholder: ${el.filename}`);
      assert.ok(!el.filename.includes('temp'), `Filename should not be temp: ${el.filename}`);
    }
  });

  test('filename extension enforcement (.md only)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.match(el.filename, /\.md$/, `Filename should end with .md: ${el.filename}`);
    }
  });

  test('negative path: invalid method should return JSON-RPC error', async () => {
    // Raw JSON-RPC send with invalid method name returns error response (not throw)
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'bad-method-1',
      method: 'tools/call_WRONG',
      params: { name: TOOL_NAME, arguments: {} }
    });
    assert.ok(response.error, 'Expected JSON-RPC error object');
    assert.match(response.error.message || '', /method/i, 'Error message should mention method');
  });

  test('description quality check (min length 50 chars)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(el.description.length >= 50, `Description too short for ${el.name}: ${el.description.length} chars`);
    }
  });

  test('title quality check (reasonable length 10-100 chars)', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    for (const el of elements) {
      assert.ok(el.title.length >= 10, `Title too short for ${el.name}: ${el.title}`);
      assert.ok(el.title.length <= 100, `Title too long for ${el.name}: ${el.title}`);
    }
  });

  test('performance: response time under 500ms', async () => {
    const start = Date.now();
    await invoke();
    const duration = Date.now() - start;
    assert.ok(duration < 500, `Response should be under 500ms, got ${duration}ms`);
  });

  test('alphabetical name sorting verification within categories', async () => {
    const { raw } = await invoke();
    const elements = safeParseElements(raw);
    
    // Group by category
    const byCategory = {};
    for (const el of elements) {
      if (!byCategory[el.category]) {
        byCategory[el.category] = [];
      }
      byCategory[el.category].push(el.name);
    }
    
    // Each category should be sorted alphabetically
    for (const [category, names] of Object.entries(byCategory)) {
      const sorted = [...names].sort();
      assert.deepEqual(names, sorted, `${category} category elements should be alphabetically sorted`);
    }
  });
});
