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

`--debug` accepts `true/false`, `1/0`, or `yes/no`. Invalid values fail fast.

## Tests and lint

```bash
npm test
npm run test:mcp:yaml
npm run test:mcp:node
npm run lint
npm run validate:server-json
npm run validate:tools-sync
npm run validate:skills-sync
```

## Architecture overview

- `src/core`: server and tool registration
- `src/core/server-tool-catalog.ts`: capability-aware tool catalog and availability checks
- `src/core/server-tool-call-lifecycle.ts`: `tools/call` orchestration for validation, progress, cancellation, and preflight notices
- `src/core/server-workspace-discovery.ts`: workspace roots discovery and runtime reconfiguration flow
- `src/clients`: domain clients for docs, logs, OCAPI, and scaffolding
- `src/services`: file system and path services
- `src/utils`: caching, validation, logging, and shared abort/timeout helpers

## Project architecture

```text
sfcc-dev-mcp/
├── src/
│   ├── main.ts                    # CLI entry point
│   ├── index.ts                   # Package exports
│   ├── core/                      # Core MCP server & tool definitions
│   │   ├── server.ts              # MCP server (registers handlers, capability gating)
│   │   ├── tool-definitions.ts    # All tool schemas grouped by category
│   │   ├── server-tool-catalog.ts # Capability-aware tool catalog and availability checks
│   │   ├── server-tool-call-lifecycle.ts # tools/call lifecycle orchestration
│   │   ├── server-workspace-discovery.ts # Workspace roots discovery and reconfigure flow
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
│   │       ├── agent-instructions-handler.ts
│   │       └── script-debugger-handler.ts
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
│   │   ├── script-debugger/
│   ├── services/                 # Dependency injection service layer
│   ├── tool-configs/             # Tool grouping & category configs
│   ├── config/                   # Configuration + dw.json loading
│   ├── utils/                    # Caching, validation, logging, abort helpers
│   └── types/
├── tests/                        # Jest + MCP YAML + programmatic tests
├── docs/                         # SFCC documentation sources
├── docs-site/                    # Legacy React docs
├── docs-site-v2/                 # VitePress docs
├── scripts/                      # Conversion & build scripts
└── ai-instructions/              # AI platform instruction sets + bundled skills
```

## Configuration and capability gating

- `configuration-factory.ts`: derives capabilities (`canAccessLogs`, `canAccessOCAPI`, `canAccessWebDAV`, `isLocalMode`).
- `dw-json-loader.ts`: secure credential ingestion and validation.
- `credential-validation.ts`: shared auth-pair and hostname validation used by both config paths.
- Capability gating rules:
  - No credentials: docs-only tools (docs, SFRA, ISML, cartridge generation, agent instructions).
  - WebDAV credentials + hostname: runtime logs, job logs, and script debugger.
  - Data API credentials + hostname: system & custom objects, site preferences, code versions.
- Tools requiring unavailable capabilities are hidden from `tools/list` and rejected at `tools/call`.

## Runtime validation boundary

- `src/core/tool-argument-validator.ts` validates tool arguments at call time before handler execution.
- Validation includes required fields, scalar/object/array types, enum values, integer/number ranges, string constraints, and regex patterns.
- Shared OCAPI query schemas support `text_query`, `term_query`, `bool_query`, `filtered_query`, and `match_all_query`.
- Object schemas with declared properties reject unknown keys by default (top-level and nested), unless `additionalProperties: true` is explicitly set.
- Validation errors are returned as structured tool errors (`INVALID_TOOL_ARGUMENTS`) so clients can recover predictably.
- Non-validation execution errors are sanitized before returning tool responses (for example, upstream HTTP response bodies are stripped) to reduce accidental data leakage.

## Progress and cancellation

- `tools/call` handlers receive an abort signal from the MCP SDK and return `REQUEST_CANCELLED` when the request is aborted.
- When clients provide `_meta.progressToken`, the server emits best-effort `notifications/progress` updates through request-scoped notification APIs.

## Adding a new tool

1. Define the schema in the correct `src/core/tool-schemas/*` file.
2. Implement or extend a handler under `src/core/handlers`.
3. Add domain logic in a client under `src/clients`.
4. Discover response shapes with `npx aegis query` before writing tests.
5. Add unit tests and MCP YAML tests.
6. Update AGENTS.md and README.md if tool counts or categories change.

## Testing strategy

- Unit tests: `npm run test:unit`
- Full suite (unit + MCP): `npm test`
- YAML MCP tests: `npm run test:mcp:yaml`
- Programmatic MCP tests: `npm run test:mcp:node`
- Lint: `npm run lint`

## Documentation updates

The VitePress site lives in `docs-site-v2/`. If you modify structure, update the navigation and related pages.

## Release process

```bash
npm run changeset
npm run release:status
```

Checklist:

- Add a changeset for every change that should ship in a new npm package version
- Merge changeset-bearing pull requests into `main`
- Review and merge the release pull request created by the Changesets workflow
- Package publication uses GitHub Actions OIDC trusted publishing
- Update README.md and AGENTS.md if tool counts or categories change
- Keep `server.json` version fields aligned with `package.json` (`version` and `packages[0].version`)
- Run `npm run validate:server-json` after versioning changes
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
