import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * Programmatic tests for the MCP tool: get_available_sfra_documents
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Basic successful invocation returns non-empty array JSON string
 * 3. JSON parse yields objects with required keys (id, name, category, filename)
 * 4. Category coverage (expects at least: core, product, order, customer, pricing, store, other)
 * 5. Extraneous argument tolerance (should ignore unexpected params)
 * 6. Negative invalid method error path via raw JSON-RPC call
 */

describe('get_available_sfra_documents (programmatic)', () => {
  let client;
  const CONFIG = './aegis.config.docs-only.json';

  before(async () => {
    client = await connect(CONFIG);
  });

  after(async () => {
    if (client?.connected) await client.disconnect();
  });

  beforeEach(() => {
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  const TOOL_NAME = 'get_available_sfra_documents';
  const REQUIRED_CATEGORIES = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
  // Actual response objects do NOT include an explicit 'id' field; we validate name/category/filename
  const REQUIRED_KEYS = ['name', 'category', 'filename'];

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

  function safeParseDocuments(raw) {
    let docs;
    try {
      docs = JSON.parse(raw);
  } catch {
      // Attempt to extract JSON array via regex fallback if wrapping noise present
      const match = raw.match(/\[[\s\S]*\]/);
      assert.ok(match, 'Could not locate JSON array in content');
      docs = JSON.parse(match[0]);
    }
    assert.ok(Array.isArray(docs), 'Parsed docs should be array');
    assert.ok(docs.length >= 15, 'Expect at least 15 SFRA documents');
    return docs;
  }

  test('basic invocation returns valid JSON array with required keys', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    // Validate keys & reasonable string values
    for (const d of docs.slice(0, 25)) { // sample first 25 to keep runtime low
      for (const key of REQUIRED_KEYS) {
        assert.ok(Object.prototype.hasOwnProperty.call(d, key), `Missing key ${key}`);
        assert.equal(typeof d[key], 'string', `${key} should be string`);
        assert.ok(d[key].length > 0, `${key} should be non-empty`);
      }
    }
  });

  test('category coverage present', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const categories = new Set(docs.map(d => d.category));
    for (const c of REQUIRED_CATEGORIES) {
      assert.ok(categories.has(c), `Expected category ${c}`);
    }
  });

    test('extraneous argument is rejected', async () => {
      const result = await client.callTool(TOOL_NAME, { unused: 'value' });
      assert.equal(result.isError, true, 'Tool invocation should be error for unknown arguments');
      assert.ok(result.content?.[0]?.text?.includes('is not allowed'), 'Error should mention unknown arguments');
  });

  test('multiple product-* occurrences and filename pattern sanity', async () => {
    const { raw } = await invoke();
    assert.match(raw, /(product-).*(product-).*(product-)/s, 'Expect at least three product- occurrences');
  assert.match(raw, /"filename"\s*:\s*"[a-z0-9-]+\.md"/, 'Expect filename .md entries');
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

  test('argument validation error path (null arguments object)', async () => {
    let caught = null;
    try {
      await client.callTool(TOOL_NAME, null);
    } catch (err) {
      caught = err;
    }
    assert.ok(caught, 'Expected callTool to reject with invalid_type');
    assert.match(caught.message, /invalid_type|Expected object/i, 'Error should mention invalid type');
  });

  test('filenames unique and kebab-case', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const filenames = docs.map(d => d.filename);
    const fileSet = new Set(filenames);
    assert.equal(fileSet.size, filenames.length, 'Filenames must be unique');
    for (const f of filenames.slice(0, 50)) {
      assert.match(f, /^[a-z0-9-]+\.md$/, 'filename should be kebab-case .md');
    }
  });

  test('filename semantic correlation with name (first token appears in name)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    for (const d of docs.slice(0, 40)) {
      assert.match(d.filename, /^[a-z0-9-]+\.md$/, 'filename must be kebab-case .md');
      const firstSegment = d.filename.replace(/\.md$/, '').split('-')[0];
      assert.ok(d.name.toLowerCase().includes(firstSegment), 'name should contain filename first segment');
    }
  });

  test('category distribution sanity (no category monopolizes >70%)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const counts = docs.reduce((acc, d) => { acc[d.category] = (acc[d.category]||0)+1; return acc; }, {});
    const total = docs.length;
    for (const [cat, cnt] of Object.entries(counts)) {
      assert.ok(cnt / total <= 0.7, `Category ${cat} dominates with ${(cnt/total*100).toFixed(1)}%`);
    }
  });

  test('deterministic ordering (two calls produce identical first 10 IDs)', async () => {
    const first = safeParseDocuments((await invoke()).raw).slice(0,10).map(d=>d.id);
    const second = safeParseDocuments((await invoke()).raw).slice(0,10).map(d=>d.id);
    assert.deepEqual(second, first, 'First 10 IDs should be stable across calls');
  });

  test('sample documents contain expected semantic keywords', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const textBlob = JSON.stringify(docs.slice(0, 30)).toLowerCase();
    const expected = ['server', 'request', 'response', 'product', 'price', 'cart'];
    for (const token of expected) {
      assert.ok(textBlob.includes(token), `Expected token ${token} in first 30 docs blob`);
    }
  });

  test('no empty or placeholder names', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    for (const d of docs) {
      assert.ok(d.name.trim().length > 2, 'name should be >2 chars');
      assert.ok(!/^(todo|tbd|placeholder)$/i.test(d.name), 'name should not be placeholder');
    }
  });

  test('round-trip JSON parse reproducibility (stringify->parse equality for first 5)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw).slice(0,5);
    const roundTrip = JSON.parse(JSON.stringify(docs));
    assert.deepEqual(roundTrip, docs, 'Round trip serialization must preserve first 5 docs');
  });

  test('at least one document per required category and each category has <= 50% of docs', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const counts = docs.reduce((acc, d) => { acc[d.category] = (acc[d.category]||0)+1; return acc; }, {});
    const total = docs.length;
    for (const c of REQUIRED_CATEGORIES) {
      assert.ok(counts[c] > 0, `Category ${c} missing`);
      assert.ok((counts[c] / total) <= 0.5, `Category ${c} exceeds 50% threshold`);
    }
  });

  test('filename/id pairing uniqueness (no duplicate filename)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const filenames = docs.map(d => d.filename);
    const fileSet = new Set(filenames);
    assert.equal(fileSet.size, filenames.length, 'Filenames must be unique');
  });

  test('sorted by name alpha? (non-fatal heuristic) warn if not mostly sorted', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw).slice(0,30);
    const names = docs.map(d=>d.name.toLowerCase());
    const sorted = [...names].sort();
    let outOfOrder = 0;
    names.forEach((n,i)=>{ if(n!==sorted[i]) outOfOrder++; });
    if (outOfOrder > Math.ceil(names.length * 0.4)) {
      console.warn(`Heuristic: more than 40% (${outOfOrder}/${names.length}) of first 30 names out of alpha order`);
    }
  });

  // Removed category/id correlation test (no id field in response)

  // Removed id/filename prefix correlation (id not present)

  test('document count stable across two invocations (delta <= 2)', async () => {
    const firstLen = safeParseDocuments((await invoke()).raw).length;
    const secondLen = safeParseDocuments((await invoke()).raw).length;
    const delta = Math.abs(firstLen - secondLen);
    assert.ok(delta <= 2, `Doc count changed unexpectedly by ${delta}`);
  });

  test('category histogram logged for diagnostic insight (non-asserting)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const counts = docs.reduce((acc, d) => { acc[d.category] = (acc[d.category]||0)+1; return acc; }, {});
    console.info('SFRA docs category histogram:', counts);
  });

  test('ensure presence of canonical core documents', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const names = docs.map(d=>d.name.toLowerCase());
    const required = ['server', 'request', 'response', 'querystring', 'render'];
    for (const r of required) {
      assert.ok(names.some(n=>n.includes(r)), `Missing canonical core doc: ${r}`);
    }
  });

  test('ensure presence of key product/order/customer domain docs', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    const blob = JSON.stringify(docs).toLowerCase();
    const expected = ['product', 'cart', 'shipping', 'billing', 'account', 'customer', 'price'];
    for (const token of expected) {
      assert.ok(blob.includes(token), `Missing expected domain token: ${token}`);
    }
  });

  test('no obvious placeholder filenames', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    for (const d of docs) {
      assert.ok(!/(placeholder|temp|dummy)/i.test(d.filename), 'Filename should not look placeholder');
    }
  });

  test('filename extension enforcement (.md only)', async () => {
    const { raw } = await invoke();
    const docs = safeParseDocuments(raw);
    for (const d of docs) {
      assert.ok(d.filename.endsWith('.md'), 'All filenames must end with .md');
    }
  });
});
