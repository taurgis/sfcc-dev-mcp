---
title: Script Debugger Guide
description: Execute JavaScript safely in SFCC sandboxes with evaluate_script, debugger prerequisites, and troubleshooting guidance.
---

# Script debugger

Use `evaluate_script` to execute JavaScript on a sandbox instance via the script debugger API.

## Quick start

Prompt:

```
What is the current site ID on my sandbox?
```

Example script:

```javascript
dw.system.Site.current.ID
```

## Requirements

- Valid `dw.json` credentials
- Script debugger enabled in Business Manager
- SFRA or SiteGenesis storefront in the cartridge path, or a custom `breakpointFile`

<Callout title="Username is case-sensitive" variant="warn">
The debug API requires the username to match Business Manager casing exactly.
</Callout>

<Callout title="Sandbox only" variant="danger">
Only use the script debugger on sandbox or development instances.
</Callout>

## Parameters

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| `script` | Yes | - | JavaScript expression to evaluate |
| `siteId` | No | RefArch | Site ID for the request |
| `locale` | No | default | Locale segment (fallback if locale-less fails) |
| `timeout` | No | 30000 | Execution timeout in ms |
| `breakpointFile` | No | Auto | Custom controller file for breakpoint |
| `breakpointLine` | No | Auto | Specific breakpoint line |

## Script rules

- Do not use `return` at the top level. Use expressions.
- Do not use `require()`; use the global `dw.*` namespace.
- Wrap multi-step logic in an IIFE.
- Use `JSON.stringify()` for objects or arrays.

Example IIFE:

```javascript
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  if (!p) return 'Not found';
  return JSON.stringify({ id: p.ID, name: p.name, online: p.onlineFlag });
})()
```

## Common use cases

### Site information

```javascript
dw.system.Site.current.ID
```

### Product lookup

```javascript
(function() {
  var p = dw.catalog.ProductMgr.getProduct('25518704M');
  if (!p) return 'Not found';
  return JSON.stringify({ id: p.ID, name: p.name, online: p.onlineFlag });
})()
```

### Site preferences

```javascript
JSON.stringify(Object.keys(dw.system.Site.current.preferences.custom))
```

## Troubleshooting

| Error | Cause | Fix |
| --- | --- | --- |
| `invalid return` | Top-level `return` | Use expression or IIFE |
| `Cannot call method of null` | Using `require()` | Use `dw.*` globals |
| Timeout waiting for breakpoint | Wrong siteId or debugger disabled | Verify siteId and enable debugger |
| NotAuthorizedException | Missing permissions | Enable Script Debugger permission |
| No compatible storefront cartridge | Missing SFRA/SiteGenesis | Deploy storefront or set `breakpointFile` |

## Best practices

- Keep scripts short and synchronous
- Use IIFEs for multi-step logic
- Always null-check objects
- Use `JSON.stringify()` for readable output
