import React from 'react';

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TermCard({ term, abbreviation, definition, category, synonyms, lastUpdated }) {
  return (
    <article className="term-card" role="article">
      <header className="term-header">
        <h3 className="term-title">{term}
          {abbreviation && <span className="abbr">{abbreviation}</span>}
        </h3>
        {category && <span className="badge category">{category}</span>}
      </header>
      {definition && <p className="definition">{definition}</p>}
      {Array.isArray(synonyms) && synonyms.length > 0 && (
        <div className="synonyms"><span>Also known as:</span> {synonyms.join(', ')}</div>
      )}
      {lastUpdated && (
        <footer className="meta">Last updated: {formatDate(lastUpdated)}</footer>
      )}
    </article>
  );
}
