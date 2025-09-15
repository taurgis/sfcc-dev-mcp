import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            'pre': {
              'overflow-x': 'auto',
              'word-wrap': 'normal',
              'white-space': 'pre',
              'max-width': '100%',
              'word-break': 'normal',
            },
            'pre code': {
              'white-space': 'pre',
              'word-break': 'normal',
              'overflow-wrap': 'normal',
            },
            'code': {
              'word-wrap': 'break-word',
              'overflow-wrap': 'break-word',
              'word-break': 'break-word',
            },
            'p code': {
              'word-break': 'break-word',
              'overflow-wrap': 'break-word',
            },
            'li code': {
              'word-break': 'break-word',
              'overflow-wrap': 'break-word',
            },
            'h1, h2, h3, h4, h5, h6': {
              'word-wrap': 'break-word',
              'overflow-wrap': 'break-word',
            },
            'p, li, td, th': {
              'word-wrap': 'break-word',
              'overflow-wrap': 'break-word',
            },
            'table': {
              'width': '100%',
              'table-layout': 'fixed',
            },
            'td, th': {
              'overflow-wrap': 'break-word',
              'word-break': 'break-word',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};
