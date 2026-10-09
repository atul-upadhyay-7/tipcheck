import { validateAnalysis } from './validate.js';
const BASE = import.meta.env?.VITE_API_BASE_URL || '/api';

// Free hosting can need about a minute to wake. Bound each attempt and retry
// only an aborted timeout once; never loop on validation or network failures.
export async function analyzeMessage(text, { timeoutMs = 90000, onWarming = () => {}, warmingMs = 10000, context = null, signal } = {}) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const warming = setTimeout(onWarming, warmingMs);
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal?.addEventListener('abort', cancel, {once:true});
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(`${BASE}/${context ? "preflight" : "analyze"}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context ? { text, ...context } : { text }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Check message length and backend connection.');
        return validateAnalysis(await res.json(), Boolean(context));
      } catch (error) {
        if (signal?.aborted || !controller.signal.aborted || attempt === 1) throw error;
        onWarming();
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', cancel);
      }
    }
  } finally {
    clearTimeout(warming);
  }
}
