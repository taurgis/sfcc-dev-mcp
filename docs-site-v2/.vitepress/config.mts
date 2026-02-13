import { defineConfig } from 'vitepress';

const guideSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/guide/' },
      { text: 'AI Interfaces', link: '/guide/ai-interfaces' },
      { text: 'Configuration', link: '/guide/configuration' }
    ]
  },
  {
    text: 'Features',
    items: [
      { text: 'Overview', link: '/features/' },
      { text: 'Tools Catalog', link: '/tools/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Script Debugger', link: '/script-debugger/' },
      { text: 'Skills', link: '/skills/' },
      { text: 'Security', link: '/security/' }
    ]
  },
  {
    text: 'Development',
    items: [
      { text: 'Development Guide', link: '/development/' },
      { text: 'Troubleshooting', link: '/troubleshooting/' }
    ]
  }
];

export default defineConfig({
  title: 'SFCC Dev MCP',
  description: 'MCP server for Salesforce B2C Commerce Cloud development with docs, logs, and tooling',
  base: '/',

  markdown: {
    toc: { level: [2, 3] }
  },

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg'
    },
    outline: {
      level: [2, 3]
    },
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Features', link: '/features/' },
      { text: 'Tools', link: '/tools/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Development', link: '/development/' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright (c) ${new Date().getFullYear()} Thomas Theunen`
    },
    sidebar: {
      '/guide/': guideSidebar,
      '/features/': guideSidebar,
      '/tools/': guideSidebar,
      '/examples/': guideSidebar,
      '/script-debugger/': guideSidebar,
      '/skills/': guideSidebar,
      '/security/': guideSidebar,
      '/development/': guideSidebar,
      '/troubleshooting/': guideSidebar
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/taurgis/sfcc-dev-mcp' }
    ],
    search: {
      provider: 'local'
    }
  }
});
