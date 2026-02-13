---
title: Troubleshooting
description: Diagnose SFCC Dev MCP startup, authentication, logs, OCAPI access, and client connection issues with quick fixes.
---

# Troubleshooting

## Quick checks

- Node.js 18+ is installed
- `dw.json` exists and has `chmod 600` permissions
- The SFCC sandbox is active and reachable

<Callout title="Quick test" variant="info">
Run `npx -y sfcc-dev-mcp --debug` to verify the server starts without errors.
</Callout>

## Server will not start

```bash
node --version
npx -y sfcc-dev-mcp --debug
```

<Collapsible title="Node.js version mismatch" open>

```bash
node --version
nvm install 18 && nvm use 18
```

If you work with older SFRA/SiteGenesis projects, set a higher default Node version for MCP:

```bash
nvm alias default 18
nvm use 12.22.6
```

</Collapsible>

<Collapsible title="File permissions">

```bash
chmod 600 dw.json
ls -la dw.json
```

</Collapsible>

<Collapsible title="Package installation">

```bash
npm install -g sfcc-dev-mcp
npx -y sfcc-dev-mcp --version
```

</Collapsible>

## Authentication issues

- Verify `hostname`, `username`, and `password`
- Regenerate `client-id` and `client-secret` if OCAPI calls fail
- Confirm OCAPI resources in Business Manager match the configuration page

<Collapsible title="Test connectivity">

```bash
curl -I https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com
```

</Collapsible>

<Collapsible title="Regenerate API credentials">

```bash
curl -X POST \
	https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/dw/oauth2/access_token \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "grant_type=client_credentials&client_id=NEW_ID&client_secret=NEW_SECRET"
```

</Collapsible>

## Log tools return no data

- Test WebDAV access directly:

```bash
curl -u "username:password" https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/
```

- Ensure logs exist for the requested date

<Collapsible title="Wrong date format">

```javascript
get_latest_error({ date: "20241218" })
```

</Collapsible>

## System object tools failing

- Confirm Data API resources include `definition_search` endpoints (POST)
- Ensure `client-id` matches the OCAPI client in Account Manager

<Collapsible title="Required Data API resources">

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

</Collapsible>

## Job log tools issues

<Collapsible title="Job log access">

```bash
curl -u "username:password" \
	https://your-instance.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Logs/jobs/
```

</Collapsible>

<Collapsible title="Minimal health flow">

```bash
aegis query search_job_logs_by_name 'jobName:MyJob|limit:3'
aegis query get_job_log_entries 'jobName:MyJob|limit:40'
aegis query get_job_execution_summary 'jobName:MyJob'
```

</Collapsible>

## AI client not connecting

<Collapsible title="Validate MCP config">

```bash
python -m json.tool claude_desktop_config.json
npx -y sfcc-dev-mcp --debug
```

</Collapsible>

## Auto-discovery not working

<Collapsible title="No tools after adding dw.json" open>

- Ensure your client supports MCP `roots/list` (VS Code/Copilot/Cursor do).
- Re-open the workspace after adding `dw.json`.
- If your client does not support workspace roots, pass `--dw-json` explicitly.

</Collapsible>

## Debug logging

```bash
npx -y sfcc-dev-mcp --debug
npx -y sfcc-dev-mcp --debug false --dw-json /path/to/dw.json
```

## Log file locations

- macOS: `/var/folders/{user-id}/T/sfcc-mcp-logs/`
- Linux: `/tmp/sfcc-mcp-logs/`
- Windows: `%TEMP%\sfcc-mcp-logs\`

```bash
node -e "console.log(require('os').tmpdir() + '/sfcc-mcp-logs')"
```

## Getting help

Collect diagnostic data and remove secrets before sharing:

```bash
node --version
npm --version
npm list sfcc-dev-mcp
```

## AI client not connecting

- Validate your MCP config file JSON
- Restart the client after changes
- Ensure the MCP server command uses `npx` and an absolute `dw.json` path
