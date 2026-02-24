---
name: mcp-development
description: Mandatory preflight for MCP server design/review/audit tasks. Defines production best practices for architecting, securing, testing, and operating TypeScript MCP servers, including transport design, schema validation, error handling, and deployment.
---

# MCP Development Skill

Always load this skill before designing, implementing, reviewing, auditing, or hardening TypeScript MCP servers.

## Protocol Target

- Target MCP protocol revision: `2025-11-25`.
- If you must support legacy clients, document exact compatibility with `2024-11-05` HTTP+SSE behavior.
- Treat protocol version negotiation as mandatory, not optional.

## When to Use

- Building a new MCP server from scratch
- Choosing between STDIO and Streamable HTTP transport
- Designing tools, resources, and prompts with strict schemas
- Hardening security for multi-tenant or networked deployments
- Setting up testing, CI/CD, and production operations
- Reviewing an existing MCP server for protocol correctness and resilience

## When NOT to Use

- Simple one-off scripts with no MCP protocol surface
- Frontend-only tasks unrelated to MCP integration
- Generic REST API design without MCP-specific concerns

## SDK Version Guardrails

- Be explicit about TypeScript SDK generation in docs and examples.
- Current official guidance indicates v2 is still evolving; validate stability expectations before production rollout.
- If you adopt v2 package split, ensure examples use the correct package names for server, client, and runtime transports.
- Do not assume server-side SSE transport support in new SDK major versions; confirm with the current migration docs.

## Architecture First

Treat MCP as three actors:

- Host: the user-facing AI application
- Client: host-side protocol manager for one server connection
- Server: your TypeScript process exposing tools/resources/prompts

Separate two layers:

- Data layer: JSON-RPC 2.0 semantics and MCP capability lifecycle
- Transport layer: how bytes move (STDIO or Streamable HTTP)

### Transport Decision Matrix

| Vector | STDIO | Streamable HTTP |
|---|---|---|
| Runtime model | Child process per client | Independent network service |
| Concurrency | Single client per process | Multi-client and multiplexed |
| Latency | Very low local latency | Network and TLS overhead |
| Auth complexity | Local trust boundary | OAuth/token/TLS required |
| Best fit | Local IDE, desktop workflows | Shared services, SaaS, multi-tenant |

Guideline:

- Keep domain logic transport-agnostic.
- Implement transport as an adapter at the edge.
- Reuse one server core for both local STDIO and production Streamable HTTP.

## Transport Compliance Essentials

### STDIO

- `stdout` is protocol-only JSON-RPC traffic.
- Send logs and diagnostics to `stderr` only.
- Use newline-delimited JSON-RPC messages and avoid corrupting framing.

### Streamable HTTP

- Treat Streamable HTTP as the modern transport; legacy HTTP+SSE is compatibility mode.
- Honor required headers and session lifecycle semantics.
- Validate `Origin` and `Host` for browser-facing or local-network-exposed endpoints.
- Preserve protocol version continuity via `MCP-Protocol-Version` on subsequent requests.

## TypeScript Foundations

### Compiler Discipline

- Enable strict TypeScript settings.
- Avoid `any`; use `unknown` at untrusted boundaries.
- Use type narrowing and exhaustive checks.
- Handle nullish values consistently with explicit fallbacks.

### Runtime Validation Boundary

Use Zod at every external boundary:

- Tool input arguments
- Prompt arguments
- Resource template parameters
- Environment configuration and secrets

Pattern:

1. Parse unknown input with Zod.
2. Return precise validation failure details.
3. Execute business logic only after parse success.

Also validate environment and secret configuration at startup so the server fails fast with actionable diagnostics.

## Core MCP Primitives

### Tools (Actions)

Tools are the action surface. Design for model reliability:

- Use specific names and clear descriptions.
- Describe when the tool should and should not be used.
- Prefer constrained schemas (enums, min/max, regex, unions).
- Keep outputs structured and predictable.
- Prefer output schemas for machine-consumable responses.
- Return `structuredContent` when feasible, with text content for compatibility.

Failure handling rule:

- For business-level failures, return tool content with `isError: true`.
- Reserve protocol-level JSON-RPC errors for malformed requests, missing methods, or internal faults.

### Resources (Read-only Context)

Resources provide durable context.

- Use stable URI design.
- Support template-based dynamic resources where appropriate.
- Add pagination for large listings.
- Notify clients when resource inventories change if your server supports it.
- Use templates and completion for dynamic URI argument guidance.
- Support subscriptions and updated notifications when data changes frequently.

### Prompts (Reusable Scaffolding)

Prompts should be reusable and parameterized:

- Capture repeatable workflows.
- Inject runtime arguments instead of hardcoding context.
- Keep prompt templates deterministic and concise.
- Treat prompts as user-controlled workflow scaffolding, not hidden policy overlays.

## Advanced Workflows

### Sampling

Sampling allows the server to request model generations from the host.

Use it for:

- Intermediate synthesis or transformations
- Reasoning-heavy internal steps
- AI-assisted decision support without server-owned model keys

Best practices:

- Request only the minimum required context scope.
- Use `includeContext` carefully; newer protocol guidance soft-deprecates broader context usage unless explicitly supported.
- Keep token budgets explicit and bounded.
- Preserve user approval and review boundaries.

### Elicitation

Elicitation asks the user for missing structured input mid-workflow.

Use it when:

- Required parameters are missing
- Multiple risky paths need user selection
- Human confirmation is needed before mutation

Best practices:

- Define required input shape via JSON schema.
- Keep form schemas simple and explicit.
- Avoid collecting sensitive values via insecure channels.
- Resume workflow only after validated response.
- Make error and cancellation states explicit.

### Progress, Cancellation, and Tasks

- Accept and propagate progress tokens for long-running operations.
- Send progress notifications with monotonic updates.
- Implement cancellation handling and idempotent cleanup paths.
- For long async operations, prefer task-based execution where clients support it.

## Error Handling and Logging

### The STDIO Rule

For STDIO servers, `stdout` is protocol-only.

- Never write logs to `stdout`.
- Route all logs and diagnostics to `stderr`.
- Avoid `console.log` in server paths.

If text leaks into `stdout`, JSON-RPC framing can break and the client may disconnect.

### JSON-RPC Error Mapping

Map failures intentionally:

- `-32700`: Parse error
- `-32600`: Invalid request object
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error
- `-32000` to `-32099`: App-specific server errors

Custom error classes:

- Preserve prototype chains for reliable `instanceof` checks.
- Centralize mapping from app errors to JSON-RPC errors.

Logging guidance:

- Use structured logs with severity levels.
- Redact secrets and sensitive payload fragments.
- Keep request identifiers to correlate protocol events and downstream calls.

## Security Baseline

Assume untrusted input, even from the model itself.

### Identity and Transport

- Enforce TLS for network transports.
- Prefer OAuth 2.1 or equivalent bearer-token controls.
- Validate token audience/scope on every call.
- Use short-lived credentials and rotation policies.
- Do not accept token passthrough patterns that bypass proper audience validation.

### Local and Network Hardening

- Bind local services to `127.0.0.1` when intended for local use.
- Validate `Host` and `Origin` headers.
- Reject insecure callback and auth URL configurations.
- Never use session IDs as authentication credentials.

### Prompt Injection and Over-Agency

- Treat resource/tool content as potentially adversarial.
- Sanitize and constrain tool inputs.
- Minimize tool privileges and reachable blast radius.
- Segment sessions to avoid context bleed between users.
- Treat annotations and model-supplied hints as untrusted unless you explicitly trust the source.

### Supply Chain and Runtime Controls

- Pin and scan dependencies.
- Maintain a software bill of materials when possible.
- Add rate limits, execution timeouts, and resource quotas.
- Run with least-privilege filesystem and network access.

### OAuth and Authorization

- Follow MCP authorization discovery and challenge flows for remote transports.
- Return standards-compliant auth challenges and metadata when access tokens are missing or invalid.
- Keep stdio/local auth strategy separate from network resource-server auth strategy.

## Testing Strategy

Build a layered test pyramid:

1. Protocol conformance tests for JSON-RPC framing and IDs
2. Unit tests for business logic and validators
3. Integration tests for transport and capability negotiation
4. Security tests for injection, traversal, malformed inputs
5. Performance tests for concurrency and streaming stability

Protocol-focused additions:

- Test capability negotiation (`initialize`) against the protocol version you target.
- Validate header/session requirements for Streamable HTTP.
- Verify schema validation failures return deterministic, model-correctable errors.
- Test cancellation and task polling/result flows when implemented.

### Tooling Suggestions

- MCP Inspector for interactive development and schema verification
- Jest or Vitest for automated test suites
- Load testing for Streamable HTTP endpoints
- Semantic regression checks for prompt/resource quality where needed

Also keep a small suite of fixture-based wire examples to detect accidental response-shape drift.

## Deployment and Operations

For Streamable HTTP servers:

- Containerize for reproducible deployment.
- Add health checks and readiness probes.
- Support graceful shutdown on `SIGINT` and `SIGTERM`.
- Close open streams and finish in-flight work before exit.
- Ensure graceful shutdown includes SSE stream cleanup and pending task persistence strategy.

CI/CD guidance:

- Run lint, type-check, tests, and security scans on every PR.
- Use least-privilege CI tokens.
- Keep secrets in managed secret stores, never in logs.
- Add rollback-friendly deployment strategy (canary/blue-green).
- Pin dependencies and run routine supply-chain scanning.

## Production Readiness Checklist

- [ ] Transport choice documented with threat model
- [ ] Tool/resource/prompt schemas validated at runtime
- [ ] No non-protocol writes to `stdout` in STDIO mode
- [ ] Error taxonomy mapped to JSON-RPC codes
- [ ] Auth, TLS, and token/audience validation implemented for network mode
- [ ] Rate limits and timeouts configured
- [ ] Session isolation and context-scoping enforced
- [ ] Protocol, unit, integration, and security tests passing
- [ ] Graceful shutdown and observability in place
- [ ] CI/CD includes dependency and secret hygiene

## Quick Wire Examples

### Tool result with structured output

```json
{
  "content": [{ "type": "text", "text": "Order total computed." }],
  "structuredContent": { "currency": "USD", "total": 42.5 },
  "isError": false
}
```

### Progress notification

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "op-123",
    "progress": 40,
    "message": "Fetched 2/5 pages"
  }
}
```

### Cancellation notification

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": "tool-call-17",
    "reason": "User cancelled"
  }
}
```

## Minimal Starter Layout

```text
src/
  index.ts                 # transport wiring
  server.ts                # MCP server creation and registration
  config.ts                # env parsing and Zod validation
  capabilities/
    tools.ts
    resources.ts
    prompts.ts
  lib/
    errors.ts
    logger.ts
    security.ts
tests/
  protocol/
  unit/
  integration/
```

## Reference Files

- `references/protocol-versioning-and-negotiation.md`
- `references/transports-stdio-vs-streamable-http.md`
- `references/tools-resources-prompts-data-shapes.md`
- `references/logging-progress-cancellation.md`
- `references/tasks-experimental.md`
- `references/security-authorization-oauth.md`
- `references/typescript-sdk-v1-v2-notes.md`

## Official References

- https://modelcontextprotocol.io/specification/versioning
- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://modelcontextprotocol.io/specification/2025-11-25/server/resources
- https://modelcontextprotocol.io/specification/2025-11-25/server/prompts
- https://modelcontextprotocol.io/docs/tutorials/security/authorization
- https://github.com/modelcontextprotocol/typescript-sdk
