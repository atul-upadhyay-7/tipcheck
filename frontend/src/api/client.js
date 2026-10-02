const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function analyzeMessage(text) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Check message length and backend connection.');
  return res.json();
}
