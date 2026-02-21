# TypeScript SDK v1 vs v2 Notes

Use this note to avoid mixing API shapes from different SDK generations.

## Example Semantics

- `Normative`: Migration intent and validation workflow.
- `Illustrative`: Import paths, API snippets, and option values that can vary by SDK release.

## Version Positioning

- Confirm the current official stability recommendation before selecting SDK major version.
- Document your chosen SDK major version in your server README and examples.

## Package Layout Differences

Common migration change:

- v1 style: single package import patterns
- v2 style: split packages for server, client, core, and runtime integrations

### Example imports

Classification: `Illustrative` import examples; verify against the exact SDK docs for your chosen version.

```ts
// v1-style example
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
```

```ts
// v2-style example
import { McpServer } from "@modelcontextprotocol/server"
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node"
```

## Transport/Feature Caveats

- Validate whether server-side SSE transport is supported in your chosen SDK major version.
- Re-check auth helpers and middleware exports when migrating.

### Streamable HTTP server transport example (v2-style)

Classification: `Illustrative` setup pattern; transport options may evolve between SDK versions.

```ts
import { McpServer } from "@modelcontextprotocol/server"
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node"

const server = new McpServer({
	name: "example-server",
	version: "1.0.0"
})

const transport = new NodeStreamableHTTPServerTransport({
	sessionIdGenerator: undefined,
	enableJsonResponse: true
})

await server.connect(transport)
```

## Runtime Expectations

- Confirm Node.js version and ESM/CJS constraints before rollout.
- Run smoke tests for initialize, tools/list, tools/call, and transport shutdown behavior.

### Minimal smoke sequence

Classification: `Normative` high-level validation flow; `Illustrative` execution details.

1. `initialize`
2. `notifications/initialized`
3. `tools/list`
4. `tools/call`
5. graceful shutdown (`SIGTERM`) with no leaked connections

## Migration Checklist

- [ ] Update imports and package.json dependencies
- [ ] Re-test transport behavior and headers
- [ ] Re-test auth and challenge flow
- [ ] Re-run protocol conformance checks

## Official Sources

- https://github.com/modelcontextprotocol/typescript-sdk
- https://github.com/modelcontextprotocol/typescript-sdk/raw/refs/heads/main/docs/migration.md
- https://github.com/modelcontextprotocol/typescript-sdk/raw/refs/heads/main/docs/faq.md
- https://github.com/modelcontextprotocol/typescript-sdk/raw/refs/heads/main/docs/server.md
