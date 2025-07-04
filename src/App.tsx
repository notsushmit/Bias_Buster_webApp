import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArticleAnalyzer } from './components/ArticleAnalyzer';
import { Dashboard } from './components/Dashboard';
import { SourceDirectory } from './components/SourceDirectory';
import { ApiKeySetup } from './components/ApiKeySetup';
import { AuroraBackground } from './components/AuroraBackground';
import { ClickSpark } from './components/ClickSpark';
import { BiasProvider } from './context/BiasContext';

function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dashboard' | 'sources' | 'settings'>('analyzer');
  const [sparks, setSparks] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const newSpark = {
      id: Date.now().toString(),
      x: e.clientX,
      y: e.clientY,
    };
    setSparks(prev => [...prev, newSpark]);
    
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => spark.id !== newSpark.id));
    }, 1000);
  };

  return (
    <BiasProvider>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden" onClick={handleClick}>
        <AuroraBackground />
        
        {sparks.map(spark => (
          <ClickSpark key={spark.id} x={spark.x} y={spark.y} />
        ))}
        
        <div className="relative z-10">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="container mx-auto px-4 py-8">
            {activeTab === 'settings' && <ApiKeySetup />}
            {activeTab === 'analyzer' && <ArticleAnalyzer />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'sources' && <SourceDirectory />}
          </main>
        </div>
      </div>
    </BiasProvider>
  );
}

export default App;