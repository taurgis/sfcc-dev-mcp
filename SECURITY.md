# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the SFCC Development MCP Server seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **GitHub Security Advisories**: Use GitHub's private vulnerability reporting feature at [https://github.com/taurgis/sfcc-dev-mcp/security/advisories](https://github.com/taurgis/sfcc-dev-mcp/security/advisories)

### 📋 What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and attack scenarios
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: Version, operating system, and configuration details
- **Evidence**: Screenshots, logs, or proof-of-concept code (if applicable)

### ⏰ Response Timeline

We are committed to addressing security vulnerabilities promptly:

- **Initial Response**: Within 48 hours of report
- **Acknowledgment**: Within 7 days with initial assessment
- **Resolution**: Security patches released within 30 days for high-severity issues
- **Disclosure**: Coordinated disclosure after patch is available

## Security Considerations

### 🎯 Scope

This security policy covers vulnerabilities in:

- **Core MCP Server**: Authentication, data handling, API access
- **SFCC Integration**: OAuth flows, credential management, data exposure
- **Documentation Access**: Information disclosure, access control
- **Log Analysis**: Sensitive data exposure, injection vulnerabilities
- **Dependencies**: Third-party package vulnerabilities

### ⚠️ What We Consider Security Issues

- **Authentication bypass** in SFCC credential handling
- **Sensitive data exposure** in logs or responses
- **Code injection** through tool parameters
- **Unauthorized access** to SFCC instances
- **Credential leakage** in configuration or cache
- **Path traversal** in file operations
- **Denial of service** through resource exhaustion
- **Dependency vulnerabilities** with exploitable impact

### ✅ What We Don't Consider Security Issues

- **Rate limiting** on local development tools
- **Information disclosure** of public SFCC documentation
- **Resource usage** in normal operation scenarios
- **Configuration errors** by end users
- **Network connectivity** issues
- **Feature requests** or usability improvements

## Security Best Practices

### 🔐 For Users

1. **Credential Protection**:
   - Store SFCC credentials securely in `dw.json`
   - Use environment variables for sensitive configuration
   - Regularly rotate API credentials
   - Never commit credentials to version control

2. **Network Security**:
   - Use HTTPS connections to SFCC instances
   - Verify SSL certificates in production
   - Restrict network access to development instances

3. **Local Security**:
   - Keep the MCP server updated
   - Review log outputs for sensitive data
   - Use proper file permissions on configuration files

### 🛡️ For Developers

1. **Input Validation**:
   - Validate all tool parameters
   - Sanitize user inputs before processing
   - Use type-safe parameter parsing

2. **Data Handling**:
   - Minimize sensitive data in logs
   - Implement proper error handling
   - Use secure HTTP clients with proper timeouts

3. **Dependency Management**:
   - Regularly update dependencies
   - Monitor for security advisories
   - Use `npm audit` to check for vulnerabilities

## Security Features

### 🔒 Built-in Security

- **OAuth 2.0 Authentication** for SFCC OCAPI access
- **Secure credential storage** with local file protection
- **Input validation** on all tool parameters
- **Rate limiting** on external API calls
- **Secure HTTP clients** with proper error handling
- **Minimal privilege principle** for SFCC permissions

### 📊 Security Monitoring

- **Dependency scanning** via GitHub Dependabot
- **Code quality checks** in CI/CD pipeline
- **Security-focused linting** rules
- **Regular security audits** of dependencies

## Responsible Disclosure

We believe in responsible disclosure and will work with security researchers to:

1. **Acknowledge** your contribution
2. **Keep you informed** of our progress
3. **Credit you appropriately** (unless you prefer to remain anonymous)
4. **Coordinate timing** of public disclosure

## Contact

For security-related questions or concerns:

- **GitHub**: [@taurgis](https://github.com/taurgis)
- **Project**: [sfcc-dev-mcp](https://github.com/taurgis/sfcc-dev-mcp)

---

Thank you for helping keep the SFCC Development MCP Server and its users safe! 🛡️