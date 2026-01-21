# Contributing to SFCC Development MCP Server

Thank you for your interest in contributing to the SFCC Development MCP Server! This project provides MCP tools for Salesforce B2C Commerce Cloud development assistance, including documentation access, bundled agent skills, log analysis, and system object definitions.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Types of Contributions](#types-of-contributions)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git
- SFCC instance access (for testing full mode features)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sfcc-dev-mcp.git
   cd sfcc-dev-mcp
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Test with MCP Inspector:
   ```bash
   npm run inspector
   ```

### Environment Configuration

For testing full mode features, create a `dw.json` file in the project root:

```json
{
  "hostname": "your-instance.sandbox.us01.dx.commercecloud.salesforce.com",
  "username": "your-username",
  "password": "your-password",
  "client-id": "your-client-id",
  "client-secret": "your-client-secret"
}
```

**Note**: Never commit this file. It's already in `.gitignore`.

## Project Structure

```
src/                          # TypeScript MCP server
docs/                         # SFCC docs sources (dw_* namespaces, sfra, isml)
ai-instructions/              # AGENTS.md + bundled skills (ai-instructions/skills/*/SKILL.md)
docs-site/                    # React + Vite documentation site
tests/                        # Jest + MCP (Aegis) tests
scripts/                      # Build and utility scripts
```

## Contributing Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

### Before Contributing

1. Check existing issues and pull requests
2. Open an issue to discuss major changes
3. Ensure your contribution aligns with project goals

## Types of Contributions

### 1. Bug Fixes

- Fix bugs in existing functionality
- Improve error handling
- Fix documentation inconsistencies

### 2. Feature Enhancements

- Add new MCP tools
- Improve existing tool functionality
- Enhance SFCC API coverage

### 3. Documentation

- Update bundled skills (ai-instructions/skills/*/SKILL.md)
- Add new SFCC API documentation
- Improve code comments and README

### 4. Testing

- Add unit tests
- Improve test coverage
- Add integration tests

### 5. Performance Improvements

- Optimize API calls
- Improve caching mechanisms
- Reduce memory usage

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Test with MCP Inspector
npm run inspector
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new SFCC tool for product management"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place test files in the `tests/` directory
- Use the `.test.ts` suffix
- Follow existing test patterns
- Aim for good test coverage of new functionality

### Test Categories

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test MCP tool functionality
3. **Mock Tests**: Use mocks for external SFCC API calls

## Code Style

### ESLint Configuration

The project uses ESLint for code style enforcement:

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for object shapes

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Follow existing code patterns

## Documentation

### Agent Skills

When adding or updating skills in `ai-instructions/skills/<skill>/SKILL.md`:

1. Include frontmatter (`name`, `description`)
2. Include practical examples
3. Reference relevant SFCC APIs
4. Provide security considerations

### API Documentation

When updating SFCC API docs:

1. Use the conversion script: `npm run convert-docs`
2. Ensure proper markdown formatting
3. Include complete method signatures
4. Add usage examples where helpful

### Code Comments

- Comment complex business logic
- Explain non-obvious implementation decisions
- Use JSDoc for public APIs
- Keep comments up to date with code changes

## Submitting Changes

### Pull Request Process

1. Push your branch to your fork
2. Create a pull request against the main branch
3. Fill out the pull request template
4. Link any related issues

### Pull Request Guidelines

- Provide a clear description of changes
- Include the motivation for the change
- List any breaking changes
- Add screenshots for UI changes (if applicable)
- Ensure all tests pass
- Update documentation as needed

### Review Process

- At least one maintainer review is required
- Address any feedback promptly
- Keep the pull request focused and atomic
- Rebase if requested to maintain clean history

## Release Process

### Versioning

The project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a release tag
4. Publish to npm registry

## Getting Help

### Communication Channels

- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For questions and general discussion
- Pull Request Comments: For code review discussions

### Documentation Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [SFCC API Documentation](https://documentation.b2c.commercecloud.salesforce.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Recognition

Contributors will be recognized in:

- GitHub contributor list
- Release notes for significant contributions
- Special mentions for outstanding contributions

Thank you for contributing to the SFCC Development MCP Server! Your contributions help make SFCC development more accessible and efficient for the entire community.
