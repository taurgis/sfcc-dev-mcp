# Mock WebDAV Server for SFCC Log Testing

This directory contains a mock WebDAV server that mimics the SFCC log structure, enabling comprehensive testing of log-related functionality without requiring actual SFCC credentials or sandbox access.

## 🏗️ Directory Structure

```
tests/servers/webdav/
├── package.json              # WebDAV server dependencies
├── server.js                 # Main WebDAV server implementation
├── setup-logs.js            # Mock log file generator
├── start.sh                 # Quick start script
├── README.md                # WebDAV server documentation
├── .eslintrc.js             # Node.js CommonJS linting config
└── mock-logs/               # Generated mock log files (created by setup)
    └── Logs/
        ├── error-blade-YYYYMMDD-HHMMSS.log
        ├── warn-blade-YYYYMMDD-HHMMSS.log
        ├── info-blade-YYYYMMDD-HHMMSS.log
        ├── debug-blade-YYYYMMDD-HHMMSS.log
        └── jobs/
            ├── ProcessOrders/
            │   └── Job-ProcessOrders-12345.log
            └── ImportCatalog/
                └── Job-ImportCatalog-67890.log

tests/servers/
├── webdav-manager.ts        # TypeScript utility for managing mock server
└── mock-webdav-server.test.ts # Integration tests demonstrating usage
```

## 🔗 SFCC WebDAV Path Structure

The server mimics the exact SFCC WebDAV structure:

**SFCC WebDAV URL**: `https://{hostname}/on/demandware.servlet/webdav/Sites/Logs/`

**Mock Server URLs**:
- **SFCC Format**: `http://localhost:3000/on/demandware.servlet/webdav/Sites/Logs/` (exact SFCC path)
- **Direct Format**: `http://localhost:3000/Logs/` (simplified for testing)

## 🚀 Quick Start

### Option 1: Manual Setup
```bash
cd tests/servers/webdav
npm install
npm run setup
npm start
```

### Option 2: Quick Start Script
```bash
cd tests/servers/webdav
./start.sh
```

The server will be available at `http://localhost:3000` with WebDAV logs at:
- SFCC format: `http://localhost:3000/on/demandware.servlet/webdav/Sites/Logs/`
- Direct format: `http://localhost:3000/Logs/`

## 🧪 Using in Tests

### Programmatic Usage

```typescript
import { MockWebDAVServerManager, withMockWebDAVServer } from './servers/webdav-manager';

// Method 1: Manual server management
describe('Log Tests', () => {
  let serverManager: MockWebDAVServerManager;

  beforeAll(async () => {
    serverManager = new MockWebDAVServerManager({
      port: 3001,
      autoSetup: true,
    });
    await serverManager.start();
  });

  afterAll(async () => {
    await serverManager.stop();
  });

  test('should read log files', async () => {
    const logsUrl = serverManager.getLogsUrl(); // SFCC format
    const directLogsUrl = serverManager.getDirectLogsUrl(); // Direct format
    // Test your WebDAV log functionality here
  });
});

// Method 2: Utility function (recommended)
test('should process error logs', async () => {
  await withMockWebDAVServer(async (serverUrl, logsUrl, directLogsUrl) => {
    // Test your log processing with the mock server
    // logsUrl = SFCC format: .../on/demandware.servlet/webdav/Sites/Logs/
    // directLogsUrl = Direct format: .../Logs/
    const response = await fetch(`${directLogsUrl}error-blade-20240814-120000.log`);
    const content = await response.text();
    expect(content).toContain('[ERROR]');
  });
});
```

### Configuration Options

```typescript
interface MockWebDAVServerConfig {
  port?: number;        // Default: 3001
  host?: string;        // Default: 'localhost'
  dev?: boolean;        // Default: false (enables request logging)
  autoSetup?: boolean;  // Default: true (auto-install deps and create logs)
}
```

## 📊 Mock Log Data

The mock server generates realistic SFCC log data including:

### Standard Log Files
- **Error logs**: `error-blade-YYYYMMDD-HHMMSS.log` - Contains realistic SFCC error messages
- **Warning logs**: `warn-blade-YYYYMMDD-HHMMSS.log` - Performance warnings and deprecation notices
- **Info logs**: `info-blade-YYYYMMDD-HHMMSS.log` - Order creation, customer registration events
- **Debug logs**: `debug-blade-YYYYMMDD-HHMMSS.log` - Session creation, pipeline execution traces

### Job Log Files
- **ProcessOrders**: `jobs/ProcessOrders/Job-ProcessOrders-12345.log` - Order processing job with mixed log levels
- **ImportCatalog**: `jobs/ImportCatalog/Job-ImportCatalog-67890.log` - Catalog import job with validation errors

### Example Log Entries

```
[2024-08-14 12:00:00.000] [ERROR] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.basket.BasketMgr (BasketMgr.java:234) - Error processing basket: Invalid product ID 'ABC123'

[2024-08-14 12:00:00.000] [WARN] [blade] [ProcessorThread-2] com.demandware.beehive.core.internal.cache.CacheMgr (CacheMgr.java:156) - Cache hit ratio below threshold: 65%

[2024-08-14 12:00:00.000] [INFO] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.order.OrderMgr (OrderMgr.java:123) - Order created successfully: ORDER-000001234
```

## 🔧 Development

### Adding New Mock Data

Edit `setup-logs.js` to add new log entries or create additional job logs:

```javascript
generateCustomJobLogs() {
  const customJobDir = path.join(this.jobsDir, 'CustomJob');
  this.ensureDirectoryExists(customJobDir);
  
  const customJobContent = [
    `[${this.formatLogTimestamp(new Date())}] [INFO] [JobManager] Job CustomJob started`,
    // Add your custom log entries
  ].join('\n') + '\n';
  
  const customJobFile = path.join(customJobDir, 'Job-CustomJob-99999.log');
  fs.writeFileSync(customJobFile, customJobContent);
}
```

### Server Customization

The WebDAV server can be customized by modifying `server.js`:

- **Authentication**: Currently disabled for testing, but can be enabled
- **CORS**: Configured to allow all origins for testing
- **Request Logging**: Enable with `--dev` flag
- **Custom Endpoints**: Add additional WebDAV methods or custom routes

## 🎯 Use Cases

### Testing WebDAV Log Client
```typescript
// Test WebDAV authentication and file listing
await withMockWebDAVServer(async (serverUrl, logsUrl) => {
  const client = new WebDAVClient(serverUrl);
  const files = await client.listLogFiles();
  expect(files).toContainEqual(expect.stringMatching(/error-blade-/));
});
```

### Testing Log Analysis
```typescript
// Test log parsing and analysis
await withMockWebDAVServer(async (serverUrl, logsUrl) => {
  const analyzer = new LogAnalyzer(logsUrl);
  const errors = await analyzer.getErrorEntries();
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0]).toMatchObject({
    level: 'ERROR',
    message: expect.stringContaining('Error processing basket'),
  });
});
```

### Testing Job Log Processing
```typescript
// Test job log discovery and processing
await withMockWebDAVServer(async (serverUrl, logsUrl) => {
  const jobProcessor = new JobLogProcessor(logsUrl);
  const jobLogs = await jobProcessor.getJobLogs('ProcessOrders');
  expect(jobLogs).toContainEqual(expect.stringMatching(/Job ProcessOrders started/));
});
```

## 🛡️ Security Considerations

⚠️ **For Testing Only**: This mock server is designed for local testing and should never be deployed to production or exposed to external networks.

- No authentication required (simplified for testing)
- CORS enabled for all origins
- Serves static mock data only
- No real SFCC data or credentials involved

## 🚀 Integration with CI/CD

The mock server can be integrated into CI pipelines:

```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      # Start mock WebDAV server in background
      - name: Start Mock WebDAV Server
        run: |
          cd tests/servers/webdav
          npm install
          npm run setup
          npm start &
          sleep 5  # Wait for server to start
        
      # Run tests that use the mock server
      - name: Run WebDAV Tests
        run: npm test -- --testPathPattern=webdav
```

## 📈 Performance Considerations

- **Memory Usage**: Mock log files are small and kept in memory
- **Concurrent Tests**: Use different ports for parallel test execution
- **File Generation**: Mock logs are generated once and reused
- **Cleanup**: Server automatically cleans up when stopped

This mock WebDAV server provides a comprehensive testing environment for all SFCC log-related functionality, ensuring robust testing without external dependencies.
