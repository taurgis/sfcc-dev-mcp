# Cursor Rules for SFCC Development

This directory contains modern Cursor rules following the latest Cursor documentation best practices. These rules provide focused, actionable guidance for SFCC development workflows.

## Rule Structure

The rules are organized using the modern `.cursor/rules` format with MDC files that support metadata and scoped application.

### Available Rules

| Rule File | Description | Trigger | Type |
|-----------|-------------|---------|------|
| `sfcc-development.mdc` | Core SFCC patterns and MCP tool usage | Always applied to JS/TS/DS/ISML files | Always |
| `sfra-controllers.mdc` | SFRA controller development patterns | Controllers directory files | Auto Attached |
| `hooks-development.mdc` | OCAPI/SCAPI hook implementation | Hooks directory files | Auto Attached |
| `debugging-workflows.mdc` | Error investigation and debugging | Manual invocation | Manual |
| `system-objects.mdc` | System object and data model patterns | Models/scripts files | Auto Attached |
| `security-patterns.mdc` | Security best practices and validation | Manual invocation | Manual |
| `testing-patterns.mdc` | Testing patterns and mock objects | Test files | Auto Attached |
| `performance-optimization.mdc` | Performance optimization patterns | Manual invocation | Manual |

## Rule Types Explained

- **Always**: Included in every model context
- **Auto Attached**: Automatically included when matching files are referenced
- **Manual**: Only included when explicitly mentioned using `@ruleName`

## Usage Examples

### Automatic Rule Activation
When you open or reference files in specific directories, relevant rules automatically activate:
- Working on a controller → `sfra-controllers.mdc` activates
- Writing tests → `testing-patterns.mdc` activates
- Editing hooks → `hooks-development.mdc` activates

### Manual Rule Invocation
For specialized guidance, mention rules explicitly in chat:
- `@debugging-workflows` - Get debugging workflow guidance
- `@security-patterns` - Apply security best practices
- `@performance-optimization` - Get performance optimization help

## Key Features

### MCP Tool Integration
All rules emphasize using the SFCC Development MCP Server tools:
- Real-time SFCC API documentation
- Current best practices and guidelines
- Live system object information
- Log analysis and debugging tools

### Focused Guidance
Each rule is under 500 lines and focuses on specific development scenarios:
- Concrete code examples and templates
- Security-first development patterns
- Performance optimization strategies
- Comprehensive error handling

### Modern Best Practices
Rules follow current Cursor and SFCC development standards:
- TypeScript-aware patterns
- Modern JavaScript features
- SFRA architecture principles
- Security and performance focus

## Migration from Legacy

This modern structure replaces the legacy `.cursorrules` file with:
- Better organization and maintainability
- Scoped application based on file context
- Focused, actionable guidance
- Improved performance and relevance

## Contributing

When adding new rules:
1. Keep rules under 500 lines
2. Focus on specific development scenarios
3. Include concrete examples and templates
4. Use appropriate rule types and glob patterns
5. Reference MCP tools for SFCC-specific information

For more information about Cursor rules, see the [official Cursor documentation](https://docs.cursor.com/chat/rules).
