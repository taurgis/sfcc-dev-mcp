import { defineConfig } from 'vitepress';

const siteName = 'SFCC Dev MCP';
const siteDescription = 'MCP server for Salesforce B2C Commerce Cloud development with docs, logs, and tooling';
const siteUrl = 'https://sfcc-mcp-dev.rhino-inquisitor.com';
const defaultSocialImagePath = '/explain-product-pricing-methods.png';

const toNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const buildCanonicalUrl = (relativePath: string): string => {
  const normalizedPath = relativePath
    .replace(/\\/g, '/')
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '');

  const withLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

  const canonicalPath =
    withLeadingSlash === '/' || withLeadingSlash === ''
      ? '/'
      : withLeadingSlash.endsWith('/')
        ? withLeadingSlash
        : `${withLeadingSlash}/`;

  return new URL(canonicalPath, `${siteUrl}/`).toString();
};

const buildAbsoluteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return new URL(withLeadingSlash, `${siteUrl}/`).toString();
};

const websiteSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  description: siteDescription,
  url: siteUrl
});

const softwareSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SFCC Development MCP Server',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  description: siteDescription,
  url: siteUrl,
  sameAs: ['https://github.com/taurgis/sfcc-dev-mcp', 'https://www.npmjs.com/package/sfcc-dev-mcp']
});

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
  title: siteName,
  description: siteDescription,
  base: '/',

  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { type: 'application/ld+json' }, websiteSchema],
    ['script', { type: 'application/ld+json' }, softwareSchema]
  ],

  transformHead: ({ pageData }) => {
    const relativePath = toNonEmptyString(pageData.relativePath) ?? 'index.md';
    const canonicalUrl = buildCanonicalUrl(relativePath);
    const frontmatter = (pageData.frontmatter ?? {}) as Record<string, unknown>;
    const pageTitle = toNonEmptyString(pageData.frontmatter?.title) ?? toNonEmptyString(pageData.title) ?? siteName;
    const pageDescription =
      toNonEmptyString(pageData.frontmatter?.description) ??
      toNonEmptyString((pageData as { description?: unknown }).description) ??
      siteDescription;
    const rawSocialImage =
      toNonEmptyString(frontmatter.ogImage) ??
      toNonEmptyString(frontmatter.socialImage) ??
      toNonEmptyString(frontmatter.image) ??
      defaultSocialImagePath;
    const socialImageUrl = buildAbsoluteUrl(rawSocialImage);

    const webPageSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      image: socialImageUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl
      }
    });

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: socialImageUrl }],
      ['meta', { property: 'og:image:alt', content: pageTitle }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: socialImageUrl }],
      ['script', { type: 'application/ld+json' }, webPageSchema]
    ];
  },

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
