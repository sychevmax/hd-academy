import React, { useEffect, useMemo, useState } from 'react';
import glossaryApi from '../../api/glossaryApi';
import TermCard from './TermCard';
import './glossary.css';

const PAGE_SIZE = 20;

export default function GlossaryPage({ selectedCategory }) {
  const [allTerms, setAllTerms] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true); setError(null);
      try {
        if (selectedCategory) {
          const byCat = await glossaryApi.getByCategory(selectedCategory);
          if (alive) { setAllTerms(byCat); setVisibleCount(PAGE_SIZE); setSearchResults(null); }
        } else {
          const data = await glossaryApi.getAll();
          if (alive) { setAllTerms(data); setVisibleCount(PAGE_SIZE); setSearchResults(null); }
        }
      } catch (e) {
        if (alive) setError(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [selectedCategory]);

  // Debounced search
  useEffect(() => {
    let id;
    let alive = true;
    if (!query) { setSearchResults(null); return; }
    id = setTimeout(async () => {
      setLoading(true); setError(null);
      try {
        const res = await glossaryApi.search(query);
        if (alive) {
          setSearchResults(res);
          setVisibleCount(PAGE_SIZE);
        }
      } catch (e) {
        if (alive) setError(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    }, 350);
    return () => { alive = false; if (id) clearTimeout(id); };
  }, [query]);

  const list = useMemo(() => {
    const arr = searchResults ?? allTerms;
    return Array.isArray(arr) ? arr.slice(0, visibleCount) : [];
  }, [searchResults, allTerms, visibleCount]);

  const totalCount = (searchResults ?? allTerms)?.length || 0;
  const canLoadMore = visibleCount < totalCount;

  return (
    <div className="glossary-page">
      <div className="glossary-toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search insurance terms (e.g., NCD, excess, third-party)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search glossary"
        />
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading && <div className="loader">Loading…</div>}

      {!loading && !error && list.length === 0 && (
        <div className="empty">No terms found.</div>
      )}

      <div className="terms-grid">
        {list.map(t => (
          <TermCard key={t.id}
            term={t.term}
            abbreviation={t.abbreviation}
            definition={t.definition}
            category={t.category}
            synonyms={t.synonyms}
            lastUpdated={t.last_updated}
            examples={t.examples}
          />
        ))}
      </div>

      {canLoadMore && (
        <div className="load-more-wrap">
          <button className="load-more" onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>Load more</button>
          <div className="count">{Math.min(visibleCount, totalCount)} of {totalCount}</div>
        </div>
      )}
    </div>
  );
}
