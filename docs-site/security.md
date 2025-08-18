---
title: Security Guidelines
layout: default
nav_order: 8
---

# 🔒 Security Guidelines

The SFCC Development MCP Server implements multiple layers of security to protect your development environment and SFCC instance credentials.

## 🛡️ Credential Security

### Local Development Focus
This MCP server is designed for **local development environments only** and should never be deployed to production or shared hosting environments.

### Credential Storage
- **dw.json**: Stores OAuth credentials in your project directory with restricted file permissions
- **Environment Variables**: Alternative secure storage for credentials
- **No Network Exposure**: Credentials are never transmitted except to authenticated SFCC instances

### Best Practices
- Keep `dw.json` files in your `.gitignore` to prevent accidental commits
- Use environment variables in CI/CD environments
- Rotate OAuth credentials regularly
- Never share OAuth client secrets in plain text communications

## 🔐 Authentication Security

### OAuth 2.0 Implementation
- **Client Credentials Flow**: Secure machine-to-machine authentication
- **Token Management**: Automatic token refresh and secure storage
- **Scope Limitation**: Minimal required scopes for API access

### Connection Security
- **HTTPS Only**: All API communications use TLS encryption
- **Certificate Validation**: Strict SSL certificate verification
- **Connection Timeouts**: Prevents hanging connections and resource exhaustion

## 🚧 Input Validation

### Path Security
- **Path Traversal Protection**: Prevents access to files outside the project directory
- **Absolute Path Enforcement**: All file operations use validated absolute paths
- **Extension Validation**: File type validation for cartridge generation

### Parameter Validation
- **Schema Validation**: All tool parameters validated against defined schemas
- **Type Safety**: TypeScript type checking prevents type confusion attacks
- **Length Limits**: Input length restrictions prevent buffer overflow attempts

## 📊 Audit & Monitoring

### Logging Security
- **Credential Masking**: OAuth secrets automatically masked in logs
- **Access Logging**: All API calls logged for audit purposes
- **Error Logging**: Detailed error information for debugging without credential exposure

### File System Security
- **Restricted Permissions**: Log files created with appropriate file permissions
- **Temporary Files**: Secure handling of temporary files with automatic cleanup
- **Directory Isolation**: All operations confined to project directory

## 🔒 API Security

### Rate Limiting
- **Request Throttling**: Prevents overwhelming SFCC instances
- **Connection Pooling**: Managed connection reuse
- **Resource Limits**: Memory and CPU usage boundaries

### Error Handling
- **Information Disclosure Prevention**: Error messages don't expose sensitive internal details
- **Graceful Degradation**: System continues operating when individual services fail
- **Timeout Management**: Prevents resource exhaustion from slow operations

## 🛠️ Development Security

### Code Quality
- **ESLint Rules**: Security-focused linting rules
- **Type Safety**: TypeScript prevents common security vulnerabilities
- **Dependency Scanning**: Regular dependency security updates

### Testing Security
- **Mock Credentials**: Test suites use mock credentials only
- **Isolated Testing**: Tests don't access real SFCC instances
- **Coverage Requirements**: Security-critical code has comprehensive test coverage

## 🚨 Incident Response

### Security Issues
If you discover a security vulnerability:
1. **Do NOT create a public GitHub issue**
2. Contact the maintainers privately
3. Include detailed reproduction steps
4. Allow reasonable time for fixes before disclosure

### Common Security Scenarios

#### Credential Exposure
```bash
# If credentials are accidentally committed:
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch dw.json' --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

#### Permission Issues
```bash
# Fix dw.json permissions if too open:
chmod 600 dw.json
```

#### Log File Security
```bash
# Check log file permissions:
ls -la /tmp/sfcc-mcp-logs/
# Should show restricted permissions (600 or 644)
```

## 📋 Security Checklist

Before using the MCP server:

- [ ] **Credentials**: OAuth credentials properly secured in `dw.json` or environment variables
- [ ] **Git Ignore**: `dw.json` added to `.gitignore`
- [ ] **File Permissions**: Restricted permissions on credential files (600)
- [ ] **Network**: Confirm you're on a trusted network
- [ ] **Updates**: MCP server and dependencies are up to date
- [ ] **Logs**: Log directory has appropriate permissions
- [ ] **Environment**: Using in local development environment only

## 🔗 Security Resources

### SFCC Security Documentation
- [SFCC Security Best Practices](docs/best-practices/security.md)
- [OCAPI Security Guidelines](docs/best-practices/ocapi_hooks.md)
- [SCAPI Security Patterns](docs/best-practices/scapi_hooks.md)

### External Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Remember**: Security is a shared responsibility. While this MCP server implements security best practices, you must also follow secure development practices in your own SFCC cartridges and configurations.
