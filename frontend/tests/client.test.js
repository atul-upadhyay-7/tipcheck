import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMessage } from '../src/api/client.js';

const valid = {label:'uncertain', mode:'rules-only', risk_score:0, risk_level:'none_detected', flags:[], links:[], context_warning:false, verification_status:'not_verified'};

// Fictional request data. No browser, server or extra testing dependency required.
test('analyzer request sends JSON and returns response', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/analyze');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { text: 'fictional message' });
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, json: async () => ({...valid}) };
  });
  assert.deepEqual(await analyzeMessage('fictional message'), valid);
});

test('HTTP failure is not treated as an analysis', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
  await assert.rejects(analyzeMessage('fictional message'), /backend connection/);
});

test('network failure is surfaced', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('offline'); });
  await assert.rejects(analyzeMessage('fictional message'), /offline/);
});

test('stalled request is aborted', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  await assert.rejects(analyzeMessage('fictional message', { timeoutMs: 5 }), { name: 'AbortError' });
});

test('invalid JSON is surfaced', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }));
  await assert.rejects(analyzeMessage('fictional message'), SyntaxError);
});

test('slow response survives old 15s-style deadline and reports warming', async (t) => {
  let warmed = false;
  t.mock.method(globalThis, 'fetch', async () => {
    await new Promise(resolve => setTimeout(resolve, 25));
    return { ok: true, json: async () => ({...valid,risk_score:60,risk_level:"high"}) };
  });
  assert.deepEqual(await analyzeMessage('fictional message', { timeoutMs: 100, warmingMs: 5, onWarming: () => { warmed = true; } }), {...valid,risk_score:60,risk_level:"high"});
  assert.equal(warmed, true);
});

test('timeout retries once and returns the second response', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => {
    calls += 1;
    if (calls === 1) return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
    return { ok: true, json: async () => ({...valid,risk_score:60,risk_level:"high"}) };
  });
  assert.deepEqual(await analyzeMessage('fictional message', { timeoutMs: 5 }), {...valid,risk_score:60,risk_level:"high"});
  assert.equal(calls, 2);
});

test('permanent stall is bounded to two attempts', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => {
    calls += 1;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  });
  await assert.rejects(analyzeMessage('fictional message', { timeoutMs: 5 }), { name: 'AbortError' });
  assert.equal(calls, 2);
});

test('fast response clears the delayed warming notice', async (t) => {
  let warmed = false;
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({...valid}) }));
  await analyzeMessage('fictional message', { warmingMs: 5, onWarming: () => { warmed = true; } });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(warmed, false);
});

test('valid-looking status with missing or unsafe analysis is rejected', async t => {
 for(const response of [{}, null, {...valid,risk_score:101}, {...valid,risk_score:'0'}, {...valid,verification_status:'verified'}, {...valid,flags:[{id:'x',phrase:'x',weight:0,en:'x',hi:'x',source:'javascript:alert(1)'}]}, {...valid,flags:[{id:'x',phrase:'x',weight:0,en:'x',hi:'x',source:'https://attacker.invalid/'}]}]) {
  t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>response}));
  await assert.rejects(analyzeMessage('fictional message'),/Invalid analysis/);
 }
});

test('preflight endpoint must return payment evidence, never silently downgrade', async t => {
 t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>valid}));
 await assert.rejects(analyzeMessage('',{context:{}}),/Invalid analysis/);
});

test('owner navigation cancellation aborts once, without timeout retry',async t=>{
 let calls=0;const controller=new AbortController();
 t.mock.method(globalThis,'fetch',async(_url,{signal})=>{calls++;return new Promise((_r,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));});
 const pending=analyzeMessage('fictional message',{signal:controller.signal});controller.abort();
 await assert.rejects(pending,{name:'AbortError'});assert.equal(calls,1);
});

test('unexpected payment envelope cannot crash the quick-check UI',async t=>{
 t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({...valid,preflight:{}})}));
 await assert.rejects(analyzeMessage('fictional message'),/Invalid analysis/);
});
