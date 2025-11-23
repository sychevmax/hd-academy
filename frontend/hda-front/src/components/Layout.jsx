import React, { useState } from 'react';
import './layout.css';
import logo from '../logo.svg';
import useIsMobile from '../hooks/useIsMobile';

export default function Layout({ sidebar, children }) {
  const isMobile = useIsMobile();
  // Start collapsed on small screens to show content first
  const [collapsed, setCollapsed] = useState(isMobile);

  const handleSidebarClick = (e) => {
    // Check if the click originated from a button or link
    // This allows clicking on empty space or headers without collapsing
    if (e.target.closest('button') || e.target.closest('a')) {
      if (isMobile) {
        setCollapsed(true);
      }
    }
  };

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
        <div className="sidebar-content" onClick={handleSidebarClick}>
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
