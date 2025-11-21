import React, { useEffect, useState } from 'react';
import glossaryApi from '../api/glossaryApi';

export default function SidebarMenu({ activeFeature = 'glossary', onSelectFeature, selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    glossaryApi.getCategories()
      .then(list => { if (alive) setCategories(list); })
      .catch(e => { if (alive) setError(e.message || String(e)); });
    return () => { alive = false; };
  }, []);

  return (
    <nav className="sidebar-menu">
      <div className="section">
        <div className="section-title">Features</div>
        <ul>
          <li className={activeFeature === 'dashboard' ? 'active' : ''}>
            <button className={activeFeature === 'dashboard' ? 'link active' : 'link'} onClick={() => onSelectFeature && onSelectFeature('dashboard')}>Market Dashboard</button>
          </li>
          <li className={activeFeature === 'glossary' ? 'active' : ''}>
            <button className={activeFeature === 'glossary' ? 'link active' : 'link'} onClick={() => onSelectFeature && onSelectFeature('glossary')}>Glossary</button>
          </li>
          <li className={activeFeature === 'ask' ? 'active' : ''}>
            <button className={activeFeature === 'ask' ? 'link active' : 'link'} onClick={() => onSelectFeature && onSelectFeature('ask')}>Ask AI</button>
          </li>
          <li className="disabled" title="Coming soon">Learning Paths</li>
          <li className="disabled" title="Coming soon">Quizzes</li>
        </ul>
      </div>

      {activeFeature === 'glossary' && (
        <div className="section">
          <div className="section-title">Categories</div>
          {error && <div className="small-error">{error}</div>}
          <ul className="categories">
            <li>
              <button
                className={!selectedCategory ? 'link active' : 'link'}
                onClick={() => onSelectCategory && onSelectCategory(null)}
              >All</button>
            </li>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={selectedCategory === cat ? 'link active' : 'link'}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                >{cat}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
