import { NavGroup } from './types';

// Date constants for structured data
export const SITE_DATES = {
  PUBLISHED: "2025-09-13T08:00:00+00:00", // Last week
  MODIFIED: "2025-09-20T08:00:00+00:00"   // Today
} as const;

export const NAVIGATION_LINKS: NavGroup[] = [
  {
    title: 'GETTING STARTED',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'AI Assistant Setup', path: '/ai-interfaces/' },
      { label: 'Configuration Guide', path: '/configuration/' },
    ],
  },
  {
    title: 'FEATURES',
    items: [
      { label: 'Features Overview', path: '/features/' },
      { label: 'Available Tools', path: '/tools/' },
      { label: 'Examples & Use Cases', path: '/examples/' },
      { label: 'Script Debugger', path: '/script-debugger/' },
      { label: 'Agent Skills', path: '/skills/' },
      { label: 'Security Guidelines', path: '/security/' },
    ],
  },
  {
    title: 'DEVELOPMENT',
    items: [
      { label: 'Development Guide', path: '/development/' },
      { label: 'Troubleshooting', path: '/troubleshooting/' },
    ],
  },
];