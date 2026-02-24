# Security, Authorization, and OAuth

This reference focuses on official MCP security controls for production servers.

## Example Semantics

- `Normative`: Header names, auth challenge shape, and discovery endpoint conventions.
- `Illustrative`: Domains, scope names, token strings, and error descriptions.

## Core Rules

- Validate all untrusted model and user input.
- Enforce least privilege for tools, filesystem access, and egress.
- Isolate sessions to prevent cross-user context bleed.

## Streamable HTTP Security

- Validate `Origin` and `Host` headers.
- Prefer localhost binding for local services.
- Require strong auth for remote exposure.
- Do not treat session IDs as authentication.

### Protected request header example

Classification: `Normative` security-relevant header names; `Illustrative` host/token values.

```http
POST /mcp HTTP/1.1
Host: mcp.example.internal
Origin: https://host.example.app
Accept: application/json, text/event-stream
Content-Type: application/json
MCP-Protocol-Version: 2025-11-25
MCP-Session-Id: sess_abc
Authorization: Bearer eyJhbGciOi...
```

## Token Handling

- Validate bearer token audience and scope on every request.
- Reject token passthrough patterns that bypass proper token issuance for your MCP server.
- Use short-lived credentials and rotation.

Validation checklist:

- Verify signature and expiration.
- Verify audience/resource identifier matches this MCP server.
- Verify minimum scopes for requested method/tool.

## Authorization Discovery

For protected resources and OAuth-aware clients:

- Return standards-compliant `WWW-Authenticate` challenges.
- Provide resource metadata discovery where required.

### 401 challenge example

Classification: `Normative` `WWW-Authenticate` pattern and error category; `Illustrative` realm/URL/value details.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="mcp", error="invalid_token", resource_metadata="https://mcp.example.internal/.well-known/oauth-protected-resource"
Content-Type: application/json

{"error":"invalid_token","error_description":"Access token missing or invalid"}
```

### Protected resource metadata endpoint example

Classification: `Normative` endpoint purpose and key metadata fields; `Illustrative` auth server and scope names.

```http
GET /.well-known/oauth-protected-resource HTTP/1.1
Host: mcp.example.internal
```

```json
{
	"resource": "https://mcp.example.internal",
	"authorization_servers": ["https://auth.example.internal"],
	"bearer_methods_supported": ["header"],
	"scopes_supported": ["mcp.tools.read", "mcp.tools.execute"]
}
```

## Prompt Injection Guardrails

- Treat external content as potentially adversarial.
- Add parameter-level sanitization and strict schema constraints.
- Require explicit user confirmation for sensitive mutations.
- Reject untrusted instructions embedded in tool/resource content unless explicitly re-authorized.

## Official Sources

- https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://modelcontextprotocol.io/docs/tutorials/security/authorization
- https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization
