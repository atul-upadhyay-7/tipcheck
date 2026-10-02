import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMessage } from '../src/api/client.js';

// Fictional request data. No browser, server or extra testing dependency required.
test('analyzer request sends JSON and returns response', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/analyze');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { text: 'fictional message' });
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, json: async () => ({ label: 'uncertain' }) };
  });
  assert.deepEqual(await analyzeMessage('fictional message'), { label: 'uncertain' });
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
