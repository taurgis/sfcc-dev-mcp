# Tasks (Experimental)

Use tasks for long-running or asynchronous tool execution where clients support task capabilities.

## Example Semantics

- `Normative`: Task-related method names/capabilities and JSON-RPC envelope shape.
- `Illustrative`: Task IDs, progress values, status transitions, and payload content.

## Capability and Tool Contracts

Server-side considerations:

- Advertise task capabilities explicitly.
- Define per-tool task support policy (`required`, `optional`, or `forbidden`).
- Keep task ownership scoped to the authenticated caller/session context.

### Initialize capability example

Classification: `Normative` capability structure keys; `Illustrative` capability values and metadata.

```json
{
  "jsonrpc": "2.0",
  "id": 70,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": { "listChanged": true },
      "tasks": {
        "list": true,
        "cancel": true,
        "requests": {
          "tools/call": true
        }
      }
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}
```

### Tool definition task support example

Classification: `Normative` `execution.taskSupport` concept; `Illustrative` tool schema fields.

```json
{
  "name": "generate_report",
  "description": "Generate a large CSV report.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "siteId": { "type": "string" }
    },
    "required": ["siteId"],
    "additionalProperties": false
  },
  "execution": {
    "taskSupport": "optional"
  }
}
```

## Flow Pattern

1. Client calls tool with task intent.
2. Server starts background work and returns task metadata.
3. Client polls task status or fetches task result.
4. Client can cancel task if supported.

## Minimal Task-Oriented Call Example

Classification: `Normative` task call shape and `tools/call` method; `Illustrative` task TTL and argument values.

```json
{
  "jsonrpc": "2.0",
  "id": 71,
  "method": "tools/call",
  "params": {
    "name": "generate_report",
    "arguments": { "siteId": "RefArch" },
    "task": { "ttl": 60000 },
    "_meta": { "progressToken": "task-1" }
  }
}
```

### Task-accepted response example

Classification: `Normative` related-task metadata pattern; `Illustrative` task ID and text content.

```json
{
  "jsonrpc": "2.0",
  "id": 71,
  "result": {
    "content": [{ "type": "text", "text": "Report generation started." }],
    "isError": false,
    "_meta": {
      "io.modelcontextprotocol/related-task": {
        "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5"
      }
    }
  }
}
```

### `tasks/get` polling example

Classification: `Normative` method and envelope shape; `Illustrative` status/progress values.

```json
{
  "jsonrpc": "2.0",
  "id": 72,
  "method": "tasks/get",
  "params": {
    "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 72,
  "result": {
    "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5",
    "status": "running",
    "progress": 45
  }
}
```

### `tasks/result` example

Classification: `Normative` method and envelope shape; `Illustrative` result payload.

```json
{
  "jsonrpc": "2.0",
  "id": 73,
  "method": "tasks/result",
  "params": {
    "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 73,
  "result": {
    "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5",
    "status": "succeeded",
    "result": {
      "content": [{ "type": "text", "text": "Report ready at sfcc://reports/2026-02-21.csv" }],
      "isError": false
    }
  }
}
```

### `tasks/list` example

Classification: `Normative` method and envelope shape; `Illustrative` list values and cursor.

```json
{
  "jsonrpc": "2.0",
  "id": 74,
  "method": "tasks/list",
  "params": {
    "cursor": ""
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 74,
  "result": {
    "tasks": [
      {
        "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5",
        "status": "running"
      }
    ],
    "nextCursor": null
  }
}
```

### `tasks/cancel` example

Classification: `Normative` cancellation method and response shape; `Illustrative` task ID.

```json
{
  "jsonrpc": "2.0",
  "id": 75,
  "method": "tasks/cancel",
  "params": {
    "id": "task_01JX9GQ4R8N3X6W4T1C2Y3Z4A5"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 75,
  "result": {}
}
```

## Operational Guidance

- Keep task TTL and retention explicit.
- Persist enough metadata for restart safety.
- Ensure cancellation cannot corrupt shared state.

## Official Source

- https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks
