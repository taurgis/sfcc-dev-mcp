# Logging, Progress, and Cancellation

Operational correctness depends on these three primitives.

## Example Semantics

- `Normative`: Method names (`logging/setLevel`, `notifications/progress`, `notifications/cancelled`) and envelope shape.
- `Illustrative`: Log payload fields, IDs, progress numbers, and reason text.

## Logging

- Use structured logs.
- Keep severity aligned with syslog-style levels.
- Never log credentials, tokens, or secret payload fragments.

### `logging/setLevel` request example

Classification: `Normative` method and shape; `Illustrative` level value.

```json
{
  "jsonrpc": "2.0",
  "id": 50,
  "method": "logging/setLevel",
  "params": {
    "level": "info"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 50,
  "result": {}
}
```

### Log Event Shape Example

Classification: `Normative` notification method; `Illustrative` `data` structure.

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/message",
  "params": {
    "level": "info",
    "data": {
      "event": "tool.completed",
      "tool": "search_orders",
      "durationMs": 127
    }
  }
}
```

## Progress

- Accept `_meta.progressToken` on long-running requests.
- Emit monotonic progress updates.
- Include concise user-readable progress messages.

### Progress-enabled tool call example

Classification: `Normative` method and `_meta.progressToken` pattern; `Illustrative` tool name/arguments.

```json
{
  "jsonrpc": "2.0",
  "id": 60,
  "method": "tools/call",
  "params": {
    "name": "reindex_catalog",
    "arguments": {
      "siteId": "RefArch"
    },
    "_meta": {
      "progressToken": "reindex-1"
    }
  }
}
```

### Progress Example

Classification: `Normative` progress notification method; `Illustrative` progress values and messages.

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "job-42",
    "progress": 60,
    "message": "Processed 3 of 5 files"
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 60,
  "result": {
    "content": [{ "type": "text", "text": "Reindex completed" }],
    "isError": false
  }
}
```

## Cancellation

- Handle cancellation as a normal control path.
- Ensure cleanup is safe and idempotent.
- Distinguish request cancellation from task cancellation flows.

### `notifications/cancelled` example

Classification: `Normative` cancellation method and envelope; `Illustrative` reason text.

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": 60,
    "reason": "User requested stop"
  }
}
```

Server behavior expectation:

- Stop work for request `60` if still in progress.
- Return no extra protocol noise if cancellation already completed.
- Keep cleanup idempotent.

## Official Sources

- https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/logging
- https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/progress
- https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/cancellation
