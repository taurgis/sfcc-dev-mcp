# Transports: STDIO vs Streamable HTTP

Choose transport based on trust boundary, scale, and ops model.

## Example Semantics

- `Normative`: STDIO stdout-only protocol channel, Streamable HTTP header names, and lifecycle statuses.
- `Illustrative`: Hostnames, tokens, IDs, and domain payload fields.

## STDIO

Best for local and single-client process workflows.

Rules:

- `stdout` is protocol data only.
- Route logs to `stderr`.
- Preserve clean newline-delimited JSON-RPC framing.

### STDIO framing example

Classification: `Normative` framing constraints and method names; `Illustrative` IDs and payload values.

Each JSON-RPC message is one line on `stdout`:

```text
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"host","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-11-25","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"server","version":"1.0.0"}}}
```

Log output goes to `stderr` only:

```text
[info] server started on stdio transport
```

### Minimal Logging Pattern

Classification: `Illustrative` code pattern.

```ts
process.stderr.write(`[debug] loaded config for ${instanceName}\n`)
```

## Streamable HTTP

Best for shared, multi-client, or remote deployments.

Core requirements:

- Correct `Accept` handling for JSON and event streams
- Session lifecycle with `MCP-Session-Id`
- Protocol version continuity (`MCP-Protocol-Version`)
- Host/Origin validation for browser-adjacent threat models

### Streamable HTTP tool call example

Classification: `Normative` request/response envelope and key headers; `Illustrative` endpoint and body values.

```http
POST /mcp HTTP/1.1
Host: mcp.example.internal
Accept: application/json, text/event-stream
Content-Type: application/json
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: sess_123
Authorization: Bearer <token>

{"jsonrpc":"2.0","id":9,"method":"tools/call","params":{"name":"get_order","arguments":{"orderNo":"00012345"}}}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
MCP-Session-Id: sess_123

{"jsonrpc":"2.0","id":9,"result":{"content":[{"type":"text","text":"Order found"}],"structuredContent":{"orderNo":"00012345"},"isError":false}}
```

### Streamable HTTP notification response example

Classification: `Normative` notification handling with `202 Accepted`; `Illustrative` session value.

```http
POST /mcp HTTP/1.1
Host: mcp.example.internal
Accept: application/json, text/event-stream
Content-Type: application/json
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: sess_123

{"jsonrpc":"2.0","method":"notifications/initialized"}
```

```http
HTTP/1.1 202 Accepted
MCP-Session-Id: sess_123
```

### Streamable HTTP SSE stream example

Classification: `Normative` SSE channel usage and event framing; `Illustrative` progress values.

```http
GET /mcp HTTP/1.1
Host: mcp.example.internal
Accept: text/event-stream
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: sess_123
Authorization: Bearer <token>
```

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
MCP-Session-Id: sess_123

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"t1","progress":20,"message":"Step 1/5"}}

```

### Header Checklist

Classification: `Normative` header names; `Illustrative` header values.

```http
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: abc123
Authorization: Bearer <token>
```

## Legacy Note

- Streamable HTTP replaces legacy HTTP+SSE transport behavior.
- Keep fallback support only when required by existing clients.

## Decision Checklist

- [ ] Need local-only tooling -> STDIO
- [ ] Need remote/multi-tenant service -> Streamable HTTP
- [ ] Need legacy HTTP+SSE compatibility -> explicit migration plan

## Official Sources

- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
