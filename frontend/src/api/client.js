const BASE = import.meta.env?.VITE_API_BASE_URL || '/api';

// Never let a stopped backend leave the demo indefinitely on "Checking".
export async function analyzeMessage(text, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Check message length and backend connection.');
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
