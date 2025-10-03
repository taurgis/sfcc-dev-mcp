# SFCC Mock Server

A unified mock server combining WebDAV and OCAPI functionality for SFCC (Salesforce B2C Commerce Cloud) development testing. This server provides a single endpoint for both log file access (WebDAV) and OCAPI API simulation, eliminating the need to run multiple servers during development.

## Features

- 🔄 **Unified Architecture**: Single server handling both WebDAV and OCAPI requests
- 📁 **WebDAV Support**: Mock log file access with PROPFIND and range request support
- 🔐 **OCAPI Simulation**: OAuth authentication and system object/site preferences APIs
- 🚀 **Express.js Based**: Modern, maintainable architecture with modular design
- ⚙️ **Configurable**: Enable/disable features, custom ports, development mode
- 🔧 **Developer Friendly**: Comprehensive logging and error handling

## Quick Start

```bash
# Install dependencies
npm install

# Start server in development mode
npm run dev

# Start server on custom port
npm run start:port

# Start with custom configuration
npm run start:custom
```

## Usage

### Basic Usage

```bash
# Start with default settings (port 3000)
node server.js

# Development mode with verbose logging
node server.js --dev

# Custom port and host
node server.js --port 4000 --host 0.0.0.0

# Enable only WebDAV (disable OCAPI)
node server.js --no-ocapi

# Enable only OCAPI (disable WebDAV)
node server.js --no-webdav
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--port <number>` | Server port | 3000 |
| `--host <string>` | Server host | localhost |
| `--dev` | Enable development mode | false |
| `--no-webdav` | Disable WebDAV functionality | enabled |
| `--no-ocapi` | Disable OCAPI functionality | enabled |
| `--no-cors` | Disable CORS headers | enabled |
| `--mock-data <path>` | Custom mock data directory | ./mock-data |
| `--help` | Show help message | - |

## Endpoints

### Health & Info

- `GET /health` - Server health check
- `GET /info` - Server information and configuration

### WebDAV Endpoints

- `PROPFIND|GET /on/demandware.servlet/webdav/Sites/Logs/` - SFCC WebDAV path
- `PROPFIND|GET /Logs/` - Direct logs access
- `GET /Logs/jobs/` - Job logs directory

### OCAPI Endpoints

- `POST /dw/oauth2/access_token` - OAuth token endpoint
- `GET /s/-/dw/data/v23_2/system_object_definitions` - System objects
- `POST /s/-/dw/data/v23_2/system_object_definition_search` - Search system objects
- `GET /s/-/dw/data/v23_2/code_versions` - Code versions
- `POST /s/-/dw/data/v23_2/code_versions/:id/activate` - Activate code version

## Authentication

### OCAPI OAuth Credentials

For testing OCAPI endpoints, use these credentials:

- **Client ID**: `test-client-id`
- **Client Secret**: `test-client-secret`
- **Grant Type**: `client_credentials`

### Example OAuth Request

```bash
curl -X POST http://localhost:3000/dw/oauth2/access_token \\
  -H "Authorization: Basic $(echo -n 'test-client-id:test-client-secret' | base64)" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials"
```

## Mock Data

### Directory Structure

```
mock-data/
├── logs/                    # WebDAV log files
│   ├── error-blade-*.log   # Error logs
│   ├── warn-blade-*.log    # Warning logs
│   ├── info-blade-*.log    # Info logs
│   ├── debug-blade-*.log   # Debug logs
│   └── jobs/               # Job logs
│       └── JobName/
│           └── Job-*.log
└── ocapi/                  # OCAPI mock responses
    ├── system-object-definitions.json
    ├── code-versions.json
    └── [other-mock-files].json
```

### Customizing Mock Data

1. Edit JSON files in `mock-data/ocapi/` for OCAPI responses
2. Add log files to `mock-data/logs/` for WebDAV content
3. Use `--mock-data <path>` to specify custom data directory

## Development

### Architecture

The server follows modular architecture principles:

```
src/
├── config/           # Configuration management
├── middleware/       # Express middleware (auth, CORS, logging)
├── routes/          # Route handlers (webdav, ocapi)
└── utils/           # Utility functions (data loading, XML generation)
```

### Key Classes

- **ServerConfig**: Configuration management and validation
- **SFCCMockApp**: Express application setup and routing
- **WebDAVRouteHandler**: WebDAV request handling with PROPFIND support
- **OCAPIRouteHandler**: OCAPI endpoint simulation with authentication
- **AuthenticationManager**: OAuth token generation and validation

### Adding New Features

1. **New OCAPI Endpoints**: Add routes in `src/routes/ocapi.js`
2. **WebDAV Extensions**: Modify `src/routes/webdav.js`
3. **Middleware**: Add to `src/middleware/`
4. **Mock Data**: Add JSON files to `mock-data/ocapi/`

## Testing

The server is designed to work with the SFCC Development MCP Server test suite:

```bash
# Run with the unified server for testing
node server.js --dev --port 3000

# Test WebDAV functionality
curl -X PROPFIND http://localhost:3000/Logs/

# Test OCAPI functionality  
curl -X POST http://localhost:3000/dw/oauth2/access_token \\
  -H "Authorization: Basic $(echo -n 'test-client-id:test-client-secret' | base64)" \\
  -d "grant_type=client_credentials"
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Use `--port <different-port>`
2. **Missing mock data**: Ensure `mock-data/` directory exists with proper structure
3. **CORS errors**: Enable CORS with `--cors` (enabled by default)
4. **Authentication failing**: Verify OAuth credentials match test values

### Debug Mode

Enable development mode for detailed logging:

```bash
node server.js --dev
```

This will show:
- All incoming requests with headers and body
- All outgoing responses with status codes
- File system operations and path mappings
- Authentication token generation and validation

## Contributing

1. Follow the modular architecture patterns
2. Add tests for new functionality
3. Update documentation for new endpoints or features
4. Ensure backward compatibility with existing tests

## License

MIT License - See LICENSE file for details