# Tools, Resources, and Prompts Data Shapes

Use these patterns to keep server outputs deterministic and client-friendly.

## Example Semantics

- `Normative`: JSON-RPC method names, envelope shape, and capability-specific flow semantics.
- `Illustrative`: Resource URIs, IDs, text payloads, and domain field names.

## Tools

Recommendations:

- Constrain `inputSchema` aggressively.
- Prefer machine-readable output with `structuredContent`.
- Return `isError: true` for business-level failures.
- Reserve JSON-RPC errors for protocol/runtime failures.

### `tools/list` example

Classification: `Normative` method and envelope shape; `Illustrative` tool catalog contents.

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "tools/list",
  "params": {}
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "tools": [
      {
        "name": "get_order",
        "description": "Return order details by order number.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "orderNo": { "type": "string" }
          },
          "required": ["orderNo"],
          "additionalProperties": false
        },
        "outputSchema": {
          "type": "object",
          "properties": {
            "orderNo": { "type": "string" },
            "status": { "type": "string" }
          },
          "required": ["orderNo", "status"]
        }
      }
    ]
  }
}
```

### `tools/call` success example

Classification: `Normative` method name and request shape; `Illustrative` tool and argument values.

```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "tools/call",
  "params": {
    "name": "get_order",
    "arguments": {
      "orderNo": "00012345"
    }
  }
}
```

### Tool Output Example

Classification: `Normative` use of `isError` semantics; `Illustrative` `structuredContent` fields.

```json
{
  "content": [{ "type": "text", "text": "Customer fetched" }],
  "structuredContent": { "id": "C1000", "active": true },
  "isError": false
}
```

### `tools/call` business-error example

Classification: `Normative` business-error signaling pattern; `Illustrative` message text.

```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Order 00099999 was not found."
      }
    ],
    "isError": true
  }
}
```

## Resources

Recommendations:

- Use stable URI semantics.
- Implement subscriptions for frequently updated data.
- Emit update/list-changed notifications where supported.
- Pair templates with completion for dynamic argument entry.

### `resources/list` example

Classification: `Normative` method and envelope shape; `Illustrative` resource/template values.

```json
{
  "jsonrpc": "2.0",
  "id": 20,
  "method": "resources/list",
  "params": {}
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 20,
  "result": {
    "resources": [
      {
        "uri": "sfcc://orders/00012345",
        "name": "Order 00012345",
        "mimeType": "application/json"
      }
    ],
    "resourceTemplates": [
      {
        "uriTemplate": "sfcc://orders/{orderNo}",
        "name": "Order by number"
      }
    ]
  }
}
```

### `resources/read` example

Classification: `Normative` method and envelope shape; `Illustrative` resource content.

```json
{
  "jsonrpc": "2.0",
  "id": 21,
  "method": "resources/read",
  "params": {
    "uri": "sfcc://orders/00012345"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 21,
  "result": {
    "contents": [
      {
        "uri": "sfcc://orders/00012345",
        "mimeType": "application/json",
        "text": "{\"orderNo\":\"00012345\",\"status\":\"NEW\"}"
      }
    ]
  }
}
```

### `resources/subscribe` + update notification

Classification: `Normative` subscribe and update method names; `Illustrative` URI values.

```json
{
  "jsonrpc": "2.0",
  "id": 22,
  "method": "resources/subscribe",
  "params": {
    "uri": "sfcc://orders/00012345"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 22,
  "result": {}
}
```

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "sfcc://orders/00012345"
  }
}
```

## Prompts

Recommendations:

- Keep prompts parameterized and narrow.
- Use prompts as reusable workflow scaffolding.
- Ensure prompt outputs are predictable enough for downstream tooling.

### `prompts/list` and `prompts/get` examples

Classification: `Normative` method names and envelope shape; `Illustrative` prompt names and arguments.

```json
{
  "jsonrpc": "2.0",
  "id": 30,
  "method": "prompts/list",
  "params": {}
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 30,
  "result": {
    "prompts": [
      {
        "name": "summarize_order",
        "description": "Summarize an order for customer support.",
        "arguments": [
          {
            "name": "orderNo",
            "required": true
          }
        ]
      }
    ]
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 31,
  "method": "prompts/get",
  "params": {
    "name": "summarize_order",
    "arguments": {
      "orderNo": "00012345"
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 31,
  "result": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Summarize order 00012345 for a support agent."
        }
      }
    ]
  }
}
```

## Completions

- Implement completion for prompt/resource argument ergonomics.
- Keep suggestions bounded and context-specific.

### `completion/complete` example

Classification: `Normative` method and parameter structure; `Illustrative` suggested values.

```json
{
  "jsonrpc": "2.0",
  "id": 40,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/prompt",
      "name": "summarize_order"
    },
    "argument": {
      "name": "orderNo",
      "value": "0001"
    },
    "context": {
      "arguments": {}
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 40,
  "result": {
    "completion": {
      "values": ["00012345", "00012346"],
      "total": 2,
      "hasMore": false
    }
  }
}
```

## Design Checklist

- [ ] Inputs use strict JSON schema boundaries
- [ ] Outputs include text + structured shape where useful
- [ ] List/read/update notification behavior documented
- [ ] Completion coverage for template arguments

## Official Sources

- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://modelcontextprotocol.io/specification/2025-11-25/server/resources
- https://modelcontextprotocol.io/specification/2025-11-25/server/prompts
- https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/completion
