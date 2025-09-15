# SFCC Development MCP Server Documentation Site

A modern React-based documentation site for the SFCC Development MCP Server built with Vite and TailwindCSS.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling (locally configured)
- **React Router** with Hash routing for GitHub Pages compatibility
- **Responsive design** with mobile-first approach

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

The site will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

This will:
1. Generate optimized TailwindCSS from used classes
2. Build the React application with Vite
3. Output production files to `dist/`

### TailwindCSS Configuration

TailwindCSS is configured locally with:

- **Config**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`  
- **Input CSS**: `src/styles/input.css`
- **Output CSS**: `public/index.css` (generated)

### Available Scripts

- `npm run dev` - Start development server with CSS generation
- `npm run build` - Build for production (includes CSS generation)
- `npm run preview` - Preview production build
- `npm run build:css` - Generate TailwindCSS once
- `npm run build:css:watch` - Generate TailwindCSS in watch mode

### File Structure

```
docs-site-v2/
├── public/
│   └── index.css          # Generated TailwindCSS (gitignored)
├── src/
│   └── styles/
│       └── input.css      # TailwindCSS source
├── components/            # React components
├── pages/                 # Page components
├── index.html            # Main HTML template
├── index.tsx             # React application entry
├── tailwind.config.js    # TailwindCSS configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch in the `docs-site-v2/` directory.

**Deployment Process:**
1. GitHub Actions workflow triggers on push to `main`
2. Node.js 18 environment is set up
3. Dependencies are installed with `npm ci`
4. Site is built with `NODE_ENV=production npm run build`
5. Generated `dist/` folder is deployed to GitHub Pages

**Configuration:**
- Base path: `/` (configured for subdomain deployment)
- Build artifacts: `dist/` directory
- Workflow: `.github/workflows/deploy-docs.yml`

### Manual Deployment

For other static hosting services, use:

```bash
npm run build
```

The `dist/` folder contains all files needed for deployment to any static hosting service.

## Notes

- The generated CSS file (`public/index.css`) is excluded from version control
- TailwindCSS is configured to only include classes actually used in the project
- CSS is automatically generated before development and build processes
