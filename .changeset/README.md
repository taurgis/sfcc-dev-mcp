# Release Manual

This repository uses Changesets for npm releases.

When a change should ship in a new `sfcc-dev-mcp` package version, add a changeset from the repository root:

```bash
npm run changeset
```

Use an empty changeset when you need release notes without a version bump:

```bash
npm run changeset -- --empty
```

Check pending release state against `main` before merging:

```bash
npm run release:status
```

The release workflow on `main` creates or updates a release pull request from pending changesets. Merging that release pull request publishes the npm package through GitHub Actions OIDC trusted publishing, waits for npm propagation, reruns the published NPX MCP validation, and then publishes the same version to the MCP Registry.

Changesets versioning here also syncs `server.json` through `scripts/sync-server-json-version.js` so repository metadata stays aligned with `package.json`.