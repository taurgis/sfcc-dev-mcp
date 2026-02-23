# Skill Configuration Options

Configuration guidance for `SKILL.md` metadata and structure.

## Required Frontmatter

```yaml
---
name: skill-name
description: One-line description of when to use this skill
---
```

## Naming Conventions

- Use lowercase and hyphens for `name`.
- Keep `description` concise and action-oriented.
- Ensure `name` is stable after publication.

## Layout Conventions

- Start with a clear overview.
- Add a quick-reference table for commands or patterns.
- Keep deep detail in `references/` files.

## Validation Checklist

- Frontmatter is valid YAML.
- All relative links resolve.
- Commands and snippets are current.
- The skill is understandable from top to bottom without hidden assumptions.

## Related

- [Reference Hub](./REFERENCE.md)
- [Patterns](./PATTERNS.md)
