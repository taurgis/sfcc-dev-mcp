# Salesforce B2C Commerce Job Framework: Best Practices & Development Guide

This guide provides comprehensive best practices for developing custom jobs within the Salesforce B2C Commerce Cloud Job Framework. Master these principles to build robust, scalable, and high-performing batch processing solutions that can handle enterprise-scale data operations.

**IMPORTANT**: Before developing custom jobs, consult the **Performance and Stability Best Practices** and **Security Best Practices** guides from this MCP server. Understanding performance optimization strategies, database-friendly APIs, and security guidelines is essential for building production-ready job solutions.

## Core Concepts

### The SFCC Job Framework Architecture

The Job Framework is the cornerstone of back-end automation for any e-commerce implementation on SFCC. It provides a robust, scalable mechanism for executing asynchronous processes essential for site operations, data management, and system integration.

**Key Components:**
- **Jobs**: Highest-level containers that encapsulate complete business processes
- **Flows**: Logical sequences of steps within a job (can be sequential or parallel)
- **Steps**: Smallest units of execution representing discrete tasks

### Modern Job Development Paradigms

SFCC offers two distinct development models for custom jobs:

| Aspect | Task-Oriented ("Normal") | Chunk-Oriented |
|--------|-------------------------|----------------|
| **Best For** | Simple, monolithic tasks; quick operations | Large-scale data processing |
| **Data Volume** | Low (prone to timeouts with large datasets) | High (designed for massive datasets) |
| **Progress Monitoring** | Limited (running or finished) | Granular (updated per chunk) |
| **Transaction Control** | Typically one transaction | Fine-grained per chunk |
| **Code Complexity** | Low (single main function) | Moderate (callback functions) |
| **Resumability** | Difficult (requires full restart) | Easier (failures isolated to chunks) |

## Task-Oriented Jobs: Best Practices

### When to Use Task-Oriented Jobs

Choose task-oriented jobs for:
- Single configuration file downloads
- Single API calls to external services
- Quick, targeted database updates
- Tasks where calculating progress is impractical

### Essential Implementation Patterns

#### 1. Proper Script Module Structure

```javascript
'use strict';

var Status = require('dw/system/Status');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

/**
 * Main function for task-oriented job step
 * @param {Object} parameters - Parameters from Business Manager
 * @param {dw.job.JobStepExecution} stepExecution - Job context and logging
 * @returns {dw.system.Status} - Exit status
 */
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'TaskOrientedJob');
    
    try {
        logger.info('Starting job with parameters: {0}', JSON.stringify(parameters));
        
        // Your business logic here
        var result = performBusinessLogic(parameters, logger);
        
        if (result.success) {
            logger.info('Job completed successfully');
            return new Status(Status.OK);
        } else {
            logger.warn('Job completed with warnings: {0}', result.message);
            return new Status(Status.OK, 'PARTIAL_SUCCESS', result.message);
        }
        
    } catch (e) {
        logger.error('Job failed with error: {0}', e.message);
        return new Status(Status.ERROR, 'UNEXPECTED_ERROR', e.message);
    }
};

function performBusinessLogic(parameters, logger) {
    // Implementation here
    return { success: true, message: 'Operation completed' };
}
```

#### 2. Advanced Status Control for Flow Management

```javascript
// Custom status codes enable sophisticated workflow control
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'StatusControlJob');
    
    try {
        var inputFile = new File(File.IMPEX + parameters.fileName);
        
        if (!inputFile.exists()) {
            logger.info('Input file not found: {0}', parameters.fileName);
            // This custom status can trigger specific Business Manager flow rules
            return new Status(Status.OK, 'FILE_NOT_FOUND', 'Input file was not present');
        }
        
        if (inputFile.length() === 0) {
            logger.info('Input file is empty: {0}', parameters.fileName);
            return new Status(Status.OK, 'EMPTY_FILE', 'No data to process');
        }
        
        // Process file...
        return new Status(Status.OK, 'PROCESSED', 'File processed successfully');
        
    } catch (e) {
        logger.error('Processing failed: {0}', e.message);
        return new Status(Status.ERROR, 'PROCESSING_ERROR', e.message);
    }
};
```

#### 3. Proper Transaction Management

```javascript
// RECOMMENDED: Use Transaction.wrap for automatic lifecycle management
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'TransactionJob');
    
    try {
        var category = CatalogMgr.getCategory(parameters.categoryID);
        var products = ProductMgr.queryProductsInCatalog(category.getCatalog());
        var updateCount = 0;
        
        // Transaction.wrap handles begin/commit/rollback automatically
        Transaction.wrap(function () {
            while (products.hasNext()) {
                var product = products.next();
                // Filter by category assignment and online status
                if (product.isOnline() && product.isAssignedToCategory(category)) {
                    product.setOnlineFlag(false);
                    updateCount++;
                }
            }
        });
        
        products.close();
        logger.info('Updated {0} products', updateCount);
        return new Status(Status.OK);
        
    } catch (e) {
        logger.error('Transaction failed: {0}', e.message);
        return new Status(Status.ERROR);
    }
};
```

### Task-Oriented Job Configuration

#### steptypes.json Structure

```json
{
    "step-types": {
        "script-module-step": [
            {
                "@type-id": "custom.DeactivateProducts",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Deactivates all online products in a specified category",
                "module": "cartridge/scripts/jobs/deactivateProducts.js",
                "function": "execute",
                "parameters": [
                    {
                        "@name": "categoryID",
                        "@type": "string",
                        "@required": true,
                        "description": "ID of the category containing products to deactivate"
                    }
                ],
                "status-codes": {
                    "status": [
                        { "@code": "OK", "description": "Products deactivated successfully" },
                        { "@code": "CATEGORY_NOT_FOUND", "description": "Specified category does not exist" },
                        { "@code": "NO_PRODUCTS", "description": "No products found in category" }
                    ]
                }
            }
        ]
    }
}
```

## Chunk-Oriented Jobs: Enterprise-Scale Processing

### The Chunking Philosophy

Chunk-oriented jobs are SFCC's architectural solution for processing large datasets without hitting platform limits. They break massive tasks into manageable segments, providing:

- **Stability**: Eliminates memory and timeout issues
- **Performance**: Fine-tuned transaction management
- **Monitoring**: Granular progress tracking
- **Resilience**: Isolated failure handling

### Core Lifecycle Functions

#### Required Functions (Data Pipeline)

```javascript
'use strict';

var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var CSVStreamReader = require('dw/io/CSVStreamReader');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var csvReader;
var totalLines = 0;
var processedLines = 0;
var logger = Logger.getLogger('jobs', 'BulkPriceUpdate');

/**
 * Setup function - opens input file and prepares for processing
 */
exports.beforeStep = function (parameters, stepExecution) {
    try {
        var inputFile = new File(File.IMPEX + parameters.inputFileName);
        if (!inputFile.exists()) {
            throw new Error('Input file not found: ' + parameters.inputFileName);
        }
        
        var fileReader = new FileReader(inputFile);
        csvReader = new CSVStreamReader(fileReader);
        
        // Skip header row if present
        if (parameters.hasHeader === 'true') {
            csvReader.readNext();
        }
        
        logger.info('Started processing file: {0}', parameters.inputFileName);
        
    } catch (e) {
        logger.error('Setup failed: {0}', e.message);
        throw e;
    }
};

/**
 * Returns total count for progress monitoring (optional but recommended)
 */
exports.getTotalCount = function (parameters, stepExecution) {
    // Return estimated count for progress tracking
    // This could be based on file size or pre-calculated value
    return totalLines > 0 ? totalLines : null;
};

/**
 * Reads next item from data source
 * @returns {Object|null} Next item or null when finished
 */
exports.read = function (parameters, stepExecution) {
    var line = csvReader.readNext();
    if (line && line.length > 0) {
        return {
            productID: line[0],
            newPrice: parseFloat(line[1]) || 0,
            lineNumber: ++processedLines
        };
    }
    return null; // Signals end of data
};

/**
 * Processes a single item
 * @param {Object} item - Item from read()
 * @returns {Object|null} Processed item or null to filter out
 */
exports.process = function (item, parameters, stepExecution) {
    try {
        var product = ProductMgr.getProduct(item.productID);
        if (!product) {
            return {
                productID: item.productID,
                status: 'ERROR',
                message: 'Product not found',
                lineNumber: item.lineNumber
            };
        }
        
        if (item.newPrice <= 0) {
            return {
                productID: item.productID,
                status: 'SKIPPED',
                message: 'Invalid price value',
                lineNumber: item.lineNumber
            };
        }
        
        return {
            product: product,
            productID: item.productID,
            newPrice: item.newPrice,
            status: 'READY',
            lineNumber: item.lineNumber
        };
        
    } catch (e) {
        logger.warn('Error processing product {0}: {1}', item.productID, e.message);
        return {
            productID: item.productID,
            status: 'ERROR',
            message: e.message,
            lineNumber: item.lineNumber
        };
    }
};

/**
 * Writes a chunk of processed items
 * @param {dw.util.ArrayList} chunk - Collection of processed items
 */
exports.write = function (chunk, parameters, stepExecution) {
    var successCount = 0;
    var errorCount = 0;
    
    for (var i = 0; i < chunk.size(); i++) {
        var item = chunk.get(i);
        
        if (item.status === 'READY') {
            try {
                // Update product price - transaction will be committed in afterChunk
                var priceBook = item.product.getPriceModel().getPriceBook();
                if (priceBook) {
                    priceBook.setPriceInfo(item.product, null, 'list', item.newPrice);
                    successCount++;
                } else {
                    errorCount++;
                    logger.warn('No price book found for product: {0}', item.productID);
                }
            } catch (e) {
                errorCount++;
                logger.error('Failed to update price for {0}: {1}', item.productID, e.message);
            }
        } else {
            errorCount++;
        }
    }
    
    logger.info('Chunk processed: {0} success, {1} errors', successCount, errorCount);
};

/**
 * Pre-chunk setup to begin a transaction (Optional but recommended)
 */
exports.beforeChunk = function (parameters, stepExecution) {
    // Begin transaction for this chunk
    Transaction.begin();
};

/**
 * Commits transaction after successful chunk processing (Optional but recommended)
 */
exports.afterChunk = function (parameters, stepExecution) { 
    // CRITICAL: Commit transaction per chunk for resilience
    Transaction.commit();
};

/**
 * Cleanup function - closes resources
 */
exports.afterStep = function (success, parameters, stepExecution) {
    if (csvReader) {
        csvReader.close();
    }
    
    logger.info('Processing completed. Total lines processed: {0}', processedLines);
    
    if (!success) {
        logger.error('Job completed with errors');
    }
};
```

#### Optional Lifecycle Hooks

```javascript

/**
 * Post-step reporting (optional)
 */
exports.afterStep = function (success, parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    
    if (success) {
        // Send success notification
        sendProcessingReport(parameters, 'SUCCESS', processedLines);
    } else {
        // Handle failure case
        sendProcessingReport(parameters, 'FAILED', processedLines);
    }
};
```

### Chunk-Oriented Job Configuration

#### steptypes.json Structure

```json
{
    "step-types": {
        "chunk-script-module-step": [
            {
                "@type-id": "custom.BulkPriceUpdate",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Updates product prices from CSV file in chunks",
                "module": "cartridge/scripts/jobs/bulkPriceUpdate.js",
                "chunk-size": 200,
                "transactional": false,
                "parameters": [
                    {
                        "@name": "inputFileName",
                        "@type": "string",
                        "@required": true,
                        "description": "Name of CSV file in IMPEX folder"
                    },
                    {
                        "@name": "hasHeader",
                        "@type": "boolean",
                        "@required": false,
                        "@default": true,
                        "description": "Whether CSV file has header row"
                    }
                ]
            }
        ]
    }
}
```

## Performance Optimization Strategies

### Memory Management Best Practices

#### 1. Always Use Streaming APIs

```javascript
// ❌ WRONG: Loading entire file into memory
var content = new FileReader(file).readBytes();
var lines = content.toString().split('\n');

// ✅ CORRECT: Stream processing
var csvReader = new CSVStreamReader(new FileReader(file));
var line;
while ((line = csvReader.readNext()) !== null) {
    // Process one line at a time
}
csvReader.close();
```

#### 2. Proper Iterator Management

```javascript
// ✅ CORRECT: Always close iterators
exports.execute = function (parameters, stepExecution) {
    var products = null;
    try {
        products = ProductMgr.queryAllSiteProducts();
        while (products.hasNext()) {
            var product = products.next();
            // Process product
        }
    } finally {
        if (products) {
            products.close(); // Critical: prevents memory leaks
        }
    }
};
```

#### 3. Avoid Object Retention

```javascript
// ❌ WRONG: Accumulating objects in memory
var allProducts = [];
while (products.hasNext()) {
    allProducts.push(products.next()); // Memory will grow linearly
}

// ✅ CORRECT: Process and release
while (products.hasNext()) {
    var product = products.next();
    processProduct(product);
    // Product reference goes out of scope and can be garbage collected
}
```

### Transaction Management Strategies

#### 1. Optimal Chunk Sizing

```javascript
// Chunk size guidelines based on operation complexity:
// - Simple attribute updates: 500-1000 items
// - Complex object creation: 100-300 items
// - File I/O operations: 200-500 items

// Example configuration for different scenarios:
"chunk-size": 250  // Good balance for most operations
```

#### 2. Transaction Per Chunk Pattern

```javascript
exports.beforeChunk = function (parameters, stepExecution) {
    Transaction.begin();
};

exports.write = function (chunk, parameters, stepExecution) {
    // Perform all database modifications here
    for (var i = 0; i < chunk.size(); i++) {
        var item = chunk.get(i);
        // Database updates happen within the transaction
        updateDatabaseObject(item);
    }
};

exports.afterChunk = function (parameters, stepExecution) {
    try {
        Transaction.commit(); // Commit successful chunk
    } catch (e) {
        Transaction.rollback(); // Rollback failed chunk
        throw e; // Re-throw to mark chunk as failed
    }
};
```

### Efficient API Usage Patterns

#### 1. Minimize API Calls in Loops

```javascript
// ❌ WRONG: API call per iteration
for (var i = 0; i < productIDs.length; i++) {
    var product = ProductMgr.getProduct(productIDs[i]); // Expensive!
    processProduct(product);
}

// ✅ BETTER: Batch processing where possible
var productSearchModel = ProductMgr.createProductSearchModel();
productSearchModel.setSearchPhrase(productIDs.join(' OR '));
var products = productSearchModel.getProductSearchHits();
```

#### 2. Smart Caching Strategies

```javascript
var categoryCache = {};

function getCachedCategory(categoryID) {
    if (!categoryCache[categoryID]) {
        categoryCache[categoryID] = CatalogMgr.getCategory(categoryID);
    }
    return categoryCache[categoryID];
}
```

## Security Best Practices

### Secure Logging Practices

```javascript
// ❌ WRONG: Logging sensitive data
logger.info('Processing customer: {0}', customer.getProfile().getEmail());

// ✅ CORRECT: Log only necessary identifiers
logger.info('Processing customer ID: {0}', customer.getProfile().getCustomerNo());
```

### Input Validation and Sanitization

```javascript
exports.process = function (item, parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    
    // Validate input data
    if (!item.productID || typeof item.productID !== 'string') {
        return {
            status: 'ERROR',
            message: 'Invalid product ID format'
        };
    }
    
    // Sanitize string inputs
    var sanitizedID = item.productID.trim().substring(0, 100);
    
    // Validate business rules
    if (item.price !== undefined && (isNaN(item.price) || item.price < 0)) {
        return {
            status: 'ERROR',
            message: 'Invalid price value'
        };
    }
    
    // Process validated data
    return processValidatedItem(sanitizedID, item);
};
```

## Debugging and Troubleshooting

### Common Issues and Solutions

#### 1. Memory-Related Failures

```javascript
// OutOfMemoryError prevention checklist:
// ✓ Use streaming APIs for file processing
// ✓ Close all SeekableIterators
// ✓ Avoid accumulating objects in global scope
// ✓ Set appropriate chunk size (start with 250)
// ✓ Process items and release references quickly

exports.read = function (parameters, stepExecution) {
    // Good: Read one item at a time
    return csvReader.readNext();
};

exports.afterStep = function (success, parameters, stepExecution) {
    // Critical: Clean up resources
    if (csvReader) csvReader.close();
    if (xmlReader) xmlReader.close();
    if (iterator) iterator.close();
};
```

#### 2. Transaction Timeout Prevention

```javascript
// Prevent long-running transactions
exports.beforeChunk = function (parameters, stepExecution) {
    Transaction.begin();
    // Keep transaction scope limited to single chunk
};

exports.afterChunk = function (parameters, stepExecution) {
    Transaction.commit();
    // Transaction released - prevents long-running locks
};
```

#### 3. Effective Error Handling

```javascript
exports.process = function (item, parameters, stepExecution) {
    var logger = stepExecution.log;
    
    try {
        return processItem(item);
    } catch (e) {
        // Log detailed error for debugging
        logger.error('Failed to process item {0}: {1}', 
                    item.id, e.message + '\n' + e.stack);
        
        // Return error result instead of throwing
        return {
            id: item.id,
            status: 'ERROR',
            message: e.message
        };
    }
};
```

### Diagnostic Tools and Techniques

#### 1. Comprehensive Logging Strategy

```javascript
exports.beforeStep = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    
    logger.info('Job started with parameters: {0}', JSON.stringify(parameters));
    logger.info('Available memory: {0} MB', 
               Runtime.getRuntime().freeMemory() / (1024 * 1024));
};

exports.afterChunk = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    var runtime = Runtime.getRuntime();
    var usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);
    logger.info('Chunk completed. Memory usage: {0} MB', usedMemory);
};
```

#### 2. Performance Monitoring

```javascript
var startTime = Date.now();
var itemCount = 0;

exports.process = function (item, parameters, stepExecution) {
    itemCount++;
    
    // Log performance metrics periodically
    if (itemCount % 1000 === 0) {
        var elapsed = Date.now() - startTime;
        var rate = itemCount / (elapsed / 1000);
        Logger.getLogger('jobs', 'ReportingJob');
            .info('Processed {0} items at {1} items/second', itemCount, rate.toFixed(2));
    }
    
    return processItem(item);
};
```

## Deployment and Configuration Best Practices

### Resource Management

#### 1. Proper Resource Locking

Configure resource locks in Business Manager to prevent conflicts:
- Lock catalogs when modifying products
- Lock inventory lists during inventory updates
- Lock price books during price modifications

#### 2. Optimal Scheduling Strategies

```javascript
// Stagger job start times to distribute load
// Good: 01:17, 02:23, 03:08
// Bad:  01:00, 02:00, 03:00 (creates load spikes)

// Keep job load factor below 0.20
// Monitor total job execution time per day
```

### Environment-Specific Considerations

#### 1. Sandbox vs Production

```javascript
exports.beforeStep = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    var system = require('dw/system/System');
    
    if (system.getInstanceType() === system.DEVELOPMENT_SYSTEM) {
        logger.debug('Running in development mode');
        // Enable verbose logging for development
    } else {
        logger.info('Running in production mode');
        // Minimal logging for performance
    }
};
```

#### 2. Configuration Management

```javascript
// Use site preferences for environment-specific configuration
var Site = require('dw/system/Site');
var site = Site.getCurrent();

var batchSize = site.getCustomPreferenceValue('jobBatchSize') || 250;
var maxRetries = site.getCustomPreferenceValue('jobMaxRetries') || 3;
```

## Advanced Patterns and Integration

### External Service Integration

```javascript
var ServiceRegistry = require('dw/svc/ServiceRegistry');

exports.process = function (item, parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    
    try {
        var service = ServiceRegistry.get('MyExternalService');
        var result = service.call({
            productID: item.productID,
            action: 'update'
        });
        
        if (result.isOk()) {
            return {
                productID: item.productID,
                status: 'SUCCESS',
                externalID: result.object.id
            };
        } else {
            logger.warn('Service call failed for {0}: {1}', 
                       item.productID, result.getErrorMessage());
            return {
                productID: item.productID,
                status: 'ERROR',
                message: result.getErrorMessage()
            };
        }
    } catch (e) {
        logger.error('Service error for {0}: {1}', item.productID, e.message);
        return {
            productID: item.productID,
            status: 'ERROR',
            message: e.message
        };
    }
};
```

### Idempotent Job Design

```javascript
// Design jobs to be safely re-runnable
exports.beforeStep = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    
    // Check for previous successful run
    var statusFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.complete');
    if (statusFile.exists()) {
        logger.info('Job already completed successfully. Skipping.');
        return new Status(Status.OK, 'ALREADY_COMPLETED');
    }
    
    // Create processing flag
    var processingFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.processing');
    var writer = new FileWriter(processingFile);
    writer.writeLine(new Date().toISOString());
    writer.close();
};

exports.afterStep = function (success, parameters, stepExecution) {
    if (success) {
        // Mark job as completed
        var statusFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.complete');
        var writer = new FileWriter(statusFile);
        writer.writeLine(new Date().toISOString());
        writer.close();
        
        // Clean up processing flag
        var processingFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.processing');
        processingFile.remove();
    }
};
```

## Quick Reference

### Choosing the Right Job Model

**Use Task-Oriented When:**
- Processing single files or making single API calls
- Quick database updates affecting known small datasets
- Simple configuration or setup tasks
- Progress tracking is not important

**Use Chunk-Oriented When:**
- Processing large datasets (>1000 items)
- Iterating over products, orders, customers, or file rows
- Progress monitoring is required
- Failure resilience is critical
- Transaction control is important

### Essential Performance Guidelines

1. **Always use streaming APIs** for file processing
2. **Close all SeekableIterators** to prevent memory leaks
3. **Keep chunk sizes between 100-500** for most operations
4. **Commit transactions per chunk** for resilience
5. **Avoid accumulating objects** in global scope
6. **Log appropriately** - info for milestones, debug for development only
7. **Validate inputs** and handle errors gracefully
8. **Design for idempotency** to enable safe re-runs

### Common Troubleshooting Steps

1. **OutOfMemoryError**: Check streaming APIs, iterator closure, chunk size
2. **ScriptingTimeoutError**: Consider chunk-oriented model, review algorithm efficiency
3. **Transaction timeouts**: Reduce chunk size, commit per chunk
4. **Job hangs**: Check resource locks, review for infinite loops
5. **Poor performance**: Use Code Profiler, review API usage patterns

Remember: **The Job Framework is critical infrastructure**. Always prioritize stability, performance, and maintainability over quick implementation.
