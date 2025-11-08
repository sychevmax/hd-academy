import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import SidebarMenu from './components/SidebarMenu';
import GlossaryPage from './features/glossary/GlossaryPage';
import AskAiPage from './features/ai/AskAiPage';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeFeature = location.pathname.startsWith('/ask-ai') ? 'ask' : 'glossary';

  // Reset category when switching away from glossary to avoid stale UI state
  useEffect(() => {
    if (activeFeature !== 'glossary') {
      setSelectedCategory(null);
    }
  }, [activeFeature]);

  const handleSelectFeature = (feature) => {
    if (feature === 'glossary') {
      navigate('/');
    } else if (feature === 'ask') {
      navigate('/ask-ai');
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
        <Route path="/" element={<GlossaryPage selectedCategory={selectedCategory} />} />
        <Route path="/ask-ai" element={<AskAiPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
