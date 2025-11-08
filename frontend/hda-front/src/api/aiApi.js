const BASE = '/api/ai';

async function httpPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = text;
    try { detail = JSON.parse(text); } catch { /* ignore */ }
    const msg = typeof detail === 'string' ? detail : (detail.message || JSON.stringify(detail));
    throw new Error(`Request failed ${res.status}: ${msg}`);
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Invalid JSON from AI API');
  }
}

export const aiApi = {
  ask: ({ question }) => httpPost(`${BASE}/ask`, { question })
};

export default aiApi;
