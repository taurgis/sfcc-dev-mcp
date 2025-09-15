import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ConfigurationPage from './pages/ConfigurationPage';
import AIInterfacesPage from './pages/AIInterfacesPage';
import FeaturesPage from './pages/FeaturesPage';
import ToolsPage from './pages/ToolsPage';
import ExamplesPage from './pages/ExamplesPage';
import SecurityPage from './pages/SecurityPage';
import DevelopmentPage from './pages/DevelopmentPage';
import TroubleshootingPage from './pages/TroubleshootingPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Redirect old installation path to AI interfaces */}
          <Route path="/installation" element={<Navigate to="/ai-interfaces" replace />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/ai-interfaces" element={<AIInterfacesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/development" element={<DevelopmentPage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;