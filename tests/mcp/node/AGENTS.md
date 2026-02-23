# MCP Programmatic Testing Guide (Local)

This local guide points to the canonical programmatic testing skill used in this repository.

## Canonical Guide

- [mcp-programmatic-testing skill](../../../.github/skills/mcp-programmatic-testing/SKILL.md)

## Quick Commands

```bash
npm run test:mcp:node
node --test tests/mcp/node/*.programmatic.test.js
```

## Required Test Hygiene

Always call `client.clearAllBuffers()` in `beforeEach()` for MCP programmatic tests.
