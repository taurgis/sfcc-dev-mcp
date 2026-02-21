# Protocol Versioning and Negotiation

Use this reference to keep server behavior aligned with MCP revisioned specs.

## Example Semantics

- `Normative`: JSON-RPC method names, lifecycle ordering, and required protocol headers.
- `Illustrative`: IDs, capability sets, hostnames, tokens, and sample values.

## Target Revision

- Preferred target: `2025-11-25`.
- Legacy compatibility: document exactly what is supported from older revisions.

## Initialize Handshake Example

Classification: `Normative` method names and lifecycle sequence; `Illustrative` payload values.

### Client request

```json
{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "initialize",
	"params": {
		"protocolVersion": "2025-11-25",
		"capabilities": {
			"roots": { "listChanged": true },
			"sampling": {}
		},
		"clientInfo": {
			"name": "example-host",
			"version": "1.0.0"
		}
	}
}
```

### Server response

```json
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"protocolVersion": "2025-11-25",
		"capabilities": {
			"tools": { "listChanged": true },
			"resources": { "subscribe": true, "listChanged": true },
			"prompts": { "listChanged": true },
			"logging": {}
		},
		"serverInfo": {
			"name": "example-mcp-server",
			"version": "1.0.0"
		}
	}
}
```

### Client initialized notification

```json
{
	"jsonrpc": "2.0",
	"method": "notifications/initialized"
}
```

If unsupported, fail early with actionable guidance and expected version information.

## Streamable HTTP Version Continuity

For HTTP transports:

- Keep protocol version consistent per session.
- Send `MCP-Protocol-Version` where required after initialization.

### Subsequent HTTP request example

Classification: `Normative` header names and request shape; `Illustrative` host/session/token values.

```http
POST /mcp HTTP/1.1
Host: mcp.example.internal
Accept: application/json, text/event-stream
Content-Type: application/json
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: sess_4f8d66b2
Authorization: Bearer eyJhbGciOi...

{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

## Compatibility Policy Template

Classification: `Illustrative` documentation template.

Use this in project docs:

```text
Protocol target: 2025-11-25
Legacy support: 2024-11-05 transport fallback only
Unsupported: pre-2024-11-05
```

## Implementation Checklist

- [ ] One explicit protocol target in docs and code comments
- [ ] Initialize handshake tests for supported and unsupported versions
- [ ] Header-level version checks for HTTP requests
- [ ] Backward compatibility behavior documented and tested
- [ ] `notifications/initialized` is sent/accepted in lifecycle tests

## Official Sources

- https://modelcontextprotocol.io/specification/versioning
- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
