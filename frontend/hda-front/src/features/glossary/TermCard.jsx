import React, { useState, useId } from 'react';

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TermCard({ term, abbreviation, definition, category, synonyms, lastUpdated, examples }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <article className={`term-card ${expanded ? 'expanded' : ''}`}>
      <header className="term-header">
        <h3 className="term-title">{term}
          {abbreviation && <span className="abbr">{abbreviation}</span>}
        </h3>
        <div className="term-actions">
          {category && <span className="badge category">{category}</span>}
        </div>
      </header>

      {definition && <p className="definition">{definition}</p>}
      {Array.isArray(synonyms) && synonyms.length > 0 && (
        <div className="synonyms"><span>Also known as:</span> {synonyms.join(', ')}</div>
      )}

      {expanded && (
        <div id={panelId} className="term-extra">
          {Array.isArray(examples) && examples.length > 0 && (
            <div className="examples">
              <div className="extra-title">Examples</div>
              <ul>
                {examples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          )}


          {lastUpdated && (
            <footer className="meta">Last updated: {formatDate(lastUpdated)}</footer>
          )}
        </div>
      )}

      <div className="term-footer">
        <button
          className="term-toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
          onClick={() => setExpanded(e => !e)}
          title={expanded ? 'Collapse details' : 'Expand details'}
        >
          {/* Compact single arrow: down when collapsed, up when expanded */}
          {expanded ? '▴' : '▾'}
        </button>
      </div>
    </article>
  );
}
