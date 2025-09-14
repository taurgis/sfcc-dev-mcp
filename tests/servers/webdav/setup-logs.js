const fs = require('fs');
const path = require('path');

/**
 * Setup Script for Mock SFCC Log Files
 * 
 * This script creates a realistic directory structure and log files
 * that mimic the SFCC WebDAV log system for testing purposes.
 */

class MockLogGenerator {
    constructor() {
        this.baseDir = path.join(__dirname, 'mock-logs');
        this.logsDir = path.join(this.baseDir, 'Logs');
        this.jobsDir = path.join(this.logsDir, 'jobs');
        
        // Current date for log file naming
        this.today = new Date();
        this.dateString = this.formatDate(this.today);
        this.timeString = this.formatTime(this.today);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}${minutes}${seconds}`;
    }

    formatLogTimestamp(date) {
        return date.toISOString().replace('T', ' ').replace('Z', '');
    }

    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
    }

    generateErrorLogs() {
        const errorContent = [
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.basket.BasketMgr (BasketMgr.java:234) - Error processing basket: Invalid product ID 'ABC123'`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [blade] [ProcessorThread-2] com.demandware.beehive.core.internal.order.OrderMgr (OrderMgr.java:567) - Payment authorization failed for order ORDER-000001234`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [blade] [ProcessorThread-3] com.demandware.beehive.core.internal.customer.CustomerMgr (CustomerMgr.java:123) - Customer profile creation failed: Email already exists`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.catalog.CatalogMgr (CatalogMgr.java:445) - Product import failed: Invalid category assignment`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [blade] [ProcessorThread-4] dw.system.Logger - Custom cartridge error: Unable to connect to external service`,
        ].join('\n') + '\n';

        const errorFile = path.join(this.logsDir, `error-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(errorFile, errorContent);
        console.log(`📄 Created error log: ${errorFile}`);
    }

    generateWarnLogs() {
        const warnContent = [
            `[${this.formatLogTimestamp(new Date())}] [WARN] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.cache.CacheMgr (CacheMgr.java:156) - Cache hit ratio below threshold: 65%`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [blade] [ProcessorThread-2] com.demandware.beehive.core.internal.pipeline.PipelineMgr (PipelineMgr.java:234) - Deprecated pipeline used: CheckoutShippingServices`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [blade] [ProcessorThread-3] dw.system.Logger - Memory usage above 80%: Current usage 85%`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.job.JobMgr (JobMgr.java:89) - Long running job detected: ImportCatalog has been running for 45 minutes`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [blade] [ProcessorThread-2] dw.system.Logger - API rate limit approaching: 450/500 requests in current window`,
        ].join('\n') + '\n';

        const warnFile = path.join(this.logsDir, `warn-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(warnFile, warnContent);
        console.log(`📄 Created warn log: ${warnFile}`);
    }

    generateInfoLogs() {
        const infoContent = [
            `[${this.formatLogTimestamp(new Date())}] [INFO] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.order.OrderMgr (OrderMgr.java:123) - Order created successfully: ORDER-000001234`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [blade] [ProcessorThread-2] com.demandware.beehive.core.internal.customer.CustomerMgr (CustomerMgr.java:245) - Customer registration completed: customer.id=123456789`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [blade] [ProcessorThread-3] com.demandware.beehive.core.internal.job.JobMgr (JobMgr.java:67) - Job started: ProcessOrders`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [blade] [ProcessorThread-1] com.demandware.beehive.core.internal.catalog.CatalogMgr (CatalogMgr.java:334) - Product indexed successfully: SKU ABC-123-XYZ`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [blade] [ProcessorThread-4] dw.system.Logger - Cache refreshed: ProductCache (2,450 items)`,
        ].join('\n') + '\n';

        const infoFile = path.join(this.logsDir, `info-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(infoFile, infoContent);
        console.log(`📄 Created info log: ${infoFile}`);
    }

    generateDebugLogs() {
        const debugContent = [
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [blade] [ProcessorThread-1] dw.system.Logger - Session created: session.id=ABC123DEF456, customer.id=guest`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [blade] [ProcessorThread-2] dw.system.Logger - Pipeline execution: Cart-AddProduct -> Product.ID=12345, Quantity=2`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [blade] [ProcessorThread-3] dw.system.Logger - Template rendered: checkout/billing.isml (45ms)`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [blade] [ProcessorThread-1] dw.system.Logger - Database query executed: SELECT * FROM product WHERE id=? (12ms)`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [blade] [ProcessorThread-4] dw.system.Logger - HTTP request: GET /s/SiteGenesis/home -> Response: 200 (234ms)`,
        ].join('\n') + '\n';

        const debugFile = path.join(this.logsDir, `debug-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(debugFile, debugContent);
        console.log(`📄 Created debug log: ${debugFile}`);
    }

    generateJobLogs() {
        // Create job directories
        const processOrdersDir = path.join(this.jobsDir, 'ProcessOrders');
        const importCatalogDir = path.join(this.jobsDir, 'ImportCatalog');
        
        this.ensureDirectoryExists(processOrdersDir);
        this.ensureDirectoryExists(importCatalogDir);

        // ProcessOrders job log
        const processOrdersContent = [
            `[${this.formatLogTimestamp(new Date())}] [INFO] [JobManager] Job ProcessOrders started`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ProcessOrders] Processing 150 orders`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [ProcessOrders] Processing order ORDER-000001234`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [ProcessOrders] Updating order status to 'confirmed'`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ProcessOrders] Order ORDER-000001234 processed successfully`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [ProcessOrders] Order ORDER-000001235 has invalid shipping address`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [ProcessOrders] Failed to process order ORDER-000001236: Payment declined`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ProcessOrders] Processed 148/150 orders, 2 failures`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [JobManager] Job ProcessOrders completed in 12.5 minutes`,
        ].join('\n') + '\n';

        const processOrdersFile = path.join(processOrdersDir, 'Job-ProcessOrders-12345.log');
        fs.writeFileSync(processOrdersFile, processOrdersContent);
        console.log(`📄 Created job log: ${processOrdersFile}`);

        // ImportCatalog job log
        const importCatalogContent = [
            `[${this.formatLogTimestamp(new Date())}] [INFO] [JobManager] Job ImportCatalog started`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ImportCatalog] Importing catalog from /IMPEX/catalog.xml`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [ImportCatalog] Reading catalog file: 2,450 products found`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ImportCatalog] Validating product data`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [ImportCatalog] Processing product: ABC-123-XYZ`,
            `[${this.formatLogTimestamp(new Date())}] [DEBUG] [ImportCatalog] Creating product variants: 3 variants found`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ImportCatalog] Product ABC-123-XYZ imported successfully`,
            `[${this.formatLogTimestamp(new Date())}] [WARN] [ImportCatalog] Product DEF-456-ABC has missing images`,
            `[${this.formatLogTimestamp(new Date())}] [ERROR] [ImportCatalog] Product GHI-789-DEF has invalid category reference`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [ImportCatalog] Imported 2,447/2,450 products, 3 failures`,
            `[${this.formatLogTimestamp(new Date())}] [INFO] [JobManager] Job ImportCatalog completed in 35.2 minutes`,
        ].join('\n') + '\n';

        const importCatalogFile = path.join(importCatalogDir, 'Job-ImportCatalog-67890.log');
        fs.writeFileSync(importCatalogFile, importCatalogContent);
        console.log(`📄 Created job log: ${importCatalogFile}`);
    }

    setup() {
        console.log('🚀 Setting up mock SFCC log files...\n');

        // Create directory structure
        this.ensureDirectoryExists(this.baseDir);
        this.ensureDirectoryExists(this.logsDir);
        this.ensureDirectoryExists(this.jobsDir);

        // Generate log files
        this.generateErrorLogs();
        this.generateWarnLogs();
        this.generateInfoLogs();
        this.generateDebugLogs();
        this.generateJobLogs();

        console.log('\n✅ Mock log files created successfully!');
        console.log('\n📋 Summary:');
        console.log('   - Error logs: 1 file with 5 entries');
        console.log('   - Warning logs: 1 file with 5 entries');
        console.log('   - Info logs: 1 file with 5 entries');
        console.log('   - Debug logs: 1 file with 5 entries');
        console.log('   - Job logs: 2 files (ProcessOrders, ImportCatalog)');
        console.log(`\n📁 All files created in: ${this.baseDir}`);
    }
}

// Run setup if called directly
if (require.main === module) {
    const generator = new MockLogGenerator();
    generator.setup();
}

module.exports = MockLogGenerator;
