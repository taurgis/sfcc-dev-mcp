import { NavGroup } from './types';

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