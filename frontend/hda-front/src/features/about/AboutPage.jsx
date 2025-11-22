import React from 'react';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About This Project</h1>
        <p className="subtitle">Exploring Insurance Tech, Automation, and Modern Development</p>
      </div>

      <section className="about-section">
        <h2>Project Overview</h2>
        <p>
          Welcome! This project is my personal playground and portfolio designed to demonstrate the skills and technologies relevant to the <strong>Pricing Automation Engineer</strong> role at Hastings Direct.
        </p>
        <p>
          My goal was to build a full-stack application that mirrors real-world insurance tech challenges: processing industry data, building robust APIs, and delivering a clean user experience—all automated with CI/CD pipelines.
        </p>
      </section>

      <section className="about-section">
        <h2>Tech Stack & Architecture</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Frontend</h3>
            <ul>
              <li><strong>React.js</strong> for a responsive UI</li>
              <li>Modern Hooks & Component Architecture</li>
              <li>CSS Modules for styling</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Backend</h3>
            <ul>
              <li><strong>Java 17</strong> & <strong>Spring Boot 3</strong></li>
              <li>Microservice Architecture principles</li>
              <li>RESTful API design</li>
              <li><strong>PostgreSQL</strong> (Supabase)</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Data & Automation</h3>
            <ul>
              <li><strong>Python (Pandas)</strong> for ETL pipelines</li>
              <li>FCA Value Measures dataset processing</li>
              <li><strong>GitHub Actions</strong> for CI/CD</li>
              <li><strong>Azure App Service</strong> for hosting</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li><strong>Market Dashboard:</strong> Visualizing cleaned data from the FCA General Insurance value measures dataset.</li>
          <li><strong>Insurance Glossary:</strong> A full-stack glossary tool backed by a relational database.</li>
          <li><strong>Ask AI:</strong> An experimental interface for insurance domain queries.</li>
        </ul>
      </section>

      <section className="about-section">
        <div className="migration-note">
          <strong>💰 Architecture Decision: Database Migration</strong>
          <p>
            Originally, this project was built using <strong>Azure SQL Database</strong> to stay fully within the Azure ecosystem.
            However, to optimize costs for this educational project, I migrated the persistence layer to <strong>Supabase (PostgreSQL)</strong>.
            This migration demonstrated flexibility in handling database drivers, dialects, and connection pooling in a Spring Boot environment.
          </p>
        </div>
      </section>

      <section className="about-section links-section">
        <h2>Links</h2>
        <div className="links-grid">
          <a href="https://github.com/sychevmax/hd-academy" target="_blank" rel="noopener noreferrer" className="link-btn">
            View Source Code (GitHub)
          </a>
          <a href="https://hd-academy-web.azurewebsites.net/" target="_blank" rel="noopener noreferrer" className="link-btn">
            Live Application
          </a>
        </div>
      </section>
    </div>
  );
}
