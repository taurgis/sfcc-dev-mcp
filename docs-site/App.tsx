import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import { Navigate } from 'react-router-dom';
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
import SkillsPage from './pages/SkillsPage';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Routes with trailing slashes
      {
        path: 'configuration/',
        element: <ConfigurationPage />,
      },
      {
        path: 'ai-interfaces/',
        element: <AIInterfacesPage />,
      },
      {
        path: 'features/',
        element: <FeaturesPage />,
      },
      {
        path: 'tools/',
        element: <ToolsPage />,
      },
      {
        path: 'examples/',
        element: <ExamplesPage />,
      },
      {
        path: 'skills/',
        element: <SkillsPage />,
      },
      {
        path: 'security/',
        element: <SecurityPage />,
      },
      {
        path: 'development/',
        element: <DevelopmentPage />,
      },
      {
        path: 'troubleshooting/',
        element: <TroubleshootingPage />,
      },
      // Redirects from non-trailing slash URLs to trailing slash URLs
      {
        path: 'configuration',
        element: <Navigate to="/configuration/" replace />,
      },
      {
        path: 'ai-interfaces',
        element: <Navigate to="/ai-interfaces/" replace />,
      },
      {
        path: 'features',
        element: <Navigate to="/features/" replace />,
      },
      {
        path: 'tools',
        element: <Navigate to="/tools/" replace />,
      },
      {
        path: 'examples',
        element: <Navigate to="/examples/" replace />,
      },
      {
        path: 'skills',
        element: <Navigate to="/skills/" replace />,
      },
      {
        path: 'security',
        element: <Navigate to="/security/" replace />,
      },
      {
        path: 'development',
        element: <Navigate to="/development/" replace />,
      },
      {
        path: 'troubleshooting',
        element: <Navigate to="/troubleshooting/" replace />,
      },
      // Redirect old installation path to AI interfaces
      {
        path: 'installation',
        element: <Navigate to="/ai-interfaces/" replace />,
      },
      {
        path: 'installation/',
        element: <Navigate to="/ai-interfaces/" replace />,
      },
    ],
  },
];

export default routes;