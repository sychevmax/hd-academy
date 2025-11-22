import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import SidebarMenu from './components/SidebarMenu';
import GlossaryPage from './features/glossary/GlossaryPage';
import AskAiPage from './features/ai/AskAiPage';
import DashboardPage from './features/dashboard/DashboardPage';
import AboutPage from './features/about/AboutPage';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  let activeFeature = 'dashboard';
  if (location.pathname.startsWith('/ask-ai')) {
    activeFeature = 'ask';
  } else if (location.pathname.startsWith('/glossary')) {
    activeFeature = 'glossary';
  } else if (location.pathname.startsWith('/about')) {
    activeFeature = 'about';
  }

  // Reset category when switching away from glossary to avoid stale UI state
  useEffect(() => {
    if (activeFeature !== 'glossary') {
      setSelectedCategory(null);
    }
  }, [activeFeature]);

  const handleSelectFeature = (feature) => {
    if (feature === 'glossary') {
      navigate('/glossary');
    } else if (feature === 'ask') {
      navigate('/ask-ai');
    } else if (feature === 'dashboard') {
      navigate('/');
    } else if (feature === 'about') {
      navigate('/about');
    }
  };

  return (
    <Layout
      sidebar={
        <SidebarMenu
          activeFeature={activeFeature}
          onSelectFeature={handleSelectFeature}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      }
    >
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ask-ai" element={<AskAiPage />} />
        <Route path="/glossary" element={<GlossaryPage selectedCategory={selectedCategory} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
