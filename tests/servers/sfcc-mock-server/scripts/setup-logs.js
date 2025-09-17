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
        this.baseDir = path.join(__dirname, '../mock-data');
        this.logsDir = path.join(this.baseDir, 'logs');
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
        // Format like real SFCC logs: [2025-09-14 12:00:00.000 GMT]
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
    }

    generateErrorLogs() {
        const timestamp = this.formatLogTimestamp(new Date());
        
        const errorEntries = [
            `[${timestamp} GMT] ERROR SystemJobThread|1645761595|sfcc-download-gdpr-einstein-response-files-for-einstein|DownloadGDPRLogFiles com.demandware.component.transaction.cquotient.feed.s3.S3Store Sites-Site JOB bce341cf01 fd3d5c567c091a16392d5b865e 4815298613491841024 - CQ - AWS S3 Configuration Issue: bucketName is missing.`,
            `[${timestamp} GMT] ERROR PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|Qq38CuNXpX custom [] Payment authorization failed for order ORDER-000001234`,
            `[${timestamp} GMT] ERROR PipelineCallServlet|1050777654|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|V5YDtxRLpL custom [] Customer profile creation failed: Email already exists`,
            `[${timestamp} GMT] ERROR SystemJobThread|1581553813|sfcc-catalog-import|ImportCatalogStep com.demandware.beehive.core.internal.catalog.CatalogMgr Sites-Site JOB abc123def456 - Product import failed: Invalid category assignment`,
            `[${timestamp} GMT] ERROR PipelineCallServlet|1645761595|Sites-RefArchGlobal-Site|Cart-AddProduct|PipelineCall|nYJXtqnEfz custom [] Custom cartridge error: Unable to connect to external service`
        ];

        const errorContent = errorEntries.join('\n') + '\n';
        const errorFile = path.join(this.logsDir, `error-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(errorFile, errorContent);
        console.log(`📄 Created error log: ${errorFile}`);
    }

    generateWarnLogs() {
        const timestamp = this.formatLogTimestamp(new Date());
        
        const warnEntries = [
            `[${timestamp} GMT] WARN PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|Qq38CuNXpX custom [] Content asset with ID cookie_hint is offline`,
            `[${timestamp} GMT] WARN PipelineCallServlet|1050777654|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|V5YDtxRLpL custom [] Content asset with ID cookie_hint is offline`,
            `[${timestamp} GMT] WARN PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|290fx4tnVR custom [] Content asset with ID cookie_hint is offline`,
            `[${timestamp} GMT] WARN PipelineCallServlet|1581553813|Sites-RefArchGlobal-Site|Page-Include|PipelineCall|nYJXtqnEfz custom [] Content asset with ID cookie_hint is offline`,
            `[${timestamp} GMT] WARN PipelineCallServlet|1645761595|Sites-RefArchGlobal-Site|Product-Show|PipelineCall|AbcDef123G custom [] Product inventory low: SKU-789-XYZ has only 2 units remaining`
        ];

        const warnContent = warnEntries.join('\n') + '\n';
        const warnFile = path.join(this.logsDir, `warn-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(warnFile, warnContent);
        console.log(`📄 Created warn log: ${warnFile}`);
    }

    generateInfoLogs() {
        const timestamp = this.formatLogTimestamp(new Date());
        
        const infoEntries = [
            `[${timestamp} GMT] INFO SystemJobThread|67038033|sfcc-export-dw-analytics-site-config Executing job [sfcc-export-dw-analytics-site-config][2664334]...`,
            `[${timestamp} GMT] INFO SystemJobThread|67038033|sfcc-export-dw-analytics-site-config|ExportDWAnalyticsSiteConfigurationStep Executing step [ExportDWAnalyticsSiteConfigurationStep][5846619] for [Organization]...`,
            `[${timestamp} GMT] INFO PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Order-Confirm|PipelineCall|AbcDef123G custom [] Order created successfully: ORDER-000001234`,
            `[${timestamp} GMT] INFO PipelineCallServlet|1050777654|Sites-RefArchGlobal-Site|Account-SubmitRegistration|PipelineCall|V5YDtxRLpL custom [] Customer registration completed: customer.id=123456789`,
            `[${timestamp} GMT] INFO SystemJobThread|1581553813|sfcc-process-orders|ProcessOrdersStep com.demandware.beehive.core.internal.job.JobMgr Sites-Site JOB abc123def456 - Job started: ProcessOrders`
        ];

        const infoContent = infoEntries.join('\n') + '\n';
        const infoFile = path.join(this.logsDir, `info-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(infoFile, infoContent);
        console.log(`📄 Created info log: ${infoFile}`);
    }

    generateDebugLogs() {
        const timestamp = this.formatLogTimestamp(new Date());
        
        const debugEntries = [
            `[${timestamp} GMT] DEBUG PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Product-Show|PipelineCall|AbcDef123G custom [] Product cache hit: SKU ABC-123-XYZ`,
            `[${timestamp} GMT] DEBUG PipelineCallServlet|1050777654|Sites-RefArchGlobal-Site|Search-Show|PipelineCall|V5YDtxRLpL custom [] Search query executed: 'laptop' returned 45 results`,
            `[${timestamp} GMT] DEBUG SystemJobThread|1581553813|sfcc-data-replication|DataReplicationStep com.demandware.beehive.core.internal.system.SystemMgr Sites-Site JOB abc123def456 - Data replication sync started`,
            `[${timestamp} GMT] DEBUG PipelineCallServlet|1645761595|Sites-RefArchGlobal-Site|Cart-Show|PipelineCall|nYJXtqnEfz custom [] Basket calculation: 3 items, subtotal $149.99`,
            `[${timestamp} GMT] DEBUG PipelineCallServlet|1912801078|Sites-RefArchGlobal-Site|Account-Show|PipelineCall|290fx4tnVR custom [] Customer session validated: session timeout extended`
        ];

        const debugContent = debugEntries.join('\n') + '\n';
        const debugFile = path.join(this.logsDir, `debug-blade-${this.dateString}-${this.timeString}.log`);
        fs.writeFileSync(debugFile, debugContent);
        console.log(`📄 Created debug log: ${debugFile}`);
    }

    generateJobLogs() {
        // Create job directories and logs
        const jobs = [
            { 
                name: 'ProcessOrders', 
                id: '1234567890',
                steps: ['ValidateOrdersStep', 'ProcessPaymentsStep', 'UpdateInventoryStep']
            },
            { 
                name: 'ImportCatalog', 
                id: '0987654321',
                steps: ['ValidateCatalogStep', 'ImportProductsStep', 'IndexProductsStep']
            }
        ];

        jobs.forEach(job => {
            const jobDir = path.join(this.jobsDir, job.name);
            this.ensureDirectoryExists(jobDir);

            const timestamp = this.formatLogTimestamp(new Date());
            
            const jobEntries = [
                `[${timestamp} GMT] INFO SystemJobThread|${job.id}|${job.name} Executing job [${job.name}][${job.id}]...`
            ];

            // Add step entries
            job.steps.forEach(step => {
                jobEntries.push(
                    `[${timestamp} GMT] INFO SystemJobThread|${job.id}|${job.name}|${step} Executing step [${step}] for [Organization]...`,
                    `[${timestamp} GMT] INFO SystemJobThread|${job.id}|${job.name}|${step} Step [${step}] completed successfully`
                );
            });

            jobEntries.push(`[${timestamp} GMT] INFO SystemJobThread|${job.id}|${job.name} Execution of job finished with status [OK].`);

            const jobContent = jobEntries.join('\n') + '\n';
            const jobFile = path.join(jobDir, `Job-${job.name}-${job.id}.log`);
            fs.writeFileSync(jobFile, jobContent);
            console.log(`📄 Created job log: ${jobFile}`);
        });
    }

    run() {
        console.log('🚀 Starting mock log generation...');
        
        // Ensure directories exist
        this.ensureDirectoryExists(this.baseDir);
        this.ensureDirectoryExists(this.logsDir);
        this.ensureDirectoryExists(this.jobsDir);

        // Generate all log types
        this.generateErrorLogs();
        this.generateWarnLogs();
        this.generateInfoLogs();
        this.generateDebugLogs();
        this.generateJobLogs();

        console.log('✅ Mock log generation completed!');
        console.log(`� Logs created in: ${this.logsDir}`);
    }
}

// Run the generator if called directly
if (require.main === module) {
    const generator = new MockLogGenerator();
    generator.run();
}

module.exports = MockLogGenerator;