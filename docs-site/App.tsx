import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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

// Component to handle URL-encoded hash fragments
const URLDecodeRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the current path contains an encoded hash (%23)
    if (location.pathname.includes('%23')) {
      const parts = location.pathname.split('%23');
      if (parts.length === 2) {
        const basePath = parts[0];
        const hashFragment = decodeURIComponent(parts[1]);
        
        // Navigate to the proper route with hash
        navigate(`${basePath}#${hashFragment}`, { replace: true });
      }
    }
  }, [location, navigate]);

  // Return null as this component only handles redirects
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <URLDecodeRedirect />
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
          {/* Catch-all route for URL-encoded paths - this will handle any remaining encoded fragments */}
          <Route path="*" element={<URLDecodeRedirect />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;