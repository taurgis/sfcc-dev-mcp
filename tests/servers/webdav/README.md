# Mock SFCC WebDAV Server

This directory contains a mock WebDAV server that mimics the SFCC log structure for testing purposes.

## Setup

```bash
cd tests/servers/webdav
npm install
npm run setup
```

## Usage

### Start the server
```bash
npm start
```

### Start in development mode (with request logging)
```bash
npm run dev
```

### Custom port
```bash
node server.js --port=8080
```

## Features

- **WebDAV Protocol Support**: Full WebDAV compatibility for testing
- **SFCC Log Structure**: Mimics real SFCC log directory structure
- **Multiple Log Types**: Error, warn, info, debug, and job logs
- **Realistic Content**: Mock log entries that match SFCC format
- **CORS Enabled**: Ready for browser-based testing
- **No Authentication**: Simplified for testing environment

## Directory Structure

```
mock-logs/
├── Logs/
│   ├── error-blade-20240814-120000.log
│   ├── warn-blade-20240814-120000.log
│   ├── info-blade-20240814-120000.log
│   ├── debug-blade-20240814-120000.log
│   └── jobs/
│       ├── ProcessOrders/
│       │   └── Job-ProcessOrders-12345.log
│       └── ImportCatalog/
│           └── Job-ImportCatalog-67890.log
```

## Testing Integration

Use this server in your tests by:

1. Starting the server: `npm start`
2. Configure your WebDAV client to use `http://localhost:3000`
3. Access logs via `/Logs/` endpoint
4. Stop server with Ctrl+C

The server automatically creates realistic mock log data on first setup.
