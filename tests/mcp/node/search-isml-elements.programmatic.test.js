/**
 * Programmatic tests for the MCP tool: search_isml_elements
 * Mirrors YAML tests but adds deeper JSON parsing & resilience checks.
 *
 * Validates:
 * 1. Tool is registered
 * 2. Successful search with various queries (loop, format, cache, condition)
 * 3. Search result structure (element, relevance, matchedSections, preview)
 * 4. Category filtering
 * 5. Result limit enforcement
 * 6. Relevance scoring
 * 7. Empty result handling
 * 8. Error handling for missing parameters
 * 9. Preview quality and content
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_isml_elements (programmatic)', () => {
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

  const TOOL_NAME = 'search_isml_elements';
  const RESULT_KEYS = ['element', 'relevance', 'matchedSections', 'preview'];
  const ELEMENT_KEYS = ['name', 'title', 'description', 'category', 'filename'];

  test('tool should be registered', async () => {
    const tools = await client.listTools();
    const names = tools.map(t => t.name);
    assert.ok(names.includes(TOOL_NAME), 'Tool not found in listTools');
  });

  async function invoke(query, options = {}) {
    const result = await client.callTool(TOOL_NAME, { query, ...options });
    return { result, raw: result.content[0]?.text };
  }

  function safeParseResults(raw) {
    let results;
    try {
      results = JSON.parse(raw);
    } catch (err) {
      assert.fail(`Failed to parse response as JSON: ${err.message}\nRaw: ${raw.substring(0, 500)}`);
    }
    assert.ok(Array.isArray(results), 'Parsed results should be array');
    return results;
  }

  test('search for loop-related elements', async () => {
    const { result, raw } = await invoke('loop');
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should find loop-related elements');
    
    // Check if isloop is in results
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('isloop'), 'Should include isloop element');
  });

  test('search for formatting elements', async () => {
    const { result, raw } = await invoke('format');
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should find formatting-related elements');
    
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('isprint'), 'Should include isprint element');
  });

  test('search for cache elements', async () => {
    const { result, raw } = await invoke('cache');
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should find cache-related elements');
    
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('iscache'), 'Should include iscache element');
  });

  test('search for conditional elements', async () => {
    const { result, raw } = await invoke('condition');
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should find conditional-related elements');
    
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('isif'), 'Should include isif element');
  });

  test('search result structure validation', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    for (const searchResult of results.slice(0, 5)) {
      // Check top-level keys
      for (const key of RESULT_KEYS) {
        assert.ok(Object.prototype.hasOwnProperty.call(searchResult, key), `Result should have ${key}`);
      }
      
      // Check element structure
      for (const key of ELEMENT_KEYS) {
        assert.ok(Object.prototype.hasOwnProperty.call(searchResult.element, key), `Element should have ${key}`);
      }
      
      // Check types
      assert.ok(typeof searchResult.relevance === 'number', 'Relevance should be number');
      assert.ok(Array.isArray(searchResult.matchedSections), 'matchedSections should be array');
      assert.ok(typeof searchResult.preview === 'string', 'Preview should be string');
    }
  });

  test('relevance scoring is present and positive', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    for (const result of results) {
      assert.ok(result.relevance > 0, `Relevance should be positive, got ${result.relevance}`);
    }
  });

  test('results sorted by relevance (descending)', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    if (results.length > 1) {
      const relevances = results.map(r => r.relevance);
      for (let i = 0; i < relevances.length - 1; i++) {
        assert.ok(relevances[i] >= relevances[i + 1], `Results should be sorted by relevance descending`);
      }
    }
  });

  test('filter search by category', async () => {
    const { result, raw } = await invoke('condition', { category: 'control-flow' });
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should find elements in control-flow category');
    
    // All results should be control-flow category
    for (const searchResult of results) {
      assert.equal(searchResult.element.category, 'control-flow', 'All results should be control-flow category');
    }
  });

  test('respect limit parameter', async () => {
    const { result, raw } = await invoke('element', { limit: 5 });
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    assert.ok(results.length <= 5, `Should respect limit of 5, got ${results.length}`);
  });

  test('preview snippets are present and reasonable', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    for (const searchResult of results.slice(0, 5)) {
      assert.ok(searchResult.preview.length >= 50, `Preview should be at least 50 chars, got ${searchResult.preview.length}`);
      assert.ok(searchResult.preview.length <= 300, `Preview should be at most 300 chars, got ${searchResult.preview.length}`);
    }
  });

  test('matchedSections array structure', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    for (const searchResult of results) {
      assert.ok(Array.isArray(searchResult.matchedSections), 'matchedSections should be array');
      // Array may be empty or contain strings
      if (searchResult.matchedSections.length > 0) {
        assert.ok(searchResult.matchedSections.every(s => typeof s === 'string'), 'All matchedSections should be strings');
      }
    }
  });

  test('return empty array for no matches', async () => {
    const { result, raw } = await invoke('zzznothingfound');
    assert.equal(result.isError, false, 'Should not be error for no matches');
    
    const results = safeParseResults(raw);
    assert.equal(results.length, 0, 'Should return empty array for no matches');
  });

  test('error for missing query parameter', async () => {
    const result = await client.callTool(TOOL_NAME, {});
    assert.equal(result.isError, true, 'Should be error for missing query');
    assert.match(result.content[0].text, /query/i, 'Error should mention query');
  });

  test('case insensitive search', async () => {
    const lowerResults = safeParseResults((await invoke('loop')).raw);
    const upperResults = safeParseResults((await invoke('LOOP')).raw);
    
    assert.equal(upperResults.length, lowerResults.length, 'Case should not affect result count');
  });

  test('partial word matching', async () => {
    const { raw } = await invoke('scri');
    const results = safeParseResults(raw);
    
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('isscript'), 'Should find isscript with partial match');
  });

  test('search for scripting elements', async () => {
    const { result, raw } = await invoke('script');
    assert.equal(result.isError, false, 'Should not be error');
    
    const results = safeParseResults(raw);
    const elementNames = results.map(r => r.element.name);
    assert.ok(elementNames.includes('isscript'), 'Should include isscript');
  });

  test('multiple category filtering combinations', async () => {
    const categories = ['control-flow', 'output', 'scripting'];
    
    for (const category of categories) {
      const { result, raw } = await invoke('element', { category });
      assert.equal(result.isError, false, `Should search in ${category} category`);
      
      const results = safeParseResults(raw);
      if (results.length > 0) {
        for (const searchResult of results) {
          assert.equal(searchResult.element.category, category, `All results should be ${category} category`);
        }
      }
    }
  });

  test('filename pattern in results', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    
    for (const searchResult of results.slice(0, 5)) {
      assert.match(searchResult.element.filename, /^[a-z0-9-]+\.md$/, 'Filename should be kebab-case .md');
    }
  });

  test('round-trip JSON parse reproducibility', async () => {
    const { raw } = await invoke('loop');
    const results = safeParseResults(raw);
    const roundTrip = JSON.parse(JSON.stringify(results));
    assert.deepEqual(roundTrip, results, 'Round trip serialization must preserve results');
  });

  test('negative path: invalid method should return JSON-RPC error', async () => {
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'bad-method-1',
      method: 'tools/call_WRONG',
      params: { name: TOOL_NAME, arguments: { query: 'loop' } }
    });
    assert.ok(response.error, 'Expected JSON-RPC error object');
    assert.match(response.error.message || '', /method/i, 'Error message should mention method');
  });

  test('performance: response time under 1500ms', async () => {
    const start = Date.now();
    await invoke('loop');
    const duration = Date.now() - start;
    assert.ok(duration < 1500, `Response should be under 1500ms, got ${duration}ms`);
  });

  test('extraneous parameters are ignored', async () => {
    const { result, raw } = await invoke('loop', { unused: 'value', extra: 123 });
    assert.equal(result.isError, false, 'Should ignore extraneous params');
    const results = safeParseResults(raw);
    assert.ok(results.length > 0, 'Should still return results');
  });

  test('default limit behavior (should have reasonable max)', async () => {
    const { raw } = await invoke('element');
    const results = safeParseResults(raw);
    
    // Default limit should be reasonable (not thousands of results)
    assert.ok(results.length <= 50, `Default limit should be reasonable, got ${results.length} results`);
  });

  test('query with special characters', async () => {
    const { result } = await invoke('loop-test');
    assert.equal(result.isError, false, 'Should handle special characters in query');
  });

  test('very short query (1 char)', async () => {
    const { result } = await invoke('l');
    assert.equal(result.isError, false, 'Should handle very short query');
  });

  test('very long query', async () => {
    const longQuery = 'loop iteration control flow template rendering scripting';
    const { result, raw } = await invoke(longQuery);
    assert.equal(result.isError, false, 'Should handle long query');
    const results = safeParseResults(raw);
    assert.ok(results.length >= 0, 'Should return results for long query');
  });

  test('search result consistency across invocations', async () => {
    const first = safeParseResults((await invoke('loop')).raw);
    const second = safeParseResults((await invoke('loop')).raw);
    
    assert.equal(second.length, first.length, 'Result count should be consistent');
    assert.deepEqual(second.map(r => r.element.name), first.map(r => r.element.name), 'Result order should be consistent');
  });
});
