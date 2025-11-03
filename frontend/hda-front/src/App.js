import React, { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import SidebarMenu from './components/SidebarMenu';
import GlossaryPage from './features/glossary/GlossaryPage';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Layout
      sidebar={<SidebarMenu selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />}
    >
      <GlossaryPage selectedCategory={selectedCategory} />
    </Layout>
  );
}

export default App;
