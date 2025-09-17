# SFCC Mock OCAPI Server

A lightweight Express.js server that simulates Salesforce B2C Commerce (SFCC) Open Commerce API (OCAPI) endpoints for testing the SFCC Development MCP Server.

## Purpose

This mock server allows you to test SFCC MCP server functionality without requiring a real SFCC instance. It provides realistic API responses for system object operations, authentication, and other OCAPI endpoints.

## Features

- **Complete OCAPI Simulation**: Supports all major system object endpoints used by the MCP server
- **OAuth2 Authentication**: Simulates SFCC's OAuth2 token-based authentication flow
- **Realistic Data**: Provides realistic SFCC system object responses with proper structure
- **CORS Support**: Enables cross-origin requests for browser testing
- **Development Mode**: Optional request/response logging for debugging
- **Configurable**: Customizable host, port, and mock data
- **Zero Dependencies**: Only requires Express.js and CORS middleware

## Supported Endpoints

### Authentication
- `POST /dw/oauth2/access_token` - OAuth2 token endpoint

### System Objects
- `GET /s/-/dw/data/v21_3/system_object_definitions` - List all system object definitions
- `GET /s/-/dw/data/v21_3/system_object_definitions/:objectType` - Get specific system object definition
- `POST /s/-/dw/data/v21_3/system_object_definition_search` - Search system object definitions
- `POST /s/-/dw/data/v21_3/system_object_definitions/:objectType/attribute_definition_search` - Search system object attributes
- `POST /s/-/dw/data/v21_3/system_object_definitions/:objectType/attribute_group_search` - Search attribute groups
- `POST /s/-/dw/data/v21_3/custom_object_definitions/:objectType/attribute_definition_search` - Search custom object attributes

### Site Preferences
- `POST /s/-/dw/data/v21_3/site_preferences/:groupId/search` - Search site preferences

### Code Versions
- `GET /s/-/dw/data/v21_3/code_versions` - List code versions
- `POST /s/-/dw/data/v21_3/code_versions/:versionId/activate` - Activate code version

### Utility
- `GET /health` - Server health check

## Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm (comes with Node.js)

### Setup

1. **Navigate to the server directory:**
   ```bash
   cd tests/servers/ocapi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

### Quick Start

The easiest way to start the server is using the provided startup script:

```bash
./start.sh
```

This will:
- Install dependencies if needed
- Start the server on `localhost:4000`
- Display all available endpoints
- Show test credentials

### Manual Start

You can also start the server directly with Node.js:

```bash
node server.js
```

### Configuration Options

#### Using the startup script:
```bash
./start.sh --help                    # Show all options
./start.sh --port 4001              # Custom port
./start.sh --host 0.0.0.0           # Bind to all interfaces
./start.sh --dev                    # Enable development mode
./start.sh --no-install             # Skip dependency installation
```

#### Using Node.js directly:
```bash
node server.js --port 4001          # Custom port
node server.js --host 0.0.0.0       # Custom host
node server.js --dev                # Development mode with logging
```

### Development Mode

Enable development mode to see detailed request/response logging:

```bash
./start.sh --dev
```

This will log all incoming requests and outgoing responses, making it easier to debug issues.

## Authentication

The mock server simulates SFCC's OAuth2 authentication flow. Use these test credentials:

- **Client ID**: `test-client-id`
- **Client Secret**: `test-client-secret`

### Getting an Access Token

```bash
curl -X POST http://localhost:4000/dw/oauth2/access_token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=test-client-id&client_secret=test-client-secret"
```

Response:
```json
{
  "access_token": "mock_token_1234567890_abcdef123",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "SFCC_DATA_API"
}
```

### Using the Access Token

Include the token in subsequent API requests:

```bash
curl -X GET http://localhost:4000/s/-/dw/data/v21_3/system_object_definitions \
  -H "Authorization: Bearer mock_token_1234567890_abcdef123"
```

## Testing with SFCC MCP Server

To test the MCP server against this mock OCAPI server:

1. **Start the mock OCAPI server:**
   ```bash
   cd tests/servers/ocapi
   ./start.sh --dev
   ```

2. **Configure your MCP server to use the mock endpoint:**
   Create or update your `dw.json` configuration:
   ```json
   {
     "hostname": "localhost:4000",
     "client-id": "test-client-id",
     "client-secret": "test-client-secret",
     "version": "v21_3"
   }
   ```

3. **Test MCP tools:**
   ```bash
   # Test system object definitions
   npx conductor query get_system_object_definitions '{}'
   
   # Test specific system object
   npx conductor query get_system_object_definition '{"objectType": "Product"}'
   
   # Test attribute search
   npx conductor query search_system_object_attribute_definitions '{"objectType": "Product", "searchRequest": {"query": {"match_all_query": {}}}}'
   ```

## Mock Data

The server includes realistic mock data for SFCC system objects:

### Built-in Objects
- Product
- Customer  
- Order
- Category
- Site
- Campaign
- Coupon
- Promotion
- PriceBook
- CustomObject
- Content
- ContentFolder
- CustomerGroup
- SourceCodeInfo
- GiftCertificate

### Custom Mock Data

You can provide custom mock data by adding JSON files to the `mock-data/` directory:

- `system-object-definitions.json` - Complete list of system objects
- `system-object-definition-{objecttype}.json` - Specific object definition (e.g., `system-object-definition-product.json`)

## API Examples

### List System Object Definitions
```bash
curl -X GET "http://localhost:4000/s/-/dw/data/v21_3/system_object_definitions?start=0&count=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Product Object Definition
```bash
curl -X GET "http://localhost:4000/s/-/dw/data/v21_3/system_object_definitions/Product" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search System Object Attributes
```bash
curl -X POST "http://localhost:4000/s/-/dw/data/v21_3/system_object_definitions/Product/attribute_definition_search" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match_all_query": {}
    },
    "count": 200
  }'
```

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Check what's using the port
lsof -i :4000

# Use a different port
./start.sh --port 4001
```

### Authentication Errors
Make sure you're using the correct test credentials:
- Client ID: `test-client-id`
- Client Secret: `test-client-secret`

### CORS Issues
The server includes CORS headers for all origins. If you're still having CORS issues, check that your requests include proper headers:
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization" \
     -X OPTIONS \
     http://localhost:4000/s/-/dw/data/v21_3/system_object_definitions
```

### Development Debugging
Use development mode to see detailed logs:
```bash
./start.sh --dev
```

This will show:
- All incoming request details (headers, query params, body)
- All outgoing response details
- Authentication attempts
- Route matching information

## Architecture

The mock server is built with:
- **Express.js**: Web framework for routing and middleware
- **CORS**: Cross-origin resource sharing support
- **In-memory storage**: Simple token management for authentication
- **JSON files**: Static mock data that can be customized

The server simulates the exact URL structure and response format expected by the SFCC MCP client, making it a drop-in replacement for testing purposes.

## Contributing

When adding new endpoints or modifying responses:

1. **Follow SFCC API conventions**: Ensure response structures match real OCAPI responses
2. **Add realistic data**: Include proper field names, data types, and relationships
3. **Update documentation**: Document any new endpoints or configuration options
4. **Test thoroughly**: Verify that the MCP server can successfully consume the mock responses

## License

This mock server is part of the SFCC Development MCP Server project and follows the same license terms.