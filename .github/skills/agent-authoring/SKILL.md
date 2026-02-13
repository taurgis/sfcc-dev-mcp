---
name: agent-authoring
description: How to design, structure, and validate custom Copilot agents for this workspace.
---

# Agent Authoring Skill
Guidelines for creating and maintaining custom GitHub Copilot agents (.agent.md) tailored to this repository.

## When to Use
- You need a new Copilot agent focused on a workflow (e.g., Storybook tests, log triage).
- You want to adjust tools/persona for existing agents.
- You are adding workspace-level agents under .github/agents or profile-level agents for reuse.

## Quick Start
1) Create `.github/agents/<agent-name>.agent.md` (VS Code auto-detects this folder/extension).
2) Add YAML frontmatter with only supported fields: `name`, `description`, `tools`, `target`, `infer`, `mcp-servers`, `handoffs`.
3) In the body, write concise instructions: task focus, guardrails, run/validate steps, and handoffs.
4) Keep it under ~200-300 lines; link out to docs instead of pasting everything.

## Frontmatter Cheatsheet
- `name`: Display name; defaults to file name if omitted.
- `description`: Placeholder text in chat input; keep short.
- `tools`: List allowed tools. For MCP servers, use `<server>/*` to include all tools or enumerate specific ones.
- `target`: `github-copilot` for Copilot agents (default), `vscode` for VS Code target.
- `infer`: Allow subagent use (default true). Set false if you want to restrict subagents.
- `mcp-servers`: For Copilot agents, point to MCP server configs (paths to server JSON). Use only if you need to pin servers.
- `handoffs`: Optional array of next-step buttons `{ label, agent, prompt?, send? }`.

## Body Structure (recommended)
- **Purpose and scope**: What this agent does and what it must not do.
- **Operating defaults**: Where to run commands, what to inspect first, preferred scripts.
- **Playbooks**: Ordered steps for common flows (run, debug, fix, validate).
- **Guardrails**: Safe-edit rules (scope, no unrelated changes, ask before destructive ops).
- **Validation**: How to verify work (tests/linters), how to summarize outputs.
- **Links**: Point to repo docs or skills for deeper detail.

## Tool Selection Patterns
- Editing agent: include `workspace`, `terminal`, `search`; add `fetch` for docs; add MCP toolsets only if required.
- Read-only agent: omit editing tools; keep `fetch`/`search`.
- Narrow the tool list to prevent unsafe actions (e.g., no `terminal` for planning-only agents).

## Handoffs
Use handoffs to guide sequential flows (e.g., Plan -> Implement -> Review). Keep labels short and make prompts actionable. Use `send: false` unless you want auto-submit.

## Quality Bar
- Minimal, task-focused instructions; avoid boilerplate.
- No unsupported frontmatter fields (reject `argument-hint`, etc.).
- Prefer scoped commands over global installs; mention working directory if non-root.
- Add guardrails for destructive commands (never propose `git reset --hard`).
- Keep instructions ASCII and concise; use fenced code blocks for commands.

## Validation Checklist
- [ ] Supported frontmatter only; fields spelled correctly.
- [ ] Tools list matches the agent’s intent; no over-broad capabilities.
- [ ] Clear run/validate steps with default commands.
- [ ] Guardrails called out.
- [ ] Links resolve (relative paths within repo or official docs).

## Examples
- Location: `.github/agents/storybook-interaction-tests.agent.md` (interaction test fixer playbook).
- Planning agent: frontmatter with `tools: ['fetch', 'search']`, body instructs to gather context and produce a plan, handoff to implementation agent.

## Maintenance Tips
- Keep agents in sync with repo workflows (scripts, test commands). Update after script changes.
- Remove stale handoffs when target agents are renamed or removed.
- Prefer additive changes; avoid reformatting existing agents without need.
