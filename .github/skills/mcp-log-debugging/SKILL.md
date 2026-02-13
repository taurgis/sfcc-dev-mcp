````skill
---
name: mcp-log-debugging
description: How to capture and read sfcc-dev-mcp server logs for debugging tool responses, preflight notices, and OCAPI/WebDAV calls. Use this when investigating missing notices or unexpected tool output.
---

# MCP Log Debugging Skill

Use this skill to collect and analyze the MCP server logs that are written outside the workspace (in the OS temp directory). Logs are always file-based and debug logging is opt-in.

## Enable Debug Logs

Start the server with debug enabled to get `[DEBUG]` entries:

```bash
node dist/main.js --debug true
```

If you run from source with ts-node or a runner wrapper, pass `--debug true` after your command. Debug mode is sticky per process; restart the server to toggle it.

## Locate the Log Directory

Logs live under the OS temp dir in `sfcc-mcp-logs/`. Print the absolute path:

```bash
node -e "const os=require('os');const path=require('path');console.log(path.join(os.tmpdir(),'sfcc-mcp-logs'));"
```

Key files:
- `sfcc-mcp-debug.log` – debug/info
- `sfcc-mcp-error.log` – errors

## Capture Logs into Workspace (safe for MCP tools)

Because the log directory is outside the workspace, copy a tail into the repo for inspection:

```bash
mkdir -p logs && \
  tail -n 200 "$(node -e "const os=require('os');const path=require('path');console.log(path.join(os.tmpdir(),'sfcc-mcp-logs','sfcc-mcp-debug.log'));")" \
  > logs/sfcc-mcp-debug-tail.txt
```

Then open `logs/sfcc-mcp-debug-tail.txt` inside the workspace. Adjust `-n` as needed.

## What to Look For

- `[InstructionAdvisor] Status` entries: shows workspaceRoot, hasAgents, hasSkills, detectedSkillsDir, missingSkills
- "Issuing" messages: confirms preflight notice generation path
- `Full response for <tool>`: verifies whether the notice was merged into the `content`
- OCAPI/WebDAV client lines: token reuse, request URLs, timings
- Handler timings: `Performance: <tool> took Nms`

## Common Debug Flows

1) **Missing preflight notice**
   - Ensure debug is on, capture tail, search for `InstructionAdvisor`.
   - If `hasAgents=true && hasSkills=true`, notice is suppressed (expected).
   - If `workspaceRoot` is undefined, use `sync_agent_instructions` with `destinationType:"temp"` or set `preferredRoot`.

2) **Tool response shape surprises**
   - Check `Full response for <tool>` preview to confirm the server returned the expected content before client UI formatting.

3) **OCAPI authentication issues**
   - Look for `Attempting to get access token` / `Using existing valid token` pairs and request URLs.

## Safety

Logger masks common secrets (passwords, client secrets, tokens). Still avoid sharing entire logs publicly; redact hostnames and business data when necessary.
````
