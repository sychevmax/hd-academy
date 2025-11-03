import React, { useState } from 'react';
import './layout.css';

export default function Layout({ sidebar, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="collapse-btn" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar">
            {collapsed ? '➡️' : '⬅️'}
          </button>
          <span className="brand">HD Academy</span>
        </div>
        <div className="sidebar-content">
          {sidebar}
        </div>
        <div className="sidebar-footer">UK Insurance Portal</div>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
