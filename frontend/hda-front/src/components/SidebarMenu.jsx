import React, { useEffect, useState } from 'react';
import glossaryApi from '../api/glossaryApi';

export default function SidebarMenu({ selectedCategory, onSelectCategory }) {
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
          <li className="active">Glossary</li>
          <li className="disabled" title="Coming soon">Learning Paths</li>
          <li className="disabled" title="Coming soon">Quizzes</li>
        </ul>
      </div>

      <div className="section">
        <div className="section-title">Categories</div>
        {error && <div className="small-error">{error}</div>}
        <ul className="categories">
          <li>
            <button
              className={!selectedCategory ? 'link active' : 'link'}
              onClick={() => onSelectCategory(null)}
            >All</button>
          </li>
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={selectedCategory === cat ? 'link active' : 'link'}
                onClick={() => onSelectCategory(cat)}
              >{cat}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
