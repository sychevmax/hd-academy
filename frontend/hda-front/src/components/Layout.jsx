import React, { useState } from 'react';
import './layout.css';
import logo from '../logo.svg';

export default function Layout({ sidebar, children }) {
  // Start collapsed on small screens to show content first
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 880);

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Floating expand button only visible when collapsed via CSS */}
      <button
        className="expand-toggle"
        onClick={() => setCollapsed(false)}
        aria-label="Expand sidebar"
        title="Expand sidebar"
      >
        »
      </button>

      {/* Backdrop for mobile drawer; clicking it collapses the sidebar */}
      <div className="backdrop" role="presentation" onClick={() => setCollapsed(true)} />

      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Collapse control inside the sidebar (hidden when collapsed by CSS) */}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            «
          </button>
          {/* Full-width logo below the collapse control */}
          <img src={logo} alt="Hastings Direct" className="brand-logo-wide" />
          {/* Heading directly under the logo on the same white background */}
          <div className="brand-heading" aria-hidden="true">Academy</div>
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
