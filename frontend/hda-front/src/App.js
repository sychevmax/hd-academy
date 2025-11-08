import React, { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import SidebarMenu from './components/SidebarMenu';
import GlossaryPage from './features/glossary/GlossaryPage';
import AskAiPage from './features/ai/AskAiPage';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFeature, setActiveFeature] = useState('glossary'); // 'glossary' | 'ask'

  // Reset category when switching away from glossary to avoid stale UI state
  const handleSelectFeature = (feature) => {
    setActiveFeature(feature);
    if (feature !== 'glossary') {
      setSelectedCategory(null);
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
      {activeFeature === 'glossary' ? (
        <GlossaryPage selectedCategory={selectedCategory} />
      ) : (
        <AskAiPage />
      )}
    </Layout>
  );
}

export default App;
