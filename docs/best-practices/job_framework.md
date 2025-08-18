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
            return new Status(Status.OK, 'OK', result.message);
        }
        
    } catch (e) {
        logger.error('Job failed with error: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};

function performBusinessLogic(parameters, logger) {
    // Implementation here
    return { success: true, message: 'Operation completed' };
}
```

#### 2. Advanced Status Control for Flow Management

```javascript
// Status codes must be either OK or ERROR only
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'StatusControlJob');
    
    try {
        var inputFile = new File(File.IMPEX + parameters.fileName);
        
        if (!inputFile.exists()) {
            logger.info('Input file not found: {0}', parameters.fileName);
            // Use OK status with descriptive message for conditional flow control
            return new Status(Status.OK, 'OK', 'Input file was not present - skipping processing');
        }
        
        if (inputFile.length() === 0) {
            logger.info('Input file is empty: {0}', parameters.fileName);
            return new Status(Status.OK, 'OK', 'No data to process - file is empty');
        }
        
        // Process file...
        return new Status(Status.OK, 'OK', 'File processed successfully');
        
    } catch (e) {
        logger.error('Processing failed: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
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
                "module": "plugin_examplecartridge/cartridge/scripts/jobs/deactivateProducts.js",
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
                        { "@code": "ERROR", "description": "An error occurred during processing" }
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
var logger = Logger.getLogger('jobs', 'BulkProductUpdate');

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
            newOnlineStatus: line[1] === 'true',
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
        
        if (typeof item.newOnlineStatus !== 'boolean') {
            return {
                productID: item.productID,
                status: 'SKIPPED',
                message: 'Invalid online status value',
                lineNumber: item.lineNumber
            };
        }
        
        return {
            product: product,
            productID: item.productID,
            newOnlineStatus: item.newOnlineStatus,
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
                // Update product attribute - transaction will be committed in afterChunk
                item.product.setOnlineFlag(item.newOnlineStatus);
                successCount++;
            } catch (e) {
                errorCount++;
                logger.error('Failed to update product {0}: {1}', item.productID, e.message);
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
                "@type-id": "custom.BulkProductUpdate",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Updates product online status from CSV file in chunks",
                "module": "plugin_examplecartridge/cartridge/scripts/jobs/bulkProductUpdate.js",
                "before-step-function": "beforeStep",
                "total-count-function": "getTotalCount",
                "before-chunk-function": "beforeChunk",
                "read-function": "read",
                "process-function": "process",
                "write-function": "write",
                "after-chunk-function": "afterChunk",
                "after-step-function": "afterStep",
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
                        "description": "Whether CSV file has header row"
                    }
                ],
                "status-codes": {
                    "status": [
                        { "@code": "OK", "description": "Processing completed successfully" },
                        { "@code": "ERROR", "description": "An error occurred during processing" }
                    ]
                }
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
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var productSearchModel = new ProductSearchModel();
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
    // Memory monitoring not available in SFCC environment
};

exports.afterChunk = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    // Memory monitoring not available in SFCC environment
    logger.info('Chunk completed successfully');
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

### Steptypes.json Configuration File

#### File Placement and Structure

Custom step types are registered in the SFCC system using a `steptypes.json` file. This file defines the step types, their parameters, and status codes for your cartridge.

**Critical Requirements:**
- File must be named **exactly** `steptypes.json`
- Must be placed in the **root folder** of your custom cartridge (not inside the cartridge subfolder)
- Only **one** `steptypes.json` file per cartridge is allowed
- Cannot coexist with `steptypes.xml` - choose one format only

**Correct File Structure:**
```
my_cartridge/
├── cartridge/
│   ├── controllers/
│   ├── scripts/
│   ├── (other cartridge folders)
│   └── my_cartridge.properties
└── steptypes.json ← Must be here, not inside cartridge/
```

#### Root Structure

All steptypes.json files must follow this root structure:

```json
{
  "step-types": {
    "script-module-step": [],
    "chunk-script-module-step": [],
    "pipeline-step": []
  }
}
```

**Note**: You must define at least one step type category, but all three are optional as long as one is present.

### Task-Oriented Job Configuration (script-module-step)

#### Complete Attribute Reference

```json
{
  "step-types": {
    "script-module-step": [
      {
        "@type-id": "custom.DeactivateProducts",
        "@supports-parallel-execution": true,
        "@supports-site-context": true,
        "@supports-organization-context": false,
        "description": "Deactivates all online products in a specified category",
        "module": "plugin_examplecartridge/cartridge/scripts/jobs/deactivateProducts.js",
        "function": "execute",
        "transactional": false,
        "timeout-in-seconds": 900,
        "parameters": {
          "parameter": [
            {
              "@name": "categoryID",
              "@type": "string",
              "@required": true,
              "description": "ID of the category containing products to deactivate"
            },
            {
              "@name": "dryRun",
              "@type": "boolean", 
              "@required": false,
              "description": "If true, only logs what would be deactivated"
            }
          ]
        },
        "status-codes": {
          "status": [
            { "@code": "OK", "description": "Products deactivated successfully" },
            { "@code": "ERROR", "description": "An error occurred during processing" }
          ]
        }
      }
    ]
  }
}
```

#### Attribute Details

| Attribute | Required | Description | Validation Rules |
|-----------|----------|-------------|------------------|
| `@type-id` | ✅ **Required** | Unique identifier for the step type | Must start with `custom.`, max 100 chars, no whitespace, unique across all cartridges |
| `@supports-parallel-execution` | Optional | Enables parallel execution with other steps | `true` or `false` (default: `true`) |
| `@supports-site-context` | Optional | Can be used in site-scoped flows | `true` or `false` (default: `true`) |
| `@supports-organization-context` | Optional | Can be used in organization-scoped flows | `true` or `false` (default: `true`) |
| `description` | Optional | Internal description (not shown in Business Manager) | Max 4000 characters |
| `module` | ✅ **Required** | Path to script module | No leading/trailing whitespace |
| `function` | ✅ **Required** | Function name to execute | No leading/trailing whitespace, defaults to `execute` |
| `transactional` | Optional | Wraps execution in single transaction | `true` or `false` (default: `false`) |
| `timeout-in-seconds` | Optional | Execution timeout limit | Integer > 0, no default |
| `parameters` | Optional | User-configurable parameters | Contains `parameter` array |
| `status-codes` | Optional | Custom status code definitions | Contains `status` array |

**Important Notes:**
- `@supports-site-context` and `@supports-organization-context` cannot both be `true` or both be `false`
- `@type-id` cannot conflict with system step types like `ExecutePipeline` or `IncludeStepsFromJob`
- Setting `transactional: true` creates one large transaction - avoid for performance reasons

### Chunk-Oriented Job Configuration (chunk-script-module-step)

#### Complete Attribute Reference

```json
{
  "step-types": {
    "chunk-script-module-step": [
      {
        "@type-id": "custom.BulkPriceUpdate",
        "@supports-parallel-execution": false,
        "@supports-site-context": true,
        "@supports-organization-context": false,
        "description": "Updates product prices from CSV file in chunks",
        "module": "plugin_examplecartridge/cartridge/scripts/jobs/bulkPriceUpdate.js",
        "before-step-function": "beforeStep",
        "total-count-function": "getTotalCount",
        "before-chunk-function": "beforeChunk",
        "read-function": "read",
        "process-function": "process",
        "write-function": "write",
        "after-chunk-function": "afterChunk",
        "after-step-function": "afterStep",
        "chunk-size": 200,
        "transactional": false,
        "parameters": {
          "parameter": [
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
              "description": "Whether CSV file has header row"
            }
          ]
        },
        "status-codes": {
          "status": [
            { "@code": "OK", "description": "Processing completed successfully" },
            { "@code": "ERROR", "description": "An error occurred during processing" }
          ]
        }
      }
    ]
  }
}
```

#### Chunk-Specific Attributes

| Attribute | Required | Description | Default Function |
|-----------|----------|-------------|------------------|
| `before-step-function` | Optional | Setup function before processing starts | None |
| `total-count-function` | Optional | Returns total items for progress tracking | None |
| `before-chunk-function` | Optional | Setup before each chunk | None |
| `read-function` | Optional | Reads next item from data source | `read` |
| `process-function` | Optional | Processes individual items | `process` |
| `write-function` | Optional | Writes processed chunk | `write` |
| `after-chunk-function` | Optional | Cleanup after each chunk | None |
| `after-step-function` | Optional | Final cleanup after all chunks | None |
| `chunk-size` | ✅ **Required** | Number of items per chunk | Must be numeric > 0 |

### Parameter Configuration

Parameters allow Business Manager users to configure job execution. Each parameter supports these attributes:

```json
{
  "@name": "parameterName",
  "@type": "string|boolean|number|password",
  "@required": true,
  "description": "User-friendly description shown in Business Manager"
}
```

#### Supported Parameter Types
- `string`: Text input
- `boolean`: Checkbox (true/false)
- `number`: Numeric input
- `password`: Masked text input (use for sensitive data)

### Status Code Configuration

Custom status codes enable sophisticated flow control in Business Manager:

```json
{
  "status-codes": {
    "status": [
      { "@code": "OK", "description": "Standard success" },
      { "@code": "CUSTOM_STATUS", "description": "Custom workflow trigger" },
      { "@code": "ERROR", "description": "Processing failed" }
    ]
  }
}
```

**Flow Control Usage:**
- Use custom status codes to branch job flows
- Configure different follow-up steps based on status
- Enable conditional processing in complex workflows

### Pipeline Step Configuration

For legacy pipeline-based steps (not recommended for new development):

```json
{
  "step-types": {
    "pipeline-step": [
      {
        "@type-id": "custom.LegacyPipelineStep",
        "@supports-site-context": true,
        "@supports-organization-context": false,
        "description": "Legacy pipeline step",
        "pipeline": "cartridge/pipelines/jobs/LegacyPipeline.xml",
        "start-node": "Start"
      }
    ]
  }
}
```

**Note**: Pipeline steps are legacy - use script-module-step or chunk-script-module-step for new development.

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

#### 3. Environment-Specific Considerations

```javascript
exports.beforeStep = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ReportingJob');
    var system = require('dw/system/System');
    
    if (system.getInstanceType() === 0) { // Development = 0, Staging = 1, Production = 2
        logger.debug('Running in development mode');
        // Enable verbose logging for development
    } else {
        logger.info('Running in production mode');
        // Minimal logging for performance
    }
};
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
