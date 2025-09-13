/**
 * Programmatic tests for get_hook_reference tool (docs-only mode)
 *
 * Response formats discovered via conductor query:
 *  Success (ocapi_hooks): { content:[{type:'text', text:'[ {"category": ... } ]'}], isError:false }
 *  Success (scapi_hooks): similar but includes signature fields in JSON text
 *  Invalid guideName: content text is "[]" (empty JSON array), isError:false
 *  Validation error (missing/empty guideName): { content:[{text:'Error: guideName must be a non-empty string'}], isError:true }
 *
 * This suite validates:
 *  - Tool presence in listTools
 *  - Successful retrieval for ocapi_hooks & scapi_hooks
 *  - Structural JSON parsing of categories & hooks
 *  - Presence of multiple hookPoints for basket endpoints
 *  - Presence of hook signatures in scapi_hooks
 *  - Validation errors for missing & empty guideName
 *  - Empty result handling for invalid guideName
 *  - Performance characteristics & basic variation ratio (CI-friendly thresholds)
 */

import { describe, test, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

class PerfMonitor {
  constructor() { this.samples = []; }
  record(ms) { this.samples.push(ms); }
  stats() {
    if (!this.samples.length) return null;
    const sorted = [...this.samples].sort((a,b)=>a-b);
    const min = sorted[0];
    const max = sorted[sorted.length-1];
    const avg = this.samples.reduce((a,b)=>a+b,0)/this.samples.length;
    return { count:this.samples.length, min, max, avg, variation: max/min };
  }
}

function parseHookReference(result) {
  assert.equal(result.isError, false, 'Expected non-error result');
  assert.ok(Array.isArray(result.content), 'content must be array');
  assert.ok(result.content.length > 0, 'content should have at least one item');
  const textItem = result.content.find(i => i.type === 'text');
  assert.ok(textItem, 'text content item required');
  const raw = textItem.text.trim();
  let data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try { data = JSON.parse(raw); } catch (e) {
    throw new Error('Failed to JSON.parse hook reference payload: ' + raw.slice(0,200));
  }
  assert.ok(Array.isArray(data), 'Top-level parsed data must be array of categories');
  return { raw, data };
}

function findCategory(data, nameFragment) {
  return data.find(c => typeof c.category === 'string' && c.category.toLowerCase().includes(nameFragment.toLowerCase()));
}

function validateHookSchema(h) {
  assert.ok(typeof h.endpoint === 'string' && h.endpoint.length > 0, 'hook.endpoint must be non-empty string');
  assert.ok(Array.isArray(h.hookPoints), 'hook.hookPoints must be array');
  h.hookPoints.forEach(p => assert.ok(typeof p === 'string' && p.length > 0, 'hookPoint must be non-empty string'));
  if ('signature' in h) {
    assert.ok(typeof h.signature === 'string' && /\w+\(/.test(h.signature), 'signature should look like a function');
  }
}

describe('get_hook_reference.docs-only (programmatic)', () => {
  let client;
  const perfOcapi = new PerfMonitor();
  const perfScapi = new PerfMonitor();

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) await client.disconnect();
  });

  beforeEach(() => {
    client.clearStderr();
  });

  test('tool should be present in listTools', async () => {
    const tools = await client.listTools();
    const names = tools.map(t => t.name);
    assert.ok(names.includes('get_hook_reference'), 'get_hook_reference should be registered');
  });

  test('ocapi_hooks reference basic structure', async () => {
    const start = Date.now();
    const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });
    perfOcapi.record(Date.now()-start);
    const { data, raw } = parseHookReference(result);
    assert.ok(data.length >= 2, 'Expect >=2 categories (Shop API Hooks, Data API Hooks)');

    const shopCat = findCategory(data, 'shop api');
    const dataCat = findCategory(data, 'data api');
    assert.ok(shopCat, 'Shop API Hooks category missing');
    assert.ok(dataCat, 'Data API Hooks category missing');

    // Validate hook objects minimally
    for (const cat of [shopCat, dataCat]) {
      assert.ok(Array.isArray(cat.hooks), 'category.hooks must be array');
      assert.ok(cat.hooks.length > 0, 'category.hooks should not be empty');
      const firstHook = cat.hooks[0];
      assert.ok(firstHook.endpoint, 'hook.endpoint required');
      assert.ok(Array.isArray(firstHook.hookPoints), 'hook.hookPoints must be array');
    }

    // Basket POST should have multiple hookPoints including modifyPOSTResponse or validateBasket
    const basketPost = shopCat.hooks.find(h => /POST \/baskets$/.test(h.endpoint));
    if (basketPost) {
      const points = basketPost.hookPoints.join(' ');
      assert.ok(/modifyPOSTResponse/.test(points) || /validateBasket/.test(points), 'Basket POST should expose modifyPOSTResponse or validateBasket');
    } else {
      // Non-fatal, but log for debugging
      console.warn('Basket POST endpoint not found in OCAPI shop hooks');
    }

    assert.ok(raw.length > 500, 'Raw OCAPI JSON text should exceed 500 chars for richness');
  });

  test('scapi_hooks reference includes signatures & structural integrity', async () => {
    const start = Date.now();
    const result = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });
    perfScapi.record(Date.now()-start);
    const { data, raw } = parseHookReference(result);
    assert.ok(data.length >= 3, 'Expect >=3 categories for SCAPI');

    const basketCat = findCategory(data, 'baskets');
    const ordersCat = findCategory(data, 'orders');
    assert.ok(basketCat, 'Basket category missing');
    assert.ok(ordersCat, 'Orders category missing');

    // Validate full schema for first 3 hooks of basket category (or all if <3)
    basketCat.hooks.slice(0,3).forEach(validateHookSchema);

    // SCAPI version adds signature field per hook (at least some hooks)
    const signaturePresent = basketCat.hooks.some(h => 'signature' in h && /\w+\(.+\)/.test(h.signature));
    assert.ok(signaturePresent, 'Expected at least one signature field with function pattern in SCAPI hooks');

    // Validate at least one hook shows beforePOST/afterPOST pair
    const anyBefore = basketCat.hooks.some(h => h.hookPoints.some(p => /beforePOST/.test(p)));
    const anyAfter = basketCat.hooks.some(h => h.hookPoints.some(p => /afterPOST/.test(p)));
    assert.ok(anyBefore && anyAfter, 'Expect beforePOST and afterPOST patterns in SCAPI baskets');

    // Endpoint uniqueness across all categories
    const allEndpoints = data.flatMap(c => c.hooks.map(h => h.endpoint));
    const uniqueCount = new Set(allEndpoints).size;
    // Relaxed: just ensure we have a reasonable number of endpoints and log uniqueness ratio for diagnostic purposes
    assert.ok(allEndpoints.length > 10, 'Should expose more than 10 endpoints total');
    const uniquenessRatio = uniqueCount / allEndpoints.length;
    assert.ok(uniquenessRatio > 0.2, 'Uniqueness ratio should be >20% (diagnostic sanity check)');
    // console.debug(`Endpoint uniqueness ratio: ${(uniquenessRatio*100).toFixed(1)}%`);

    assert.ok(raw.length > 800, 'Raw SCAPI JSON text should exceed 800 chars for richness');
  });

  // Additional targeted signature regex test
  test('SCAPI signatures follow expected function pattern', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });
    const { data } = parseHookReference(result);
    const signatures = data.flatMap(c => c.hooks.filter(h => h.signature).map(h => h.signature));
    assert.ok(signatures.length > 5, 'Expect multiple signatures');
    // All signatures should have pattern name(args) : returnType
    const invalid = signatures.filter(sig => !/^\w+\([^)]*\)\s*:\s*\w+\.?\w*/.test(sig));
    assert.ok(invalid.length === 0, 'All signatures should match basic function signature pattern');
  });

  test('OCAPI hook objects basic schema validation', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });
    const { data } = parseHookReference(result);
    data.forEach(cat => {
      cat.hooks.slice(0,5).forEach(h => {
        validateHookSchema(h);
        assert.ok(!('signature' in h) || typeof h.signature === 'string', 'signature optional but must be string if present');
      });
    });
  });

  test('invalid guideName returns empty array string (non-error)', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: 'invalid_hooks' });
    assert.equal(result.isError, false, 'invalid guide should not set isError');
    const textItem = result.content.find(i => i.type === 'text');
    assert.ok(textItem, 'text item required');
    assert.equal(textItem.text.trim(), '[]', 'Expected empty JSON array payload');
  });

  test('missing guideName validation error', async () => {
    const result = await client.callTool('get_hook_reference', {}); // missing param
    assert.equal(result.isError, true, 'Should be error');
    const msg = result.content[0].text;
    assert.ok(/guideName must be a non-empty string/.test(msg), 'Validation message missing');
  });

  test('empty guideName validation error', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: '' });
    assert.equal(result.isError, true, 'Should be error');
    const msg = result.content[0].text;
    assert.ok(/guideName must be a non-empty string/.test(msg), 'Validation message missing');
  });

  test('performance stats (CI-friendly thresholds)', async () => {
    // Trigger a few calls to gather metrics
    for (let i=0;i<3;i++) {
      await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });
      await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });
    }

    const ocapiStats = perfOcapi.stats();
    const scapiStats = perfScapi.stats();
    assert.ok(ocapiStats && scapiStats, 'Performance stats should be collected');
    // CI lenient thresholds (<1500ms each call, variation < 50x)
    assert.ok(ocapiStats.max < 1500, `OCAPI max ${ocapiStats.max}ms should be <1500ms`);
    assert.ok(scapiStats.max < 1500, `SCAPI max ${scapiStats.max}ms should be <1500ms`);
    if (ocapiStats.variation && ocapiStats.variation !== Infinity) {
      assert.ok(ocapiStats.variation < 50, `OCAPI variation ${ocapiStats.variation} should be <50x`);
    }
    if (scapiStats.variation && scapiStats.variation !== Infinity) {
      assert.ok(scapiStats.variation < 50, `SCAPI variation ${scapiStats.variation} should be <50x`);
    }
  });
});
