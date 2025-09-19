import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';
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

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'configuration',
        element: <ConfigurationPage />,
      },
      {
        path: 'ai-interfaces',
        element: <AIInterfacesPage />,
      },
      {
        path: 'features',
        element: <FeaturesPage />,
      },
      {
        path: 'tools',
        element: <ToolsPage />,
      },
      {
        path: 'examples',
        element: <ExamplesPage />,
      },
      {
        path: 'security',
        element: <SecurityPage />,
      },
      {
        path: 'development',
        element: <DevelopmentPage />,
      },
      {
        path: 'troubleshooting',
        element: <TroubleshootingPage />,
      },
      // Redirect old installation path to AI interfaces
      {
        path: 'installation',
        element: <AIInterfacesPage />,
      },
    ],
  },
];

export default routes;