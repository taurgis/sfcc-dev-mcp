# Advanced Skill Patterns

This guide covers higher-complexity patterns for mature skills.

## Layering Strategy

- Keep `SKILL.md` focused on fast orientation.
- Move implementation detail to reference files.
- Prefer shallow links (`SKILL.md` -> `references/*.md`) over deep chains.

## Multi-Workflow Skills

When a skill supports multiple workflows:

1. Add a short decision matrix near the top of `SKILL.md`.
2. Split workflow details into separate sections in references.
3. Keep examples runnable and realistic.

## Maintenance Pattern

- Update examples whenever commands or APIs change.
- Treat broken links as failures.
- Validate snippets and command names before publishing.

## Related

- [Patterns](./PATTERNS.md)
- [Configuration Options](./CONFIG.md)
