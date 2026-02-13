# Configuration

The server discovers credentials in this priority order:

1. `--dw-json /path/to/dw.json`
2. Environment variables (`SFCC_HOSTNAME`, `SFCC_USERNAME`, `SFCC_PASSWORD`, `SFCC_CLIENT_ID`, `SFCC_CLIENT_SECRET`)
3. Workspace auto-discovery (VS Code workspace root containing a `dw.json`)

Environment variables example:

```bash
export SFCC_HOSTNAME="your-instance.sandbox.us01.dx.commercecloud.salesforce.com"
export SFCC_USERNAME="your-username"
export SFCC_PASSWORD="your-password"
export SFCC_CLIENT_ID="your-client-id"
export SFCC_CLIENT_SECRET="your-client-secret"
```

## Workspace roots auto-discovery

Auto-discovery happens **after** the MCP client finishes initializing. The server requests workspace roots via the MCP `roots/list` capability and searches those directories for `dw.json`.

Key behaviors (from the server logic):

- Only runs when no CLI or environment credentials are provided (priority is CLI > ENV > workspace roots).
- Uses `roots/list` instead of the current working directory.
- Validates `file://` URIs only and blocks system directories for safety.
- When a `dw.json` is found, the server re-registers tools and sends `tools/list_changed` so your client can see new tools.

If your client does not support `roots/list`, auto-discovery will be skipped and you must pass `--dw-json` or environment variables.

<Callout title="Quick start" variant="info">
Start in docs mode, then add `dw.json` only when you need logs, job logs, system objects, or code versions.
</Callout>

## dw.json builder

<DwJsonBuilder />

## Minimal dw.json (logs and job logs)

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password"
}
```

## Full dw.json (Data API and code versions)

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-ocapi-client-id",
  "client-secret": "your-ocapi-client-secret"
}
```

## Supported dw.json fields

<div class="vp-card">

| Field | Required for | Notes |
| --- | --- | --- |
| `hostname` | All authenticated tools | Sandbox domain (no protocol) |
| `username` / `password` | Logs + job logs | WebDAV credentials |
| `client-id` / `client-secret` | System & custom objects, site prefs, code versions | OCAPI Data API |
| `code-version` | Code version operations | Optional default |
| `site-id` | Site-specific actions | Optional |

</div>

## Tool availability by mode

<div class="vp-card">

| Category | Docs only | Authenticated (capability-gated) |
| --- | --- | --- |
| Documentation | ✔ | ✔ |
| Agent instructions (AGENTS.md + skills) | ✔ | ✔ |
| SFRA docs | ✔ | ✔ |
| ISML docs | ✔ | ✔ |
| Cartridge generation | ✔ | ✔ |
| Log analysis (runtime) | — | ✔ (requires WebDAV creds) |
| Job logs | — | ✔ (requires WebDAV creds) |
| System & custom objects / site prefs | — | ✔ (requires client-id/client-secret) |
| Code versions | — | ✔ (requires client-id/client-secret) |

</div>

## Data API resource mapping

Add these resources in Business Manager: Administration -> Site Development -> Open Commerce API Settings (Data API tab).

```json
{
  "_v": "23.2",
  "clients": [{
    "client_id": "YOUR_CLIENT_ID",
    "resources": [
      { "resource_id": "/system_object_definitions", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/system_object_definitions/*", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/system_object_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/system_object_definitions/*/attribute_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/system_object_definitions/*/attribute_group_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/custom_object_definitions/*/attribute_definition_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/site_preferences/preference_groups/*/*/preference_search", "methods": ["post"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/code_versions", "methods": ["get"], "read_attributes": "(**)", "write_attributes": "(**)" },
      { "resource_id": "/code_versions/*", "methods": ["get", "patch"], "read_attributes": "(**)", "write_attributes": "(**)" }
    ]
  }]
}
```

## Data API setup steps

<Collapsible title="Step 1: Create API Client (Account Manager)" open>

1. Log in to Account Manager (not Business Manager).
2. Navigate to **API Client** and add a new client.
3. Generate a client secret and grant SFCC scopes.

</Collapsible>

<Collapsible title="Step 2: Business Manager Data API settings">

1. Business Manager -> Administration -> Site Development -> Open Commerce API Settings.
2. Add the resource mapping shown above to the Data API tab.
3. Ensure the client ID matches your Account Manager API client.

</Collapsible>

<Collapsible title="Step 3: Update dw.json">

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-ocapi-client-id",
  "client-secret": "your-ocapi-client-secret"
}
```

</Collapsible>

<Collapsible title="Troubleshooting Data API access">

- **403**: Missing scope or resource mapping in Business Manager.
- **401**: Invalid credentials or expired secret.
- **Empty results**: Confirm `definition_search` endpoints are enabled and use `match_all_query`.

</Collapsible>

## Notes

- Logs and job logs use WebDAV with username and password.
- System objects and site preferences use OCAPI Data API (`client-id` and `client-secret`).
- Code version activation requires Data API access plus `patch` permission.

<Callout title="Debug mode" variant="info">
Use `--debug true` temporarily when diagnosing tool behavior.
</Callout>

## Tool availability by mode

| Category | Docs mode | Full mode |
| --- | --- | --- |
| Documentation, SFRA, ISML | Yes | Yes |
| Cartridge generation | Yes | Yes |
| Agent instructions | Yes | Yes |
| Logs and job logs | No | Yes |
| System objects and site preferences | No | Yes |
| Code versions | No | Yes |
| Script debugger | No | Yes |

## Supported dw.json fields

| Field | Required for | Notes |
| --- | --- | --- |
| `hostname` | All authenticated tools | Sandbox hostname |
| `username` / `password` | Logs and job logs | WebDAV access |
| `client-id` / `client-secret` | System objects, site preferences, code versions | OCAPI Data API |
| `code-version` | Code version operations | Optional |
| `site-id` | Site-specific operations | Optional |

## Security basics

```bash
echo 'dw.json' >> .gitignore
echo '*.dw.json' >> .gitignore
chmod 600 dw.json
```

Use environment variables for secrets in CI:

```bash
export SFCC_CLIENT_SECRET="your-secret"
export SFCC_PASSWORD="your-password"
```
