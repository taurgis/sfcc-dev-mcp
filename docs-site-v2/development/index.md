---
title: Development Guide
description: Build, test, and contribute to SFCC Dev MCP with architecture notes, capability gating, and release workflow details.
---

# Development guide

This project is a TypeScript MCP server with modular handlers and clients.

## Prerequisites

- Node.js 18+
- npm 8+

## Local setup

```bash
git clone https://github.com/taurgis/sfcc-dev-mcp.git
cd sfcc-dev-mcp
npm install
npm run build
npm test
```

## Run in dev mode

```bash
npm run dev -- --debug
npm run dev -- --dw-json /path/to/dw.json --debug false
```

## Tests and lint

```bash
npm test
npm run test:mcp:yaml
npm run test:mcp:node
npm run lint
```

## Architecture overview

- `src/core`: server and tool registration
- `src/clients`: domain clients for docs, logs, OCAPI, and scaffolding
- `src/services`: file system and path services
- `src/utils`: caching, validation, logging

## Project architecture

```text
sfcc-dev-mcp/
├── src/
│   ├── main.ts                    # CLI entry point
│   ├── index.ts                   # Package exports
│   ├── core/                      # Core MCP server & tool definitions
│   │   ├── server.ts              # MCP server (registers handlers, capability gating)
│   │   ├── tool-definitions.ts    # All tool schemas grouped by category
│   │   └── handlers/              # Modular tool handlers
│   │       ├── base-handler.ts
│   │       ├── docs-handler.ts
│   │       ├── isml-handler.ts
│   │       ├── sfra-handler.ts
│   │       ├── log-handler.ts
│   │       ├── job-log-handler.ts
│   │       ├── system-object-handler.ts
│   │       ├── code-version-handler.ts
│   │       ├── cartridge-handler.ts
│   │       └── agent-instructions-handler.ts
│   ├── clients/                   # API & domain clients (logic, not routing)
│   │   ├── base/                  # Shared HTTP + auth
│   │   ├── logs/                  # Modular log system
│   │   ├── docs/                  # Modular documentation system
│   │   ├── docs-client.ts
│   │   ├── sfra-client.ts
│   │   ├── isml-client.ts
│   │   ├── agent-instructions-client.ts
│   │   ├── cartridge/
│   │   ├── ocapi/
│   │   ├── ocapi-client.ts
│   │   ├── log-client.ts
│   ├── services/                 # Dependency injection service layer
│   ├── tool-configs/             # Tool grouping & category configs
│   ├── config/                   # Configuration + dw.json loading
│   ├── utils/                    # Caching, validation, logging
│   └── types/
├── tests/                        # Jest + MCP YAML + programmatic tests
├── docs/                         # SFCC documentation sources
├── docs-site/                    # Legacy React docs
├── docs-site-v2/                 # VitePress docs
├── scripts/                      # Conversion & build scripts
└── ai-instructions/              # AI platform instruction sets + bundled skills
```

## Configuration and capability gating

- `configuration-factory.ts`: derives capabilities (`canAccessLogs`, `canAccessJobLogs`, `canAccessOCAPI`, `canAccessSitePrefs`).
- `dw-json-loader.ts`: secure credential ingestion and validation.
- Capability gating rules:
	- No credentials: docs-only tools (docs, SFRA, ISML, cartridge generation, agent instructions).
	- WebDAV credentials: runtime logs + job logs.
	- Data API credentials: system & custom objects, site preferences, code versions.
- Tools requiring unavailable capabilities are not registered.

## Adding a new tool

1. Define the schema in the correct `src/core/tool-schemas/*` file.
2. Implement or extend a handler under `src/core/handlers`.
3. Add domain logic in a client under `src/clients`.
4. Discover response shapes with `npx aegis query` before writing tests.
5. Add unit tests and MCP YAML tests.
6. Update AGENTS.md and README.md if tool counts or categories change.

## Testing strategy

- Unit tests: `npm test`
- YAML MCP tests: `npm run test:mcp:yaml`
- Programmatic MCP tests: `npm run test:mcp:node`
- Lint: `npm run lint`

## Documentation updates

The VitePress site lives in `docs-site-v2/`. If you modify structure, update the navigation and related pages.

## Release process

```bash
npm version patch
git push origin main --tags
```

Checklist:

- Update README.md and AGENTS.md if tool counts or categories change
- Run `npm test` and `npm run lint:check`
- Verify docs build in `docs-site-v2`

## Contributing

- Open an issue for large changes
- Keep changes small and scoped
- Add tests for new tools and update docs if behavior changes

## Documentation site

The VitePress site lives in `docs-site-v2/`.

```bash
cd docs-site-v2
npm install
npm run dev
```
