const BASE = '/api/v1/glossary';

async function httpGet(url) {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export const glossaryApi = {
  getAll: () => httpGet(`${BASE}`),
  getById: (id) => httpGet(`${BASE}/${id}`),
  search: (q) => httpGet(`${BASE}/search?q=${encodeURIComponent(q)}`),
  getByCategory: (category) => httpGet(`${BASE}/category/${encodeURIComponent(category)}`),
  getCategories: () => httpGet(`${BASE}/categories`)
};

export default glossaryApi;
