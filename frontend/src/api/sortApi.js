const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function sortArray(array, algorithm = 'both') {
  const res = await fetch(`${BASE}/sort`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ array, algorithm })
  });
  if (!res.ok) throw new Error(`Sort API error: ${res.status}`);
  return res.json();
}

export async function getBenchmark() {
  const res = await fetch(`${BASE}/sort/benchmark`);
  if (!res.ok) throw new Error(`Benchmark API error: ${res.status}`);
  return res.json();
}