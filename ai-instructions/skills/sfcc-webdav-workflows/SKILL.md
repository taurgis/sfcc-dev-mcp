---
name: sfcc-webdav-workflows
description: Practical guide for using WebDAV in Salesforce B2C Commerce Cloud for IMPEX transfers and log access. Use this when setting up WebDAV clients, debugging WebDAV permission issues, or designing automation that reads/writes files via WebDAV.
---

# SFCC WebDAV Workflows

WebDAV is SFCC’s “remote filesystem over HTTP”. It’s central to:
- Moving data in/out via IMPEX
- Reading logs
- Managing catalogs/images in supported folders

This skill focuses on *practical* workflows and the most common permission and path pitfalls.

## Quick Checklist

```text
[ ] Confirm which auth path you’re using: BM user (Basic Auth) vs API client (client-id/secret token)
[ ] Verify directory permissions are configured in Business Manager for the exact folder(s)
[ ] Avoid overlapping WebDAV client permission paths (SFCC restriction)
[ ] Don’t expect write access to restricted folders (e.g. security logs)
[ ] For automation: scope access to the minimum folders required
```

## Mental Model

- **WebDAV ≈ HTTP interface to instance folders** (not your local repo)
- **Permissions are folder-scoped** and configured in Business Manager
- **Two common authentication modes**:
  - **Business Manager users**: Basic Auth (username/password), governed by Role permissions
  - **API clients**: token-based auth (client credentials), governed by “WebDAV Client Permissions” JSON

## Common SFCC WebDAV Folders (What They’re Typically For)

These vary by project, but the patterns are stable:

| Folder | Typical use | Read/Write? |
|---|---|---|
| `/impex/src/` | Upload import feeds, export results | Usually read/write |
| `/impex/src/logs/` | Some log exports and job artifacts | Often read |
| `/Logs/` | Log files (application logs) | Usually read |
| `/catalogs/` | Catalog exports/imports, metadata | Often read |
| `/cartridges/` | Code deployment via WebDAV (teams vary) | Usually read/write for deployment users |

## Business Manager Setup (Humans / Desktop Clients)

### Role-based permissions
- Configure in: **Administration → Organization → Roles → WebDAV Permissions**
- Use this when a developer uses Cyberduck/Transmit/FileZilla with BM credentials.

### Debugging “403 Forbidden” quickly
- Confirm you’re editing the correct role
- Confirm the role grants permissions for the *exact* path you’re trying to access

## API Client Setup (Automation / CI / Tools)

### WebDAV Client Permissions (JSON)
- Configure in: **Administration → Organization → WebDAV Client Permissions**
- You assign `client_id` → permissions array of `{ path, operations }`.

**Operations typically include:** `read`, `read_write`.

### Critical constraint: no intersecting permission paths
SFCC does not allow different WebDAV client permission paths to overlap.

Example of what to avoid:
- Client A: `/impex/src`
- Client B: `/impex/src/foo`

Design your permission model so each client owns a non-overlapping subtree.

### Restricted directories
Some directories are effectively **read-only** for security reasons (for example, security log directories). Expect permission errors even if you attempt to grant write.

## Automation Patterns

### Pattern: “single-purpose” clients
Create separate API clients for:
- Log readers (read-only `/Logs/`)
- IMPEX uploaders (read/write `/impex/src/`) 

This keeps credentials and blast radius smaller.

### Pattern: job writes file → WebDAV serves download
When storefront requests can’t write files, a common SFCC pattern is:
1. Storefront creates a token/state record
2. Background job generates file into `/impex/src/` (or another allowed folder)
3. Storefront polls and then links the file

(See also: `sfcc-platform-limits` for storefront file I/O constraints.)

## References
- Rhino Inquisitor: A Beginner’s Guide To WebDAV For Salesforce B2C Commerce Cloud
  - https://www.rhino-inquisitor.com/a-beginners-guide-to-webdav-in-sfcc/
- Salesforce Help: Access files with WebDAV (folder access + permissions)
  - https://help.salesforce.com/s/articleView?id=cc.b2c_access_files_webdav.htm&type=5
