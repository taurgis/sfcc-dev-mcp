import React from 'react';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const SecurityPage: React.FC = () => {
  useSEO({
    title: 'Security & Privacy - SFCC Development MCP Server',
    description: 'Security guidelines and privacy considerations for SFCC Development MCP Server. Learn about credential protection, data handling, network security, and best practices for safe development.',
    keywords: 'SFCC MCP security, Commerce Cloud security, MCP server privacy, SFCC credential protection, development security, API security, local development security, SFCC authentication security',
    canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/security',
    ogTitle: 'SFCC Development MCP Server - Security & Privacy Guide',
    ogDescription: 'Comprehensive security and privacy guide for SFCC Development MCP Server with credential protection and development best practices.',
    ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/security'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <H1 id="security-guidelines">🔒 Security Guidelines</H1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          The SFCC Development MCP Server implements multiple layers of security to protect your development environment and SFCC instance credentials.
        </p>

        <H2 id="credential-security">🛡️ Credential Security</H2>

        <H3 id="local-development-focus">Local Development Focus</H3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            This MCP server is designed for <strong>local development environments only</strong> and should never be deployed to production or shared hosting environments.
          </p>
        </div>

        <H3 id="credential-storage">Credential Storage</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>dw.json</strong>: Stores OAuth credentials in your project directory with restricted file permissions</li>
          <li><strong>Environment Variables</strong>: Alternative secure storage for credentials</li>
          <li><strong>No Network Exposure</strong>: Credentials are never transmitted except to authenticated SFCC instances</li>
        </ul>

        <H3 id="best-practices">Best Practices</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Keep <code>dw.json</code> files in your <code>.gitignore</code> to prevent accidental commits</li>
          <li>Use environment variables in CI/CD environments</li>
          <li>Rotate OAuth credentials regularly</li>
          <li>Never share OAuth client secrets in plain text communications</li>
        </ul>

        <H2 id="authentication-security">🔐 Authentication Security</H2>

        <H3 id="oauth-implementation">OAuth 2.0 Implementation</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Client Credentials Flow</strong>: Secure machine-to-machine authentication</li>
          <li><strong>Token Management</strong>: Automatic token refresh and secure storage</li>
          <li><strong>Scope Limitation</strong>: Minimal required scopes for API access</li>
        </ul>

        <H3 id="connection-security">Connection Security</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>HTTPS Only</strong>: All API communications use TLS encryption</li>
          <li><strong>Certificate Validation</strong>: Strict SSL certificate verification</li>
          <li><strong>Connection Timeouts</strong>: Prevents hanging connections and resource exhaustion</li>
        </ul>

        <H2 id="input-validation">🚧 Input Validation</H2>

        <H3 id="path-security">Path Security</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Path Traversal Protection</strong>: Prevents access to files outside the project directory</li>
          <li><strong>Absolute Path Enforcement</strong>: All file operations use validated absolute paths</li>
          <li><strong>Extension Validation</strong>: File type validation for cartridge generation</li>
        </ul>

        <H3 id="parameter-validation">Parameter Validation</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Schema Validation</strong>: All tool parameters validated against defined schemas</li>
          <li><strong>Type Safety</strong>: TypeScript type checking prevents type confusion attacks</li>
          <li><strong>Length Limits</strong>: Input length restrictions prevent buffer overflow attempts</li>
        </ul>

        <H2 id="network-security">🌐 Network Security</H2>

        <H3 id="api-communication">API Communication</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>TLS 1.2+ Required</strong>: Minimum encryption standards enforced</li>
          <li><strong>Certificate Pinning</strong>: Validates SFCC certificate authenticity</li>
          <li><strong>Request Rate Limiting</strong>: Prevents API abuse and resource exhaustion</li>
          <li><strong>User-Agent Identification</strong>: Clear identification of MCP server requests</li>
        </ul>

        <H3 id="webdav-security">WebDAV Security</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Read-Only Access</strong>: Log analysis tools only read data, never write</li>
          <li><strong>Authenticated Connections</strong>: OAuth or basic auth required for all WebDAV operations</li>
          <li><strong>Path Restrictions</strong>: Access limited to logs directory only</li>
        </ul>

        <H2 id="data-protection">💾 Data Protection</H2>

        <H3 id="log-data-handling">Log Data Handling</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Temporary Storage</strong>: Log data cached temporarily in memory only</li>
          <li><strong>No Persistence</strong>: Log content not stored permanently on local filesystem</li>
          <li><strong>Memory Cleanup</strong>: Automatic cleanup of sensitive data from memory</li>
          <li><strong>Size Limits</strong>: Maximum response sizes prevent memory exhaustion</li>
        </ul>

        <H3 id="sensitive-information-filtering">Sensitive Information Filtering</H3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Password Masking</strong>: Site preferences with password types are masked by default</li>
          <li><strong>PII Awareness</strong>: Tools designed to avoid exposing personally identifiable information</li>
          <li><strong>Debug Mode Controls</strong>: Debug output can be disabled in production-like environments</li>
        </ul>

        <H2 id="security-considerations">⚠️ Security Considerations</H2>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-red-800 mb-2">🚨 Never Use in Production</h4>
            <ul className="text-red-800 space-y-1">
              <li>This tool is designed for local development only</li>
              <li>Never deploy to shared servers or production environments</li>
              <li>Use sandbox instances only for testing and development</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Credential Management</h4>
            <ul className="text-yellow-800 space-y-1">
              <li>Never commit credentials to version control systems</li>
              <li>Use separate OAuth clients for different environments</li>
              <li>Regularly audit and rotate access credentials</li>
              <li>Monitor OAuth client usage in SFCC Account Manager</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">💡 Security Best Practices</h4>
            <ul className="text-blue-800 space-y-1">
              <li>Use minimal OCAPI permissions required for your use case</li>
              <li>Enable debug mode only when necessary for troubleshooting</li>
              <li>Review log output before sharing with team members</li>
              <li>Keep the MCP server package updated to the latest version</li>
            </ul>
          </div>
        </div>

        <H2 id="security-reporting">🔍 Security Reporting</H2>

        <p>If you discover a security vulnerability in the SFCC Development MCP Server:</p>

        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Do not</strong> create a public GitHub issue</li>
          <li>Email security concerns to the project maintainers</li>
          <li>Include detailed information about the vulnerability</li>
          <li>Provide steps to reproduce if possible</li>
          <li>Allow reasonable time for the security issue to be addressed</li>
        </ol>

        <H2 id="security-checklist">📋 Security Checklist</H2>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-4">Before Using the MCP Server:</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Verify you're using a sandbox SFCC instance</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Add <code>dw.json</code> to your <code>.gitignore</code> file</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Configure minimal OCAPI permissions required</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Verify OAuth credentials are properly secured</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Test with documentation-only mode first</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span>Review security guidelines with your team</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
          <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Security by Design</h4>
          <p className="text-green-800">
            The SFCC Development MCP Server is built with security as a primary concern, implementing industry-standard practices for credential management, API communication, and data protection in local development environments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
